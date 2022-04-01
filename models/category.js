const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = new Schema({
  category_en: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Category', categorySchema)