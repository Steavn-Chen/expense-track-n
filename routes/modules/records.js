const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')
const Category = require('../../models/category.js')

const { getDate, getTotal, getYear } = require('../../tools/helpers.js')

router.get('/new', (req, res) => {
  let end = new Date()
  let start = new Date()
  start = start.setDate(start.getYear() - 3650)
  start = getDate(start)
  end = getDate(end)
  const options = { start, end }
  return Category.find()
    .lean()
    .then((categories) => {
      res.render('new', { categories: categories, options })
    })
    .catch((err) => console.error(err))
})
router.post('/new', (req, res) => {
  // 第一種搜尋方式
  // return Category.findOne({ category: req.body.category})
  //  第二種搜尋方式
  return Category.aggregate([
    {
      $match: { category: req.body.category },
    },
    {
      $project: { _id: 0, __v: 0, category_en: 0, category: 0 },
    },
    {
      $project: { categoryIcon: '$icon' },
    },
  ])
    .then((category) => {
      const icon = category[0].categoryIcon
      // 第一種寫法
      return Record.create({ ...req.body, icon })
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

module.exports = router
