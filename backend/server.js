const express = require('express')
const cors = require('cors')
const fs = require('fs/promises')
const path = require('path')
const createOrdersRouter = require('./routes/orders')

const app = express()
const PORT = process.env.PORT || 3000
// Orders are persisted in a local JSON array file for this project.
const DATA_FILE = path.join(__dirname, 'orders.json')

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
  // Keep output pretty-printed for easier local inspection.
  await fs.writeFile(DATA_FILE, `${JSON.stringify(orders, null, 2)}\n`, 'utf8')
}

app.use('/api/orders', createOrdersRouter({ readOrders, writeOrders }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

async function startServer() {
  try {
    await ensureDataFile()
    app.listen(PORT)
  } catch (error) {
    console.error('Server startup failed:', error)
    process.exit(1)
  }
}

startServer()
