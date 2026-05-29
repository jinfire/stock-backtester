export function runStrategy(prices, sellDrop, sellTimes, buyRise, buyTimes, taxRate) {
  if (prices.length < 2) return { strat: [], hold: [], trades: 0 };

  const sd = sellDrop / 100;
  const br = buyRise / 100;
  const tax = taxRate / 100;
  const INIT = 100.0;
  const sellUnit = INIT / sellTimes;

  let shares = INIT;
  let cash = 0.0;
  let peak = prices[0];
  let trough = prices[0];
  let inDip = false;
  let avgCost = prices[0];
  let trades = 0;

  const init = INIT * prices[0];
  const strat = [];
  const hold = [];

  for (let i = 0; i < prices.length; i++) {
    const p = prices[i];

    if (p > peak) {
      peak = p;
      if (!inDip) trough = p;
    }

    if (i < prices.length - 1) {
      const next = prices[i + 1];

      if (p <= peak * (1 - sd) && shares >= sellUnit * 0.5) {
        const s = Math.min(sellUnit, shares);
        const proceeds = s * next;
        const gain = proceeds - s * avgCost;
        const taxPaid = gain > 0 ? gain * tax : 0;
        shares -= s;
        cash += proceeds - taxPaid;
        peak = next;
        trough = next;
        inDip = true;
        trades++;
      }

      if (inDip && p >= trough * (1 + br) && cash > 0.01) {
        const buyAmt = Math.min(cash / buyTimes, cash);
        const newSh = buyAmt / next;
        const totalCost = shares * avgCost + buyAmt;
        shares += newSh;
        avgCost = totalCost / shares;
        cash -= buyAmt;
        trough = next;
        trades++;
      }
    }

    strat.push(parseFloat(((shares * p + cash) / init * 100).toFixed(2)));
    hold.push(parseFloat((p / prices[0] * 100).toFixed(2)));
  }

  return { strat, hold, trades };
}

export function runStrategyFast(prices, sellDrop, sellTimes, buyRise, buyTimes, taxRate) {
  if (prices.length < 2) return { stratFinal: 100, holdFinal: 100 };

  const sd = sellDrop / 100;
  const br = buyRise / 100;
  const tax = taxRate / 100;
  const INIT = 100.0;
  const sellUnit = INIT / sellTimes;

  let shares = INIT;
  let cash = 0.0;
  let peak = prices[0];
  let trough = prices[0];
  let inDip = false;
  let avgCost = prices[0];

  const init = INIT * prices[0];

  for (let i = 0; i < prices.length - 1; i++) {
    const p = prices[i];
    const next = prices[i + 1];

    if (p > peak) {
      peak = p;
      if (!inDip) trough = p;
    }

    if (p <= peak * (1 - sd) && shares >= sellUnit * 0.5) {
      const s = Math.min(sellUnit, shares);
      const proceeds = s * next;
      const gain = proceeds - s * avgCost;
      const taxPaid = gain > 0 ? gain * tax : 0;
      shares -= s;
      cash += proceeds - taxPaid;
      peak = next;
      trough = next;
      inDip = true;
    }

    if (inDip && p >= trough * (1 + br) && cash > 0.01) {
      const buyAmt = Math.min(cash / buyTimes, cash);
      const newSh = buyAmt / next;
      const totalCost = shares * avgCost + buyAmt;
      shares += newSh;
      avgCost = totalCost / shares;
      cash -= buyAmt;
      trough = next;
    }
  }

  const lastP = prices[prices.length - 1];
  const stratFinal = parseFloat(((shares * lastP + cash) / init * 100).toFixed(2));
  const holdFinal = parseFloat((lastP / prices[0] * 100).toFixed(2));

  return { stratFinal, holdFinal };
}
