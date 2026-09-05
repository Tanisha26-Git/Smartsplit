import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";
import { formatMoney } from "../utils/format";

// Bar chart of each member's net balance. Green bars = owed money (positive),
// red bars = owes money (negative). Responsive to its container width.
function BalanceChart({ balances }) {
  const { t } = useTranslation();
  const data = balances.map((b) => ({
    name: b.name,
    balance: Number(Number(b.balance).toFixed(2)),
  }));

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} />
          <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
          <Tooltip
            formatter={(v) => [formatMoney(v), t("balances.netBalance")]}
            contentStyle={{ borderRadius: 8, border: "1px solid #a7f3d0" }}
          />
          <ReferenceLine y={0} stroke="#94a3b8" />
          <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.balance >= 0 ? "#059669" : "#dc2626"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BalanceChart;
