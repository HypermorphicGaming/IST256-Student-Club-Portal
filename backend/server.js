const express = require('express')
const cors = require('cors')
const fs = require('fs/promises')
const path = require('path')
const { randomUUID } = require('crypto')

const app = express()
const PORT = process.env.PORT || 3000
const DATA_FILE = path.join(__dirname, 'orders.json')
const ALLOWED_STATUSES = new Set(['pending', 'approved', 'declined'])

app.use(cors())
app.use(express.json())

async function ensureDataFile() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    if (!raw.trim()) {
      await fs.writeFile(DATA_FILE, '[]\n', 'utf8')
      return
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      await fs.writeFile(DATA_FILE, '[]\n', 'utf8')
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, '[]\n', 'utf8')
      return
    }

    throw error
  }
}

async function readOrders() {
  await ensureDataFile()
  const raw = await fs.readFile(DATA_FILE, 'utf8')
  const parsed = JSON.parse(raw || '[]')
  return Array.isArray(parsed) ? parsed : []
}

async function writeOrders(orders) {
  await fs.writeFile(DATA_FILE, `${JSON.stringify(orders, null, 2)}\n`, 'utf8')
}

function normalizeOrderPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null
  }

  return payload
}

app.get('/api/orders', async (_req, res) => {
  try {
    const orders = await readOrders()
    return res.json(orders)
  } catch (error) {
    console.error('Failed to read orders:', error)
    return res.status(500).json({ error: 'Failed to read orders.' })
  }
})

app.post('/api/orders', async (req, res) => {
  const orderPayload = normalizeOrderPayload(req.body)

  if (!orderPayload) {
    return res.status(400).json({ error: 'Invalid order payload.' })
  }

  try {
    const orders = await readOrders()
    const timestamp = new Date().toISOString()
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
    console.error('Failed to save order:', error)
    return res.status(500).json({ error: 'Failed to save order.' })
  }
})

app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}

  if (!ALLOWED_STATUSES.has(status) || status === 'pending') {
    return res.status(400).json({
      error: 'Invalid status. Allowed values are approved or declined.',
    })
  }

  try {
    const orders = await readOrders()
    const orderIndex = orders.findIndex((order) => String(order.id) === String(id))

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    const updatedOrder = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    orders[orderIndex] = updatedOrder
    await writeOrders(orders)
    return res.json(updatedOrder)
  } catch (error) {
    console.error('Failed to update order status:', error)
    return res.status(500).json({ error: 'Failed to update order status.' })
  }
})

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

async function startServer() {
  try {
    await ensureDataFile()
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error)
    process.exit(1)
  }
}

startServer()
