if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose.js')
const Record = require('../record.js')
const recordList = require('./records.json')
const User = require('../user.js')
const Category = require('../category.js')

const SEED_USERS = [
  {
    name: 'root',
    email: 'root@example.com',
    password: '123456',
  },
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '123456',
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '123456',
  },
]

db.once('open', async () => {
  try {
    const recDataLength = 5
    SEED_USERS.forEach( async (x, index) => {
      try {
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(x.password, salt)
        let user = await User.create({ ...x, password: hash })
        const userId = user._id
        // const [categories] = await Promise.all([Category.find()])
        const categories = await Category.find()
        Array.from({ length: recDataLength }, async (_, j) => {
          try {
            const icon = categories.find(
              (i) =>
                i.category === recordList[index * recDataLength + j].category
            ).icon
            await Record.create({
              ...recordList[index * recDataLength + j],
              icon,
              userId,
            })
            if (index * recDataLength + j === recordList.length - 1) {
              console.log('insertMany records ok.')
              process.exit()
            }
          } catch (e) {
            console.warn(e)
          }
        })
      } catch(e) {
        console.warn(e)
      }
      
    })
  } catch (e) {
    console.warn(e)
  }
})
// db.once('open', () => {
//   console.log('mongodb is open')
//   recordList.forEach(async (item, index, arr) => {
//     await Record.create(item)
//     if (index === arr.length - 1) {
//       db.close()
//       console.log('insertMany records ok.')
//     }
//   })
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
// })
