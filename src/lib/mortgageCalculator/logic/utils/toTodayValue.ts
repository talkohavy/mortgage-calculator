import { vatFactor } from './vatFactor';

/**
 * Converts a nominal past amount to today's real value, adjusting for both CPI and VAT changes.
 *
 * Formula:
 *   realValue = nominal × vatFactor(vatAtTime, vatToday) × (currentCpi / cpiAtTime)
 */
export function toTodayValue(
  nominal: number,
  cpiAtTime: number,
  currentCpi: number,
  vatAtTime: number,
  vatToday: number,
): number {
  if (cpiAtTime <= 0) return 0;

  return nominal * vatFactor(vatAtTime, vatToday) * (currentCpi / cpiAtTime);
}
