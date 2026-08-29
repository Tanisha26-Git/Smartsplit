const Group = require("../models/Group");
const Expense = require("../models/Expense");
const calculateBalances = require("../utils/calculateBalances");
const settleUp = require("../utils/settleUp");

// members are populated User docs here, so compare against each member's _id.
const isMember = (group, userId) =>
  group.members.some((m) => m._id.toString() === userId.toString());

exports.getSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (!isMember(group, req.user._id))
      return res.status(403).json({ msg: "Not a member of this group" });

    const expenses = await Expense.find({ group: groupId });
    const balances = calculateBalances(group, expenses);
    const transactions = settleUp(balances);

    res.json({ balances, transactions });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
