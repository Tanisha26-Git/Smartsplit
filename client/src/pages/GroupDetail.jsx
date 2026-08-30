import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import AddMemberModal from "../components/AddMemberModal";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseList from "../components/ExpenseList";
import BalancesSection from "../components/BalancesSection";
import Spinner from "../components/Spinner";
import { getGroup } from "../api/groups";
import { getExpenses } from "../api/expenses";

function GroupDetail() {
  const { id } = useParams();
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
        setError("Group not found — you may not be a member of it.");
      } else {
        setGroup(data);
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          (err.request
            ? "Can't reach the server. Is the backend running?"
            : "Couldn't load this group.")
      );
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
      setExpensesError(
        err.response?.data?.msg ||
          (err.request
            ? "Can't reach the server. Is the backend running?"
            : "Couldn't load expenses.")
      );
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
            <Spinner label="Loading group…" />
          </div>
        )}

        {!loading && error && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadGroup}
              className="rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-slate-700 hover:bg-white transition"
            >
              Try again
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
                    Created by {group.createdBy.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowAddMember(true)}
                className="shrink-0 rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition"
              >
                + Add member
              </button>
            </div>

            {/* Members section */}
            <section className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Members ({group.members?.length || 0})
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
                  Expenses
                </h3>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition"
                >
                  + Add expense
                </button>
              </div>

              {expensesLoading && <Spinner label="Loading expenses…" />}

              {!expensesLoading && expensesError && (
                <div className="text-center py-6">
                  <p className="text-red-600 mb-3">{expensesError}</p>
                  <button
                    onClick={loadExpenses}
                    className="rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-slate-700 hover:bg-white transition"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!expensesLoading && !expensesError && expenses.length === 0 && (
                <p className="text-slate-500 text-sm py-6 text-center">
                  No expenses yet — add the first one to get started.
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
