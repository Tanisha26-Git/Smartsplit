const Expense = require("../models/Expense");
const Group = require("../models/Group");

const isMember = (group, userId) =>
  group.members.some((m) => m.toString() === userId.toString());

exports.addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { description, amount, splitType, splits, participants } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (!isMember(group, req.user._id))
      return res.status(403).json({ msg: "Not a member of this group" });

    let computedSplits;

    if (splitType === "equal") {
      const participantIds =
        participants && participants.length
          ? participants
          : group.members.map((m) => m.toString());

      // Round each share to 2dp, then push the leftover cent(s) onto the
      // last participant so the splits always sum exactly to amount.
      const n = participantIds.length;
      const baseShare = Math.floor((amount / n) * 100) / 100;
      let allocated = 0;
      computedSplits = participantIds.map((userId, idx) => {
        const isLast = idx === n - 1;
        const share = isLast ? Number((amount - allocated).toFixed(2)) : baseShare;
        allocated += share;
        return { user: userId, amount: share };
      });
    } else if (splitType === "unequal") {
      if (!splits || !splits.length)
        return res.status(400).json({ msg: "Splits are required for an unequal split" });

      const total = splits.reduce((sum, s) => sum + s.amount, 0);
      if (Math.abs(total - amount) > 0.01)
        return res.status(400).json({ msg: "Split amounts must add up to the total amount" });

      computedSplits = splits.map((s) => ({ user: s.user, amount: s.amount }));
    } else if (splitType === "percentage") {
      if (!splits || !splits.length)
        return res.status(400).json({ msg: "Splits are required for a percentage split" });

      const totalPercent = splits.reduce((sum, s) => sum + s.percentage, 0);
      if (Math.abs(totalPercent - 100) > 0.01)
        return res.status(400).json({ msg: "Percentages must add up to 100" });

      computedSplits = splits.map((s) => ({
        user: s.user,
        amount: Number(((s.percentage / 100) * amount).toFixed(2)),
      }));
    } else {
      return res.status(400).json({ msg: "splitType must be equal, unequal, or percentage" });
    }

    const expense = await Expense.create({
      group: groupId,
      description,
      amount,
      paidBy: req.user._id,
      splitType,
      splits: computedSplits,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (!isMember(group, req.user._id))
      return res.status(403).json({ msg: "Not a member of this group" });

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name email")
      .populate("splits.user", "name email")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
