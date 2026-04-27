const mongoose = require('mongoose')

const returnSchema = new mongoose.Schema(
  {
    shopperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopper', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    reason: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'completed'],
      default: 'requested',
    },
    returnedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'returns',
  }
)

module.exports = mongoose.model('Return', returnSchema)
