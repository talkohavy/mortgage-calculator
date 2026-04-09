/**
 * This scripts takes in an array of change values,
 * and creates CPI from them based on some base value.
 */

export const MONTHLY_PCT = [
  { yearMonth: '2024 January', ratePct: 0.3 },
  { yearMonth: '2024 February', ratePct: -0.2 },
  { yearMonth: '2024 March', ratePct: 0.2 },
  { yearMonth: '2024 April', ratePct: -0.1 },
  { yearMonth: '2024 May', ratePct: 0.5 },
  { yearMonth: '2024 June', ratePct: 0.4 },
  { yearMonth: '2024 July', ratePct: 0.4 },
  { yearMonth: '2024 August', ratePct: 0.2 },
  { yearMonth: '2024 September', ratePct: 0.4 },
  { yearMonth: '2024 October', ratePct: 0.2 },
  { yearMonth: '2024 November', ratePct: 0.3 },
  { yearMonth: '2024 December', ratePct: 0.3 },
  { yearMonth: '2025 January', ratePct: 2.6 },
  { yearMonth: '2025 February', ratePct: 0.4 },
  { yearMonth: '2025 March', ratePct: 0.4 },
  { yearMonth: '2025 April', ratePct: 0.1 },
  { yearMonth: '2025 May', ratePct: 0.1 },
  { yearMonth: '2025 June', ratePct: 0 },
  { yearMonth: '2025 July', ratePct: 0.1 },
  { yearMonth: '2025 August', ratePct: 0.4 },
  { yearMonth: '2025 September', ratePct: 0 },
  { yearMonth: '2025 October', ratePct: 0.1 },
  { yearMonth: '2025 November', ratePct: 0.6 },
  { yearMonth: '2025 December', ratePct: 0.1 },
  { yearMonth: '2026 January', ratePct: 0.1 },
  { yearMonth: '2026 February', ratePct: 0.2 },
];

const BASE_DATE = 'Dec 2023';
const BASE_INDEX = 100;

function buildSeries() {
  let index = BASE_INDEX;

  const rows = [{ label: BASE_DATE, index }];

  for (const { yearMonth, ratePct } of MONTHLY_PCT) {
    index *= 1 + ratePct / 100;
    rows.push({ label: yearMonth, index });
  }

  return { rows, finalIndex: index };
}

const { rows, finalIndex } = buildSeries();

console.log(JSON.stringify(rows, null, 2));
console.log(finalIndex);
