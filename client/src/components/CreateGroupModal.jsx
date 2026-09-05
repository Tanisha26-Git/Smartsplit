import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import { createGroup } from "../api/groups";
import { apiErrorMessage } from "../utils/apiError";
import { useToast } from "./Toast";

// Modal with a single "name" field. On success it calls onCreated() so the
// parent can refresh its list, then closes.
function CreateGroupModal({ open, onClose, onCreated }) {
  const { t } = useTranslation();
  const toast = useToast();
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
      toast(t("toast.groupCreated"));
      onCreated();
      close();
    } catch (err) {
      setError(apiErrorMessage(err, "createGroup.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title={t("createGroup.title")}>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("createGroup.groupName")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={t("createGroup.placeholder")}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 text-white font-medium py-2 hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? t("createGroup.creating") : t("createGroup.create")}
        </button>
      </form>
    </Modal>
  );
}

export default CreateGroupModal;
