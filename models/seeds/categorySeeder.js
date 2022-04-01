const mongoose = require('mongoose')
const categoryList = require('./categories.json')
const Category = require('../category.js')
mongoose.connect('mongodb://localhost/expense-trackerss', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection


db.once('open', () => {
  console.log('mongodb is open.')
  return Category.insertMany(categoryList)
    .then(() => {
      db.close()
      console.log('insertMany categories ok.')
    })
    .catch(err => console.error(err))

})