import axios from "axios";
import { load } from "cheerio";
import dotenv from "dotenv";
import fs from "fs";
import { isWithin7Days, formatMessage } from "./helper.js";
import { PROJECTS } from "./const.js";

dotenv.config();

/* ===== 基本設定 ===== */
const base = "https://zentao.cdn664.com";
const SENT_FILE = "./sent.json";
const TG_TOKEN = process.env.TG_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

if (!TG_TOKEN || !CHAT_ID) {
  console.error("缺少 TG_TOKEN 或 TG_CHAT_ID");
  process.exit(1);
}

/* ===== 已發送紀錄 ===== */
const loadSent = () => {
  if (!fs.existsSync(SENT_FILE)) return new Set();
  return new Set(JSON.parse(fs.readFileSync(SENT_FILE, "utf-8")));
};

const saveSent = (set) => {
  fs.writeFileSync(SENT_FILE, JSON.stringify([...set], null, 2));
};

const sentSet = loadSent();

/* ===== Telegram 發送 ===== */
const sendTG = async (text) => {
  const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: CHAT_ID,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
};

/* ===== 主流程 ===== */
const list = [];

for (const project of PROJECTS) {
  console.log(`抓取中：${project.name}`);
  const url = `${base}/bug-browse-${project.id}-0-unresolved.html`;

  const res = await axios.get(url, {
    headers: {
      Cookie: "zentaosid=6krsngddqej6cf4g5cf1ar5t52; lang=zh-tw;",
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = load(res.data);

  $(".c-title.text-left").each((_, el) => {
    const row = $(el).closest("tr");
    const openedDate = row.find(".c-openedDate").text().trim();
    if (!isWithin7Days(openedDate)) return;

    const ticketId = row.find(".c-id").text().trim();
    if (sentSet.has(ticketId)) return;

    list.push({
      projectId: project.id,
      projectName: project.name,
      ticketId,
      title: $(el).text().trim(),
      openedDate,
      assignedTo: row.find(".c-assignedTo").text().trim(),
      url: `${base}/bug-view-${ticketId}.html`,
    });
  });
}

/* ===== 沒新資料就結束 ===== */
if (!list.length) {
  console.log("沒有新的 bug");
  process.exit(0);
}

/* ===== 發送 ===== */
const messages = list.map(formatMessage);
const payload = messages.join("━━━━━━━━━━━━━━━━━━\n");

await sendTG(payload);

/* ===== 記錄已發送 ===== */
list.forEach(item => sentSet.add(item.ticketId));
saveSent(sentSet);

console.log(`已推送 ${list.length} 筆新 bug`);
