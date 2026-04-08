import { toTodayValue } from './logic/utils/toTodayValue';
import type { MortgageResult, PaymentRow } from './types';

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
 *
 * When VAT rates are equal (or both 0), the formula degrades to the pure CPI-only calculation.
 */
export function calculateMortgage(props: CalculateMortgageProps): MortgageResult {
  const { housePrice, baseCpi, currentCpi, vatAtPurchase, vatToday, payments } = props;

  const housePriceToday = toTodayValue(housePrice, baseCpi, currentCpi, vatAtPurchase, vatToday);

  let totalPaidToday = 0;
  let totalPaidNominal = 0;
  let totalPaidTodayCpiOnly = 0;

  for (const payment of payments) {
    if (payment.pmt > 0 && payment.cpi > 0) {
      totalPaidNominal += payment.pmt;
      totalPaidToday += toTodayValue(payment.pmt, payment.cpi, currentCpi, payment.vat, vatToday);
      // CPI-only (no VAT adjustment) for comparison
      totalPaidTodayCpiOnly += payment.pmt * (currentCpi / payment.cpi);
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
  };
}
