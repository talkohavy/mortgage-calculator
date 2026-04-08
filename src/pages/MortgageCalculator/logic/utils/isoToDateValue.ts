import { parseDate, type DateValue } from '@ark-ui/react/date-picker';

export function isoToDateValue(iso: string | null): DateValue[] {
  if (!iso) return [];

  return [parseDate(new Date(iso))];
}
