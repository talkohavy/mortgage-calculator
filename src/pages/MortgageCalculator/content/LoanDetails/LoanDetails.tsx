import DatePicker from '@src/components/DatePicker';
import { CPI_BASE_YEARS } from '@src/lib/mortgageCalculator';
import type { DateValue } from '@ark-ui/react';

type LoanDetailsProps = {
  housePrice: string;
  purchaseDate: DateValue[];
  baseCpi: string;
  baseCpiAutoFilled: boolean;
  currentCpi: string;
  cpiBaseYear: number;
  setHousePrice: (val: string) => void;
  setBaseCpi: (val: string) => void;
  setBaseCpiAutoFilled: (val: boolean) => void;
  setCurrentCpi: (val: string) => void;
  handlePurchaseDateChange: (date: DateValue[]) => void;
  handleCpiBaseYearChange: (year: number) => void;
  setResult: (val: any) => void;
};

export default function LoanDetails(props: LoanDetailsProps) {
  const {
    housePrice,
    purchaseDate,
    baseCpi,
    baseCpiAutoFilled,
    currentCpi,
    cpiBaseYear,
    setHousePrice,
    setBaseCpi,
    setBaseCpiAutoFilled,
    setCurrentCpi,
    handlePurchaseDateChange,
    handleCpiBaseYearChange,
    setResult,
  } = props;

  return (
    <section className='bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5'>
      <h2 className='text-lg font-semibold text-slate-200'>Loan Details</h2>

      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        {/* House Price */}
        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>Original House Price ($)</div>
          <input
            type='number'
            min={0}
            value={housePrice}
            onChange={(e) => {
              setHousePrice(e.target.value);
              setResult(null);
            }}
            placeholder='e.g. 5000000'
            className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Purchase Date → auto-fills base CPI */}
        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>Date of Purchase</div>
          <DatePicker value={purchaseDate} setValue={handlePurchaseDateChange} />
        </div>

        {/* Base CPI — auto-filled from purchase date, manually editable as fallback */}
        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>CPI at Purchase Date</div>
          <div className='relative'>
            <input
              type='number'
              min={0}
              value={baseCpi}
              onChange={(e) => {
                setBaseCpi(e.target.value);
                setBaseCpiAutoFilled(false);
                setResult(null);
              }}
              placeholder={purchaseDate.length > 0 ? 'No data — enter manually' : 'e.g. 100'}
              title={baseCpiAutoFilled ? 'Auto-filled from CPI data file' : undefined}
              className={`w-full bg-slate-900 border rounded-lg px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                baseCpiAutoFilled
                  ? 'border-emerald-600/60 text-emerald-300'
                  : 'border-slate-600 text-slate-100'
              }`}
            />
            {baseCpiAutoFilled && (
              <span className='absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-emerald-500 pointer-events-none'>
                auto
              </span>
            )}
          </div>
        </div>

        {/* Current CPI */}
        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>Current CPI (Today)</div>
          <input
            type='number'
            min={0}
            value={currentCpi}
            onChange={(e) => {
              setCurrentCpi(e.target.value);
              setResult(null);
            }}
            placeholder='e.g. 310'
            className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* CPI Base Year */}
        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>CPI Base Year</div>
          <select
            value={cpiBaseYear}
            onChange={(e) => handleCpiBaseYearChange(Number(e.target.value))}
            className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {CPI_BASE_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
