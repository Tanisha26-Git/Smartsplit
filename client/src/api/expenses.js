import api from "./axios";

// Wrappers around the /api/expenses backend routes. The axios instance
// auto-attaches the JWT.

// GET /api/expenses/:groupId -> the group's expenses, newest first, with
// paidBy and splits.user populated ({ _id, name, email }).
export const getExpenses = (groupId) =>
  api.get(`/expenses/${groupId}`).then((res) => res.data);

// POST /api/expenses/:groupId -> the created expense.
// payload shape depends on splitType:
//   equal:      { description, amount, paidBy, splitType: "equal" }
//   unequal:    { description, amount, paidBy, splitType: "unequal",
//                 splits: [{ user, amount }] }
//   percentage: { description, amount, paidBy, splitType: "percentage",
//                 splits: [{ user, percentage }] }
export const addExpense = (groupId, payload) =>
  api.post(`/expenses/${groupId}`, payload).then((res) => res.data);
