import { Link, Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const steps = [
  {
    n: "1",
    title: "Create a group",
    desc: "Start a group and invite your friends by email.",
  },
  {
    n: "2",
    title: "Add expenses",
    desc: "Log who paid and split equally, unequally, or by percentage.",
  },
  {
    n: "3",
    title: "Settle up",
    desc: "See the fewest payments needed to clear every debt — in one tap.",
  },
];

const features = [
  {
    icon: "👥",
    title: "Group expense tracking",
    desc: "Organize shared costs by group and keep everyone on the same page.",
  },
  {
    icon: "➗",
    title: "Flexible splits",
    desc: "Split equally, by exact amounts, or by percentage — whatever fits.",
  },
  {
    icon: "📊",
    title: "Balance sheet",
    desc: "Instantly see who owes whom, and by how much, at a glance.",
  },
  {
    icon: "⚡",
    title: "Smart settle-up",
    desc: "A Min Cash Flow algorithm clears all debts in the fewest possible transactions.",
    highlight: true,
  },
];

function Landing() {
  // Logged-in visitors skip the pitch and go straight to their dashboard.
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  return (
    <div className="nature-bg min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-800 to-slate-900">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/sea-bg-1080.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-sky-950/60" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-24 sm:py-32 text-center text-white">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            SmartSplit 💸
          </h1>
          <p className="mt-5 text-lg sm:text-2xl text-emerald-50/90">
            Split expenses effortlessly — settle up in the fewest payments.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 shadow-lg transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur border border-white/40 text-white font-semibold px-6 py-3 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-10">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="glass-card rounded-2xl p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white text-xl font-bold">
                {s.n}
              </div>
              <h3 className="text-lg font-semibold text-slate-800">{s.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-10">
          Features
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className={`glass-card rounded-2xl p-6 ${
                f.highlight ? "ring-2 ring-emerald-500" : ""
              }`}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-slate-800 flex flex-wrap items-center gap-2">
                {f.title}
                {f.highlight && (
                  <span className="text-xs font-semibold uppercase tracking-wide bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Standout
                  </span>
                )}
              </h3>
              <p className="text-slate-600 mt-2 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/30 bg-emerald-950/25 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-emerald-50">
          <span>
            Built by <span className="font-semibold text-white">Tanisha</span>
          </span>
          <a
            href="https://github.com/Tanisha26-Git"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white hover:underline"
          >
            GitHub ↗
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
