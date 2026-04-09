import { validateParameters } from './logic/utils/validateParameters';
import { vatFactor as calcVatFactor } from './logic/utils/vatFactor';
import type { MortgageResult, PaymentBreakdownRow, PaymentRow } from './types';

export type CalculateMortgageProps = {
  housePrice: number;
  baseCpi: number;
  currentCpi: number;
  /** VAT rate (%) at time of purchase, e.g. 17. 0 = not tracking VAT. */
  vatAtPurchase: number;
  /** Current VAT rate (%), e.g. 18. 0 = not tracking VAT. */
  vatToday: number;
  payments: PaymentRow[];
};

/**
 * Scales a raw CPI factor by the buyer's share of inflation.
 * effectiveFactor = 1 + (rawFactor − 1) × (share / 100)
 *
 * At share=100 the factor is unchanged. At share=50, only half the inflation delta applies.
 */
function applyShare(rawFactor: number, share: number): number {
  return 1 + (rawFactor - 1) * (share / 100);
}

/**
 * Calculates the inflation- and VAT-adjusted remaining mortgage balance.
 * Each payment can have its own cpiShare to model per-period state subsidies.
 */
export function calculateMortgage(props: CalculateMortgageProps): MortgageResult {
  const { housePrice, baseCpi, currentCpi, vatAtPurchase, vatToday, payments } = props;

  validateParameters({ baseCpi, payments });

  const houseVatFactor = calcVatFactor(vatAtPurchase, vatToday);
  const rawHouseCpiFactor = currentCpi / baseCpi;

  let totalPaidToday = 0;
  let totalPaidNominal = 0;
  let totalPaidTodayCpiOnly = 0;
  const paymentBreakdown: PaymentBreakdownRow[] = [];

  // Track weighted-average cpiShare across all valid payments so the house price uses the
  // same effective CPI factor as the payments. This keeps the formula symmetric: when every
  // row has cpiShare=0, neither the house price nor the payments are inflation-adjusted, and
  // remaining = nominal remaining. When every row is 100, the formula degrades to pure CPI.
  let totalWeight = 0;
  let weightedShareSum = 0;

  for (const payment of payments) {
    const { label, pmt, cpi, vat, cpiShare } = payment;

    const rawCpiFactor = currentCpi / cpi;
    const effectiveCpiFactor = applyShare(rawCpiFactor, cpiShare);
    const vatFactor = calcVatFactor(vat, vatToday);
    const todayValue = pmt * effectiveCpiFactor * vatFactor;

    totalPaidNominal += pmt;
    totalPaidToday += todayValue;
    totalPaidTodayCpiOnly += pmt * effectiveCpiFactor;

    weightedShareSum += cpiShare * pmt;
    totalWeight += pmt;

    paymentBreakdown.push({
      label,
      nominal: pmt,
      cpiFactor: effectiveCpiFactor,
      vatFactor,
      todayValue,
    });
  }

  // Use weighted-average cpiShare (by payment amount) for the house price.
  // Falls back to 100 when there are no valid payments.
  const houseCpiShare = totalWeight > 0 ? weightedShareSum / totalWeight : 100;
  const effectiveHouseCpiFactor = applyShare(rawHouseCpiFactor, houseCpiShare);
  const housePriceToday = housePrice * effectiveHouseCpiFactor * houseVatFactor;

  const remainingToday = housePriceToday - totalPaidToday;
  const remainingNominal = housePrice - totalPaidNominal;
  const inflationGain = totalPaidNominal - totalPaidTodayCpiOnly;
  const vatGain = totalPaidTodayCpiOnly - totalPaidToday;

  return {
    housePriceToday,
    totalPaidToday,
    remainingToday,
    inflationGain,
    vatGain,
    totalPaidNominal,
    remainingNominal,
    paymentBreakdown,
  };
}
