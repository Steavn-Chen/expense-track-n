const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github-oauth20').Strategy
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
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CLIENT_CALLBACK,
        profileFields: ['displayName', 'email'],
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
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
        // profileFields: ['displayName', 'email']
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        const randomPassword = Math.random().toString(36).slice(-10)
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then((hash) => {
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
          .catch((err) => done(err, false))
      }
    )
  )
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CLIENT_CALLBACK,
        profileFields: ['displayName', 'email'],
      },
      (accessToken, refreshToken, profile, done) => {
        const { emails, login } = profile._json
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then((hash) =>
            User.findOrCreate(
              {
                email: emails[0].value,
                name: login,
                password: hash,
              },
              (err, user) => {
                return done(err, user)
              }
            )
          )
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => {
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}