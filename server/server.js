require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
const settleRoutes = require("./routes/settleRoutes");
const app = express();

connectDB();

// Allow the deployed frontend (CLIENT_URL) plus the local dev server. Not
// wide open in production — only these origins may call the API from a browser.
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(
  Boolean
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/balances", balanceRoutes);
app.use("/api/settle", settleRoutes);

app.get("/", (req, res) => {
  res.send("SmartSplit API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));