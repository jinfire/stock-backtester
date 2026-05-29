function Slider({ label, value, min, max, step = 1, unit, onChange, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "monospace" }}>{label}</span>
        <span style={{ color, fontSize: 12, fontFamily: "monospace", fontWeight: "bold" }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color }}
      />
    </div>
  );
}

export default function ParamSliders({ params, onChange, color }) {
  return (
    <div style={{ background: "#0a0f1a", border: "1px solid #1a1f2e", borderRadius: 8, padding: 16 }}>
      <Slider label="하락 트리거" value={params.sellDrop} min={1} max={30} unit="%" onChange={v => onChange({ ...params, sellDrop: v })} color={color} />
      <Slider label="분할매도 횟수" value={params.sellTimes} min={1} max={10} unit="회" onChange={v => onChange({ ...params, sellTimes: v })} color={color} />
      <Slider label="반등 트리거" value={params.buyRise} min={1} max={30} unit="%" onChange={v => onChange({ ...params, buyRise: v })} color={color} />
      <Slider label="분할매수 횟수" value={params.buyTimes} min={1} max={10} unit="회" onChange={v => onChange({ ...params, buyTimes: v })} color={color} />
      <Slider label="양도세율" value={params.taxRate} min={0} max={50} unit="%" onChange={v => onChange({ ...params, taxRate: v })} color={color} />
    </div>
  );
}
