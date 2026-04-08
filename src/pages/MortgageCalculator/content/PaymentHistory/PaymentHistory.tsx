import type { RefObject } from 'react';
import PaymentRow from '../PaymentRow';
import type { FormRow } from '../../types';
import type { DateValue } from '@ark-ui/react';

type PaymentHistoryProps = {
  rows: FormRow[];
  updateRowDate: (id: number, date: DateValue[]) => void;
  updateRow: (id: number, field: 'pmt' | 'cpi' | 'vat', raw: string) => void;
  setResult: (result: any) => void;
  removeRow: (id: number) => void;
  addRow: () => void;
  tableEndRef: RefObject<HTMLDivElement | null>;
};

export default function PaymentHistory(props: PaymentHistoryProps) {
  const { rows, updateRowDate, updateRow, setResult, removeRow, addRow, tableEndRef } = props;

  return (
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
      <div className='grid grid-cols-[1.2fr_1fr_1fr_0.55fr_auto] gap-3 px-1'>
        <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>Payment Date</span>
        <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>PMT Amount ($)</span>
        <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>CPI That Month</span>
        <span className='text-[11px] font-semibold uppercase tracking-wider text-slate-500'>VAT (%)</span>
        <span className='w-8' />
      </div>

      <div className='flex flex-col gap-2 max-h-105 overflow-y-auto pr-1'>
        {rows.map((row) => (
          <PaymentRow
            key={row.id}
            row={row}
            updateRowDate={updateRowDate}
            updateRow={updateRow}
            setResult={setResult}
            removeRow={removeRow}
            rows={rows}
          />
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
  );
}
