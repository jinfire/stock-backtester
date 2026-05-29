export function calcCAGR(finalValue, years) {
  if (years <= 0) return "0.0";
  return ((Math.pow(finalValue / 100, 1 / years) - 1) * 100).toFixed(1);
}

export function calcMaxDD(arr) {
  let peak = arr[0], dd = 0;
  for (const v of arr) {
    if (v > peak) peak = v;
    dd = Math.max(dd, (peak - v) / peak);
  }
  return (dd * 100).toFixed(1);
}
