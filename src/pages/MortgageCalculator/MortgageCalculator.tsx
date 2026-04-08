import { useCallback, useId, useRef, useState } from 'react';
import { calculateMortgage } from '../../lib/mortgageCalculator';
import type { MortgageResult, PaymentRow } from '../../lib/mortgageCalculator';

type FormRow = PaymentRow & { id: number };

const DEFAULT_ROWS: FormRow[] = [
  { id: 1, label: 'Feb 2000', pmt: 0, cpi: 0 },
  { id: 2, label: 'Mar 2000', pmt: 0, cpi: 0 },
  { id: 3, label: 'Apr 2000', pmt: 0, cpi: 0 },
];

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function ResultCard({
  label,
  value,
  color,
  subtitle,
}: {
  label: string;
  value: string;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className={`rounded-xl border ${color} p-5 flex flex-col gap-1`}>
      <span className='text-xs font-semibold uppercase tracking-wider opacity-60'>{label}</span>
      <span className='text-2xl font-bold'>{value}</span>
      {subtitle && <span className='text-xs opacity-50 mt-1'>{subtitle}</span>}
    </div>
  );
}

let rowCounter = 4;
function nextId() {
  return rowCounter++;
}

export default function MortgageCalculatorPage() {
  const housePriceId = useId();
  const baseCpiId = useId();
  const currentCpiId = useId();

  const [housePrice, setHousePrice] = useState<string>('5000000');
  const [baseCpi, setBaseCpi] = useState<string>('100');
  const [currentCpi, setCurrentCpi] = useState<string>('');
  const [rows, setRows] = useState<FormRow[]>(DEFAULT_ROWS);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [error, setError] = useState<string>('');

  const tableEndRef = useRef<HTMLDivElement>(null);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { id: nextId(), label: '', pmt: 0, cpi: 0 }]);
    setTimeout(() => tableEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }, []);

  const removeRow = useCallback((id: number) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }, []);

  const updateRow = useCallback((id: number, field: keyof Omit<FormRow, 'id'>, raw: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'label') return { ...r, label: raw };
        const num = Number.parseFloat(raw);
        return { ...r, [field]: Number.isNaN(num) ? 0 : num };
      }),
    );
  }, []);

  const handleCalculate = useCallback(() => {
    setError('');
    const price = Number.parseFloat(housePrice);
    const base = Number.parseFloat(baseCpi);
    const current = Number.parseFloat(currentCpi);

    if (!price || price <= 0) { setError('Please enter a valid house price.'); return; }
    if (!base || base <= 0) { setError('Please enter a valid base CPI.'); return; }
    if (!current || current <= 0) { setError('Please enter a valid current CPI.'); return; }

    const payments = rows.map(({ label, pmt, cpi }) => ({ label, pmt, cpi }));

    const res = calculateMortgage({ housePrice: price, baseCpi: base, currentCpi: current, payments });
    setResult(res);
  }, [housePrice, baseCpi, currentCpi, rows]);

  const handleReset = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  return (
    <div className='size-full flex flex-col overflow-auto bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100'>
      <div className='max-w-5xl w-full mx-auto px-4 py-10 flex flex-col gap-8'>

        {/* Header */}
        <div className='flex flex-col gap-1'>
          <h1 className='text-3xl font-bold tracking-tight'>Mortgage CPI Calculator</h1>
          <p className='text-slate-400 text-sm'>
            Calculate how much of your mortgage remains in today&apos;s real (inflation-adjusted) money.
          </p>
        </div>

        {/* Loan Details */}
        <section className='bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5'>
          <h2 className='text-lg font-semibold text-slate-200'>Loan Details</h2>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor={housePriceId} className='text-xs font-medium text-slate-400 uppercase tracking-wider'>
                Original House Price ($)
              </label>
              <input
                id={housePriceId}
                type='number'
                min={0}
                value={housePrice}
                onChange={(e) => { setHousePrice(e.target.value); setResult(null); }}
                placeholder='e.g. 5000000'
                className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor={baseCpiId} className='text-xs font-medium text-slate-400 uppercase tracking-wider'>
                CPI at Purchase Date
              </label>
              <input
                id={baseCpiId}
                type='number'
                min={0}
                value={baseCpi}
                onChange={(e) => { setBaseCpi(e.target.value); setResult(null); }}
                placeholder='e.g. 100'
                className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor={currentCpiId} className='text-xs font-medium text-slate-400 uppercase tracking-wider'>
                Current CPI (Today)
              </label>
              <input
                id={currentCpiId}
                type='number'
                min={0}
                value={currentCpi}
                onChange={(e) => { setCurrentCpi(e.target.value); setResult(null); }}
                placeholder='e.g. 310'
                className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </section>

        {/* Payment History */}
        <section className='bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-0.5'>
              <h2 className='text-lg font-semibold text-slate-200'>Monthly Payments</h2>
              <p className='text-xs text-slate-500'>First payment is typically the month after purchase.</p>
            </div>
            <span className='text-xs text-slate-500 bg-slate-700/50 rounded-full px-3 py-1'>
              {rows.length} row{rows.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table Header */}
          <div className='grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-1'>
            <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>Month / Label</span>
            <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>PMT Amount ($)</span>
            <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>CPI That Month</span>
            <span className='w-8' />
          </div>

          {/* Rows */}
          <div className='flex flex-col gap-2 max-h-105 overflow-y-auto pr-1'>
            {rows.map((row, index) => (
              <div key={row.id} className='grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center group'>
                <input
                  type='text'
                  value={row.label}
                  onChange={(e) => { updateRow(row.id, 'label', e.target.value); setResult(null); }}
                  placeholder={`Month ${index + 1}`}
                  className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='number'
                  min={0}
                  value={row.pmt === 0 ? '' : row.pmt}
                  onChange={(e) => { updateRow(row.id, 'pmt', e.target.value); setResult(null); }}
                  placeholder='e.g. 18500'
                  className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='number'
                  min={0}
                  value={row.cpi === 0 ? '' : row.cpi}
                  onChange={(e) => { updateRow(row.id, 'cpi', e.target.value); setResult(null); }}
                  placeholder='e.g. 101.2'
                  className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <button
                  type='button'
                  onClick={() => { removeRow(row.id); setResult(null); }}
                  disabled={rows.length === 1}
                  title='Remove row'
                  className='w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' />
                  </svg>
                </button>
              </div>
            ))}
            <div ref={tableEndRef} />
          </div>

          {/* Add Row */}
          <button
            type='button'
            onClick={addRow}
            className='self-start flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg px-3 py-2 transition-colors'
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <circle cx='12' cy='12' r='10' /><path d='M12 8v8M8 12h8' />
            </svg>
            Add Payment Row
          </button>
        </section>

        {/* Error */}
        {error && (
          <div className='bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm'>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={handleCalculate}
            className='flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/40'
          >
            Calculate
          </button>
          {result && (
            <button
              type='button'
              onClick={handleReset}
              className='px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition-colors'
            >
              Clear Results
            </button>
          )}
        </div>

        {/* Results */}
        {result && (
          <section className='flex flex-col gap-4'>
            <h2 className='text-lg font-semibold text-slate-200'>Results — in Today&apos;s Money</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <ResultCard
                label='House Price Today'
                value={formatUSD(result.housePriceToday)}
                color='border-slate-600 text-slate-100'
                subtitle={`Original: ${formatUSD(Number.parseFloat(housePrice))}`}
              />
              <ResultCard
                label='Total Paid (Today&apos;s Value)'
                value={formatUSD(result.totalPaidToday)}
                color='border-emerald-700/60 text-emerald-300'
                subtitle={`Nominal paid: ${formatUSD(result.totalPaidNominal)}`}
              />
              <ResultCard
                label='Remaining to Pay'
                value={formatUSD(Math.max(0, result.remainingToday))}
                color={result.remainingToday <= 0 ? 'border-emerald-600 text-emerald-300' : 'border-amber-600/60 text-amber-300'}
                subtitle={result.remainingToday <= 0 ? 'Fully paid off!' : `Nominal remaining: ${formatUSD(Math.max(0, result.remainingNominal))}`}
              />
            </div>

            {result.inflationGain !== 0 && (
              <div className='bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-sm text-slate-400 flex flex-col gap-1'>
                <span className='font-medium text-slate-300'>Inflation Effect</span>
                <span>
                  Your payments lost{' '}
                  <span className={result.inflationGain > 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {formatUSD(Math.abs(result.inflationGain))}
                  </span>{' '}
                  in real purchasing power compared to when they were made.
                  {result.inflationGain > 0
                    ? ' Inflation worked in your favour — each dollar you paid was worth more back then than it is today.'
                    : ' Deflation worked against you.'}
                </span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
