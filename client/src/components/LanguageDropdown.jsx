import { useTranslation } from "react-i18next";

// Language names shown in their own script. Adding a language here + a matching
// locale JSON is all that's needed to support it.
const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
];

// Styled native <select>. `variant="onDark"` for use over the sea video
// (Landing hero / auth pages); default is for the light header.
function LanguageDropdown({ variant = "onLight" }) {
  const { i18n } = useTranslation();

  const styles =
    variant === "onDark"
      ? "bg-white/20 backdrop-blur border-white/50 text-white"
      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50";

  return (
    <select
      aria-label="Language"
      value={i18n.resolvedLanguage || i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className={`rounded-lg border text-sm font-medium px-2.5 py-1.5 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${styles}`}
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code} className="text-slate-800">
          {l.label}
        </option>
      ))}
    </select>
  );
}

export default LanguageDropdown;
