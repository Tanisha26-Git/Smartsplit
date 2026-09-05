import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { saveAuth } from "../utils/auth";
import { apiErrorMessage } from "../utils/apiError";
import VideoBackground from "../components/VideoBackground";
import LanguageDropdown from "../components/LanguageDropdown";

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      saveAuth(data);
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nature-bg min-h-screen flex items-center justify-center px-4 py-10">
      <VideoBackground />
      <div className="lang-corner">
        <LanguageDropdown variant="onDark" />
      </div>
      <div className="w-full max-w-md glass-card rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          SmartSplit 💸
        </h1>
        <p className="text-slate-500 text-center mt-1 mb-6">
          {t("auth.welcomeBack")}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("auth.email")}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("auth.password")}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 text-white font-medium py-2 hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {loading ? t("auth.loggingIn") : t("auth.logInBtn")}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          {t("auth.noAccount")}{" "}
          <Link to="/signup" className="text-emerald-700 font-medium hover:underline">
            {t("auth.signUpLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
