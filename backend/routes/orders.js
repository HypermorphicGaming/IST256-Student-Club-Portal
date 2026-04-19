const { Router } = require('express')
const { randomUUID } = require('crypto')

// Orders can only be moved from pending to one of these final states.
const ALLOWED_FINAL_STATUSES = new Set(['approved', 'declined'])

function createOrdersRouter({ readOrders, writeOrders }) {
  const router = Router()

  const handleServerError = (res, message, error) => {
    console.error(message, error)
    return res.status(500).json({ error: 'Internal server error.' })
  }

  router.get('/', async (_req, res) => {
    try {
      const orders = await readOrders()
      return res.status(200).json(orders)
    } catch (error) {
      return handleServerError(res, 'Failed to read orders:', error)
    }
  })

  router.post('/', async (req, res) => {
    // Expected payload shape: { customer, items, totalCost, date }.
    const orderPayload = req.body

    if (!orderPayload || typeof orderPayload !== 'object' || Array.isArray(orderPayload)) {
      return res.status(400).json({ error: 'Invalid order payload.' })
    }

    try {
      const orders = await readOrders()
      const timestamp = new Date().toISOString()
      // Stored record shape extends the payload with canonical metadata.
      const orderRecord = {
        id: randomUUID(),
        ...orderPayload,
        status: 'pending',
        createdAt: orderPayload.date || timestamp,
        updatedAt: timestamp,
      }

      orders.push(orderRecord)
      await writeOrders(orders)
      return res.status(201).json(orderRecord)
    } catch (error) {
      return handleServerError(res, 'Failed to save order:', error)
    }
  })

  router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { status } = req.body || {}

    if (!ALLOWED_FINAL_STATUSES.has(status)) {
      return res.status(400).json({
        error: 'Invalid status. Allowed values are approved or declined.',
      })
    }

    try {
      const orders = await readOrders()
      const orderIndex = orders.findIndex((order) => String(order.id) === String(id))

      if (orderIndex < 0) {
        return res.status(404).json({ error: 'Order not found.' })
      }

      const updatedOrder = {
        ...orders[orderIndex],
        status,
        updatedAt: new Date().toISOString(),
      }

      orders[orderIndex] = updatedOrder
      await writeOrders(orders)
      return res.status(200).json(updatedOrder)
    } catch (error) {
      return handleServerError(res, 'Failed to update order status:', error)
    }
  })

  return router
}

module.exports = createOrdersRouter
