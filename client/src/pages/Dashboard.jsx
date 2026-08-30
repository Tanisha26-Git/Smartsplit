import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="nature-bg min-h-screen">
      <header className="bg-white/70 backdrop-blur-md border-b border-white/40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">SmartSplit 💸</h1>
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

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="glass-card rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome{user?.name ? `, ${user.name}` : ""}! 🎉
          </h2>
          <p className="text-slate-500 mt-2">
            You&apos;re logged in. Groups, expenses, and settle-up are coming next.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
