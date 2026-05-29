import { useState } from "react";
import { runStrategyFast } from "../utils/backtester";

export default function Top5Panel({ prices, onApply, color }) {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [searched, setSearched] = useState(false);

  function run() {
    setRunning(true);
    setTimeout(() => {
      const found = [];
      const priceArr = prices.map(d => d.price);

      for (let sd = 1; sd <= 30; sd++) {
        for (let st = 1; st <= 10; st++) {
          for (let br = 1; br <= 30; br++) {
            for (let bt = 1; bt <= 10; bt++) {
              const { stratFinal, holdFinal } = runStrategyFast(priceArr, sd, st, br, bt, 22);
              if (stratFinal > holdFinal) {
                found.push({ sd, st, br, bt, stratFinal, holdFinal });
              }
            }
          }
        }
      }

      found.sort((a, b) => b.stratFinal - a.stratFinal);
      setResults(found.slice(0, 5));
      setSearched(true);
      setRunning(false);
    }, 10);
  }

  return (
    <div style={{ background: "#0a0f1a", border: "1px solid #1a1f2e", borderRadius: 8, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "monospace" }}>TOP 5 파라미터 탐색</span>
        <button
          onClick={run}
          disabled={running || prices.length === 0}
          style={{
            padding: "4px 14px",
            borderRadius: 4,
            border: `1px solid ${color}`,
            background: color + "22",
            color,
            fontFamily: "monospace",
            fontSize: 12,
            cursor: running || prices.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          {running ? "탐색 중..." : "탐색 시작"}
        </button>
      </div>

      {results.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace" }}>
          <thead>
            <tr style={{ color: "#475569" }}>
              <th style={{ textAlign: "left", padding: "4px 8px" }}>하락%</th>
              <th style={{ textAlign: "left", padding: "4px 8px" }}>매도횟수</th>
              <th style={{ textAlign: "left", padding: "4px 8px" }}>반등%</th>
              <th style={{ textAlign: "left", padding: "4px 8px" }}>매수횟수</th>
              <th style={{ textAlign: "right", padding: "4px 8px" }}>전략</th>
              <th style={{ textAlign: "right", padding: "4px 8px" }}>존버</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                onClick={() => onApply({ sellDrop: r.sd, sellTimes: r.st, buyRise: r.br, buyTimes: r.bt, taxRate: 22 })}
                style={{ cursor: "pointer", borderTop: "1px solid #1a1f2e" }}
                onMouseEnter={e => e.currentTarget.style.background = "#ffffff08"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "5px 8px", color: "#e2e8f0" }}>{r.sd}%</td>
                <td style={{ padding: "5px 8px", color: "#e2e8f0" }}>{r.st}회</td>
                <td style={{ padding: "5px 8px", color: "#e2e8f0" }}>{r.br}%</td>
                <td style={{ padding: "5px 8px", color: "#e2e8f0" }}>{r.bt}회</td>
                <td style={{ padding: "5px 8px", color: "#4ade80", textAlign: "right" }}>${r.stratFinal}</td>
                <td style={{ padding: "5px 8px", color: "#94a3b8", textAlign: "right" }}>${r.holdFinal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {results.length === 0 && !running && searched && (
        <div style={{ color: "#f87171", fontSize: 12, fontFamily: "monospace" }}>
          이기는 구간이 없음 — 이 종목/기간은 존버가 항상 우세합니다
        </div>
      )}
      {results.length === 0 && !running && !searched && (
        <div style={{ color: "#334155", fontSize: 11, fontFamily: "monospace" }}>
          탐색 결과가 여기에 표시됩니다
        </div>
      )}
    </div>
  );
}
