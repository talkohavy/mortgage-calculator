import type { DateValue } from '@ark-ui/react/date-picker';

export type SerializedPayment = {
  date: string | null;
  pmt: number;
  cpi: number;
  cpiAutoFilled: boolean;
};

export type SerializedFormState = {
  version: 1;
  housePrice: string;
  baseCpi: string;
  currentCpi: string;
  payments: SerializedPayment[];
};

/** Converts a DateValue array to an ISO date string "YYYY-MM-DD", or null if empty. */
export function serializeDate(date: DateValue[] | undefined): string | null {
  if (!date || date.length === 0) return null;
  const d = date[0];
  if (!d) return null;
  const month = String(d.month).padStart(2, '0');
  const day = String(d.day).padStart(2, '0');
  return `${d.year}-${month}-${day}`;
}

export function downloadFormAsJson(state: SerializedFormState, filename = 'mortgage-data.json'): void {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseFormJson(raw: unknown): SerializedFormState {
  if (typeof raw !== 'object' || raw === null) throw new Error('Invalid file: expected a JSON object.');

  const obj = raw as Record<string, unknown>;

  if (obj['version'] !== 1) throw new Error('Unsupported file version.');
  if (typeof obj['housePrice'] !== 'string') throw new Error('Missing or invalid "housePrice".');
  if (typeof obj['baseCpi'] !== 'string') throw new Error('Missing or invalid "baseCpi".');
  if (typeof obj['currentCpi'] !== 'string') throw new Error('Missing or invalid "currentCpi".');
  if (!Array.isArray(obj['payments'])) throw new Error('Missing or invalid "payments" array.');

  const payments: SerializedPayment[] = (obj['payments'] as unknown[]).map((item, i) => {
    if (typeof item !== 'object' || item === null) throw new Error(`Payment[${i}] is not an object.`);
    const p = item as Record<string, unknown>;
    const date = typeof p['date'] === 'string' ? p['date'] : null;
    return {
      date,
      pmt: typeof p['pmt'] === 'number' ? p['pmt'] : 0,
      cpi: typeof p['cpi'] === 'number' ? p['cpi'] : 0,
      cpiAutoFilled: Boolean(p['cpiAutoFilled']),
    };
  });

  return {
    version: 1,
    housePrice: obj['housePrice'] as string,
    baseCpi: obj['baseCpi'] as string,
    currentCpi: obj['currentCpi'] as string,
    payments,
  };
}
