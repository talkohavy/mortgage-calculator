import clsx from 'clsx';
import Input from '@src/components/controls/Input';

type InputCpiProps = {
  value: string;
  onChange: (v: string) => void;
  isAutoFilled: boolean;
  onManualEdit?: () => void;
  placeholder?: string;
};

export default function InputCpi(props: InputCpiProps) {
  const { value, onChange, isAutoFilled, onManualEdit, placeholder } = props;

  return (
    <div className='relative'>
      <Input
        value={value}
        initialValue={value}
        onChange={(v) => {
          onManualEdit?.();
          onChange(v);
        }}
        placeholder={placeholder}
        className={clsx(
          'bg-slate-900 border rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
          isAutoFilled ? 'border-emerald-600/60 text-emerald-300' : 'border-slate-600 text-slate-100',
        )}
      />

      {isAutoFilled && (
        <span className='absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-emerald-500 pointer-events-none'>
          auto
        </span>
      )}
    </div>
  );
}
