import cpiData from '../../data/cpiData.json';

const cpiValues: Record<string, number> = cpiData.values as Record<string, number>;

/**
 * Returns the CPI value (base year 2006 = 100) for the given month, or null if not in the data.
 * @param year  Full year, e.g. 2024
 * @param month 1-indexed month (1 = January … 12 = December)
 */
export function lookupCpi(year: number, month: number): number | null {
  const key = `${year}-${String(month).padStart(2, '0')}`;

  return cpiValues[key] ?? null;
}
