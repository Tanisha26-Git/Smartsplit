import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isAuthenticated } from "../utils/auth";
import LanguageDropdown from "../components/LanguageDropdown";

function Landing() {
  const { t } = useTranslation();

  // Logged-in visitors skip the pitch and go straight to their dashboard.
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  const steps = [
    { n: "1", title: t("landing.step1Title"), desc: t("landing.step1Desc") },
    { n: "2", title: t("landing.step2Title"), desc: t("landing.step2Desc") },
    { n: "3", title: t("landing.step3Title"), desc: t("landing.step3Desc") },
  ];

  const features = [
    { icon: "👥", title: t("landing.feat1Title"), desc: t("landing.feat1Desc") },
    { icon: "➗", title: t("landing.feat2Title"), desc: t("landing.feat2Desc") },
    { icon: "📊", title: t("landing.feat3Title"), desc: t("landing.feat3Desc") },
    {
      icon: "⚡",
      title: t("landing.feat4Title"),
      desc: t("landing.feat4Desc"),
      highlight: true,
    },
  ];

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

        <div className="absolute top-4 right-4 z-20">
          <LanguageDropdown variant="onDark" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-24 sm:py-32 text-center text-white">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            SmartSplit 💸
          </h1>
          <p className="mt-5 text-lg sm:text-2xl text-emerald-50/90">
            {t("landing.tagline")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 shadow-lg transition"
            >
              {t("landing.getStarted")}
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur border border-white/40 text-white font-semibold px-6 py-3 transition"
            >
              {t("landing.logIn")}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-10">
          {t("landing.howItWorks")}
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
          {t("landing.features")}
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
                    {t("landing.standout")}
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
            {t("landing.builtBy")}{" "}
            <span className="font-semibold text-white">Tanisha</span>
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
