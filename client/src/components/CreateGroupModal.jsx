import { useState } from "react";
import Modal from "./Modal";
import { createGroup } from "../api/groups";

// Modal with a single "name" field. On success it calls onCreated() so the
// parent can refresh its list, then closes.
function CreateGroupModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    setName("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createGroup(name.trim());
      onCreated();
      close();
    } catch (err) {
      setError(err.response?.data?.msg || "Couldn't create the group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Create a group">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Group name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Goa Trip, Flatmates, …"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 text-white font-medium py-2 hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create group"}
        </button>
      </form>
    </Modal>
  );
}

export default CreateGroupModal;
