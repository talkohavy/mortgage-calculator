import clsx from 'clsx';
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

      {/* Per-payment breakdown table */}
      {result.paymentBreakdown.length > 0 && (
        <div className='bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 flex flex-col gap-3'>
          <span className='text-xs font-semibold uppercase tracking-wider text-slate-500'>How we got there</span>

          {/* House price breakdown */}
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-700'>
                  <th className='text-left pb-2 pr-4'>House price</th>
                  <th className='text-right pb-2 pr-4'>Original</th>
                  <th className='text-right pb-2 pr-4'>CPI factor</th>
                  <th className='text-right pb-2 pr-4'>VAT factor</th>
                  <th className='text-right pb-2'>Today&apos;s value</th>
                </tr>
              </thead>
              <tbody>
                <tr className='text-slate-300'>
                  <td className='py-1.5 pr-4 text-slate-400'>Purchase price</td>
                  <td className='py-1.5 pr-4 text-right font-mono'>{formatUSD(Number.parseFloat(housePrice))}</td>
                  <td className='py-1.5 pr-4 text-right font-mono text-blue-300'>
                    ×{result.houseCpiFactor.toFixed(4)}
                  </td>
                  <td className='py-1.5 pr-4 text-right font-mono text-purple-300'>
                    {result.houseVatFactor === 1 ? (
                      <span className='text-slate-600'>—</span>
                    ) : (
                      `×${result.houseVatFactor.toFixed(4)}`
                    )}
                  </td>
                  <td className='py-1.5 text-right font-mono text-slate-100'>{formatUSD(result.housePriceToday)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='border-t border-slate-700/60' />

          {/* Per-payment breakdown table */}
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-700'>
                  <th className='text-left pb-2 pr-4'>Payment</th>
                  <th className='text-right pb-2 pr-4'>Nominal</th>
                  <th className='text-right pb-2 pr-4'>CPI factor</th>
                  <th className='text-right pb-2 pr-4'>VAT factor</th>
                  <th className='text-right pb-2 pr-4'>Today&apos;s value</th>
                  <th className='text-right pb-2'>Remaining after</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-700/50'>
                {result.paymentBreakdown.map((row, i) => (
                  <tr key={i} className='text-slate-300'>
                    <td className='py-1.5 pr-4 text-slate-400'>{row.label || `#${i + 1}`}</td>
                    <td className='py-1.5 pr-4 text-right font-mono'>{formatUSD(row.nominal)}</td>
                    <td className='py-1.5 pr-4 text-right font-mono text-blue-300'>×{row.cpiFactor.toFixed(4)}</td>
                    <td className='py-1.5 pr-4 text-right font-mono text-purple-300'>
                      {row.vatFactor === 1 ? <span className='text-slate-600'>—</span> : `×${row.vatFactor.toFixed(4)}`}
                    </td>
                    <td className='py-1.5 pr-4 text-right font-mono text-emerald-300'>{formatUSD(row.todayValue)}</td>
                    <td
                      className={`py-1.5 text-right font-mono ${row.remainingAfter <= 0 ? 'text-emerald-300' : 'text-amber-300'}`}
                    >
                      {formatUSD(row.remainingAfter)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='border-t border-slate-600 font-semibold text-slate-200'>
                  <td className='pt-2 pr-4'>Total paid</td>
                  <td className='pt-2 pr-4 text-right font-mono'>{formatUSD(result.totalPaidNominal)}</td>
                  <td className='pt-2 pr-4' />
                  <td className='pt-2 pr-4' />
                  <td className='pt-2 pr-4 text-right font-mono text-emerald-300'>
                    {formatUSD(result.totalPaidToday)}
                  </td>
                  <td className='pt-2 text-right font-mono text-amber-300'>{formatUSD(result.remainingToday)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className='border-t border-slate-600 pt-3 flex flex-col gap-1.5 font-mono text-sm'>
            <div className='flex justify-between text-slate-300'>
              <span>House price (today&apos;s money)</span>
              <span>{formatUSD(result.housePriceToday)}</span>
            </div>
            <div className='flex justify-between text-emerald-400'>
              <span>− Total paid (today&apos;s money)</span>
              <span>− {formatUSD(result.totalPaidToday)}</span>
            </div>
            <div className='border-t border-slate-700 my-1' />
            <div
              className={clsx(
                'flex justify-between font-semibold',
                result.remainingToday <= 0 ? 'text-emerald-300' : 'text-amber-300',
              )}
            >
              <span>= Remaining to pay</span>
              <span>{formatUSD(Math.max(0, result.remainingToday))}</span>
            </div>
          </div>
        </div>
      )}

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
