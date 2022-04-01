const express = require('express')
const exphbs = require('express-handlebars')
const recordList = require('./records.json')
const categoryList = require("./categories.json");

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayouts: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { records: recordList })
})
app.get("/new", (req, res) => {
  res.render("new");
});

app.listen(port, () => {
  console.log(`Expense-tracker web is running on http://localhost:${port}`)
})