import { calcCAGR, calcMaxDD } from "../utils/stats";

function Card({ title, strat, years, color }) {
  if (!strat || strat.length === 0) return null;
  const final = strat[strat.length - 1];
  const totalReturn = (final - 100).toFixed(1);
  const cagr = calcCAGR(final, years);
  const mdd = calcMaxDD(strat);

  return (
    <div style={{
      background: "#0a0f1a",
      border: `1px solid ${color}44`,
      borderRadius: 8,
      padding: 16,
      flex: 1,
      minWidth: 160,
    }}>
      <div style={{ color, fontSize: 11, fontFamily: "monospace", letterSpacing: 1, marginBottom: 10 }}>{title}</div>
      <div style={{ marginBottom: 6 }}>
        <span style={{ color: "#475569", fontSize: 11, fontFamily: "monospace" }}>총수익률 </span>
        <span style={{ color: final >= 100 ? "#4ade80" : "#f87171", fontSize: 18, fontFamily: "monospace", fontWeight: "bold" }}>
          {totalReturn > 0 ? "+" : ""}{totalReturn}%
        </span>
      </div>
      <div style={{ marginBottom: 6 }}>
        <span style={{ color: "#475569", fontSize: 11, fontFamily: "monospace" }}>CAGR </span>
        <span style={{ color: "#e2e8f0", fontSize: 14, fontFamily: "monospace" }}>
          {cagr > 0 ? "+" : ""}{cagr}%
        </span>
      </div>
      <div>
        <span style={{ color: "#475569", fontSize: 11, fontFamily: "monospace" }}>MDD </span>
        <span style={{ color: "#f87171", fontSize: 14, fontFamily: "monospace" }}>-{mdd}%</span>
      </div>
    </div>
  );
}

export default function ResultCards({ stratArr, holdArr, years, colors, trades }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
      <Card title="분할매도 전략 (세후)" strat={stratArr} years={years} color={colors[0]} />
      <Card title="존버" strat={holdArr} years={years} color={colors[1]} />
      {stratArr && stratArr.length > 0 && (
        <div style={{
          background: "#0a0f1a",
          border: "1px solid #1a1f2e",
          borderRadius: 8,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 120,
        }}>
          <div style={{ color: "#475569", fontSize: 11, fontFamily: "monospace" }}>거래 횟수</div>
          <div style={{ color: "#e2e8f0", fontSize: 22, fontFamily: "monospace", fontWeight: "bold" }}>{trades}</div>
        </div>
      )}
    </div>
  );
}
