import { useEffect, useState } from "react";
import BalanceChart from "./BalanceChart";
import Spinner from "./Spinner";
import { getBalances, getSettlement } from "../api/balances";
import { formatMoney } from "../utils/format";

// Balances + Settle Up for a group. Re-fetches balances whenever `refreshKey`
// changes (e.g. after an expense is added) and clears any stale settlement.
function BalancesSection({ groupId, refreshKey }) {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [transactions, setTransactions] = useState(null); // null = not run yet
  const [settleLoading, setSettleLoading] = useState(false);
  const [settleError, setSettleError] = useState("");

  const loadBalances = async () => {
    setLoading(true);
    setError("");
    setTransactions(null); // balances changed -> old settlement is stale
    setSettleError("");
    try {
      const data = await getBalances(groupId);
      setBalances(data);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          (err.request
            ? "Can't reach the server. Is the backend running?"
            : "Couldn't load balances.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async () => {
    setSettleLoading(true);
    setSettleError("");
    try {
      const data = await getSettlement(groupId);
      setTransactions(data.transactions);
    } catch (err) {
      setSettleError(
        err.response?.data?.msg || "Couldn't calculate the settlement."
      );
    } finally {
      setSettleLoading(false);
    }
  };

  useEffect(() => {
    loadBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, refreshKey]);

  const allSettled =
    balances.length > 0 && balances.every((b) => Math.abs(b.balance) < 0.01);

  return (
    <>
      {/* Balances */}
      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Balances</h3>

        {loading && <Spinner label="Loading balances…" />}

        {!loading && error && (
          <div className="text-center py-6">
            <p className="text-red-600 mb-3">{error}</p>
            <button
              onClick={loadBalances}
              className="rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-slate-700 hover:bg-white transition"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && allSettled && (
          <p className="text-center py-8 text-lg font-medium text-emerald-700">
            Everyone&apos;s settled up! 🎉
          </p>
        )}

        {!loading && !error && !allSettled && balances.length > 0 && (
          <>
            <ul className="divide-y divide-slate-200/70 mb-6">
              {balances.map((b) => {
                const owed = b.balance > 0.01;
                const owes = b.balance < -0.01;
                return (
                  <li
                    key={b._id}
                    className="py-3 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">{b.name}</span>
                    {owed && (
                      <span className="text-emerald-700 font-medium">
                        is owed {formatMoney(b.balance)}
                      </span>
                    )}
                    {owes && (
                      <span className="text-red-600 font-medium">
                        owes {formatMoney(Math.abs(b.balance))}
                      </span>
                    )}
                    {!owed && !owes && (
                      <span className="text-slate-500">settled up</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <BalanceChart balances={balances} />
          </>
        )}
      </section>

      {/* Settle Up */}
      <section className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Settle Up</h3>
          <button
            onClick={handleSettle}
            disabled={settleLoading || loading || !!error}
            className="rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {settleLoading ? "Calculating…" : "Settle Up"}
          </button>
        </div>

        {settleError && <p className="text-red-600 text-sm mb-3">{settleError}</p>}

        {transactions === null && !settleError && (
          <p className="text-slate-500 text-sm">
            Click “Settle Up” to see the fewest payments that clear all debts.
          </p>
        )}

        {transactions !== null && transactions.length === 0 && (
          <p className="text-lg font-medium text-emerald-700">
            Everyone&apos;s settled up! 🎉
          </p>
        )}

        {transactions !== null && transactions.length > 0 && (
          <ul className="space-y-2">
            {transactions.map((t, i) => (
              <li
                key={i}
                className="rounded-lg bg-emerald-50 text-slate-800 px-4 py-2.5"
              >
                <span className="font-medium">{t.fromName}</span> pays{" "}
                <span className="font-medium">{t.toName}</span>{" "}
                <span className="font-semibold text-emerald-700">
                  {formatMoney(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default BalancesSection;
