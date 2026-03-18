export async function installMockOperationsApi(page, seedOperations = []) {
  let operations = seedOperations.map((item) => ({ ...item }))
  let nextId = operations.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1

  await page.route('**/api/operations', async (route) => {
    const request = route.request()

    if (request.method() === 'GET') {
      await route.fulfill(jsonResponse(200, operations))
      return
    }

    if (request.method() === 'POST') {
      const payload = request.postDataJSON()
      const createdItem = createOperationRecord(nextId++, payload)
      operations = [createdItem, ...operations]
      await route.fulfill(jsonResponse(201, createdItem))
      return
    }

    await route.fallback()
  })

  await page.route('**/api/operations/*', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const id = Number(url.pathname.split('/').pop())
    const itemIndex = operations.findIndex((item) => item.id === id)

    if (request.method() === 'GET') {
      if (itemIndex === -1) {
        await route.fulfill(textResponse(404, `Operation ${id} not found`))
        return
      }

      await route.fulfill(jsonResponse(200, operations[itemIndex]))
      return
    }

    if (request.method() === 'PUT') {
      if (itemIndex === -1) {
        await route.fulfill(textResponse(404, `Operation ${id} not found`))
        return
      }

      const payload = request.postDataJSON()
      const updatedItem = createOperationRecord(id, payload)
      operations = operations.map((item) => (item.id === id ? updatedItem : item))
      await route.fulfill(jsonResponse(200, updatedItem))
      return
    }

    if (request.method() === 'DELETE') {
      if (itemIndex === -1) {
        await route.fulfill(textResponse(404, `Operation ${id} not found`))
        return
      }

      operations = operations.filter((item) => item.id !== id)
      await route.fulfill({
        status: 204,
        body: '',
      })
      return
    }

    await route.fallback()
  })
}

function createOperationRecord(id, payload) {
  const firstNumber = Number(payload.firstNumber)
  const secondNumber = Number(payload.secondNumber)
  const operation = String(payload.operation)

  return {
    id,
    firstNumber,
    secondNumber,
    operation,
    result: calculateResult(firstNumber, secondNumber, operation),
  }
}

function calculateResult(firstNumber, secondNumber, operation) {
  switch (operation) {
    case 'add':
      return firstNumber + secondNumber
    case 'subtract':
      return firstNumber - secondNumber
    case 'multiply':
      return firstNumber * secondNumber
    case 'divide':
      if (secondNumber === 0) {
        throw new Error('Cannot divide by zero')
      }
      return firstNumber / secondNumber
    default:
      throw new Error(`Unsupported operation: ${operation}`)
  }
}

function jsonResponse(status, body) {
  return {
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  }
}

function textResponse(status, body) {
  return {
    status,
    contentType: 'text/plain',
    body,
  }
}
