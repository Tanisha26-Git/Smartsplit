import { useState } from "react";
import Modal from "./Modal";
import { addMember } from "../api/groups";

// Adds a member (by email) to `group`. On success calls onAdded() so the
// parent can refresh, then closes. Shows backend errors like "User not found"
// or "User already in group".
function AddMemberModal({ open, onClose, group, onAdded }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    setEmail("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addMember(group._id, email.trim());
      onAdded();
      close();
    } catch (err) {
      setError(err.response?.data?.msg || "Couldn't add the member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={group ? `Add member to ${group.name}` : "Add member"}
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Member email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="friend@example.com"
          />
          <p className="text-xs text-slate-500 mt-1">
            They must already have a SmartSplit account.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 text-white font-medium py-2 hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? "Adding…" : "Add member"}
        </button>
      </form>
    </Modal>
  );
}

export default AddMemberModal;
