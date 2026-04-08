import { useCallback, useRef, useState } from 'react';
import {
  calculateMortgage,
  downloadFormAsJson,
  lookupCpi,
  parseFormJson,
  serializeDate,
  type MortgageResult,
} from '@src/lib/mortgageCalculator';
import { DEFAULT_ROWS } from './constants';
import { isoToDateValue } from './utils/isoToDateValue';
import { nextId } from './utils/nextId';
import type { FormRow } from '../types';
import type { DateValue } from '@ark-ui/react';

export function useMortgageCalculatorPageLogic() {
  const [housePrice, setHousePrice] = useState<string>('5000000');
  const [purchaseDate, setPurchaseDateState] = useState<DateValue[]>([]);
  const [baseCpi, setBaseCpi] = useState<string>('');
  const [baseCpiAutoFilled, setBaseCpiAutoFilled] = useState<boolean>(false);
  const [currentCpi, setCurrentCpi] = useState<string>('');
  const [vatAtPurchase, setVatAtPurchase] = useState<string>('');
  const [vatToday, setVatToday] = useState<string>('');
  const [rows, setRows] = useState<FormRow[]>(DEFAULT_ROWS);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [error, setError] = useState<string>('');

  const tableEndRef = useRef<HTMLDivElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handlePurchaseDateChange = useCallback(
    (date: DateValue[]) => {
      setPurchaseDateState(date);

      const previousDate = date[0];
      const foundCpi = previousDate ? lookupCpi(previousDate.year, previousDate.month) : null;

      if (foundCpi) {
        setBaseCpi(String(foundCpi));
        setBaseCpiAutoFilled(true);
        return;
      }

      if (baseCpiAutoFilled) setBaseCpi(''); // <--- if the CPI was auto-filled, clear the input. Need to think about this.

      setBaseCpiAutoFilled(false);
    },
    [baseCpiAutoFilled],
  );

  const addRow = useCallback(() => {
    const vatDefault = Number.parseFloat(vatAtPurchase) || 0;
    setRows((prev) => [...prev, { id: nextId(), date: [], pmt: 0, cpi: 0, cpiAutoFilled: false, vat: vatDefault }]);
    setTimeout(() => tableEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }, [vatAtPurchase]);

  const removeRow = useCallback((id: number) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }, []);

  const updateRowDate = useCallback((id: number, date: DateValue[]) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const previousDate = date[0];
        const foundCpi = previousDate ? lookupCpi(previousDate.year, previousDate.month) : null;

        return {
          ...row,
          date,
          cpi: foundCpi ? foundCpi : row.cpiAutoFilled ? 0 : row.cpi,
          cpiAutoFilled: Boolean(foundCpi),
        };
      }),
    );
  }, []);

  const updateRow = useCallback((id: number, field: 'pmt' | 'cpi' | 'vat', raw: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const num = Number.parseFloat(raw);
        const updated: FormRow = { ...r, [field]: Number.isNaN(num) ? 0 : num };
        if (field === 'cpi') updated.cpiAutoFilled = false;
        return updated;
      }),
    );
  }, []);

  const handleCalculate = useCallback(() => {
    setError('');
    const price = Number.parseFloat(housePrice);
    const base = Number.parseFloat(baseCpi);
    const current = Number.parseFloat(currentCpi);

    if (!price || price <= 0) {
      setError('Please enter a valid house price.');
      return;
    }
    if (!base || base <= 0) {
      setError('Please enter a valid base CPI (pick a purchase date or enter it manually).');
      return;
    }
    if (!current || current <= 0) {
      setError('Please enter a valid current CPI.');
      return;
    }

    const vatPurchaseNum = Number.parseFloat(vatAtPurchase) || 0;
    const vatTodayNum = Number.parseFloat(vatToday) || 0;

    const payments = rows.map(({ date, pmt, cpi, vat }) => ({
      label: date[0] ? `${date[0].month}/${date[0].year}` : '',
      pmt,
      cpi,
      vat,
    }));

    const res = calculateMortgage({
      housePrice: price,
      baseCpi: base,
      currentCpi: current,
      vatAtPurchase: vatPurchaseNum,
      vatToday: vatTodayNum,
      payments,
    });

    setResult(res);
  }, [housePrice, baseCpi, currentCpi, vatAtPurchase, vatToday, rows]);

  const handleReset = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const handleExport = useCallback(() => {
    downloadFormAsJson({
      version: 1,
      housePrice,
      purchaseDateIso: serializeDate(purchaseDate),
      baseCpi,
      currentCpi,
      vatAtPurchase,
      vatToday,
      payments: rows.map(({ date, pmt, cpi, cpiAutoFilled, vat }) => ({
        date: serializeDate(date),
        pmt,
        cpi,
        cpiAutoFilled,
        vat,
      })),
    });
  }, [housePrice, purchaseDate, baseCpi, currentCpi, vatAtPurchase, vatToday, rows]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        const state = parseFormJson(raw);
        setHousePrice(state.housePrice);
        setBaseCpi(state.baseCpi);
        setBaseCpiAutoFilled(Boolean(state.baseCpiAutoFilled));
        setPurchaseDateState(isoToDateValue(state.purchaseDateIso ?? null));
        setCurrentCpi(state.currentCpi);
        setVatAtPurchase(state.vatAtPurchase ?? '');
        setVatToday(state.vatToday ?? '');
        setRows(
          state.payments.map((p) => ({
            id: nextId(),
            date: isoToDateValue(p.date),
            pmt: p.pmt,
            cpi: p.cpi,
            cpiAutoFilled: p.cpiAutoFilled,
            vat: p.vat ?? 0,
          })),
        );
        setResult(null);
        setError('');
      } catch (err) {
        setError(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        if (importFileRef.current) importFileRef.current.value = '';
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    importFileRef,
    handleImport,
    handleExport,
    housePrice,
    purchaseDate,
    baseCpi,
    baseCpiAutoFilled,
    currentCpi,
    vatAtPurchase,
    vatToday,
    setBaseCpi,
    setBaseCpiAutoFilled,
    setHousePrice,
    setCurrentCpi,
    setVatAtPurchase,
    setVatToday,
    handlePurchaseDateChange,
    rows,
    updateRow,
    updateRowDate,
    removeRow,
    addRow,
    tableEndRef,
    handleReset,
    result,
    handleCalculate,
    error,
  };
}
