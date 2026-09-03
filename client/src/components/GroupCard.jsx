import { useNavigate } from "react-router-dom";

// A single group tile. Clicking the card opens the group detail page; the
// "Add member" button stops propagation so it doesn't also navigate.
function GroupCard({ group, onAddMember }) {
  const navigate = useNavigate();
  const count = group.members?.length || 0;

  return (
    <div
      onClick={() => navigate(`/groups/${group._id}`)}
      className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition"
    >
      <h3 className="text-lg font-semibold text-slate-800 truncate">
        {group.name}
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        {count} member{count !== 1 ? "s" : ""}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-emerald-700 font-medium">View →</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddMember(group);
          }}
          className="text-sm rounded-lg border border-emerald-300 bg-white/70 px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 transition"
        >
          + Add member
        </button>
      </div>
    </div>
  );
}

export default GroupCard;
