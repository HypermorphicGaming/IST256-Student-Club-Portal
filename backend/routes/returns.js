const express = require('express')
const router = express.Router()
const Return = require('../models/Return')

router.post('/', async (req, res) => {
  try {
    const returnRecord = new Return(req.body)
    const savedReturn = await returnRecord.save()
    const populatedReturn = await savedReturn.populate(['shopperId', 'productId'])
    res.status(201).json(populatedReturn)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const returns = await Return.find().populate(['shopperId', 'productId'])
    res.json(returns)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const returnRecord = await Return.findById(req.params.id).populate(['shopperId', 'productId'])
    if (!returnRecord) return res.status(404).json({ error: 'Return not found' })
    res.json(returnRecord)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updatedReturn = await Return.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(['shopperId', 'productId'])
    if (!updatedReturn) return res.status(404).json({ error: 'Return not found' })
    res.json(updatedReturn)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedReturn = await Return.findByIdAndDelete(req.params.id)
    if (!deletedReturn) return res.status(404).json({ error: 'Return not found' })
    res.json({ message: 'Return deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
