const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createGroup,
  getMyGroups,
  addMember,
} = require("../controllers/groupController");

router.post("/", protect, createGroup);
router.get("/", protect, getMyGroups);
router.post("/:id/add-member", protect, addMember);

module.exports = router;