import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getUser, logout } from "../utils/auth";
import LanguageDropdown from "./LanguageDropdown";

// Shared top bar used across the authed pages. Pass `back` to show a link
// back to the dashboard (used on the group detail page).
function Header({ back = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {back && (
            <Link
              to="/dashboard"
              className="text-sm text-slate-500 hover:text-slate-800 transition whitespace-nowrap"
            >
              ← {t("common.back")}
            </Link>
          )}
          <Link
            to="/dashboard"
            className="text-xl font-bold text-slate-800 whitespace-nowrap"
          >
            SmartSplit 💸
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user?.name && (
            <span className="hidden sm:inline text-sm text-slate-600">
              {t("nav.greeting", { name: user.name })}
            </span>
          )}
          <LanguageDropdown />
          <button
            onClick={handleLogout}
            className="text-sm rounded-lg border border-slate-300 bg-white/70 px-3 py-1.5 text-slate-600 hover:bg-white transition whitespace-nowrap"
          >
            {t("common.logout")}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
