import { useCallback, useRef, useState } from 'react';
import {
  calculateMortgage,
  CPI_BASE_YEARS,
  downloadFormAsJson,
  lookupCpi,
  parseFormJson,
  serializeDate,
  type MortgageResult,
} from '../../../lib/mortgageCalculator';
import { DEFAULT_ROWS } from './constants';
import { isoToDateValue } from './utils/isoToDateValue';
import { nextId } from './utils/nextId';
import type { FormRow } from '../types';
import type { DateValue } from '@ark-ui/react';

export function useMortgageCalculatorPageLogic() {
  const [housePrice, setHousePrice] = useState<string>('5000000');
  const [baseCpi, setBaseCpi] = useState<string>('100');
  const [currentCpi, setCurrentCpi] = useState<string>('');
  const [cpiBaseYear, setCpiBaseYear] = useState<number>(CPI_BASE_YEARS.at(-1) ?? 2024);
  const [rows, setRows] = useState<FormRow[]>(DEFAULT_ROWS);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [error, setError] = useState<string>('');

  const tableEndRef = useRef<HTMLDivElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { id: nextId(), date: [], pmt: 0, cpi: 0, cpiAutoFilled: false }]);
    setTimeout(() => tableEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }, []);

  const removeRow = useCallback((id: number) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }, []);

  const updateRowDate = useCallback(
    (id: number, date: DateValue[]) => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const d = date[0];
          const found = d ? lookupCpi(d.year, d.month, cpiBaseYear) : null;
          return {
            ...r,
            date,
            cpi: found !== null ? found : r.cpiAutoFilled ? 0 : r.cpi,
            cpiAutoFilled: found !== null,
          };
        }),
      );
      setResult(null);
    },
    [cpiBaseYear],
  );

  const updateRow = useCallback((id: number, field: 'pmt' | 'cpi', raw: string) => {
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
      setError('Please enter a valid base CPI.');
      return;
    }
    if (!current || current <= 0) {
      setError('Please enter a valid current CPI.');
      return;
    }

    const payments = rows.map(({ date, pmt, cpi }) => ({
      label: date[0] ? `${date[0].month}/${date[0].year}` : '',
      pmt,
      cpi,
    }));

    const res = calculateMortgage({ housePrice: price, baseCpi: base, currentCpi: current, payments });
    setResult(res);
  }, [housePrice, baseCpi, currentCpi, rows]);

  const handleReset = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const handleExport = useCallback(() => {
    downloadFormAsJson({
      version: 1,
      housePrice,
      baseCpi,
      currentCpi,
      payments: rows.map(({ date, pmt, cpi, cpiAutoFilled }) => ({
        date: serializeDate(date),
        pmt,
        cpi,
        cpiAutoFilled,
      })),
    });
  }, [housePrice, baseCpi, currentCpi, rows]);

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
        setCurrentCpi(state.currentCpi);
        setRows(
          state.payments.map((p) => ({
            id: nextId(),
            date: isoToDateValue(p.date),
            pmt: p.pmt,
            cpi: p.cpi,
            cpiAutoFilled: p.cpiAutoFilled,
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
    baseCpi,
    currentCpi,
    setBaseCpi,
    setResult,
    setHousePrice,
    setCurrentCpi,
    setCpiBaseYear,
    setRows,
    cpiBaseYear,
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
