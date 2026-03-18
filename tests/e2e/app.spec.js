import { expect, test } from '@playwright/test'
import { installMockOperationsApi } from './support/mockApi.js'

const seedOperations = [
  { id: 1, firstNumber: 12, secondNumber: 7, operation: 'multiply', result: 84 },
  { id: 2, firstNumber: 3, secondNumber: 9, operation: 'add', result: 12 },
  { id: 3, firstNumber: 18, secondNumber: 6, operation: 'divide', result: 3 },
]

test('submits an operation from the calculator form', async ({ page }) => {
  await installMockOperationsApi(page, seedOperations)
  await page.goto('/')

  await page.getByLabel('First Number').fill('14')
  await page.getByLabel('Second Number').fill('6')
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page.locator('.calculator-card .result-box')).toContainText('20')

  await page.getByRole('button', { name: 'Operations History' }).click()
  await expect(page.locator('.operations-table tbody tr').first()).toContainText('20')
  await expect(page.locator('.operations-table tbody tr').first()).toContainText('add')
})

test('sorts the operations history grid by result', async ({ page }) => {
  await installMockOperationsApi(page, seedOperations)
  await page.goto('/')
  await page.getByRole('button', { name: 'Operations History' }).click()

  const rows = page.locator('.operations-table tbody tr')
  await expect(rows).toHaveCount(seedOperations.length)
  await expect(readHistoryColumn(rows, 4)).resolves.toEqual(['3', '12', '84'])

  await page.getByRole('button', { name: 'Sort by Result' }).click()
  await expect(readHistoryColumn(rows, 4)).resolves.toEqual(['3', '12', '84'])

  await page.getByRole('button', { name: 'Sort by Result' }).click()
  await expect(readHistoryColumn(rows, 4)).resolves.toEqual(['84', '12', '3'])
})

test('loads all operations in the HTTP operations view', async ({ page }) => {
  await installMockOperationsApi(page, seedOperations)
  await page.goto('/')
  await page.getByRole('button', { name: 'HTTP Operations' }).click()
  await page.getByRole('button', { name: 'Fetch all' }).click()

  await expect(page.getByText('GET all operations returned 3 items')).toBeVisible()
  await expect(page.locator('.http-method-panel tbody tr')).toHaveCount(seedOperations.length)
})

async function readHistoryColumn(rows, columnIndex) {
  return rows.evaluateAll((tableRows, index) =>
    tableRows.map((row) => row.querySelectorAll('td')[index]?.textContent?.trim() ?? ''),
  columnIndex)
}
