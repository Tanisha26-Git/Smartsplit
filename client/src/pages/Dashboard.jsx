import { useEffect, useState } from "react";
import Header from "../components/Header";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";
import AddMemberModal from "../components/AddMemberModal";
import { getGroups } from "../api/groups";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [addMemberGroup, setAddMemberGroup] = useState(null); // group or null

  const loadGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          (err.request
            ? "Can't reach the server. Is the backend running?"
            : "Couldn't load your groups.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <div className="nature-bg min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Your Groups</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition"
          >
            + New group
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="glass-card rounded-2xl p-10 text-center text-slate-500">
            Loading your groups…
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadGroups}
              className="rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-slate-700 hover:bg-white transition"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && groups.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-4xl mb-3">🌱</p>
            <h3 className="text-lg font-semibold text-slate-800">
              No groups yet
            </h3>
            <p className="text-slate-500 mt-1 mb-6">
              Create your first group to start splitting expenses.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-lg bg-emerald-600 text-white font-medium px-5 py-2.5 hover:bg-emerald-700 transition"
            >
              + Create a group
            </button>
          </div>
        )}

        {/* Loaded list */}
        {!loading && !error && groups.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                onAddMember={setAddMemberGroup}
              />
            ))}
          </div>
        )}
      </main>

      <CreateGroupModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={loadGroups}
      />
      <AddMemberModal
        open={!!addMemberGroup}
        group={addMemberGroup}
        onClose={() => setAddMemberGroup(null)}
        onAdded={loadGroups}
      />
    </div>
  );
}

export default Dashboard;
