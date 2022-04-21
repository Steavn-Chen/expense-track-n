const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
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
          //  return done(null, false, { type: 'error', message: '電子郵件尚未註冊。' })
          //  return done(null, false, req.flash('error_msg', '電子郵件尚未註冊 !'))
           return done(null, false, { message: '電子郵件尚未註冊 !' })
         }
         return bcrypt.compare(password, user.password)
           .then(isMatch => {
             if (!isMatch) {
                // return done(null, false, { type: 'error', message: '密碼或電子郵件錯誤。' })
          //  return done(null, false, req.flash('error_msg', '密碼或電子郵件錯誤'))
               return done(null, false, { message: '密碼或電子郵件錯誤 !' })
             }
             return done(null, user)
           })
       })
       .catch(err => done(err, false))
    })
  )
  passport.use(
    new FacebookStrategy(
      {
        clientID: '1360864341083799',
        clientSecret: '6d9977b280e494b6c25b87cd58da9371',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['displayName', 'email'],
        // profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(profile)
        const { email, name } = profile._json
        const randomPassword = Math.random().toString(36).slice(-10)
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then((hash) =>
            User.findOrCreate(
              { email },
              { email, name, password: hash },
              (err, user) => {
                return done(err, user)
              }
            )
          )
      }
    )
  )
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          '1074980343957-u9cu5sv42ret1jaq8panueg5q8hnqhc7.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3000/auth/google/callback',
        // profileFields: ['displayName', 'email']
      },
       (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        const randomPassword = Math.random().toString(36).slice(-10)
        bcrypt.genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then(hash => {
             return User.findOrCreate(
               { email },
               {
                 name,
                 email,
                 password: hash,
               }, 
               (err, user) => {
                return done(err, user)
              }
            )
          })
          .catch(err => done(err, false))
        }
  ))
  passport.serializeUser((user, done) => {
    console.log('serializeUser',user)
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    console.log('id', id)
    User.findById(id)
      .lean()
      .then(user => {
        console.log('deserializeUser', user)
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}