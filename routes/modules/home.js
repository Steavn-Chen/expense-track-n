const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category.js')

const { getDate, getTotal, getYear } = require('../../tools/helpers.js')

// router.get('/', (req, res) => {
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
router.get('/', (req, res) => {
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

module.exports = router
