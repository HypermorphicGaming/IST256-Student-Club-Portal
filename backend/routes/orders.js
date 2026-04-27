const express = require('express')
const router = express.Router()
const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const mongoose = require('mongoose')
const Order = require('../models/Order')

const ordersFilePath = path.join(__dirname, '..', 'orders.json')

const isMongoConnected = () => mongoose.connection.readyState === 1

const normalizeStatus = (status) => {
  const normalized = String(status || 'pending')
    .trim()
    .toLowerCase()
  if (normalized === 'approved' || normalized === 'declined') return normalized
  return 'pending'
}

const toOrderResponse = (orderDocument) => {
  const order = orderDocument.toObject ? orderDocument.toObject() : orderDocument
  return {
    ...order,
    id: String(order._id || order.id || ''),
    status: normalizeStatus(order.status),
  }
}

const readOrdersFromFile = async () => {
  try {
    const fileContent = await fs.readFile(ordersFilePath, 'utf8')
    const parsed = JSON.parse(fileContent || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

const writeOrdersToFile = async (orders) => {
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2))
}

const toFileOrder = (payload) => {
  const id = String(payload.id || payload._id || crypto.randomUUID())
  const dateValue = payload.date ? new Date(payload.date) : new Date()
  const date = Number.isNaN(dateValue.getTime())
    ? new Date().toISOString()
    : dateValue.toISOString()

  return {
    id,
    date,
    status: normalizeStatus(payload.status),
    customer: payload.customer && typeof payload.customer === 'object' ? payload.customer : {},
    items: Array.isArray(payload.items) ? payload.items : [],
    totalCost: Number.isFinite(Number(payload.totalCost)) ? Number(payload.totalCost) : 0,
  }
}

router.post('/', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      status: normalizeStatus(req.body?.status),
    }

    if (!isMongoConnected()) {
      const existingOrders = await readOrdersFromFile()
      const savedOrder = toFileOrder(payload)
      existingOrders.push(savedOrder)
      await writeOrdersToFile(existingOrders)
      res.status(201).json(savedOrder)
      return
    }

    const order = new Order(payload)
    const savedOrder = await order.save()
    res.status(201).json(toOrderResponse(savedOrder))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const orders = await readOrdersFromFile()
      res.json(orders.map(toOrderResponse))
      return
    }

    const orders = await Order.find()
    res.json(orders.map(toOrderResponse))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const orders = await readOrdersFromFile()
      const order = orders.find((record) => String(record.id) === String(req.params.id))
      if (!order) return res.status(404).json({ error: 'Order not found' })
      res.json(toOrderResponse(order))
      return
    }

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(toOrderResponse(order))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updatePayload = {
      ...req.body,
      ...(req.body?.status ? { status: normalizeStatus(req.body.status) } : {}),
    }

    if (!isMongoConnected()) {
      const orders = await readOrdersFromFile()
      const orderIndex = orders.findIndex((record) => String(record.id) === String(req.params.id))
      if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' })

      const updatedOrder = {
        ...orders[orderIndex],
        ...updatePayload,
        id: orders[orderIndex].id,
        status: normalizeStatus(updatePayload.status || orders[orderIndex].status),
      }

      orders[orderIndex] = updatedOrder
      await writeOrdersToFile(orders)
      res.json(toOrderResponse(updatedOrder))
      return
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    })

    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' })
    res.json(toOrderResponse(updatedOrder))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const orders = await readOrdersFromFile()
      const orderIndex = orders.findIndex((record) => String(record.id) === String(req.params.id))
      if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' })

      orders.splice(orderIndex, 1)
      await writeOrdersToFile(orders)
      res.json({ message: 'Order deleted successfully' })
      return
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.id)
    if (!deletedOrder) return res.status(404).json({ error: 'Order not found' })
    res.json({ message: 'Order deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
