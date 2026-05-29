import { useState, useMemo } from "react";
import { useStockData } from "./hooks/useStockData";
import { runStrategy } from "./utils/backtester";
import YearPicker from "./components/YearPicker";
import ParamSliders from "./components/ParamSliders";
import ResultCards from "./components/ResultCards";
import StrategyChart from "./components/StrategyChart";
import Top5Panel from "./components/Top5Panel";

const TICKERS = [
  { id: "MU",   name: "Micron",   colors: ["#c084fc", "#f472b6"] },
  { id: "NVDA", name: "NVIDIA",   colors: ["#76ef8a", "#22d3ee"] },
  { id: "PLTR", name: "Palantir", colors: ["#f97316", "#fbbf24"] },
  { id: "VRT",  name: "Vertiv",   colors: ["#60a5fa", "#818cf8"] },
  { id: "AXON", name: "Axon",     colors: ["#f43f5e", "#fb923c"] },
];

const DEFAULT_PARAMS = { sellDrop: 10, sellTimes: 5, buyRise: 5, buyTimes: 1, taxRate: 22 };

export default function App() {
  const [tickerIdx, setTickerIdx] = useState(0);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [fromYear, setFromYear] = useState(null);
  const [toYear, setToYear] = useState(null);

  const ticker = TICKERS[tickerIdx];
  const { data, loading, error } = useStockData(ticker.id);

  const minYear = useMemo(() => {
    if (!data.length) return 2000;
    return parseInt(data[0].date.slice(0, 4));
  }, [data]);

  const maxYear = useMemo(() => {
    if (!data.length) return new Date().getFullYear();
    return parseInt(data[data.length - 1].date.slice(0, 4));
  }, [data]);

  const effectiveFrom = fromYear ?? minYear;
  const effectiveTo = toYear ?? maxYear;

  const filtered = useMemo(() => {
    return data.filter(d => {
      const y = parseInt(d.date.slice(0, 4));
      return y >= effectiveFrom && y <= effectiveTo;
    });
  }, [data, effectiveFrom, effectiveTo]);

  const priceArr = useMemo(() => filtered.map(d => d.price), [filtered]);
  const dateArr = useMemo(() => filtered.map(d => d.date), [filtered]);

  const { strat, hold, trades } = useMemo(() => {
    if (priceArr.length < 2) return { strat: [], hold: [], trades: 0 };
    return runStrategy(priceArr, params.sellDrop, params.sellTimes, params.buyRise, params.buyTimes, params.taxRate);
  }, [priceArr, params]);

  const years = effectiveTo - effectiveFrom;

  function handleTickerChange(idx) {
    setTickerIdx(idx);
    setFromYear(null);
    setToYear(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060b14", color: "#e2e8f0", padding: "20px 16px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "monospace", fontSize: 18, marginBottom: 20, color: "#94a3b8", letterSpacing: 2 }}>
          STOCK STRATEGY BACKTESTER
        </h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {TICKERS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handleTickerChange(i)}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                border: `1px solid ${tickerIdx === i ? t.colors[0] : "#1a1f2e"}`,
                background: tickerIdx === i ? t.colors[0] + "22" : "#0a0f1a",
                color: tickerIdx === i ? t.colors[0] : "#475569",
                fontFamily: "monospace",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: tickerIdx === i ? "bold" : "normal",
              }}
            >
              {t.id}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ color: "#475569", fontFamily: "monospace", padding: 20 }}>데이터 로딩 중...</div>
        )}
        {error && (
          <div style={{ color: "#f87171", fontFamily: "monospace", padding: 20 }}>
            {error}<br />
            <span style={{ fontSize: 11, color: "#475569" }}>public/data/{ticker.id}.csv 파일을 배치해주세요</span>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <>
            <div style={{ background: "#0a0f1a", border: "1px solid #1a1f2e", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <YearPicker
                minYear={minYear}
                maxYear={maxYear}
                fromYear={effectiveFrom}
                toYear={effectiveTo}
                onFromChange={y => setFromYear(y)}
                onToChange={y => setToYear(y)}
                color={ticker.colors[0]}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <ParamSliders params={params} onChange={setParams} color={ticker.colors[0]} />
            </div>

            <ResultCards stratArr={strat} holdArr={hold} years={years} colors={ticker.colors} trades={trades} />

            <StrategyChart dates={dateArr} stratArr={strat} holdArr={hold} colors={ticker.colors} />

            <Top5Panel
              prices={filtered}
              onApply={p => setParams(p)}
              color={ticker.colors[0]}
            />
          </>
        )}
      </div>
    </div>
  );
}
