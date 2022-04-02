const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-trackerss', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection;
const Record = require('../record.js')
const recordList = require('./records.json')

db.once('open', () => {
  console.log('mongodb is open')
  recordList.forEach(async (item, index, arr) => {
    await Record.create(item)
    if (index === arr.length - 1) {
      db.close()
      console.log('insertMany records ok.')
    }
  })
  // db.close()
  // console.log('insertMany records ok.')
  //  第一種 for 迴圈
  // for (let i = 0; i < recordList.length; i++) {
  //   console.log(recordList[i], i)
  //   console.log(recordList.length - 1)
  //   await Record.create(recordList[i])
  //   // if (i === (recordList.length-1) ) {
  //   // db.close()
  //   // console.log('insertMany records ok.')
  //   // }
  // }

  // 第二種 for of 寫法
  // for (let record of recordList) {
  //   console.log(record)
  //   const { name, category, amount, icon, date } = record
  //   await Record.create({ name, category, amount, icon, date })
  // }
  // db.close()
  // console.log('insertMany records ok.')
  // setTimeout(() => {
  //   db.close()
  //   console.log('insertMany records ok.')
  //   // process.exit()
  // }, 2000)

  // 第三種 insertMany
  //   return Record.insertMany(recordList)
  //     .then(() => {
  //       db.close()
  //       console.log('insertMany records ok.')
  //     })
  //     .catch((err) => console.error(err))
})