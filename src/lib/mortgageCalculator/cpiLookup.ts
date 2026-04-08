import cpiData from '../../data/cpiData.json';

const cpiValues: Record<string, number> = cpiData.values;

/**
 * Returns the CPI value for a given year and month, or null if not in the data file.
 * @param year  Full year, e.g. 2000
 * @param month 1-indexed month (1 = January … 12 = December)
 */
export function lookupCpi(year: number, month: number): number | null {
  const key = `${year}-${String(month).padStart(2, '0')}`;

  return cpiValues[key] ?? null;
}
