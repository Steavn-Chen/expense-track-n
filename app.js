const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport.js')

const hbsHelpers = require('handlebars-helpers')
const routes = require('./routes')

require('./config/mongoose.js')

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
app.use(session({
  secret: 'expenseTrackerSecret',
  resave: false,
  saveUninitialized: true
}))

usePassport(app)
app.use((req, res, next) => {
  // console.log(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`Expense-tracker web is running on http://localhost:${port}`)
})