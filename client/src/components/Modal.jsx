// Reusable glass modal. Renders nothing when `open` is false. Clicking the
// dimmed backdrop calls onClose; the card itself stops propagation.
function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-emerald-950/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-slate-400 hover:text-slate-700 transition"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
