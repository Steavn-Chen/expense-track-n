const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user.js')

router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const { email, name, password, confirmPassword } = req.body
  const errors = []
  if (!email || !name || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填的 !' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符 !' })
  }
  if (errors.length) {
    return res.render('register', {
      email,
      name,
      password,
      confirmPassword,
      errors
    })
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.push({ message: '這個電子郵件己經被註冊了。' })
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword,
          errors
        })
      }
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => {
          req.flash('success_msg', '您註冊一個新的帳號。')
          res.redirect('/users/login')
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你己經成功登出 。')
  res.redirect('/users/login')
})

module.exports = router