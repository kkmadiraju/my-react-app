import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('navigates between Home and Sum Calculator via menu', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Sum Calculator' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Welcome' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Home' }))
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Sum Calculator' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sum Calculator' }))
    expect(screen.getByRole('heading', { name: 'Sum Calculator' })).toBeInTheDocument()
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
})
