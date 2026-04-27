const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      // Usually UUID or generated ID
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },
    // Frontend checkout payload fields.
    customer: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      address: { type: String, trim: true },
    },
    items: [
      {
        productId: { type: String, trim: true },
        description: { type: String, trim: true },
        category: { type: String, trim: true },
        unitOfMeasure: { type: String, trim: true },
        price: { type: Number, min: 0, default: 0 },
        openSeats: { type: Number, min: 0, default: 0 },
        sourceEventId: { type: String, trim: true },
      },
    ],
    totalCost: { type: Number, min: 0, default: 0 },
    // Keep legacy relational fields optional for compatibility.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
