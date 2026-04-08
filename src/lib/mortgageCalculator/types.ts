export type PaymentRow = {
  label: string;
  pmt: number;
  cpi: number;
  /** VAT rate (%) at the time this payment was made, e.g. 17. 0 = not tracking VAT. */
  vat: number;
};

export type PaymentBreakdownRow = {
  label: string;
  nominal: number;
  cpiFactor: number;
  vatFactor: number;
  todayValue: number;
};

export type MortgageResult = {
  housePriceToday: number;
  totalPaidToday: number;
  remainingToday: number;
  inflationGain: number;
  vatGain: number;
  totalPaidNominal: number;
  remainingNominal: number;
  paymentBreakdown: PaymentBreakdownRow[];
};

export type SerializedFormState = {
  version: 1;
  housePrice: string;
  purchaseDateIso: string | null;
  baseCpi: string;
  baseCpiAutoFilled?: boolean;
  currentCpi: string;
  vatAtPurchase: string;
  vatToday: string;
  /** Percentage of the CPI inflation the buyer bears (0–100). Default: 100 (no subsidy). */
  cpiShare: string;
  payments: SerializedPayment[];
};

export type SerializedPayment = {
  date: string | null;
  pmt: number;
  cpi: number;
  cpiAutoFilled: boolean;
  vat: number;
};
