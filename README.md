# SmartSplit 💸

A full-stack expense-splitting web app (Splitwise-style) that calculates the **minimum number of transactions** needed to settle group expenses using a debt-simplification algorithm.

## 🚀 Features
- User authentication (JWT + bcrypt)
- Create groups and add members
- Add shared expenses (equal / unequal / percentage split)
- Per-user balance sheet
- "Settle Up" — minimizes transactions via the Min Cash Flow algorithm
- Expense history

## 🛠️ Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcryptjs

## 📦 Getting Started

### Backend
```bash
cd server
npm install
npm run dev
```

Create a `.env` file in `server/`:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 📌 Status
🚧 In active development

## 👩‍💻 Author
**Tanisha** — [GitHub](https://github.com/Tanisha26-Git)
