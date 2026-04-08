import { CPI_BASE_YEARS, lookupCpi } from '../../../../lib/mortgageCalculator';

type LoanDetailsProps = {
  housePrice: string;
  baseCpi: string;
  currentCpi: string;
  cpiBaseYear: number;
  setHousePrice: (val: string) => void;
  setBaseCpi: (val: string) => void;
  setCurrentCpi: (val: string) => void;
  setCpiBaseYear: (val: number) => void;
  setResult: (val: any) => void;
  setRows: (val: any) => void;
};

export default function LoanDetails(props: LoanDetailsProps) {
  const {
    housePrice,
    baseCpi,
    currentCpi,
    cpiBaseYear,
    setHousePrice,
    setBaseCpi,
    setCurrentCpi,
    setCpiBaseYear,
    setResult,
    setRows,
  } = props;

  return (
    <section className='bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5'>
      <h2 className='text-lg font-semibold text-slate-200'>Loan Details</h2>

      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
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

        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>CPI at Purchase Date</div>

          <input
            type='number'
            min={0}
            value={baseCpi}
            onChange={(e) => {
              setBaseCpi(e.target.value);
              setResult(null);
            }}
            placeholder='e.g. 100'
            className='bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

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

        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>CPI Base Year</div>

          <select
            value={cpiBaseYear}
            onChange={(e) => {
              const newBaseYear = Number(e.target.value);
              setCpiBaseYear(newBaseYear);
              setRows((prev: any) =>
                prev.map((r: any) => {
                  if (!r.cpiAutoFilled || !r.date[0]) return r;
                  const found = lookupCpi(r.date[0].year, r.date[0].month, newBaseYear);
                  return found !== null ? { ...r, cpi: found } : { ...r, cpi: 0, cpiAutoFilled: false };
                }),
              );
              setResult(null);
            }}
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
