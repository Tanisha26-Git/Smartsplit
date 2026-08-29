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

## 🔌 API Endpoints

All routes are prefixed with `/api`. Routes marked 🔒 require a `Bearer <token>` JWT in the `Authorization` header.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user, returns a JWT |
| POST | `/api/auth/login` | Log in, returns a JWT |

### Groups 🔒
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/groups` | Create a group |
| GET | `/api/groups` | List the groups you belong to |
| POST | `/api/groups/:id/add-member` | Add a member by email |

### Expenses 🔒
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses/:groupId` | Add an expense (equal / unequal / percentage split) |
| GET | `/api/expenses/:groupId` | List a group's expenses |

### Balances & Settle-Up 🔒
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/balances/:groupId` | Each member's net balance (paid − owed) |
| GET | `/api/settle/:groupId` | Minimal set of transactions to settle the group |

## 🧮 How the settle-up algorithm works

Settle-up uses the **Min Cash Flow** algorithm to reduce a group's debts to the fewest possible payments. It computes each member's net balance (total paid − total owed), then **greedily** matches the biggest debtor against the biggest creditor, settling one of them fully in each transaction. Both groups are kept in **max-heaps** (priority queues) so each "biggest" lookup is `O(log n)`, giving an overall `O(n log n)` solution that produces at most `n − 1` transactions.

## 📌 Status
🚧 In active development — backend complete (auth, groups, expenses, balances, settle-up)

## 👩‍💻 Author
**Tanisha** — [GitHub](https://github.com/Tanisha26-Git)
