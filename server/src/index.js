const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const groupRoutes = require('./routes/group')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/groups', groupRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'SplitEase API is running' })
})

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
    process.exit(1)
  })