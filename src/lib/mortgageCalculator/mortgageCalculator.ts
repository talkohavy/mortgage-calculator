import { applyBuyerShare } from './logic/utils/applyBuyerShare';
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

  /**
   * Track weighted-average cpiShare across all valid payments so the house price uses the
   * same effective CPI factor as the payments. This keeps the formula symmetric: when every
   * row has cpiShare=0, neither the house price nor the payments are inflation-adjusted, and
   * remaining = nominal remaining. When every row is 100, the formula degrades to pure CPI.
   */
  let totalWeight = 0;
  let weightedShareSum = 0;

  for (const payment of payments) {
    const { label, pmt, cpi, vat, cpiShare } = payment;

    const rawCpiFactor = currentCpi / cpi;
    const effectiveCpiFactor = applyBuyerShare(rawCpiFactor, cpiShare);
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
      remainingAfter: Number.POSITIVE_INFINITY,
    });
  }

  // Use weighted-average cpiShare (by payment amount) for the house price.
  // Falls back to 100 when there are no valid payments.
  const houseCpiShare = weightedShareSum / totalWeight;
  const effectiveHouseCpiFactor = applyBuyerShare(rawHouseCpiFactor, houseCpiShare);
  const housePriceToday = housePrice * effectiveHouseCpiFactor * houseVatFactor;

  // Second pass: attach running remaining balance now that housePriceToday is known.
  let cumulativePaidToday = 0;

  paymentBreakdown.forEach((row) => {
    cumulativePaidToday += row.todayValue;
    row.remainingAfter = housePriceToday - cumulativePaidToday;
  });

  const remainingToday = housePriceToday - totalPaidToday;
  const remainingNominal = housePrice - totalPaidNominal;
  const inflationGain = totalPaidTodayCpiOnly - totalPaidNominal;
  const vatGain = totalPaidTodayCpiOnly - totalPaidToday;

  return {
    housePriceToday,
    houseCpiFactor: effectiveHouseCpiFactor,
    houseVatFactor,
    totalPaidToday,
    remainingToday,
    inflationGain,
    vatGain,
    totalPaidNominal,
    remainingNominal,
    paymentBreakdown,
  };
}
