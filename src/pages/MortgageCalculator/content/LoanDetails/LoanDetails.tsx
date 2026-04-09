import Input from '@src/components/controls/Input';
import DatePicker from '@src/components/DatePicker';
import InputCpi from '../InputCpi';
import type { DateValue } from '@ark-ui/react';

const INPUT_CLASS =
  'bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500';

type LoanDetailsProps = {
  housePrice: string;
  purchaseDate: DateValue[];
  baseCpi: string;
  baseCpiAutoFilled: boolean;
  currentCpi: string;
  vatAtPurchase: string;
  vatToday: string;
  setHousePrice: (val: string) => void;
  setBaseCpi: (val: string) => void;
  setBaseCpiAutoFilled: (val: boolean) => void;
  setCurrentCpi: (val: string) => void;
  setVatAtPurchase: (val: string) => void;
  setVatToday: (val: string) => void;
  handlePurchaseDateChange: (date: DateValue[]) => void;
};

export default function LoanDetails(props: LoanDetailsProps) {
  const {
    housePrice,
    purchaseDate,
    baseCpi,
    baseCpiAutoFilled,
    currentCpi,
    vatAtPurchase,
    vatToday,
    setHousePrice,
    setBaseCpi,
    setBaseCpiAutoFilled,
    setCurrentCpi,
    setVatAtPurchase,
    setVatToday,
    handlePurchaseDateChange,
  } = props;

  return (
    <section className='bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5'>
      <h2 className='text-lg font-semibold text-slate-200'>Loan Details</h2>

      {/* Row 1: price + dates + CPI */}
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>Original House Price ($)</div>
          <Input
            initialValue={housePrice}
            value={housePrice}
            onChange={setHousePrice}
            placeholder='e.g. 5000000'
            className={INPUT_CLASS}
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>Date of Purchase</div>
          <DatePicker value={purchaseDate} setValue={handlePurchaseDateChange} />
        </div>

        {/* Base CPI — auto-filled from purchase date */}
        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>CPI at Purchase Date</div>
          <InputCpi
            value={baseCpi}
            onChange={setBaseCpi}
            isAutoFilled={baseCpiAutoFilled}
            onManualEdit={() => setBaseCpiAutoFilled(false)}
            placeholder={purchaseDate.length > 0 ? 'No data — enter manually' : 'e.g. 101.2'}
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>Current CPI (Today)</div>
          <Input
            initialValue={currentCpi}
            value={currentCpi}
            onChange={setCurrentCpi}
            placeholder='e.g. 141'
            className={INPUT_CLASS}
          />
        </div>

      </div>

      {/* Row 2: VAT — optional, leave blank to skip VAT adjustment */}
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1 border-t border-slate-700/40'>
        <div className='sm:col-span-2 flex flex-col gap-1'>
          <div className='text-xs font-medium text-slate-500 uppercase tracking-wider'>
            VAT Adjustment
            <span className='ml-2 normal-case font-normal text-slate-600'>(optional — leave blank to skip)</span>
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>VAT at Purchase (%)</div>
          <Input
            initialValue={vatAtPurchase}
            value={vatAtPurchase}
            onChange={setVatAtPurchase}
            placeholder='e.g. 17'
            className={INPUT_CLASS}
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>Current VAT (%)</div>
          <Input
            initialValue={vatToday}
            value={vatToday}
            onChange={setVatToday}
            placeholder='e.g. 18'
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </section>
  );
}
