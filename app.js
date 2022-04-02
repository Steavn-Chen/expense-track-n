const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const Record = require('./models/record.js')
// const recordList = require('./models/seeds/records.json')
// const categoryList = require('./models/seeds/categories.json')
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

app.use(bodyParser.urlencoded({ extended: true }))

app.engine('hbs', exphbs({ defaultLayouts: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  return Record.find()
    .lean()
    .then(records => {
      res.render('index', { records: records })
    })
    .catch(err => console.error(err))
})
app.get('/new', (req, res) => {
  return Category.find()
    .lean()
    .then(categories => {
      res.render('new', { categories: categories }) 
    })
    .catch(err => console.error(err))
})
app.post('/new', (req, res) => {

  // 第一種搜尋方式 
  // return Category.findOne({ category: req.body.category})
  //  第二種搜尋方式
  return Category.aggregate([
    {
      $match: { category: req.body.category } 
    }, 
    {
      $project: { _id: 0, __v: 0, category_en: 0, category:0 }
    },
    {
      $project: { categoryIcon: '$icon' }
    }
  ])
    .then((category) => {
      const icon = category[0].categoryIcon
      // 第一種寫法
      return Record.create({...req.body, icon })
        .then((record) => {
          res.render('new')
        })
        .catch((err) => console.error(err))
      // 第二種寫法
      // const newBody = Object.assign(req.body, { icon })
      // return Record.create(newBody)
      //   .then(() => res.render('new'))
      //   .catch(err => console.error(err))
      // 第三種寫法
      // return Record.create({
      //   name: req.body.name,
      //   date: req.body.date,
      //   category: req.body.category,
      //   amount: req.body.amount,
      //   icon: icon,
      // })
      //   .then(() => res.render('new'))
      //   .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
})

app.listen(port, () => {
  console.log(`Expense-tracker web is running on http://localhost:${port}`)
})