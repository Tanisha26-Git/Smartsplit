const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getGroupBalances } = require("../controllers/balanceController");

router.get("/:groupId", protect, getGroupBalances);

module.exports = router;
