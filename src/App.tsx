import { FormEvent, useEffect, useState } from 'react'
import './App.css'

type Operation = 'add' | 'subtract' | 'multiply' | 'divide'

type CalculationResponse = {
  id: number
  result: number
  firstNumber: number
  secondNumber: number
  operation: string
}

const operationOptions: { value: Operation; label: string }[] = [
  { value: 'add', label: 'Add' },
  { value: 'subtract', label: 'Subtract' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'divide', label: 'Divide' },
]

const operationTitleMap: Record<Operation, string> = {
  add: 'Add',
  subtract: 'Subtract',
  multiply: 'Multiply',
  divide: 'Divide',
}

function App() {
  const [operation, setOperation] = useState<Operation>('add')
  const [firstNumber, setFirstNumber] = useState('')
  const [secondNumber, setSecondNumber] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [calculations, setCalculations] = useState<CalculationResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingOperations, setIsLoadingOperations] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_CALC_API_URL || 'http://localhost:8080'

  const loadCalculations = async () => {
    setIsLoadingOperations(true)
    setError(null)
    try {
      const response = await fetch(`${apiBaseUrl}/api/operations`)
      if (!response.ok) {
        throw new Error(`Failed to fetch operations: ${response.status}`)
      }
      const data = (await response.json()) as CalculationResponse[]
      setCalculations(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoadingOperations(false)
    }
  }

  useEffect(() => {
    loadCalculations()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      loadCalculations()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (value: number) => {
    if (Number.isInteger(value)) {
      return value.toString()
    }
    return value.toFixed(6).replace(/\.?0+$/, '')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError(null)
      setResult(null)

      const response = await fetch(`${apiBaseUrl}/api/operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstNumber: Number(firstNumber),
          secondNumber: Number(secondNumber),
          operation,
        }),
      })

      if (!response.ok) {
        const responseText = await response.text()
        throw new Error(responseText || `Failed to execute operation: ${response.status}`)
      }

      const data = (await response.json()) as CalculationResponse
      setResult(data.result)
      setFirstNumber('')
      setSecondNumber('')
      await loadCalculations()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app">
      <section className="calculator-card">
        <h1>Operations</h1>
        <p className="subtitle">Perform add, subtract, multiply, and divide, and save every operation.</p>

        <form className="operation-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="operation">Operation</label>
            <select
              id="operation"
              value={operation}
              onChange={(event) => setOperation(event.target.value as Operation)}
            >
              {operationOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="first-number">First Number</label>
            <input
              id="first-number"
              inputMode="decimal"
              type="number"
              step="any"
              value={firstNumber}
              onChange={(event) => setFirstNumber(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="second-number">Second Number</label>
            <input
              id="second-number"
              inputMode="decimal"
              type="number"
              step="any"
              value={secondNumber}
              onChange={(event) => setSecondNumber(event.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <div className="result-box" role="status">
          <strong>Result ({operationTitleMap[operation]}):</strong>{' '}
          {result === null ? '—' : formatNumber(result)}
        </div>
      </section>

      <section className="operations-table">
        <div className="table-header">
          <h2>Operations History</h2>
          <button
            type="button"
            className="secondary-button"
            onClick={() => loadCalculations()}
            disabled={isLoadingOperations || isSubmitting}
          >
            Refresh
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>First Number</th>
              <th>Second Number</th>
              <th>Operand</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingOperations ? (
              <tr>
                <td colSpan={5}>Loading operations...</td>
              </tr>
            ) : calculations.length === 0 ? (
              <tr>
                <td colSpan={5}>No operations yet.</td>
              </tr>
            ) : (
              calculations.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{formatNumber(item.firstNumber)}</td>
                  <td>{formatNumber(item.secondNumber)}</td>
                  <td>{item.operation}</td>
                  <td>{formatNumber(item.result)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {error && <p role="alert" className="error">Error: {error}</p>}
    </main>
  )
}

export default App
