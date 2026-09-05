import { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import BalanceChart from "./BalanceChart";
import Spinner from "./Spinner";
import { getBalances, getSettlement } from "../api/balances";
import { formatMoney } from "../utils/format";
import { apiErrorMessage } from "../utils/apiError";

// Balances + Settle Up for a group. Re-fetches balances whenever `refreshKey`
// changes (e.g. after an expense is added) and clears any stale settlement.
function BalancesSection({ groupId, refreshKey }) {
  const { t } = useTranslation();
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
      setError(apiErrorMessage(err, "balances.error"));
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
      setSettleError(apiErrorMessage(err, "balances.settleError"));
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
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {t("balances.title")}
        </h3>

        {loading && <Spinner label={t("balances.loading")} />}

        {!loading && error && (
          <div className="text-center py-6">
            <p className="text-red-600 mb-3">{error}</p>
            <button
              onClick={loadBalances}
              className="rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-slate-700 hover:bg-white transition"
            >
              {t("common.tryAgain")}
            </button>
          </div>
        )}

        {!loading && !error && allSettled && (
          <p className="text-center py-8 text-lg font-medium text-emerald-700">
            {t("balances.allSettled")}
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
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <span className="font-medium text-slate-800">{b.name}</span>
                    {owed && (
                      <span className="text-emerald-700 font-medium text-right">
                        {t("balances.isOwed", {
                          amount: formatMoney(b.balance),
                        })}
                      </span>
                    )}
                    {owes && (
                      <span className="text-red-600 font-medium text-right">
                        {t("balances.owes", {
                          amount: formatMoney(Math.abs(b.balance)),
                        })}
                      </span>
                    )}
                    {!owed && !owes && (
                      <span className="text-slate-500">
                        {t("balances.settledUp")}
                      </span>
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
          <h3 className="text-lg font-semibold text-slate-800">
            {t("balances.settleUp")}
          </h3>
          <button
            onClick={handleSettle}
            disabled={settleLoading || loading || !!error}
            className="rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {settleLoading ? t("balances.calculating") : t("balances.settleUp")}
          </button>
        </div>

        {settleError && <p className="text-red-600 text-sm mb-3">{settleError}</p>}

        {transactions === null && !settleError && (
          <p className="text-slate-500 text-sm">{t("balances.settlePrompt")}</p>
        )}

        {transactions !== null && transactions.length === 0 && (
          <p className="text-lg font-medium text-emerald-700">
            {t("balances.allSettled")}
          </p>
        )}

        {transactions !== null && transactions.length > 0 && (
          <ul className="space-y-2">
            {transactions.map((tx, i) => (
              <li
                key={i}
                className="rounded-lg bg-emerald-50 text-slate-800 px-4 py-2.5"
              >
                <Trans
                  i18nKey="balances.pays"
                  values={{
                    from: tx.fromName,
                    to: tx.toName,
                    amount: formatMoney(tx.amount),
                  }}
                  components={{
                    b: <span className="font-medium" />,
                    amt: <span className="font-semibold text-emerald-700" />,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default BalancesSection;
