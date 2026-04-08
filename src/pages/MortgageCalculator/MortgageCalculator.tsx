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
    baseCpi,
    currentCpi,
    setBaseCpi,
    setResult,
    setHousePrice,
    setCurrentCpi,
    setCpiBaseYear,
    setRows,
    cpiBaseYear,
    rows,
    updateRow,
    updateRowDate,
    removeRow,
    addRow,
    tableEndRef,
    handleReset,
    result,
    handleCalculate,
    error,
  } = useMortgageCalculatorPageLogic();

  return (
    <div className='size-full flex flex-col overflow-auto bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100'>
      <div className='max-w-5xl w-full mx-auto px-4 py-10 flex flex-col gap-8'>
        <Header importFileRef={importFileRef} handleImport={handleImport} handleExport={handleExport} />

        <LoanDetails
          housePrice={housePrice}
          baseCpi={baseCpi}
          currentCpi={currentCpi}
          cpiBaseYear={cpiBaseYear}
          setHousePrice={setHousePrice}
          setBaseCpi={setBaseCpi}
          setCurrentCpi={setCurrentCpi}
          setCpiBaseYear={setCpiBaseYear}
          setResult={setResult}
          setRows={setRows}
        />

        <PaymentHistory
          rows={rows}
          addRow={addRow}
          removeRow={removeRow}
          updateRowDate={updateRowDate}
          updateRow={updateRow}
          setResult={setResult}
          tableEndRef={tableEndRef}
        />

        {error && (
          <div className='bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm'>
            {error}
          </div>
        )}

        <ActionButtons handleCalculate={handleCalculate} handleReset={handleReset} result={result} />

        {result && <CalculatorResults result={result} housePrice={housePrice} />}
      </div>
    </div>
  );
}
