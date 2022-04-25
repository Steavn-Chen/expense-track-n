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