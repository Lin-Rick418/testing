export const isWithin7Days = (dateStr) => {
  // dateStr: '06-18 15:21'
  const now = new Date();
  const [md, hm] = dateStr.split(" ");
  const [month, day] = md.split("-").map(Number);
  const [hour, minute] = hm.split(":").map(Number);

  let year = now.getFullYear();

  // 跨年處理（例如現在 1 月，看見 12 月）
  if (month > now.getMonth() + 1) {
    year -= 1;
  }

  const target = new Date(year, month - 1, day, hour, minute);
  const diff = now - target;

  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
};

export const formatMessage = (item) => `
🧩【平台】 ${item.projectName}
🆔【編號】 ${item.ticketId}
👤【負責】 ${item.assignedTo || '未指派'}
⏰【時間】 ${item.openedDate}
📌【標題】${item.title}
🔗【BUG 連結】${item.url}
`;
import fs from "fs";

const SENT_FILE = "./sent.json";

export const loadSent = () => {
  if (!fs.existsSync(SENT_FILE)) return new Set();
  const data = JSON.parse(fs.readFileSync(SENT_FILE, "utf-8"));
  return new Set(data);
};

export const saveSent = (set) => {
  fs.writeFileSync(SENT_FILE, JSON.stringify([...set], null, 2));
};
