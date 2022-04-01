const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    date: Date.now,
    default: true
  },
 amount: {
   type: Number,
   required: true
  },
  icon: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)