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
  /**
   * Percentage of the CPI inflation the buyer is responsible for (0–100).
   * e.g. 50 means the state covers half the inflation.
   * Defaults to 100 (buyer bears full inflation).
   */
  cpiShare?: number;
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
 * Supports an optional cpiShare discount where the state covers part of the CPI adjustment.
 */
export function calculateMortgage(props: CalculateMortgageProps): MortgageResult {
  const { housePrice, baseCpi, currentCpi, vatAtPurchase, vatToday, payments, cpiShare = 100 } = props;

  const houseVatFactor = calcVatFactor(vatAtPurchase, vatToday);
  const rawHouseCpiFactor = baseCpi > 0 ? currentCpi / baseCpi : 1;
  const effectiveHouseCpiFactor = applyShare(rawHouseCpiFactor, cpiShare);
  const housePriceToday = housePrice * effectiveHouseCpiFactor * houseVatFactor;

  let totalPaidToday = 0;
  let totalPaidNominal = 0;
  let totalPaidTodayCpiOnly = 0;
  const paymentBreakdown: PaymentBreakdownRow[] = [];

  for (const payment of payments) {
    if (payment.pmt > 0 && payment.cpi > 0) {
      const rawCpiFactor = currentCpi / payment.cpi;
      const effectiveCpiFactor = applyShare(rawCpiFactor, cpiShare);
      const vf = calcVatFactor(payment.vat, vatToday);
      const todayValue = payment.pmt * effectiveCpiFactor * vf;

      totalPaidNominal += payment.pmt;
      totalPaidToday += todayValue;
      totalPaidTodayCpiOnly += payment.pmt * effectiveCpiFactor; // for inflation gain (no VAT)

      paymentBreakdown.push({
        label: payment.label,
        nominal: payment.pmt,
        cpiFactor: effectiveCpiFactor,
        vatFactor: vf,
        todayValue,
      });
    }
  }

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
