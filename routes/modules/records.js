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
      res.render('new', { categories, options })
    })
    .catch((err) => console.error(err))
})
router.post('/new', (req, res) => {
  const userId = req.user._id
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
      return Record.create({ ...req.body, icon, userId })
        .then((record) => {
          res.redirect('/')
        })
        .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
})
router.get('/:_id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  return Category.find()
    .lean()
    .then((categories) => {
      return Record.findOne({ _id, userId })
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
  const userId = req.user._id
  const _id = req.params._id
  const { name, date, amount, category } = req.body
  return Category.aggregate([
    {
      $match: { category }
    },
    {
      $project: { _id: 0, __v: 0, category_en: 0, category: 0 }
    },
    {
      $project: { categoryIcon: '$icon' }
    }
  ])
    .then((resultIcon) => {
      const icon = resultIcon[0].categoryIcon
      return (
        Record.updateOne({ _id, userId }, { name, date, category, icon, amount })
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
  const userId = req.user._id
  const _id = req.params._id
  return Record.deleteOne({ _id, userId })
    .then(() => res.redirect('/'))
    .catch((err) => console.error(err))
})

module.exports = router
