import type { SerializedFormState, SerializedPayment } from '../../types';

export function parseFormJson(raw: unknown): SerializedFormState {
  if (typeof raw !== 'object' || raw === null) throw new Error('Invalid file: expected a JSON object.');

  const obj = raw as Record<string, unknown>;

  if (obj.version !== 1) throw new Error('Unsupported file version.');

  if (typeof obj.housePrice !== 'string') throw new Error('Missing or invalid "housePrice".');

  if (typeof obj.currentCpi !== 'string') throw new Error('Missing or invalid "currentCpi".');

  if (!Array.isArray(obj.payments)) throw new Error('Missing or invalid "payments" array.');

  const payments: SerializedPayment[] = (obj.payments as unknown[]).map((item, i) => {
    if (typeof item !== 'object' || item === null) throw new Error(`Payment[${i}] is not an object.`);

    const p = item as Record<string, unknown>;

    return {
      date: typeof p.date === 'string' ? p.date : null,
      pmt: typeof p.pmt === 'number' ? p.pmt : 0,
      cpi: typeof p.cpi === 'number' ? p.cpi : 0,
      cpiAutoFilled: Boolean(p.cpiAutoFilled),
      vat: typeof p.vat === 'number' ? p.vat : 0,
      cpiShare: typeof p.cpiShare === 'number' ? p.cpiShare : 100,
    };
  });

  return {
    version: 1,
    housePrice: obj.housePrice as string,
    purchaseDateIso: typeof obj.purchaseDateIso === 'string' ? obj.purchaseDateIso : null,
    baseCpi: typeof obj.baseCpi === 'string' ? obj.baseCpi : '',
    baseCpiAutoFilled: Boolean(obj.baseCpiAutoFilled),
    currentCpi: obj.currentCpi as string,
    vatAtPurchase: typeof obj.vatAtPurchase === 'string' ? obj.vatAtPurchase : '',
    vatToday: typeof obj.vatToday === 'string' ? obj.vatToday : '',
    payments,
  };
}
