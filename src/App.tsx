import { type FormEvent, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState<'home' | 'calculator'>('calculator')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [sum, setSum] = useState<number | null>(null)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const firstValue = Number(first)
    const secondValue = Number(second)

    if (Number.isNaN(firstValue) || Number.isNaN(secondValue)) {
      setSum(null)
      return
    }

    setSum(firstValue + secondValue)
  }

  return (
    <div className="app-page">
      <div className="app-menu">
        <button
          type="button"
          className={`menu-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          Home
        </button>
        <button
          type="button"
          className={`menu-item ${activePage === 'calculator' ? 'active' : ''}`}
          onClick={() => setActivePage('calculator')}
        >
          Sum Calculator
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
              Use the menu above to open the Sum Calculator.
            </p>
          </>
        )}

        {activePage === 'calculator' && (
          <>
            <h1>Sum Calculator</h1>
            <div className="card">
              <form onSubmit={onSubmit} className="sum-form">
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
              {sum !== null && <p>Sum: {sum}</p>}
            </div>
            <p className="read-the-docs">
              Enter two numbers and click submit to calculate the sum.
            </p>
          </>
        )}
      </main>
    </div>
  )
}

export default App
