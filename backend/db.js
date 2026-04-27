const mongoose = require('mongoose')

const requiredCollections = ['shopper', 'products', 'shopping_cart', 'returns']

const ensureRequiredCollections = async () => {
  const existingCollections = await mongoose.connection.db.listCollections().toArray()
  const existingCollectionNames = new Set(existingCollections.map((entry) => entry.name))

  for (const collectionName of requiredCollections) {
    if (!existingCollectionNames.has(collectionName)) {
      await mongoose.connection.db.createCollection(collectionName)
    }
  }
}

const connectDB = async () => {
  try {
    // Falls back to a local mongodb instance if MONGODB_URI is not present in .env
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-club-portal'
    const conn = await mongoose.connect(connUri)
    await ensureRequiredCollections()
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    // Keep the API running even if MongoDB is unavailable.
    console.error(`Error connecting to MongoDB: ${error.message}`)
    console.warn('Continuing without MongoDB. Falling back to local order storage where supported.')
    return false
  }
}

module.exports = connectDB
