const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category.js')

const { getDate, getTotal, getYear } = require('../../tools/helpers.js')
const monthList = Array.from({ length: 12 }, (v, i) => ({ value: i + 1 }))
 let end = new Date()
 let start = new Date()
 start = start.setFullYear(start.getFullYear() - 10)
 start = getDate(start)
 end = getDate(end)
// const monthList = Array.from({ length: 12 }, (v, i) => v = i + 1 )

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
  // let end = new Date()
  // let start = new Date()
  // start = start.setDate(start.getYear() - 3650)
  // start = getDate(start) 
  // end = getDate(end)
  const options = { start, end }
  // const monthList = Array.from({ length: 12 }, (v, i) => ({ value: i + 1 }))
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
router.get('/search', (req, res) => {
  const options = { start, end }
  let message
  const keyword = req.query.keyword.trim()
  if (!keyword) {
    message = '請輸入字元 !'
    res.render('error', { message })
  }
  return Category.find()
    .lean()
    .then((categories) => {
      return Record.find({ name: { $regex: keyword, $options: 'i' } })
        .lean()
        .then((records) => {
          if (records.length === 0) {
            message = '沒有查詢到相閞名稱的記錄 !'
            return res.render('error', { message })
          }
          records = records.map((i) => (i = { ...i, date: getDate(i.date) }))
          const totalAmount = getTotal(records)
          res.render('index', { records, categories, totalAmount, options })
        })
        .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
})
// router.get('/filter', (req, res) => {
//   const monthList = Array.from({ length: 12 }, (v, i) => ({ value: i + 1 }))
//   let message
//   const options = req.query
//   return Category.find()
//     .lean()
//     .then((categories) => {
//       return Record.aggregate([
//         {
//           $project: {
//             date: '$date',
//           },
//         },
//       ])
//         .then((recordsYear) => {
//           const yearList = getYear(recordsYear)
//           // return Record.find({
//           // })
//           // .lean()
//           return Record.aggregate([
//             {
//               $project: {
//                 name: '$name',
//                 category: '$category',
//                 date: '$date',
//                 amount: '$amount',
//                 icon: '$icon',
//                 month: { $month: '$date' },
//                 year: { $year: '$date' },
//               },
//             },
//             {
//               $match: {
//                 category: options.category ? options.category : String,
//                 month: options.month ? Number(options.month) : Number,
//                 year: options.year ? Number(options.year) : Number,
//               },
//             },
//           ])
//             .then((records) => {
//               if (records.length === 0) {
//                 message = '沒有查詢到相關名稱的記錄 !'
//                 const totalAmount = 0
//                 return res.render('index', {
//                   message,
//                   options,
//                   totalAmount,
//                   categories,
//                   month: monthList,
//                   year: yearList,
//                 })
//               }
//               records = records.map(
//                 (i) => (i = { ...i, date: getDate(i.date) })
//               )
//               const totalAmount = getTotal(records)
//               res.render('index', {
//                 records,
//                 categories,
//                 totalAmount,
//                 month: monthList,
//                 year: yearList,
//                 options,
//               })
//             })
//             .catch((err) => console.error(err))
//         })
//         .catch((err) => console.error(err))
//     })
//     .catch((err) => console.error(err))
// })
// 測試日期寫法開頭
router.get('/filter2', (req, res) => {
  // const monthList = Array.from({ length: 12 }, (v, i) => ({ value: i + 1 }))
  let message
  const startDate = new Date(req.query.startDate)
  const endDate = new Date(req.query.endDate)
  let endDateFilter = endDate.setSeconds(endDate.getSeconds() + 86399)
  endDateFilter = new Date(endDateFilter)
  const options = {...req.query, start, end }
  console.log()
  console.log(req.query)
  console.log(startDate)
  console.log(endDateFilter)
  return Category.find()
    .lean()
    .then((categories) => {
      return Record.aggregate([
        {
          $project: {
            date: '$date',
          },
        },
      ])
        .then((recordsYear) => {
          const yearList = getYear(recordsYear)
          
          if (!options.startDate || !options.endDate) {
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
                date: { $gte: startDate, $lt: endDateFilter },
                // date: { $gte: startDate, $lt: endDate },
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
        .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
})

module.exports = router
