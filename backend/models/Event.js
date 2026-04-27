const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventType: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Event', eventSchema)
