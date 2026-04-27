const mongoose = require('mongoose')

const shoppingCartSchema = new mongoose.Schema(
  {
    shopperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopper', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'checked_out', 'abandoned'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: 'shopping_cart',
  }
)

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema)
