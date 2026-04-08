import { formatUSD } from '../../logic/utils/formatUSD';
import ResultCard from '../ResultCard';
import type { MortgageResult } from '@src/lib/mortgageCalculator';

type CalculatorResultsProps = {
  result: MortgageResult;
  housePrice: string;
};

export default function CalculatorResults(props: CalculatorResultsProps) {
  const { result, housePrice } = props;

  return (
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
          value={formatUSD(result.remainingToday)}
          color={
            result.remainingToday <= 0 ? 'border-emerald-600 text-emerald-300' : 'border-amber-600/60 text-amber-300'
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
              className={result.inflationGain > 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}
            >
              {formatUSD(Math.abs(result.inflationGain))}
            </span>{' '}
            in real purchasing power compared to when they were made.
            {result.inflationGain > 0
              ? ' Inflation worked in your favour — each shekel you paid was worth more back then than today.'
              : ' Deflation worked against you.'}
          </span>
        </div>
      )}

      {result.vatGain !== 0 && (
        <div className='bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-sm text-slate-400 flex flex-col gap-1'>
          <span className='font-medium text-slate-300'>VAT Change Effect</span>
          <span>
            The VAT change {result.vatGain > 0 ? 'reduced' : 'increased'} the real value of your past payments by{' '}
            <span className={result.vatGain > 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
              {formatUSD(Math.abs(result.vatGain))}
            </span>
            .
            {result.vatGain < 0
              ? " A VAT increase means your remaining balance is higher in today's terms."
              : ' A VAT decrease worked in your favour.'}
          </span>
        </div>
      )}
    </section>
  );
}
