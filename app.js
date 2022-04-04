const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const Record = require('./models/record.js')
const hbsHelpers = require('handlebars-helpers')
const { getDate, getTotal, getYear } = require('./tools/helpers.js')

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

app.engine(
  'hbs',
  exphbs({ defaultLayouts: 'main', extname: 'hbs', helpers: hbsHelpers() })
)
app.set('view engine', 'hbs')

app.use(express.static('public'))

// app.get('/', (req, res) => {
//   const monthList = Array.from({ length: 12 }, (v, i) =>  ({ value: i + 1 }))
//   // const monthList = Array.from({ length: 12 }, (v, i) => v = i + 1 )
//   return Category.aggregate([
//     {
//       $project: { id: 0, __v: 0, icon: 0, category_en: 0 }
//     }
//   ])
//     .then(categories => {
//       return Record.find()
//         .lean()
//         .sort({ date: 'asc'})
//         .then(records => {
//           records = records.map((i) => (i = { ...i, date: getDate(i.date) }))
//           const totalAmount = getTotal(records)
//           const yearList = getYear(records)
//           res.render('index', { records: records, totalAmount, year: yearList, month: monthList, categories })
//         })
//         .catch(err => console.error(err))
//     })
//     .catch(err => console.error(err))
// })
//  查詢記錄時間時段首由開始
app.get('/', (req, res) => {
  let end = new Date()
  let start = new Date()
  start = start.setDate(start.getYear() - 3650)
  start = getDate(start) 
  end = getDate(end)
  const options = { start, end }
  const monthList = Array.from({ length: 12 }, (v, i) => ({ value: i + 1 }))
  // const monthList = Array.from({ length: 12 }, (v, i) => v = i + 1 )
  return Category.aggregate([
    {
      $project: { id: 0, __v: 0, icon: 0, category_en: 0 },
    },
  ])
    .then((categories) => {
      return Record.find()
        .lean()
        .sort({ date: 'asc' })
        .then((records) => {
          records = records.map((i) => (i = { ...i, date: getDate(i.date) }))
          const totalAmount = getTotal(records)
          const yearList = getYear(records)
          res.render('index', {
            records: records,
            totalAmount,
            year: yearList,
            month: monthList,
            categories,
            options
          })
        })
        .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
})
//  查詢記錄時間時段首由結束
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
      $project: { _id: 0, __v: 0, category_en: 0, category: 0 }
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
          res.redirect('/')
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
app.get('/search', (req, res) => {
  let message
  const keyword = req.query.keyword.trim()
  if (!keyword) {
     message = '請輸入字元 !'
     res.render('error', { message })
  }
  return Category.find()
    .lean()
    .then(categories => {
      return Record.find({ name: { $regex: keyword, $options: 'i' } })
        .lean()
        .then((records) => {
          if (records.length === 0) {
            message = '沒有查詢到相閞名稱的記錄 !'
            return res.render('error', { message })
          }
          records = records.map((i) => (i = { ...i, date: getDate(i.date) }))
          const totalAmount = getTotal(records)
          res.render('index', { records, categories, totalAmount })
        })
        .catch((err) => console.error(err))
    })
    .catch(err => console.error(err))
})
app.get('/filter', (req, res) => {
  const monthList = Array.from({ length: 12 }, (v, i) => ({ value: i + 1 }))
  let message
  const options = req.query
  return Category.find()
    .lean()
    .then(categories => {
      return Record.aggregate([
        {
          $project: {
            date: '$date'
          }
        }
      ])
        .then((recordsYear) => {
          const yearList = getYear(recordsYear)
          // return Record.find({
          // })
          // .lean()
          return Record.aggregate([
            {
              $project: {
                name: '$name',
                category: '$category',
                date: '$date',
                amount: '$amount',
                icon: '$icon',
                month: { $month: '$date' },
                year: { $year: '$date' },
              },
            },
            {
              $match: {
                category: options.category ? options.category : String,
                month: options.month ? Number(options.month) : Number,
                year: options.year ? Number(options.year) : Number,
              },
            },
          ])
            .then((records) => {
              if (records.length === 0) {
                message = '沒有查詢到相關名稱的記錄 !'
                const totalAmount = 0
                return res.render('index', {
                  message,
                  options,
                  totalAmount,
                  categories,
                  month: monthList,
                  year: yearList,
                })
              }
              records = records.map(
                (i) => (i = { ...i, date: getDate(i.date) })
              )
              const totalAmount = getTotal(records)
              res.render('index', {
                records,
                categories,
                totalAmount,
                month: monthList,
                year: yearList,
                options,
              })
            })
            .catch((err) => console.error(err))
        })
        .catch((err) => console.error(err))
    })
    .catch(err => console.error(err))
})
// 測試日期寫法開頭
app.get('/filter2', (req, res) => {
  const monthList = Array.from({ length: 12 }, (v, i) => ({ value: i + 1 }))
  let message
  const startDate = new Date(req.query.startDate)
  const endDate = new Date(req.query.endDate)
  const options = req.query
  return Category.find()
    .lean()
    .then(categories => {
      return Record.aggregate([
        {
          $project: {
            date: '$date'
          }
        }
      ])
        .then((recordsYear) => {
          const yearList = getYear(recordsYear) 
          if (!options.startDate || !options.endDate ) {
            message = '請輸入開始或者最新時間 !'
            const totalAmount = 0
            return res.render('index', {
              message,
              options,
              totalAmount,
              categories,
              month: monthList,
              year: yearList,
            })
          }
          return Record.aggregate([
            {
              $project: {
                name: '$name',
                category: '$category',
                date: '$date',
                amount: '$amount',
                icon: '$icon',
                month: { $month: '$date' },
                year: { $year: '$date' },
              },
            },
            {
              $match: {
                category: options.category ? options.category : String,
                date: { $gte: startDate, $lt: endDate }
            //     month: options.month ? Number(options.month) : Number,
            //     year: options.year ? Number(options.year) : Number,
              },
            },
          ])
            .then((records) => {
              if (records.length === 0) {
                message = '沒有查詢到消費記錄 !'
                const totalAmount = 0
                return res.render('index', {
                  message,
                  options,
                  totalAmount,
                  categories,
                  month: monthList,
                  year: yearList,
                })
              }
              records = records.map(
                (i) => (i = { ...i, date: getDate(i.date) })
              )
              const totalAmount = getTotal(records)
              res.render('index', {
                records,
                categories,
                totalAmount,
                month: monthList,
                year: yearList,
                options,
              })
            })
            .catch((err) => console.error(err))
        })
        .catch(err => console.error(err))  
    })
    .catch(err => console.error(err))
})
// 測試日期寫法結尾
app.get('/records/:_id/edit', (req, res) => {
  const _id = req.params._id
  return Category.find()
    .lean()
    .then((categories) => {
      return Record.findById(_id)
        .lean()
        .then((record) => {
          record.date = getDate(record.date)
          res.render('edit', { record, categories })
        })
        .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
})
app.post('/records/:_id/edit', (req, res) => {
  const _id = req.params._id
  const { name, date, amount, category } = req.body
    return Category.aggregate([
      {
        $match: { category: category }
      },
      {
        $project: { _id: 0, __v: 0, category_en: 0, category: 0 }
      },
      {
        $project: { categoryIcon: '$icon'}
      }
    ])
    .then((resultIcon) => {
      const icon = resultIcon[0].categoryIcon
      //  第一種搜尋
      return Record.updateOne({ _id }, { name, date, category, icon, amount})
      // 第二種搜尋
      // return Record.updateOne({ _id }, { ...req.body, icon })
        .then((record) => {
          record.date = getDate(record.date)
          res.redirect(`/records/${_id}/edit`)
        })
        .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
})
app.post('/records/:_id/delete', (req, res) => {
  const _id = req.params._id
  return Record.deleteOne({ _id })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

app.listen(port, () => {
  console.log(`Expense-tracker web is running on http://localhost:${port}`)
})