import { useState, useEffect } from "react";
import Papa from "papaparse";

export function useStockData(ticker) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.BASE_URL}data/${ticker}.csv`)
      .then(r => {
        if (!r.ok) throw new Error(`${ticker}.csv 파일을 찾을 수 없습니다`);
        return r.text();
      })
      .then(csv => {
        const { data: rows } = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });
        // investing.com 날짜 파싱 (e.g. "Jan 03, 2000" → "2000-01-03")
        function parseDate(str) {
          const s = str?.trim();
          if (!s) return null;
          // YYYY-MM-DD (Yahoo Finance)
          if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
          // MMM DD, YYYY or MMM DD YYYY (investing.com)
          const d = new Date(s);
          if (!isNaN(d)) return d.toISOString().slice(0, 10);
          return null;
        }

        // Yahoo Finance: "Adj Close", investing.com: "Price"
        const priceKey = rows[0]?.["Adj Close"] !== undefined ? "Adj Close" : "Price";

        const prices = rows
          .filter(row => row[priceKey] && row[priceKey] !== "null")
          .map(row => ({
            date: parseDate(row["Date"]),
            price: parseFloat(String(row[priceKey]).replace(/,/g, "")),
          }))
          .filter(d => d.date && !isNaN(d.price) && d.price > 0)
          .sort((a, b) => a.date.localeCompare(b.date));
        setData(prices);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [ticker]);

  return { data, loading, error };
}
