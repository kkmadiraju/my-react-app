import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

type CalculationResponse = {
  id: number
  firstNumber: number
  secondNumber: number
  operation: string
  result: number
}

const historyItems: CalculationResponse[] = [
  { id: 1, firstNumber: 12, secondNumber: 7, operation: 'multiply', result: 5 },
  { id: 2, firstNumber: 3, secondNumber: 9, operation: 'add', result: 2 },
  { id: 3, firstNumber: 8, secondNumber: 4, operation: 'divide', result: 3 },
]

const mockJsonResponse = (data: CalculationResponse[]) =>
  ({
    ok: true,
    json: async () => data,
  }) as Response

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockJsonResponse(historyItems)))
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('sorts the operations history grid by column', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Operations History' }))

    const table = await screen.findByRole('table')
    const getResultValues = () =>
      within(table)
        .getAllByRole('row')
        .slice(1)
        .map((row) => within(row).getAllByRole('cell')[4].textContent)

    await waitFor(() => {
      expect(getResultValues()).toEqual(['3', '2', '5'])
    })

    const resultSortButton = screen.getByRole('button', { name: 'Sort by Result' })

    await user.click(resultSortButton)

    await waitFor(() => {
      expect(getResultValues()).toEqual(['2', '3', '5'])
    })

    await user.click(resultSortButton)

    await waitFor(() => {
      expect(getResultValues()).toEqual(['5', '3', '2'])
    })
  })
})
