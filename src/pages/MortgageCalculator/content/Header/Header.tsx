import type { RefObject } from 'react';

type HeaderProps = {
  importFileRef: RefObject<HTMLInputElement | null>;
  handleImport: (val: any) => void;
  handleExport: (val: any) => void;
};

export default function Header(props: HeaderProps) {
  const { importFileRef, handleImport, handleExport } = props;

  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-3xl font-bold tracking-tight'>Mortgage CPI Calculator</h1>
        <p className='text-slate-400 text-sm'>
          Calculate how much of your mortgage remains in today&apos;s real (inflation-adjusted) money.
        </p>
      </div>

      <div className='flex items-center gap-2 shrink-0 mt-1'>
        {/* Hidden file input for import */}
        <input
          ref={importFileRef}
          type='file'
          accept='.json,application/json'
          onChange={handleImport}
          className='hidden'
        />

        <button
          type='button'
          onClick={() => importFileRef.current?.click()}
          className='flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors'
          title='Load a previously saved mortgage-data.json file'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='17 8 12 3 7 8' />
            <line x1='12' y1='3' x2='12' y2='15' />
          </svg>
          Import
        </button>

        <button
          type='button'
          onClick={handleExport}
          className='flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors'
          title='Download current form as mortgage-data.json'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='7 10 12 15 17 10' />
            <line x1='12' y1='15' x2='12' y2='3' />
          </svg>
          Export
        </button>
      </div>
    </div>
  );
}
