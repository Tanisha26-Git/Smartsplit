// Min Cash Flow settle-up.
//
// Given each member's net balance, produce a small set of {from, to, amount}
// transactions that brings everyone to zero. Strategy: repeatedly settle the
// biggest debtor against the biggest creditor. We use two max-heaps (priority
// queues) keyed by magnitude so each "biggest" lookup is O(log n).
//
// Amounts are handled in integer cents to avoid floating-point drift, then
// converted back to dollars on output.

// Binary max-heap of items compared by item.amount (a positive integer, cents).
class MaxHeap {
  constructor() {
    this.data = [];
  }
  get size() {
    return this.data.length;
  }
  push(item) {
    this.data.push(item);
    let i = this.data.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent].amount >= this.data[i].amount) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }
  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      const n = this.data.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let largest = i;
        if (l < n && this.data[l].amount > this.data[largest].amount) largest = l;
        if (r < n && this.data[r].amount > this.data[largest].amount) largest = r;
        if (largest === i) break;
        [this.data[largest], this.data[i]] = [this.data[i], this.data[largest]];
        i = largest;
      }
    }
    return top;
  }
}

// balances: [{ _id, name, email, balance }]  (balance in dollars, may be +/-/0)
// returns: [{ from, fromName, to, toName, amount }]  (amount in dollars)
const settleUp = (balances) => {
  const creditors = new MaxHeap(); // people owed money (balance > 0)
  const debtors = new MaxHeap(); // people who owe money (balance < 0)

  balances.forEach((m) => {
    const cents = Math.round(m.balance * 100);
    const person = { id: m._id.toString(), name: m.name, amount: Math.abs(cents) };
    if (cents > 0) creditors.push(person);
    else if (cents < 0) debtors.push(person);
    // cents === 0 (zero balance) is already settled -> skip entirely
  });

  const transactions = [];

  while (creditors.size > 0 && debtors.size > 0) {
    const creditor = creditors.pop();
    const debtor = debtors.pop();

    const settled = Math.min(creditor.amount, debtor.amount); // cents
    transactions.push({
      from: debtor.id,
      fromName: debtor.name,
      to: creditor.id,
      toName: creditor.name,
      amount: settled / 100,
    });

    creditor.amount -= settled;
    debtor.amount -= settled;

    // Whoever still has a residual goes back into their heap.
    if (creditor.amount > 0) creditors.push(creditor);
    if (debtor.amount > 0) debtors.push(debtor);
  }

  return transactions;
};

module.exports = settleUp;
