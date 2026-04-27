const mongoose = require('mongoose')

const shopperSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    emailAddress: { type: String, required: true, trim: true, unique: true, lowercase: true },
    contactAddress: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: 'shopper',
  }
)

module.exports = mongoose.model('Shopper', shopperSchema)
