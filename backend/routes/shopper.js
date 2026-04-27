const express = require('express')
const router = express.Router()
const Shopper = require('../models/Shopper')

router.post('/', async (req, res) => {
  try {
    const shopper = new Shopper(req.body)
    const savedShopper = await shopper.save()
    res.status(201).json(savedShopper)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const shoppers = await Shopper.find()
    res.json(shoppers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const shopper = await Shopper.findById(req.params.id)
    if (!shopper) return res.status(404).json({ error: 'Shopper not found' })
    res.json(shopper)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updatedShopper = await Shopper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updatedShopper) return res.status(404).json({ error: 'Shopper not found' })
    res.json(updatedShopper)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedShopper = await Shopper.findByIdAndDelete(req.params.id)
    if (!deletedShopper) return res.status(404).json({ error: 'Shopper not found' })
    res.json({ message: 'Shopper deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
