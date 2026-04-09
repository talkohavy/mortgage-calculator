import { isPercentage } from './isPercentage';
import { isPositiveNumber } from './isPositiveNumber';
import type { PaymentRow } from '../../types';

type ValidateParametersProps = {
  baseCpi: number;
  payments: PaymentRow[];
};

export function validateParameters(props: ValidateParametersProps) {
  const { baseCpi, payments } = props;

  if (!baseCpi || baseCpi <= 0) {
    throw new Error('baseCpi must be a positive number (CPI index at purchase).');
  }

  payments.forEach((payment) => {
    const { cpi, pmt, vat, cpiShare } = payment;

    if (!isPositiveNumber(cpi)) {
      throw new Error('cpi must be a positive number (CPI index at payment).');
    }

    if (!isPositiveNumber(pmt)) {
      throw new Error('pmt must be a positive number (payment amount).');
    }

    if (!isPercentage(vat)) {
      throw new Error('vat must be a positive number (VAT rate).');
    }

    if (!isPercentage(cpiShare)) {
      throw new Error('cpiShare must be a positive number (CPI share).');
    }
  });
}
