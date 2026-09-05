import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";
import AddMemberModal from "../components/AddMemberModal";
import Spinner from "../components/Spinner";
import { getGroups } from "../api/groups";
import { apiErrorMessage } from "../utils/apiError";

function Dashboard() {
  const { t } = useTranslation();
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
      setError(apiErrorMessage(err, "dashboard.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {t("dashboard.yourGroups")}
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-emerald-600 text-white font-medium px-4 py-2 hover:bg-emerald-700 transition"
          >
            + {t("dashboard.newGroup")}
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <Spinner label={t("dashboard.loadingGroups")} />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadGroups}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
            >
              {t("common.tryAgain")}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && groups.length === 0 && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center">
            <p className="text-4xl mb-3">🌱</p>
            <h3 className="text-lg font-semibold text-slate-800">
              {t("dashboard.noGroupsTitle")}
            </h3>
            <p className="text-slate-500 mt-1 mb-6">
              {t("dashboard.noGroupsDesc")}
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-lg bg-emerald-600 text-white font-medium px-5 py-2.5 hover:bg-emerald-700 transition"
            >
              + {t("dashboard.createGroupCta")}
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
