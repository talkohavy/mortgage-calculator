import type { MortgageResult } from '@src/lib/mortgageCalculator';

type ActionButtonsProps = {
  handleCalculate: () => void;
  handleReset: () => void;
  result: MortgageResult | null;
};

export default function ActionButtons(props: ActionButtonsProps) {
  const { handleCalculate, handleReset, result } = props;

  return (
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
  );
}
