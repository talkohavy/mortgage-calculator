import type { DateValue } from '@ark-ui/react';

export type FormRow = {
  id: number;
  date: DateValue[];
  pmt: number;
  cpi: number;
  cpiAutoFilled: boolean;
  /**
   * VAT rate (%) at the time of this payment, e.g. 17. Defaults to vatAtPurchase.
   */
  vat: number;
};
