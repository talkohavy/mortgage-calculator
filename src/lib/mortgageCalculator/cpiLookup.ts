import cpiData from '../../data/cpiData.json';

type CpiEntry = Record<string, number>;
const cpiValues: Record<string, CpiEntry> = cpiData.values as Record<string, CpiEntry>;

export const CPI_BASE_YEARS = cpiData.baseYears as number[];

/**
 * Returns the CPI value for a given year, month, and base year.
 * Returns null if the month is not in the data file or the base year has no value for that month.
 *
 * @param year     Full year, e.g. 2024
 * @param month    1-indexed month (1 = January … 12 = December)
 * @param baseYear One of the available base years (2006, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024)
 */
export function lookupCpi(year: number, month: number, baseYear: number): number | null {
  const key = `${year}-${String(month).padStart(2, '0')}`;
  const entry = cpiValues[key];

  if (!entry) return null;

  return entry[`base${baseYear}`] ?? null;
}
