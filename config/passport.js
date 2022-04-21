const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.js')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    { 
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false
    }
    , 
    (req, email, password, done) => {
      User.findOne({ email })
       .then(user => {
         if (!user) {
           console.log('電子郵件尚未註冊 !')
          //  return done(null, false, { type: 'error', message: '電子郵件尚未註冊。' })
          //  return done(null, false, req.flash('error_msg', '電子郵件尚未註冊 !'))
           return done(null, false, { message: '電子郵件尚未註冊 !' })
         }
         if (user.password !== password) {
           console.log('密碼或電子郵件錯誤 !')
          //  return done(null, false, { type: 'error', message: '密碼或電子郵件錯誤。' })
          //  return done(null, false, req.flash('error_msg', '密碼或電子郵件錯誤'))
           return done(null, false, { message: '密碼或電子郵件錯誤 !' })
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
      .lean()
      .then(user => {
        console.log('user',user)
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}