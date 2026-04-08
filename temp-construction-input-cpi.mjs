#!/usr/bin/env node
/**
 * Temporary one-off: Israeli Construction Input Price Index 2024 — monthly % changes (OCR).
 * Source table title (Hebrew): מדד תשומות הבנייה 2024 טבלה לפי חודשים
 *
 * OCR (month → monthly change %):
 *   January    0.3%
 *   February  -0.2%
 *   March      0.2%
 *   April     -0.1%
 *   May        0.5%
 *   June       0.4%
 *   July       0.4%
 *   August     0.2%
 *   September  0.4%
 *   October    0.2%
 *   November   0.3%
 *   December   0.3%
 * Annual total stated in table: 2.9%
 *
 * Base index = 100 on 2024-01-01. Each month’s rate is applied in order:
 *   index_{m} = index_{m-1} * (1 + r_m/100)
 * Output lines are index after each month (end-of-month convention).
 */
export const MONTHLY_PCT_2024 = [
  { month: 'January', ratePct: 0.3 },
  { month: 'February', ratePct: -0.2 },
  { month: 'March', ratePct: 0.2 },
  { month: 'April', ratePct: -0.1 },
  { month: 'May', ratePct: 0.5 },
  { month: 'June', ratePct: 0.4 },
  { month: 'July', ratePct: 0.4 },
  { month: 'August', ratePct: 0.2 },
  { month: 'September', ratePct: 0.4 },
  { month: 'October', ratePct: 0.2 },
  { month: 'November', ratePct: 0.3 },
  { month: 'December', ratePct: 0.3 },
];

export const MONTHLY_PCT_2025 = [
  { month: 'January', ratePct: 2.6 },
  { month: 'February', ratePct: 0.4 },
  { month: 'March', ratePct: 0.4 },
  { month: 'April', ratePct: 0.1 },
  { month: 'May', ratePct: 0.1 },
  { month: 'June', ratePct: 0 },
  { month: 'July', ratePct: 0.1 },
  { month: 'August', ratePct: 0.4 },
  { month: 'September', ratePct: 0 },
  { month: 'October', ratePct: 0.1 },
  { month: 'November', ratePct: 0.6 },
  { month: 'December', ratePct: 0.1 },
];

export const MONTHLY_PCT_2026 = [
  { month: 'January', ratePct: 0.1 },
  { month: 'February', ratePct: 0.2 },
  // { month: 'March', ratePct: 0.4 },
  // { month: 'April', ratePct: 0.1 },
  // { month: 'May', ratePct: 0.1 },
  // { month: 'June', ratePct: 0 },
  // { month: 'July', ratePct: 0.1 },
  // { month: 'August', ratePct: 0.4 },
  // { month: 'September', ratePct: 0 },
  // { month: 'October', ratePct: 0.1 },
  // { month: 'November', ratePct: 0.6 },
  // { month: 'December', ratePct: 0.1 },
];

const MONTHLY_PCT = MONTHLY_PCT_2026; // <--- change this to one of: MONTHLY_PCT_2024, MONTHLY_PCT_2025, MONTHLY_PCT_2026
const yearLabel = 2026; // <--- change this to match the suffix of ^
const BASE_DATE = `Dec ${yearLabel - 1}`;
const BASE_INDEX = 108.06524954346453; // <--- change this to match the base index of Dec of previous year (yearLabel - 1)

function buildSeries() {
  let index = BASE_INDEX;

  const rows = [{ label: BASE_DATE, index, note: 'base' }];

  for (const { month, ratePct } of MONTHLY_PCT) {
    index *= 1 + ratePct / 100;
    rows.push({ label: `${month} ${yearLabel}`, index, ratePct });
  }

  const compoundedAnnualPct = MONTHLY_PCT.reduce((acc, { ratePct }) => acc * (1 + ratePct / 100), 1) - 1;

  return { rows, finalIndex: index, compoundedAnnualPct };
}

const { rows, finalIndex, compoundedAnnualPct } = buildSeries();

console.log('Construction Input Price Index (CPI-style) from OCR monthly changes\n');
console.log(`Base: ${BASE_INDEX} on ${BASE_DATE}\n`);

for (const r of rows) {
  if (r.note === 'base') {
    console.log(`${r.label.padEnd(22)} ${r.index.toFixed(6)}  (base)`);
  } else {
    console.log(`${r.label.padEnd(22)} ${r.index.toFixed(6)}  (after ${r.ratePct}% month)`);
  }
}

console.log('');
console.log(`End of ${yearLabel} index:     ${finalIndex.toFixed(6)}`);
console.log(`Implied YoY vs base:     ${((finalIndex / BASE_INDEX - 1) * 100).toFixed(4)}%`);
console.log(`Compounded from months: ${(compoundedAnnualPct * 100).toFixed(4)}% (table annual: 2.9%)`);
console.log('');
console.log(
  JSON.stringify(
    rows.map(({ index }) => index),
    null,
    2,
  ),
);
