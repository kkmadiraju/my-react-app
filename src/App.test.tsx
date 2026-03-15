import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

type Operation = 'add' | 'subtract' | 'multiply'

type MockResponseBody = {
  id: number
  firstNumber: number
  secondNumber: number
  operation: Operation
  result: number
  createdAt: string
}

const mockCalculationResponse = async (result: number, operation: Operation): Promise<Response> => {
  return {
    ok: true,
    json: async () => ({
      id: 1,
      firstNumber: 12,
      secondNumber: 8,
      operation,
      result,
      createdAt: '2026-03-14T00:00:00Z',
    } as MockResponseBody,
  } as Response
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('navigates between Home and operation pages via menu', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Add' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Welcome' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Home' }))
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Add' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Subtract' }))
    expect(screen.getByRole('heading', { name: 'Subtract' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Multiply' }))
    expect(screen.getByRole('heading', { name: 'Multiply' })).toBeInTheDocument()
  })

  it('calls backend and shows result for sum', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockResolvedValue(mockCalculationResponse(20, 'add'))
    render(<App />)

    const firstInput = screen.getByLabelText('First Number') as HTMLInputElement
    const secondInput = screen.getByLabelText('Second Number') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: 'Submit' })

    await user.clear(firstInput)
    await user.type(firstInput, '12')
    await user.clear(secondInput)
    await user.type(secondInput, '8')
    await user.click(submitButton)

    expect(await screen.findByText('Sum: 20')).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/operations',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstNumber: 12,
          secondNumber: 8,
          operation: 'add',
        }),
      }),
    )
  })

  it('calls backend and shows result for difference', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockResolvedValue(mockCalculationResponse(4, 'subtract'))
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Subtract' }))

    const firstInput = screen.getByLabelText('First Number') as HTMLInputElement
    const secondInput = screen.getByLabelText('Second Number') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: 'Submit' })

    await user.clear(firstInput)
    await user.type(firstInput, '12')
    await user.clear(secondInput)
    await user.type(secondInput, '8')
    await user.click(submitButton)

    expect(await screen.findByText('Difference: 4')).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/operations',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstNumber: 12,
          secondNumber: 8,
          operation: 'subtract',
        }),
      }),
    )
  })

  it('calls backend and shows result for product', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockResolvedValue(mockCalculationResponse(96, 'multiply'))
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Multiply' }))

    const firstInput = screen.getByLabelText('First Number') as HTMLInputElement
    const secondInput = screen.getByLabelText('Second Number') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: 'Submit' })

    await user.clear(firstInput)
    await user.type(firstInput, '12')
    await user.clear(secondInput)
    await user.type(secondInput, '8')
    await user.click(submitButton)

    expect(await screen.findByText('Product: 96')).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/operations',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstNumber: 12,
          secondNumber: 8,
          operation: 'multiply',
        }),
      }),
    )
  })
})
