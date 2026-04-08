/**
 * VAT adjustment factor: removes the old VAT rate and applies the current one.
 * Returns 1 when either rate is 0 (VAT not being tracked).
 */
export function vatFactor(rateAtTime: number, rateToday: number): number {
  if (rateAtTime <= 0 || rateToday <= 0) return 1;

  return (1 + rateToday / 100) / (1 + rateAtTime / 100);
}
