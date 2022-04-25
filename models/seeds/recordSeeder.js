if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose.js')
const recordList = require('./records.json')
const Record = require('../record.js')
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

//  async / await _2
db.once('open', async () => {
  try {
    await Promise.all(
    SEED_USERS.map(async (user, user_index) => {
      try {
        const recDataLength = 5
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)
        const createsUser = await User.create({ ...user, password: hash })
        const categories = await Category.find()
        const userRecord = []
        recordList.forEach((rest, rest_index) => {
          if (rest_index >= user_index * recDataLength && rest_index < (user_index + 1) * recDataLength) {
          const getCategory = categories.find(
            (item, _item_index) => item.category === rest.category
          )
          const icon = getCategory.icon
          const userId = createsUser._id
          rest.userId = userId
          rest.icon = icon
          userRecord.push(rest)
          }
        })
        await Record.create(userRecord)
      } catch (e) {
        console.warn(e)
      }
    })
    )
    console.log('insertMany records ok.')
    process.exit()
  } catch (e) {
    console.warn(e)
  }
})

//  async / await _1
// db.once('open', async () => {
//   try {
//     const recDataLength = 5
//     SEED_USERS.forEach(async (x, index) => {
//       try {
//         let salt = bcrypt.genSaltSync(10)
//         let hash = bcrypt.hashSync(x.password, salt)
//         let user = await User.create({ ...x, password: hash })
//         const userId = user._id
//         const categories = await Category.find()
//         Array.from({ length: recDataLength }, async (_, j) => {
//           try {
//             const icon = categories.find(
//               (i) =>
//                 i.category === recordList[index * recDataLength + j].category
//             ).icon
//             await Record.create({
//               ...recordList[index * recDataLength + j],
//               icon,
//               userId,
//             })
//             if (index * recDataLength + j === recordList.length - 1) {
//               console.log('insertMany records ok.')
//               process.exit()
//             }
//           } catch (e) {
//             console.warn(e)
//           }
//         })
//       } catch(e) {
//         console.warn(e)
//       }
//     })
//   } catch (e) {
//     console.warn(e)
//   }
// })

// Promise.all
// db.once('open', () => {
//   const recDataLength = 5
//   Promise.all(
//     SEED_USERS.map((user, user_index) => {
//       return bcrypt.genSalt(10)
//         .then(salt => bcrypt.hash(user.password, salt))
//         .then(hash => {
//           return User.create({ ...user, hash })
//       })
//       .then(user => {
//         return Category.find()
//           .then((categories) => {
//             const userRecord = []
//             recordList.forEach((rec, rec_index) => {
//               if (rec_index >= user_index * recDataLength && rec_index < (user_index + 1) * recDataLength) {
//                 const getIcon = categories.find(cate => cate.category === rec.category)
//                 rec.userId = user._id
//                 rec.icon = getIcon.icon
//                 userRecord.push(rec)
//               }
//             })
//             return Record.create(userRecord)
//           })
//       })
//     })
//   )
//     .then(([users]) => {
//       process.exit()
//   })
//     .catch(err => console.warn(err))
// })

// Promise
// db.once('open', () => {
//   const recDataLength = 5
//   new Promise((resolve, reject) => {
//     for (const [user_index, user] of SEED_USERS.entries()) {
//       bcrypt.genSalt(10)
//         .then(salt => bcrypt.hash(user.password, salt))
//         .then(hash => User.create({ ...user, password: hash }))
//         .then(user => {
//           Category.find()
//             .lean()
//             .then(categories => {
//               const userId = user.id
//               const userRecord = []
//               recordList.forEach((rest, rest_index) => {
//                 if (rest_index >= user_index * recDataLength && rest_index <  (user_index + 1) * recDataLength) {
//                   const icon = categories.find(cate => cate.category === rest.category).icon
//                   rest.userId = userId
//                   rest.icon = icon
//                   userRecord.push(rest)
//                 }
//               })
//             })
//             .then(() => {
//                   console.log('out',user_index)
//                     console.log(user_index)
//                     if (user_index >= SEED_USERS.length - 1) {
//                     return resolve()
//                   }
//                 })
//             .catch(err => reject(err))
//         })
//         .catch(err => reject(err))
//     }
//   })
//   .then(() => {
//     console.log('insertMany records ok.')
//     process.exit()
//   }).catch((err) => {
//     console.warn('insertMany records err !', err)
//     process.exit()
//   })
// })

// callback 
// db.once('open', () => {
//     const recDataLength = 5
//       for (const [index, x] of SEED_USERS.entries()) {
//       bcrypt.genSalt(10)
//         .then(salt => bcrypt.hash(x.password, salt))
//         .then(hash => User.create(
//           {
//             ...x, password: hash
//           }))
//         .then(user => {
//           Category.find()
//             .lean()
//             .then(categories => {
//               const userId = user._id
//               const userRecord = []
//               recordList.forEach((re, reIndex) => {
//               //  const icon = categories.find((i) => i.category === recordList[index * recDataLength + reIndex].category).icon
//                   // for (let reIndex = 0; reIndex < recordList.length; reIndex++) {
//                   //   if (reIndex >= index * recDataLength && reIndex < (index + 1) * recDataLength) {
//                   //     const icon = categories.find((i) => i.category === recordList[reIndex].category).icon
//                   //     recordList[reIndex].userId = userId
//                   //     recordList[reIndex].icon = icon
//                   //     userRecord.push(recordList[reIndex])
//                   //   }
//                 if (reIndex >= index * recDataLength && reIndex < (index + 1) * recDataLength) {
//                   const icon = categories.find((i) => i.category === re.category).icon
//                   re.userId = userId
//                   re.icon = icon
//                   userRecord.push(re)
//                 }
//               })
//               Record.create(userRecord, () => {
//                 if (index === SEED_USERS.length - 1) {
//                   console.log('insertMany records ok.')
//                   process.exit()
//                 }
//               // })
//                 // Array.from({ length: recDataLength }, (_, j) => {
//                 //   Record.create({
//                 //     ...recordList[index * recDataLength + j],
//                 //     icon,
//                 //     userId,
//                 //   })
//                 //   if (index * recDataLength + j === recordList.length - 1) {
//                 //     console.log('insertMany records ok.')
//                 //     process.exit()
//                 //   }
//                 // })
//             //  }
//              })
//               //  .catch(err => console.log('create Record error', err))
//             // }
//           // })
//         })
//         .catch(err => console.log('沒有拿到 category 資料',err))
//       })
//       .catch(err => console.log('create User error',err))
//   }
// })