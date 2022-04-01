const express = require('express')
const exphbs = require('express-handlebars')
const Record = require('./models/record.js')
// const recordList = require('./models/seeds/records.json')
// const categoryList = require('./models/seeds/categories.json')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-trackerss', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb is error !')
})

db.once('open', () => {
  console.log('mongodb is connected.')
})

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayouts: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  return Record.find()
    .lean()
    .then(records => {
      res.render("index", { records: records })
    })
    .catch(err => console.error(err))
})
app.get("/new", (req, res) => {
  res.render("new")
})

app.listen(port, () => {
  console.log(`Expense-tracker web is running on http://localhost:${port}`)
})