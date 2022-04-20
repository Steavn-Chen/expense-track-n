const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.js')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    { 
      usernameField: 'email',
      passwordField: 'password' 
    }
    , 
    (email, password, done) => {
      console.log(email, password)
      User.findOne({ email })
       .then(user => {
         if (!user) {
           console.log('電子郵件尚未註冊 !')
           return done(null, false)
         }
         if (user.password !== password) {
           console.log('密碼或電子郵件錯誤 !')
           return done(null, false)
         }
         return done(null, user)
       })
       .catch(err => done(err, false))

    })
  )

  passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    console.log('id', id)
    User.findById(id)
      .then(user => {
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}