const express = require('express')
const router = express.Router()
const ShoppingCart = require('../models/ShoppingCart')

router.post('/', async (req, res) => {
  try {
    const shoppingCart = new ShoppingCart(req.body)
    const savedCart = await shoppingCart.save()
    const populatedCart = await savedCart.populate(['shopperId', 'items.productId'])
    res.status(201).json(populatedCart)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const carts = await ShoppingCart.find().populate(['shopperId', 'items.productId'])
    res.json(carts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const cart = await ShoppingCart.findById(req.params.id).populate([
      'shopperId',
      'items.productId',
    ])
    if (!cart) return res.status(404).json({ error: 'Shopping cart not found' })
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updatedCart = await ShoppingCart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(['shopperId', 'items.productId'])
    if (!updatedCart) return res.status(404).json({ error: 'Shopping cart not found' })
    res.json(updatedCart)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedCart = await ShoppingCart.findByIdAndDelete(req.params.id)
    if (!deletedCart) return res.status(404).json({ error: 'Shopping cart not found' })
    res.json({ message: 'Shopping cart deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
