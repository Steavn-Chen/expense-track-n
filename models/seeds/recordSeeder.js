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
