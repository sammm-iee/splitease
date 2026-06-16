const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
// These run on EVERY incoming request, in order, before your routes
app.use(cors())              // Allow cross-origin requests from your React frontend
app.use(express.json())      // Parse incoming JSON request bodies (req.body won't work without this)

// Routes (we'll add real ones soon)
app.get('/', (req, res) => {
  res.json({ message: 'SplitEase API is running' })
})

// Connect to MongoDB, then start the server
// We wait for the DB before accepting requests — good practice
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT || 5001, () => {
      console.log(`Server running on port ${process.env.PORT || 5001}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1) // Exit the process if DB fails — no point running without it
  })