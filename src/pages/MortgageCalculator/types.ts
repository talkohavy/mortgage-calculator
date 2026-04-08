import type { DateValue } from '@ark-ui/react';

export type FormRow = {
  id: number;
  date: DateValue[];
  pmt: number;
  cpi: number;
  cpiAutoFilled: boolean;
};
