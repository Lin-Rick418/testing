# Testing

A simple Node.js project demonstrating testing functionality with Jest.

## Features

- Basic calculator module with add, subtract, multiply, and divide operations
- Comprehensive test suite using Jest
- Test coverage reporting

## Installation

```bash
npm install
```

## Usage

The calculator module provides basic arithmetic operations:

```javascript
const { add, subtract, multiply, divide } = require('./src/calculator');

console.log(add(2, 3));      // 5
console.log(subtract(5, 3)); // 2
console.log(multiply(2, 3)); // 6
console.log(divide(6, 3));   // 2
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

## Project Structure

```
testing/
├── src/
│   └── calculator.js       # Calculator module
├── tests/
│   └── calculator.test.js  # Test suite
├── package.json            # Project dependencies
├── .gitignore             # Git ignore file
└── README.md              # This file
```
