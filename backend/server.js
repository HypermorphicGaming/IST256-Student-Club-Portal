require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./db')

const eventsRoutes = require('./routes/events')
const ordersRoutes = require('./routes/orders')
const shopperRoutes = require('./routes/shopper')
const productsRoutes = require('./routes/products')
const shoppingCartRoutes = require('./routes/shopping_cart')
const returnsRoutes = require('./routes/returns')
const usersRoutes = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/events', eventsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/shopper', shopperRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/shopping_cart', shoppingCartRoutes)
app.use('/api/returns', returnsRoutes)
app.use('/api/users', usersRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
