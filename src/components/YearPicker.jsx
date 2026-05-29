export default function YearPicker({ minYear, maxYear, fromYear, toYear, onFromChange, onToChange, color }) {
  const years = [];
  for (let y = minYear; y <= maxYear; y++) years.push(y);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>FROM</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {years.map(y => (
              <button
                key={y}
                disabled={y >= toYear}
                onClick={() => onFromChange(y)}
                style={{
                  padding: "3px 8px",
                  fontSize: 12,
                  borderRadius: 4,
                  border: "1px solid",
                  cursor: y >= toYear ? "not-allowed" : "pointer",
                  borderColor: fromYear === y ? color : "#1a1f2e",
                  background: fromYear === y ? color + "22" : "#0a0f1a",
                  color: y >= toYear ? "#334155" : fromYear === y ? color : "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>TO</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {years.map(y => (
              <button
                key={y}
                disabled={y <= fromYear}
                onClick={() => onToChange(y)}
                style={{
                  padding: "3px 8px",
                  fontSize: 12,
                  borderRadius: 4,
                  border: "1px solid",
                  cursor: y <= fromYear ? "not-allowed" : "pointer",
                  borderColor: toYear === y ? color : "#1a1f2e",
                  background: toYear === y ? color + "22" : "#0a0f1a",
                  color: y <= fromYear ? "#334155" : toYear === y ? color : "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
