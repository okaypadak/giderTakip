const mongoose = require('mongoose')

const cycleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  start: {
    type: Date,
    required: true
  },
  durationDays: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('Cycle', cycleSchema)
