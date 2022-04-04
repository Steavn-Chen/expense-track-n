const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')
const Category = require('../../models/category.js')

const { getDate } = require('../../tools/helpers.js')

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
router.get('/:_id/edit', (req, res) => {
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
router.put('/:_id', (req, res) => {
  const _id = req.params._id
  const { name, date, amount, category } = req.body
  return Category.aggregate([
    {
      $match: { category: category },
    },
    {
      $project: { _id: 0, __v: 0, category_en: 0, category: 0 },
    },
    {
      $project: { categoryIcon: '$icon' },
    },
  ])
    .then((resultIcon) => {
      const icon = resultIcon[0].categoryIcon
      //  第一種搜尋
      return (
        Record.updateOne({ _id }, { name, date, category, icon, amount })
          // 第二種搜尋
          // return Record.updateOne({ _id }, { ...req.body, icon })
          .then((record) => {
            record.date = getDate(record.date)
            res.redirect(`/records/${_id}/edit`)
          })
          .catch((err) => console.error(err))
      )
    })
    .catch((err) => console.error(err))
})
router.delete('/:_id', (req, res) => {
  const _id = req.params._id
  return Record.deleteOne({ _id })
    .then(() => res.redirect('/'))
    .catch((err) => console.error(err))
})

module.exports = router
