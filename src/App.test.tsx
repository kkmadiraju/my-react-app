import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('navigates between Home and operation pages via menu', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Add' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Welcome' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Home' }))
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Add' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Subtract' }))
    expect(screen.getByRole('heading', { name: 'Subtract' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Multiply' }))
    expect(screen.getByRole('heading', { name: 'Multiply' })).toBeInTheDocument()
  })

  it('calculates the sum of two entered numbers', async () => {
    const user = userEvent.setup()
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
  })

  it('calculates the difference of two entered numbers', async () => {
    const user = userEvent.setup()
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
  })

  it('calculates the product of two entered numbers', async () => {
    const user = userEvent.setup()
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
  })
})
