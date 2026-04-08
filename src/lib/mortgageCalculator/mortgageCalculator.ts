export type PaymentRow = {
  label: string;
  pmt: number;
  cpi: number;
};

export type MortgageInput = {
  housePrice: number;
  baseCpi: number;
  currentCpi: number;
  payments: PaymentRow[];
};

export type MortgageResult = {
  housePriceToday: number;
  totalPaidToday: number;
  remainingToday: number;
  inflationGain: number;
  totalPaidNominal: number;
  remainingNominal: number;
};

/**
 * Adjusts a past nominal amount to today's real value using CPI.
 * realValue = nominalValue * (currentCpi / cpiAtTime)
 */
function toTodayValue(nominal: number, cpiAtTime: number, currentCpi: number): number {
  if (cpiAtTime <= 0) return 0;
  return nominal * (currentCpi / cpiAtTime);
}

/**
 * Calculates the inflation-adjusted remaining mortgage balance.
 *
 * Logic:
 *   - Convert the original house price to today's money using CPI.
 *   - Convert each past payment to today's money using the CPI at the time of that payment.
 *   - Remaining = house price today − sum of all past payments in today's money.
 *   - Inflation gain = what was actually paid in nominal − what those payments are worth today.
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const { housePrice, baseCpi, currentCpi, payments } = input;

  const housePriceToday = toTodayValue(housePrice, baseCpi, currentCpi);

  let totalPaidToday = 0;
  let totalPaidNominal = 0;

  for (const payment of payments) {
    if (payment.pmt > 0 && payment.cpi > 0) {
      totalPaidNominal += payment.pmt;
      totalPaidToday += toTodayValue(payment.pmt, payment.cpi, currentCpi);
    }
  }

  const remainingToday = housePriceToday - totalPaidToday;
  const remainingNominal = housePrice - totalPaidNominal;
  const inflationGain = totalPaidNominal - totalPaidToday;

  return {
    housePriceToday,
    totalPaidToday,
    remainingToday,
    inflationGain,
    totalPaidNominal,
    remainingNominal,
  };
}
