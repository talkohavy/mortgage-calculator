import { calculateMortgage } from './mortgageCalculator';
import type { CalculateMortgageProps } from './mortgageCalculator';
import type { MortgageResult, PaymentBreakdownRow } from './types';

/**
 * Calculates the mortgage balance expressed in purchase-date money.
 *
 * Derived from the "Today's Money" result by dividing all values by the house
 * price scale factor (CPI × VAT).  This guarantees both perspectives agree on
 * when the mortgage reaches zero — they are the same equation expressed in
 * different units.
 */
export function calculateMortgageAtPurchase(props: CalculateMortgageProps): MortgageResult {
  const todayResult = calculateMortgage(props);
  const { houseCpiFactor, houseVatFactor } = todayResult;

  let totalPaidAtPurchase = 0;
  let totalPaidNominal = 0;
  let totalPaidAtPurchaseCpiOnly = 0;

  const paymentBreakdown: PaymentBreakdownRow[] = todayResult.paymentBreakdown.map((row) => {
    const cpiFactor = row.cpiFactor / houseCpiFactor;
    const vatFactor = row.vatFactor / houseVatFactor;
    const atPurchaseValue = row.nominal * cpiFactor * vatFactor;

    totalPaidNominal += row.nominal;
    totalPaidAtPurchase += atPurchaseValue;
    totalPaidAtPurchaseCpiOnly += row.nominal * cpiFactor;

    return {
      label: row.label,
      nominal: row.nominal,
      cpiFactor,
      vatFactor,
      todayValue: atPurchaseValue,
      remainingAfter: 0,
    };
  });

  const housePriceAtPurchase = props.housePrice;

  let cumulative = 0;
  for (const row of paymentBreakdown) {
    cumulative += row.todayValue;
    row.remainingAfter = housePriceAtPurchase - cumulative;
  }

  const remainingAtPurchase = housePriceAtPurchase - totalPaidAtPurchase;
  const remainingNominal = props.housePrice - totalPaidNominal;

  // In this perspective, payments made after prices rose are deflated below nominal — a gain.
  const inflationGain = totalPaidNominal - totalPaidAtPurchaseCpiOnly;
  const vatGain = totalPaidAtPurchaseCpiOnly - totalPaidAtPurchase;

  return {
    housePriceToday: housePriceAtPurchase,
    houseCpiFactor: 1,
    houseVatFactor: 1,
    totalPaidToday: totalPaidAtPurchase,
    remainingToday: remainingAtPurchase,
    inflationGain,
    vatGain,
    totalPaidNominal,
    remainingNominal,
    paymentBreakdown,
  };
}
