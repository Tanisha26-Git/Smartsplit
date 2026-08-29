const Group = require("../models/Group");
const Expense = require("../models/Expense");

// members are populated User docs here, so compare against each member's _id.
const isMember = (group, userId) =>
  group.members.some((m) => m._id.toString() === userId.toString());

exports.getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (!isMember(group, req.user._id))
      return res.status(403).json({ msg: "Not a member of this group" });

    const expenses = await Expense.find({ group: groupId });

    // net[userId] = total they paid - total they owe across every expense
    const net = {};
    group.members.forEach((m) => {
      net[m._id.toString()] = 0;
    });

    expenses.forEach((expense) => {
      const paidById = expense.paidBy.toString();
      net[paidById] = (net[paidById] || 0) + expense.amount;

      expense.splits.forEach((split) => {
        const userId = split.user.toString();
        net[userId] = (net[userId] || 0) - split.amount;
      });
    });

    const balances = group.members.map((m) => ({
      _id: m._id,
      name: m.name,
      email: m.email,
      balance: Number(net[m._id.toString()].toFixed(2)),
    }));

    res.json(balances);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
