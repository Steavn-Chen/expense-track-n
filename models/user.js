const mongoose =  require('mongoose')
const findOrCreate = require('mongoose-find-or-create')
const Schema = mongoose.Schema
const userSchema = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.plugin(findOrCreate)

module.exports = mongoose.model('User', userSchema)