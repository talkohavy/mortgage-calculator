export type PaymentRow = {
  label: string;
  pmt: number;
  cpi: number;
  /** VAT rate (%) at the time this payment was made, e.g. 17. 0 = not tracking VAT. */
  vat: number;
  /** Percentage of the CPI inflation the buyer bears for this payment (0–100). Default: 100. */
  cpiShare: number;
};

export type PaymentBreakdownRow = {
  label: string;
  nominal: number;
  cpiFactor: number;
  vatFactor: number;
  todayValue: number;
  remainingAfter: number;
};

export type MortgageResult = {
  housePriceToday: number;
  houseCpiFactor: number;
  houseVatFactor: number;
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
  payments: SerializedPayment[];
};

export type SerializedPayment = {
  date: string | null;
  pmt: number;
  cpi: number;
  cpiAutoFilled: boolean;
  vat: number;
  /** Percentage of the CPI inflation the buyer bears for this payment (0–100). Default: 100. */
  cpiShare: number;
};
