import api from "./axios";

// GET /api/balances/:groupId -> [{ _id, name, email, balance }]
// balance > 0 => member is owed money; balance < 0 => member owes money.
export const getBalances = (groupId) =>
  api.get(`/balances/${groupId}`).then((res) => res.data);

// GET /api/settle/:groupId -> { balances, transactions }
// transactions: [{ from, fromName, to, toName, amount }] (Min Cash Flow result).
export const getSettlement = (groupId) =>
  api.get(`/settle/${groupId}`).then((res) => res.data);
