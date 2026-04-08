import Input from '@src/components/controls/Input';
import DatePicker from '@src/components/DatePicker';
import InputCpi from '../InputCpi';
import type { FormRow } from '../../types';
import type { DateValue } from '@ark-ui/react';

const INPUT_CLASS =
  'bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500';

type PaymentRowProps = {
  row: FormRow;
  updateRowDate: (id: number, date: DateValue[]) => void;
  updateRow: (id: number, field: 'pmt' | 'cpi' | 'vat', raw: string) => void;
  removeRow: (id: number) => void;
  canRemoveRow: boolean;
};

export default function PaymentRow(props: PaymentRowProps) {
  const { row, updateRowDate, updateRow, removeRow, canRemoveRow } = props;

  return (
    <div className='grid grid-cols-[1.2fr_1fr_1fr_0.55fr_auto] gap-3 items-center group'>
      <DatePicker value={row.date} setValue={(date: DateValue[]) => updateRowDate(row.id, date)} />

      <Input
        initialValue={row.pmt === 0 ? '' : String(row.pmt)}
        value={row.pmt === 0 ? '' : String(row.pmt)}
        onChange={(v) => {
          updateRow(row.id, 'pmt', v);
        }}
        placeholder='e.g. 18500'
        className={INPUT_CLASS}
      />

      <InputCpi
        value={row.cpi === 0 ? '' : String(row.cpi)}
        onChange={(newCpiValue) => updateRow(row.id, 'cpi', newCpiValue)}
        isAutoFilled={row.cpiAutoFilled}
        placeholder={row.date.length > 0 ? 'No data' : 'e.g. 101.2'}
      />

      <Input
        initialValue={row.vat === 0 ? '' : String(row.vat)}
        value={row.vat === 0 ? '' : String(row.vat)}
        onChange={(newVatValue) => {
          updateRow(row.id, 'vat', newVatValue);
        }}
        placeholder='%'
        className={INPUT_CLASS}
      />

      <button
        type='button'
        onClick={() => {
          removeRow(row.id);
        }}
        disabled={canRemoveRow}
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
