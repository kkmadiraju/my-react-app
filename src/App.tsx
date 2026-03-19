import { FormEvent, MouseEvent, useEffect, useState } from 'react'
import './App.css'

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'mod'
type ActiveMenu = 'operations' | 'history' | 'http'
type HttpMode = 'getAll' | 'getById' | 'create' | 'update' | 'delete'
type SortDirection = 'asc' | 'desc'
type SortKey = 'id' | 'firstNumber' | 'secondNumber' | 'operation' | 'result'
type SortConfig = {
  key: SortKey
  direction: SortDirection
}

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
  { value: 'mod', label: 'Mod' },
]

const operationTitleMap: Record<Operation, string> = {
  add: 'Add',
  subtract: 'Subtract',
  multiply: 'Multiply',
  divide: 'Divide',
  mod: 'Mod',
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
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('operations')
  const [activeHttpMode, setActiveHttpMode] = useState<HttpMode>('getAll')
  const [isHttpSubmitting, setIsHttpSubmitting] = useState(false)
  const [historySort, setHistorySort] = useState<SortConfig>({
    key: 'id',
    direction: 'desc',
  })

  const [httpItems, setHttpItems] = useState<CalculationResponse[]>([])
  const [httpItem, setHttpItem] = useState<CalculationResponse | null>(null)
  const [httpGetById, setHttpGetById] = useState('')
  const [httpMessage, setHttpMessage] = useState('')

  const [httpCreateOperation, setHttpCreateOperation] = useState<Operation>('add')
  const [httpCreateFirst, setHttpCreateFirst] = useState('')
  const [httpCreateSecond, setHttpCreateSecond] = useState('')

  const [httpUpdateId, setHttpUpdateId] = useState('')
  const [httpUpdateOperation, setHttpUpdateOperation] = useState<Operation>('add')
  const [httpUpdateFirst, setHttpUpdateFirst] = useState('')
  const [httpUpdateSecond, setHttpUpdateSecond] = useState('')
  const [httpDeleteId, setHttpDeleteId] = useState('')

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
    return value.toFixed(6).replace(/\\.?0+$/, '')
  }

  const formatOperationLabel = (value: Operation) => {
    return operationTitleMap[value]
  }

  const getSortLabel = (key: SortKey) => {
    if (historySort.key !== key) {
      return 'none'
    }

    return historySort.direction === 'asc' ? 'ascending' : 'descending'
  }

  const handleHistorySort = (key: SortKey) => {
    setHistorySort((currentSort) => {
      if (currentSort.key === key) {
        return {
          key,
          direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
        }
      }

      return {
        key,
        direction: 'asc',
      }
    })
  }

  const sortedCalculations = [...calculations].sort((left, right) => {
    let comparison = 0

    switch (historySort.key) {
      case 'id':
        comparison = left.id - right.id
        break
      case 'firstNumber':
        comparison = left.firstNumber - right.firstNumber
        break
      case 'secondNumber':
        comparison = left.secondNumber - right.secondNumber
        break
      case 'result':
        comparison = left.result - right.result
        break
      case 'operation':
        comparison = left.operation.localeCompare(right.operation)
        break
    }

    return historySort.direction === 'asc' ? comparison : -comparison
  })

  const renderHistorySortButton = (label: string, key: SortKey) => (
    <button
      type="button"
      className={historySort.key === key ? 'sort-button active' : 'sort-button'}
      onClick={() => handleHistorySort(key)}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      <span className="sort-indicator" aria-hidden="true">
        {historySort.key === key ? (historySort.direction === 'asc' ? '^' : 'v') : '<>'}
      </span>
    </button>
  )

  const formatOperationSelect = (
    selectedOperation: Operation,
    onChange: (next: Operation) => void,
  ) => (
    <details className="operation-menu">
      <summary>Operation: {operationTitleMap[selectedOperation]}</summary>
      <div className="operation-menu-panel">
        {operationOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              onChange(item.value)
              event.currentTarget.closest('details')?.removeAttribute('open')
            }}
            className={selectedOperation === item.value ? 'selected' : ''}
          >
            {item.label}
          </button>
        ))}
      </div>
    </details>
  )

  const clearHttpResult = () => {
    setHttpItems([])
    setHttpItem(null)
    setHttpMessage('')
  }

  const parseId = (raw: string) => {
    const numeric = Number(raw)
    if (!Number.isInteger(numeric) || numeric < 1) {
      throw new Error('Please enter a valid positive integer id')
    }
    return numeric
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

  const handleHttpGetAll = async () => {
    setIsHttpSubmitting(true)
    setError(null)
    clearHttpResult()

    try {
      const response = await fetch(`${apiBaseUrl}/api/operations`)
      if (!response.ok) {
        throw new Error(`Failed to get all operations: ${response.status}`)
      }

      const data = (await response.json()) as CalculationResponse[]
      setHttpItems(data)
      setHttpMessage(`GET all operations returned ${data.length} items`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsHttpSubmitting(false)
    }
  }

  const handleHttpGetByIdSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsHttpSubmitting(true)
    setError(null)
    clearHttpResult()

    try {
      const id = parseId(httpGetById)
      const response = await fetch(`${apiBaseUrl}/api/operations/${id}`)
      if (!response.ok) {
        const responseText = await response.text()
        throw new Error(responseText || `Failed to get operation ${id}: ${response.status}`)
      }

      const data = (await response.json()) as CalculationResponse
      setHttpItem(data)
      setHttpMessage(`GET operation ${id} completed`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsHttpSubmitting(false)
    }
  }

  const handleHttpCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsHttpSubmitting(true)
    setError(null)
    clearHttpResult()

    try {
      const response = await fetch(`${apiBaseUrl}/api/operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstNumber: Number(httpCreateFirst),
          secondNumber: Number(httpCreateSecond),
          operation: httpCreateOperation,
        }),
      })

      if (!response.ok) {
        const responseText = await response.text()
        throw new Error(responseText || `Failed to create operation: ${response.status}`)
      }

      const data = (await response.json()) as CalculationResponse
      setHttpItem(data)
      setHttpMessage(`POST create completed with id ${data.id}`)
      setHttpCreateFirst('')
      setHttpCreateSecond('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsHttpSubmitting(false)
    }
  }

  const handleHttpUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsHttpSubmitting(true)
    setError(null)
    clearHttpResult()

    try {
      const id = parseId(httpUpdateId)
      const response = await fetch(`${apiBaseUrl}/api/operations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstNumber: Number(httpUpdateFirst),
          secondNumber: Number(httpUpdateSecond),
          operation: httpUpdateOperation,
        }),
      })

      if (!response.ok) {
        const responseText = await response.text()
        throw new Error(responseText || `Failed to update operation ${id}: ${response.status}`)
      }

      const data = (await response.json()) as CalculationResponse
      setHttpItem(data)
      setHttpMessage(`PUT update for id ${id} completed`)
      setHttpUpdateId('')
      setHttpUpdateFirst('')
      setHttpUpdateSecond('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsHttpSubmitting(false)
    }
  }

  const handleHttpDeleteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsHttpSubmitting(true)
    setError(null)
    clearHttpResult()

    try {
      const id = parseId(httpDeleteId)
      const response = await fetch(`${apiBaseUrl}/api/operations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const responseText = await response.text()
        throw new Error(responseText || `Failed to delete operation ${id}: ${response.status}`)
      }

      setHttpMessage(`DELETE operation ${id} completed`)
      setHttpDeleteId('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsHttpSubmitting(false)
    }
  }

  return (
    <main className="app">
      <nav className="main-menu" aria-label="App menu">
        <button
          type="button"
          className={activeMenu === 'operations' ? 'menu-item active' : 'menu-item'}
          onClick={() => setActiveMenu('operations')}
        >
          Operations
        </button>
        <button
          type="button"
          className={activeMenu === 'history' ? 'menu-item active' : 'menu-item'}
          onClick={() => setActiveMenu('history')}
        >
          Operations History
        </button>
        <button
          type="button"
          className={activeMenu === 'http' ? 'menu-item active' : 'menu-item'}
          onClick={() => setActiveMenu('http')}
        >
          HTTP Operations
        </button>
      </nav>

      {activeMenu === 'operations' ? (
        <section className="calculator-card">
          <h1>Operations</h1>
          <p className="subtitle">
            Perform add, subtract, multiply, divide, and mod, and save every operation.
          </p>

          <form className="operation-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="operation">Operation</label>
              {formatOperationSelect(operation, setOperation)}
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
            <strong>Result ({formatOperationLabel(operation)}):</strong> {result === null ? '--' : formatNumber(result)}
          </div>
        </section>
      ) : activeMenu === 'history' ? (
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
                <th aria-sort={getSortLabel('id')}>{renderHistorySortButton('Id', 'id')}</th>
                <th aria-sort={getSortLabel('firstNumber')}>
                  {renderHistorySortButton('First Number', 'firstNumber')}
                </th>
                <th aria-sort={getSortLabel('secondNumber')}>
                  {renderHistorySortButton('Second Number', 'secondNumber')}
                </th>
                <th aria-sort={getSortLabel('operation')}>
                  {renderHistorySortButton('Operand', 'operation')}
                </th>
                <th aria-sort={getSortLabel('result')}>
                  {renderHistorySortButton('Result', 'result')}
                </th>
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
                sortedCalculations.map((item) => (
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
      ) : (
        <section className="operations-table http-operations">
          <h2>HTTP Operations</h2>

          <div className="http-submenu" role="tablist" aria-label="HTTP operation methods">
            <button
              type="button"
              className={activeHttpMode === 'getAll' ? 'menu-item active' : 'menu-item'}
              role="tab"
              onClick={() => {
                setActiveHttpMode('getAll')
                clearHttpResult()
              }}
            >
              GET All
            </button>
            <button
              type="button"
              className={activeHttpMode === 'getById' ? 'menu-item active' : 'menu-item'}
              role="tab"
              onClick={() => {
                setActiveHttpMode('getById')
                clearHttpResult()
              }}
            >
              GET by Id
            </button>
            <button
              type="button"
              className={activeHttpMode === 'create' ? 'menu-item active' : 'menu-item'}
              role="tab"
              onClick={() => {
                setActiveHttpMode('create')
                clearHttpResult()
              }}
            >
              POST
            </button>
            <button
              type="button"
              className={activeHttpMode === 'update' ? 'menu-item active' : 'menu-item'}
              role="tab"
              onClick={() => {
                setActiveHttpMode('update')
                clearHttpResult()
              }}
            >
              PUT
            </button>
            <button
              type="button"
              className={activeHttpMode === 'delete' ? 'menu-item active' : 'menu-item'}
              role="tab"
              onClick={() => {
                setActiveHttpMode('delete')
                clearHttpResult()
              }}
            >
              DELETE
            </button>
          </div>

          {activeHttpMode === 'getAll' && (
            <section className="calculator-card http-method-panel" aria-label="HTTP GET all operations">
              <div className="table-header">
                <h3>GET /api/operations</h3>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleHttpGetAll}
                  disabled={isHttpSubmitting}
                >
                  {isHttpSubmitting ? 'Loading...' : 'Fetch all'}
                </button>
              </div>

              {httpItems.length === 0 ? (
                <p>No data loaded yet.</p>
              ) : (
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
                    {httpItems.map((item) => (
                      <tr key={`all-${item.id}`}>
                        <td>{item.id}</td>
                        <td>{formatNumber(item.firstNumber)}</td>
                        <td>{formatNumber(item.secondNumber)}</td>
                        <td>{item.operation}</td>
                        <td>{formatNumber(item.result)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {activeHttpMode === 'getById' && (
            <section className="calculator-card http-method-panel" aria-label="HTTP GET by id">
              <h3>GET /api/operations/{'{id}'}</h3>
              <form className="operation-form" onSubmit={handleHttpGetByIdSubmit}>
                <div className="field">
                  <label htmlFor="http-get-id">Operation Id</label>
                  <input
                    id="http-get-id"
                    type="number"
                    min="1"
                    value={httpGetById}
                    onChange={(event) => setHttpGetById(event.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={isHttpSubmitting}>
                  {isHttpSubmitting ? 'Loading...' : 'Get'}
                </button>
              </form>

              {httpItem && (
                <div className="result-box" role="status">
                  Id: {httpItem.id}, Operand: {httpItem.operation},
                  {` First: ${formatNumber(httpItem.firstNumber)}, Second: ${formatNumber(httpItem.secondNumber)}, Result: ${formatNumber(httpItem.result)}`}
                </div>
              )}
            </section>
          )}

          {activeHttpMode === 'create' && (
            <section className="calculator-card http-method-panel" aria-label="HTTP create operation">
              <h3>POST /api/operations</h3>
              <form className="operation-form" onSubmit={handleHttpCreateSubmit}>
                <div className="field">
                  <label htmlFor="http-create-operation">Operation</label>
                  {formatOperationSelect(httpCreateOperation, setHttpCreateOperation)}
                </div>
                <div className="field">
                  <label htmlFor="http-create-first">First Number</label>
                  <input
                    id="http-create-first"
                    inputMode="decimal"
                    type="number"
                    step="any"
                    value={httpCreateFirst}
                    onChange={(event) => setHttpCreateFirst(event.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="http-create-second">Second Number</label>
                  <input
                    id="http-create-second"
                    inputMode="decimal"
                    type="number"
                    step="any"
                    value={httpCreateSecond}
                    onChange={(event) => setHttpCreateSecond(event.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={isHttpSubmitting}>
                  {isHttpSubmitting ? 'Submitting...' : 'Create'}
                </button>
              </form>

              {httpItem && (
                <div className="result-box" role="status">
                  Created Id {httpItem.id} with Result {formatNumber(httpItem.result)}
                </div>
              )}
            </section>
          )}

          {activeHttpMode === 'update' && (
            <section className="calculator-card http-method-panel" aria-label="HTTP update operation">
              <h3>PUT /api/operations/{'{id}'}</h3>
              <form className="operation-form" onSubmit={handleHttpUpdateSubmit}>
                <div className="field">
                  <label htmlFor="http-update-id">Operation Id</label>
                  <input
                    id="http-update-id"
                    type="number"
                    min="1"
                    value={httpUpdateId}
                    onChange={(event) => setHttpUpdateId(event.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="http-update-operation">Operation</label>
                  {formatOperationSelect(httpUpdateOperation, setHttpUpdateOperation)}
                </div>
                <div className="field">
                  <label htmlFor="http-update-first">First Number</label>
                  <input
                    id="http-update-first"
                    inputMode="decimal"
                    type="number"
                    step="any"
                    value={httpUpdateFirst}
                    onChange={(event) => setHttpUpdateFirst(event.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="http-update-second">Second Number</label>
                  <input
                    id="http-update-second"
                    inputMode="decimal"
                    type="number"
                    step="any"
                    value={httpUpdateSecond}
                    onChange={(event) => setHttpUpdateSecond(event.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={isHttpSubmitting}>
                  {isHttpSubmitting ? 'Updating...' : 'Update'}
                </button>
              </form>

              {httpItem && (
                <div className="result-box" role="status">
                  Updated Id {httpItem.id}. Current result: {formatNumber(httpItem.result)}
                </div>
              )}
            </section>
          )}

          {activeHttpMode === 'delete' && (
            <section className="calculator-card http-method-panel" aria-label="HTTP delete operation">
              <h3>DELETE /api/operations/{'{id}'}</h3>
              <form className="operation-form" onSubmit={handleHttpDeleteSubmit}>
                <div className="field">
                  <label htmlFor="http-delete-id">Operation Id</label>
                  <input
                    id="http-delete-id"
                    type="number"
                    min="1"
                    value={httpDeleteId}
                    onChange={(event) => setHttpDeleteId(event.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={isHttpSubmitting}>
                  {isHttpSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </form>
            </section>
          )}

          {httpMessage && <p className="http-message">{httpMessage}</p>}
        </section>
      )}

      {error && <p role="alert" className="error">Error: {error}</p>}
    </main>
  )
}

export default App
