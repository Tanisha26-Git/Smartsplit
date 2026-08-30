// Small centered loading spinner with an optional label. Used anywhere the app
// is waiting on data so loading states look consistent.
function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-slate-500">
      <svg
        className="animate-spin h-7 w-7 text-emerald-600"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export default Spinner;
