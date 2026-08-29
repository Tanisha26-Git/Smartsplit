// Pure balance calculation, reused by the balance and settle-up controllers.
// Takes a group with POPULATED members ({ _id, name, email }) and that group's
// expenses, and returns one row per member with their net balance:
//   net = total they paid - total they owe (across every expense split)
// Positive => they should receive money; negative => they owe money.
const calculateBalances = (group, expenses) => {
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

  return group.members.map((m) => ({
    _id: m._id,
    name: m.name,
    email: m.email,
    balance: Number(net[m._id.toString()].toFixed(2)),
  }));
};

module.exports = calculateBalances;
