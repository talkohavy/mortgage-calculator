import DatePicker from '../../components/DatePicker';
import Header from './content/Header';
import LoanDetails from './content/LoanDetails';
import ResultCard from './content/ResultCard';
import { useMortgageCalculatorPageLogic } from './logic/useMortgageCalculatorPageLogic';
import { formatUSD } from './logic/utils/formatUSD';
import type { DateValue } from '@ark-ui/react/date-picker';

export default function MortgageCalculatorPage() {
  const {
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
  } = useMortgageCalculatorPageLogic();

  return (
    <div className='size-full flex flex-col overflow-auto bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100'>
      <div className='max-w-5xl w-full mx-auto px-4 py-10 flex flex-col gap-8'>
        <Header importFileRef={importFileRef} handleImport={handleImport} handleExport={handleExport} />

        <LoanDetails
          housePrice={housePrice}
          baseCpi={baseCpi}
          currentCpi={currentCpi}
          cpiBaseYear={cpiBaseYear}
          setHousePrice={setHousePrice}
          setBaseCpi={setBaseCpi}
          setCurrentCpi={setCurrentCpi}
          setCpiBaseYear={setCpiBaseYear}
          setResult={setResult}
          setRows={setRows}
        />

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
          <div className='grid grid-cols-[1.2fr_1fr_1fr_auto] gap-3 px-1'>
            <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>Payment Date</span>
            <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>PMT Amount ($)</span>
            <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>CPI That Month</span>
            <span className='w-8' />
          </div>

          {/* Rows */}
          <div className='flex flex-col gap-2 max-h-105 overflow-y-auto pr-1'>
            {rows.map((row) => (
              <div key={row.id} className='grid grid-cols-[1.2fr_1fr_1fr_auto] gap-3 items-center group'>
                <DatePicker value={row.date} setValue={(date: DateValue[]) => updateRowDate(row.id, date)} />
                <input
                  type='number'
                  min={0}
                  value={row.pmt === 0 ? '' : row.pmt}
                  onChange={(e) => {
                    updateRow(row.id, 'pmt', e.target.value);
                    setResult(null);
                  }}
                  placeholder='e.g. 18500'
                  className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <div className='relative flex flex-col'>
                  <input
                    type='number'
                    min={0}
                    readOnly={row.cpiAutoFilled}
                    value={row.cpi === 0 ? '' : row.cpi}
                    onChange={(e) => {
                      updateRow(row.id, 'cpi', e.target.value);
                      setResult(null);
                    }}
                    placeholder={row.date.length > 0 ? 'No data — enter manually' : 'e.g. 101.2'}
                    title={row.cpiAutoFilled ? 'Auto-filled from CPI data file' : undefined}
                    className={`bg-slate-900 border rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      row.cpiAutoFilled
                        ? 'border-emerald-600/60 text-emerald-300 cursor-default'
                        : 'border-slate-600 text-slate-100'
                    }`}
                  />
                  {row.cpiAutoFilled && (
                    <span className='absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-emerald-500 pointer-events-none'>
                      auto
                    </span>
                  )}
                </div>
                <button
                  type='button'
                  onClick={() => {
                    removeRow(row.id);
                    setResult(null);
                  }}
                  disabled={rows.length === 1}
                  title='Remove row'
                  className='w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
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
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='M12 8v8M8 12h8' />
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
                label="Total Paid (Today's Value)"
                value={formatUSD(result.totalPaidToday)}
                color='border-emerald-700/60 text-emerald-300'
                subtitle={`Nominal paid: ${formatUSD(result.totalPaidNominal)}`}
              />

              <ResultCard
                label='Remaining to Pay'
                value={formatUSD(Math.max(0, result.remainingToday))}
                color={
                  result.remainingToday <= 0
                    ? 'border-emerald-600 text-emerald-300'
                    : 'border-amber-600/60 text-amber-300'
                }
                subtitle={
                  result.remainingToday <= 0
                    ? 'Fully paid off!'
                    : `Nominal remaining: ${formatUSD(Math.max(0, result.remainingNominal))}`
                }
              />
            </div>

            {result.inflationGain !== 0 && (
              <div className='bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-sm text-slate-400 flex flex-col gap-1'>
                <span className='font-medium text-slate-300'>Inflation Effect</span>
                <span>
                  Your payments lost{' '}
                  <span
                    className={
                      result.inflationGain > 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'
                    }
                  >
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
