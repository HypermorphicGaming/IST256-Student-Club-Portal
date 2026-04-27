const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    unitOfMeasure: { type: String, required: true, trim: true, default: 'item' },
    price: { type: Number, required: true, min: 0 },
    openSeats: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    timestamps: true,
    collection: 'products',
  }
)

module.exports = mongoose.model('Product', productSchema)
