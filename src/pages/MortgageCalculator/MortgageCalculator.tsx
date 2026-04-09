import ActionButtons from './content/ActionButtons';
import CalculatorResults from './content/CalculatorResults';
import Header from './content/Header';
import LoanDetails from './content/LoanDetails';
import PaymentHistory from './content/PaymentHistory';
import { useMortgageCalculatorPageLogic } from './logic/useMortgageCalculatorPageLogic';

export default function MortgageCalculatorPage() {
  const {
    importFileRef,
    handleImport,
    handleExport,
    housePrice,
    purchaseDate,
    baseCpi,
    baseCpiAutoFilled,
    currentCpi,
    vatAtPurchase,
    vatToday,
    setBaseCpi,
    setBaseCpiAutoFilled,
    setHousePrice,
    setCurrentCpi,
    setVatAtPurchase,
    setVatToday,
    handlePurchaseDateChange,
    rows,
    updateRow,
    updateRowDate,
    removeRow,
    addRow,
    tableEndRef,
    handleReset,
    result,
    resultAtPurchase,
    perspective,
    setPerspective,
    handleCalculate,
    error,
  } = useMortgageCalculatorPageLogic();

  const activeResult = perspective === 'today' ? result : resultAtPurchase;

  return (
    <div className='size-full flex flex-col overflow-auto bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100'>
      <div className='max-w-5xl w-full mx-auto px-4 py-10 flex flex-col gap-8'>
        <Header importFileRef={importFileRef} handleImport={handleImport} handleExport={handleExport} />

        <LoanDetails
          housePrice={housePrice}
          purchaseDate={purchaseDate}
          baseCpi={baseCpi}
          baseCpiAutoFilled={baseCpiAutoFilled}
          currentCpi={currentCpi}
          vatAtPurchase={vatAtPurchase}
          vatToday={vatToday}
          setHousePrice={setHousePrice}
          setBaseCpi={setBaseCpi}
          setBaseCpiAutoFilled={setBaseCpiAutoFilled}
          setCurrentCpi={setCurrentCpi}
          setVatAtPurchase={setVatAtPurchase}
          setVatToday={setVatToday}
          handlePurchaseDateChange={handlePurchaseDateChange}
        />

        <PaymentHistory
          rows={rows}
          addRow={addRow}
          removeRow={removeRow}
          updateRowDate={updateRowDate}
          updateRow={updateRow}
          tableEndRef={tableEndRef}
        />

        {error && (
          <div className='bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm'>
            {error}
          </div>
        )}

        <ActionButtons handleCalculate={handleCalculate} handleReset={handleReset} result={result} />

        {result && (
          <>
            <div className='flex items-center gap-1 p-1 bg-slate-800/60 border border-slate-700/40 rounded-xl self-start'>
              <button
                type='button'
                onClick={() => setPerspective('today')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  perspective === 'today' ? 'bg-slate-600 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Today&apos;s Money
              </button>

              <button
                type='button'
                onClick={() => setPerspective('atPurchase')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  perspective === 'atPurchase'
                    ? 'bg-slate-600 text-slate-100 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                At Purchase Date
              </button>
            </div>

            {activeResult && (
              <CalculatorResults result={activeResult} housePrice={housePrice} perspective={perspective} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
