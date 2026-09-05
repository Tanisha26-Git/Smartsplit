import { useTranslation } from "react-i18next";
import { formatMoney } from "../utils/format";

const TYPE_KEY = {
  equal: "expense.typeEqual",
  unequal: "expense.typeUnequal",
  percentage: "expense.typePercentage",
};

// Renders a group's expenses. Each row shows the description, amount, who paid,
// the split type, and the per-member breakdown.
function ExpenseList({ expenses }) {
  const { t } = useTranslation();
  return (
    <ul className="divide-y divide-slate-200/70">
      {expenses.map((exp) => (
        <li key={exp._id} className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-slate-800 truncate">
                {exp.description}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("expense.paidByType", {
                  name: exp.paidBy?.name || "—",
                  type: TYPE_KEY[exp.splitType]
                    ? t(TYPE_KEY[exp.splitType])
                    : exp.splitType,
                })}
              </p>
            </div>
            <p className="font-semibold text-slate-800 whitespace-nowrap">
              {formatMoney(exp.amount)}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {exp.splits?.map((s) => (
              <span
                key={s._id || s.user?._id}
                className="text-xs rounded-full bg-emerald-50 text-emerald-800 px-2.5 py-1"
              >
                {s.user?.name || "—"}: {formatMoney(s.amount)}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
