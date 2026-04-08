import DatePicker from '@src/components/DatePicker';
import type { FormRow } from '../../types';
import type { DateValue } from '@ark-ui/react';

type PaymentRowProps = {
  row: FormRow;
  updateRowDate: (id: number, date: DateValue[]) => void;
  updateRow: (id: number, field: 'pmt' | 'cpi', raw: string) => void;
  setResult: (result: any) => void;
  removeRow: (id: number) => void;
  rows: FormRow[];
};

export default function PaymentRow(props: PaymentRowProps) {
  const { row, updateRowDate, updateRow, setResult, removeRow, rows } = props;

  return (
    <div className='grid grid-cols-[1.2fr_1fr_1fr_auto] gap-3 items-center group'>
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
          value={row.cpi === 0 ? '' : row.cpi}
          onChange={(e) => {
            updateRow(row.id, 'cpi', e.target.value);
            setResult(null);
          }}
          placeholder={row.date.length > 0 ? 'No data — enter manually' : 'e.g. 101.2'}
          title={row.cpiAutoFilled ? 'Auto-filled from CPI data file' : undefined}
          className={`bg-slate-900 border rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            row.cpiAutoFilled
              ? 'border-emerald-600/60 text-emerald-300'
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
  );
}
