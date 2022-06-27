require('dotenv').config()
require('express-async-errors')

// express
const express = require('express')
const app = express()
const logger = require('./utils/logger')
// packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// database
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const orderRouter = require('./routes/orderRoutes')

// middleware handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//middleware
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(cors())

// routes
app.get('/', (req, res) => {
  res.send('E-commerce API')
})

app.get('/api/v1', (req, res) => {
  res.send('E-commerce API')
})

app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders', orderRouter)

// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// listen
const port = process.env.PORT || 1337

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      logger.info(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    logger.error(error)
  }
}

start()
