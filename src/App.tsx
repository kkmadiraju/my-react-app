import { type FormEvent, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type OperationPage = 'home' | 'add' | 'subtract' | 'multiply'

const operationConfig = {
  add: {
    heading: 'Add',
    resultLabel: 'Sum',
    description: 'Enter two numbers and click submit to calculate the sum.',
    calculate: (first: number, second: number) => first + second,
  },
  subtract: {
    heading: 'Subtract',
    resultLabel: 'Difference',
    description: 'Enter two numbers and click submit to calculate the difference.',
    calculate: (first: number, second: number) => first - second,
  },
  multiply: {
    heading: 'Multiply',
    resultLabel: 'Product',
    description: 'Enter two numbers and click submit to calculate the product.',
    calculate: (first: number, second: number) => first * second,
  },
} as const

function App() {
  const [activePage, setActivePage] = useState<OperationPage>('add')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const firstValue = Number(first)
    const secondValue = Number(second)

    if (Number.isNaN(firstValue) || Number.isNaN(secondValue)) {
      setResult(null)
      return
    }

    if (activePage === 'home') {
      setResult(null)
      return
    }

    setResult(operationConfig[activePage].calculate(firstValue, secondValue))
  }

  const activeOperation = activePage === 'home' ? null : operationConfig[activePage]

  return (
    <div className="app-page">
      <div className="app-menu">
        <button
          type="button"
          className={`menu-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('home')
            setResult(null)
          }}
        >
          Home
        </button>
        <button
          type="button"
          className={`menu-item ${activePage === 'add' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('add')
            setResult(null)
          }}
        >
          Add
        </button>
        <button
          type="button"
          className={`menu-item ${activePage === 'subtract' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('subtract')
            setResult(null)
          }}
        >
          Subtract
        </button>
        <button
          type="button"
          className={`menu-item ${activePage === 'multiply' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('multiply')
            setResult(null)
          }}
        >
          Multiply
        </button>
      </div>
      <main>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>

        {activePage === 'home' && (
          <>
            <h1>Welcome</h1>
            <p className="read-the-docs">
              Use the menu above to open Add, Subtract, or Multiply.
            </p>
          </>
        )}

        {activeOperation !== null && (
          <>
            <h1>{activeOperation.heading}</h1>
            <div className="card">
              <form onSubmit={onSubmit} className="operation-form">
                <div>
                  <label htmlFor="first-number">First Number</label>
                  <input
                    id="first-number"
                    type="number"
                    value={first}
                    onChange={(event) => setFirst(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="second-number">Second Number</label>
                  <input
                    id="second-number"
                    type="number"
                    value={second}
                    onChange={(event) => setSecond(event.target.value)}
                    required
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
              {result !== null && <p>{activeOperation.resultLabel}: {result}</p>}
            </div>
            <p className="read-the-docs">{activeOperation.description}</p>
          </>
        )}
      </main>
    </div>
  )
}

export default App
