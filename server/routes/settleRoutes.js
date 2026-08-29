const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getSettlement } = require("../controllers/settleController");

router.get("/:groupId", protect, getSettlement);

module.exports = router;
