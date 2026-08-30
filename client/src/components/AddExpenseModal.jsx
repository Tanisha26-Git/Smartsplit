import { useState } from "react";
import Modal from "./Modal";
import { addExpense } from "../api/expenses";
import { getUser } from "../utils/auth";

// Add-expense form supporting equal / unequal / percentage splits.
// - equal: split evenly across all members (backend handles the math)
// - unequal: an amount input per member; must sum to the total
// - percentage: a percent input per member; must sum to 100
function AddExpenseModal({ open, onClose, group, onAdded }) {
  const members = group?.members || [];
  const currentUser = getUser();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [memberAmounts, setMemberAmounts] = useState({}); // { userId: "12.50" }
  const [memberPercents, setMemberPercents] = useState({}); // { userId: "50" }
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Default the payer to the logged-in user (if a member), else the first one.
  const defaultPayer =
    members.find((m) => m._id === currentUser?._id)?._id ||
    members[0]?._id ||
    "";
  const payer = paidBy || defaultPayer;

  const amountNum = parseFloat(amount) || 0;
  const allocated = members.reduce(
    (sum, m) => sum + (parseFloat(memberAmounts[m._id]) || 0),
    0
  );
  const percentTotal = members.reduce(
    (sum, m) => sum + (parseFloat(memberPercents[m._id]) || 0),
    0
  );

  const reset = () => {
    setDescription("");
    setAmount("");
    setPaidBy("");
    setSplitType("equal");
    setMemberAmounts({});
    setMemberPercents({});
    setError("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (amountNum <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    let payload = {
      description: description.trim(),
      amount: amountNum,
      paidBy: payer,
      splitType,
    };

    if (splitType === "unequal") {
      if (Math.abs(allocated - amountNum) > 0.01) {
        setError(
          `Split amounts add up to $${allocated.toFixed(
            2
          )}, but the total is $${amountNum.toFixed(2)}.`
        );
        return;
      }
      payload.splits = members.map((m) => ({
        user: m._id,
        amount: parseFloat(memberAmounts[m._id]) || 0,
      }));
    } else if (splitType === "percentage") {
      if (Math.abs(percentTotal - 100) > 0.01) {
        setError(`Percentages add up to ${percentTotal}%, but must total 100%.`);
        return;
      }
      payload.splits = members.map((m) => ({
        user: m._id,
        percentage: parseFloat(memberPercents[m._id]) || 0,
      }));
    }

    setLoading(true);
    try {
      await addExpense(group._id, payload);
      onAdded();
      close();
    } catch (err) {
      setError(err.response?.data?.msg || "Couldn't add the expense.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <Modal open={open} onClose={close} title="Add an expense">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            autoFocus
            className={inputClass}
            placeholder="Dinner, cab, groceries…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={inputClass}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Paid by
          </label>
          <select
            value={payer}
            onChange={(e) => setPaidBy(e.target.value)}
            className={inputClass}
          >
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Split type
          </label>
          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            className={inputClass}
          >
            <option value="equal">Equal</option>
            <option value="unequal">Unequal (exact amounts)</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        {/* Equal: nothing to configure */}
        {splitType === "equal" && (
          <p className="text-sm text-slate-500">
            Split equally across all {members.length} member
            {members.length !== 1 ? "s" : ""}.
          </p>
        )}

        {/* Unequal: an amount per member */}
        {splitType === "unequal" && (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m._id} className="flex items-center gap-3">
                <span className="flex-1 text-sm text-slate-700 truncate">
                  {m.name}
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={memberAmounts[m._id] || ""}
                  onChange={(e) =>
                    setMemberAmounts({
                      ...memberAmounts,
                      [m._id]: e.target.value,
                    })
                  }
                  className="w-28 rounded-lg border border-slate-300 bg-white/80 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
            ))}
            <p
              className={`text-sm text-right ${
                Math.abs(allocated - amountNum) <= 0.01 && amountNum > 0
                  ? "text-emerald-700"
                  : "text-amber-600"
              }`}
            >
              Allocated ${allocated.toFixed(2)} / ${amountNum.toFixed(2)}
            </p>
          </div>
        )}

        {/* Percentage: a percent per member */}
        {splitType === "percentage" && (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m._id} className="flex items-center gap-3">
                <span className="flex-1 text-sm text-slate-700 truncate">
                  {m.name}
                </span>
                <div className="relative w-28">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={memberPercents[m._id] || ""}
                    onChange={(e) =>
                      setMemberPercents({
                        ...memberPercents,
                        [m._id]: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white/80 pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    %
                  </span>
                </div>
              </div>
            ))}
            <p
              className={`text-sm text-right ${
                Math.abs(percentTotal - 100) <= 0.01
                  ? "text-emerald-700"
                  : "text-amber-600"
              }`}
            >
              Total {percentTotal}% / 100%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 text-white font-medium py-2 hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? "Adding…" : "Add expense"}
        </button>
      </form>
    </Modal>
  );
}

export default AddExpenseModal;
