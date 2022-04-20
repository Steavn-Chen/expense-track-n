const express = require('express')
const router = express.Router()
const User = require('../../models/user.js')

router.get('/login', (req, res) => {
  res.render('login')

})
router.post('/login', (req, res) => {})

router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const { email, name, password, confirmPassword } = req.body
  User.findOne({ email })
    .then((user) => {
      if (user) {
        console.log('此帳號己被註冊.')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword,
        })
      }
      // if (password !== confirmPassword) {
      //   console.log('密碼與確認密碼不相符 !')
      //   return res.render('register', {
      //     name,
      //     email,
      //     password,
      //     confirmPassword,
      //   })
      // }
      return User.create({
        name,
        email,
        password,
      })
        .then((user) => res.redirect('/'))
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

module.exports = router