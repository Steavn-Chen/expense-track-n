const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const hbsHelpers = require('handlebars-helpers')
const Record = require('./models/record.js')
const { getDate, getTotal, getYear } = require('./tools/helpers.js')
const routes = require('./routes')

const Category = require('./models/category.js')
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


app.engine(
  'hbs',
  exphbs({ defaultLayouts: 'main', extname: 'hbs', helpers: hbsHelpers() })
  )
app.set('view engine', 'hbs')
  
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(port, () => {
  console.log(`Expense-tracker web is running on http://localhost:${port}`)
})