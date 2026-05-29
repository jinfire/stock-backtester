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
        const prices = rows
          .filter(row => row["Adj Close"] && row["Adj Close"] !== "null")
          .map(row => ({
            date: row["Date"]?.trim(),
            price: parseFloat(row["Adj Close"]),
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
