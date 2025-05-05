require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlı'))
  .catch(err => console.error(err))

app.use('/api', require('./routes/auth'))
app.use('/api/expenses', require('./routes/expenses'))
app.use('/api/periods', require('./routes/periods'))
app.use('/api/cycles', require('./routes/cycles'))

app.listen(process.env.PORT, () => {
  console.log(`Sunucu çalışıyor http://localhost:${process.env.PORT}`)
})
