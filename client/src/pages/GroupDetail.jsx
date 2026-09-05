import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import AddMemberModal from "../components/AddMemberModal";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseList from "../components/ExpenseList";
import BalancesSection from "../components/BalancesSection";
import Spinner from "../components/Spinner";
import { getGroup } from "../api/groups";
import { getExpenses } from "../api/expenses";
import { apiErrorMessage } from "../utils/apiError";

function GroupDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [expensesError, setExpensesError] = useState("");
  // Bumped whenever expenses change, so balances/settle re-fetch in sync.
  const [dataVersion, setDataVersion] = useState(0);

  const loadGroup = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGroup(id);
      if (!data) {
        setError(t("group.notFound"));
      } else {
        setGroup(data);
      }
    } catch (err) {
      setError(apiErrorMessage(err, "group.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    setExpensesLoading(true);
    setExpensesError("");
    try {
      const data = await getExpenses(id);
      setExpenses(data);
    } catch (err) {
      setExpensesError(apiErrorMessage(err, "group.expensesError"));
    } finally {
      setExpensesLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="nature-bg min-h-screen">
      <Header back />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading && (
          <div className="glass-card rounded-2xl p-6">
            <Spinner label={t("group.loadingGroup")} />
          </div>
        )}

        {!loading && error && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadGroup}
              className="rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-slate-700 hover:bg-white transition"
            >
              {t("common.tryAgain")}
            </button>
          </div>
        )}

        {!loading && !error && group && (
          <div className="space-y-6">
            {/* Group heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-800 break-words">
                  {group.name}
                </h2>
                {group.createdBy?.name && (
                  <p className="text-sm text-slate-500 mt-1">
                    {t("group.createdBy", { name: group.createdBy.name })}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowAddMember(true)}
                className="shrink-0 rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition"
              >
                + {t("group.addMember")}
              </button>
            </div>

            {/* Members section */}
            <section className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {t("group.members", { count: group.members?.length || 0 })}
              </h3>
              <ul className="divide-y divide-slate-200/70">
                {group.members?.map((m) => (
                  <li
                    key={m._id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <span className="font-medium text-slate-800 shrink-0">
                      {m.name}
                    </span>
                    <span className="text-sm text-slate-500 truncate">
                      {m.email}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Expenses */}
            <section className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  {t("group.expenses")}
                </h3>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition"
                >
                  + {t("group.addExpense")}
                </button>
              </div>

              {expensesLoading && <Spinner label={t("group.loadingExpenses")} />}

              {!expensesLoading && expensesError && (
                <div className="text-center py-6">
                  <p className="text-red-600 mb-3">{expensesError}</p>
                  <button
                    onClick={loadExpenses}
                    className="rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-slate-700 hover:bg-white transition"
                  >
                    {t("common.tryAgain")}
                  </button>
                </div>
              )}

              {!expensesLoading && !expensesError && expenses.length === 0 && (
                <p className="text-slate-500 text-sm py-6 text-center">
                  {t("group.noExpenses")}
                </p>
              )}

              {!expensesLoading && !expensesError && expenses.length > 0 && (
                <ExpenseList expenses={expenses} />
              )}
            </section>

            {/* Balances + Settle Up (re-fetch when expenses change) */}
            <BalancesSection groupId={id} refreshKey={dataVersion} />
          </div>
        )}
      </main>

      <AddMemberModal
        open={showAddMember}
        group={group}
        onClose={() => setShowAddMember(false)}
        onAdded={() => {
          loadGroup();
          setDataVersion((v) => v + 1);
        }}
      />
      {group && (
        <AddExpenseModal
          open={showAddExpense}
          group={group}
          onClose={() => setShowAddExpense(false)}
          onAdded={() => {
            loadExpenses();
            setDataVersion((v) => v + 1);
          }}
        />
      )}
    </div>
  );
}

export default GroupDetail;
