import type { DateValue } from '@ark-ui/react';

/**
 * Converts a DateValue array to an ISO date string "YYYY-MM-DD", or null if empty.
 */
export function serializeDate(date: DateValue[] | undefined): string | null {
  if (!date || date.length === 0) return null;

  const d = date[0];

  if (!d) return null;

  const month = String(d.month).padStart(2, '0');
  const day = String(d.day).padStart(2, '0');

  return `${d.year}-${month}-${day}`;
}
