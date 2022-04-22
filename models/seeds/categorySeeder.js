if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category.js')
const categoryList = require('./categories.json')
const db = require('../../config/mongoose.js')

db.once('open', () => {
  console.log('mongodb is open.')
  return Category.insertMany(categoryList)
    .then(() => {
      db.close()
      console.log('insertMany categories ok.')
    })
    .catch((err) => console.error(err))
})
