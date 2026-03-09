const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/coins', require('./routes/coins'))
app.use('/api/watchlist', require('./routes/watchlist'))
app.use('/api/portfolio', require('./routes/portfolio'))

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Crypto Tracker API is running ' })
})

// Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Connected')
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err)
    process.exit(1)
  })