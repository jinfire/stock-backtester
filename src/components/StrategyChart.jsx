import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function StrategyChart({ dates, stratArr, holdArr, colors }) {
  if (!stratArr || stratArr.length === 0) return null;

  const data = dates.map((d, i) => ({
    date: d.slice(0, 7),
    strat: stratArr[i],
    hold: holdArr[i],
  }));

  // Sample down to ~300 points for performance
  const step = Math.max(1, Math.floor(data.length / 300));
  const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <div style={{ background: "#0a0f1a", border: "1px solid #1a1f2e", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={sampled} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1f2e" />
          <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }} interval="preserveStartEnd" />
          <YAxis tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }} tickFormatter={v => `$${v}`} />
          <Tooltip
            contentStyle={{ background: "#0a0f1a", border: "1px solid #1a1f2e", fontFamily: "monospace", fontSize: 12 }}
            labelStyle={{ color: "#94a3b8" }}
            formatter={(v, name) => [`$${v}`, name === "strat" ? "분할매도" : "존버"]}
          />
          <Legend formatter={v => v === "strat" ? "분할매도 (세후)" : "존버"} wrapperStyle={{ fontFamily: "monospace", fontSize: 12 }} />
          <Line type="monotone" dataKey="strat" stroke={colors[0]} dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="hold" stroke={colors[1]} dot={false} strokeWidth={2} strokeDasharray="5 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
