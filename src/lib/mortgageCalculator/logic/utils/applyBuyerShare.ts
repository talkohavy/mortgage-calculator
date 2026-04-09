/**
 * Scales a raw CPI factor by the buyer's share of inflation.
 * effectiveFactor = 1 + (rawFactor − 1) × (share / 100)
 *
 * At share=100 the factor is unchanged. At share=50, only half the inflation delta applies.
 */
export function applyBuyerShare(rawFactor: number, share: number): number {
  return 1 + (rawFactor - 1) * (share / 100);
}
