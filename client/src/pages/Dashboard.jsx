import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">SmartSplit 💸</h1>
          <button
            onClick={handleLogout}
            className="text-sm rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome to your Dashboard 🎉
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
