import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

// Shared top bar used across the authed pages. Pass `back` to show a link
// back to the dashboard (used on the group detail page).
function Header({ back = false }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-white/40">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {back && (
            <Link
              to="/dashboard"
              className="text-sm text-slate-500 hover:text-slate-800 transition"
            >
              ← Back
            </Link>
          )}
          <Link to="/dashboard" className="text-xl font-bold text-slate-800">
            SmartSplit 💸
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user?.name && (
            <span className="text-sm text-slate-600">
              Hi, <span className="font-medium text-slate-800">{user.name}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm rounded-lg border border-slate-300 bg-white/70 px-3 py-1.5 text-slate-600 hover:bg-white transition"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
