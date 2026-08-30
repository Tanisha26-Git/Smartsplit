import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import AddMemberModal from "../components/AddMemberModal";
import { getGroup } from "../api/groups";

function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

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

  useEffect(() => {
    loadGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="nature-bg min-h-screen">
      <Header back />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading && (
          <div className="glass-card rounded-2xl p-10 text-center text-slate-500">
            Loading group…
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
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
                className="rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition"
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
                    className="py-3 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">{m.name}</span>
                    <span className="text-sm text-slate-500">{m.email}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Placeholder sections — wired up in later days */}
            <section className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                Expenses
              </h3>
              <p className="text-slate-500 text-sm">
                Expenses for this group will appear here.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                Settle up
              </h3>
              <p className="text-slate-500 text-sm">
                Balances and the minimal set of payments will appear here.
              </p>
            </section>
          </div>
        )}
      </main>

      <AddMemberModal
        open={showAddMember}
        group={group}
        onClose={() => setShowAddMember(false)}
        onAdded={loadGroup}
      />
    </div>
  );
}

export default GroupDetail;
