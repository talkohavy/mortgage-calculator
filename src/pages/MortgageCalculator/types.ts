import type { DateValue } from '@ark-ui/react';

export type FormRow = {
  id: number;
  date: DateValue[];
  pmt: number;
  cpi: number;
  cpiAutoFilled: boolean;
  /** VAT rate (%) at the time of this payment, e.g. 17. Defaults to vatAtPurchase. */
  vat: number;
  /** Percentage of the CPI inflation the buyer bears for this payment (0–100). Default: 100. */
  cpiShare: number;
};
