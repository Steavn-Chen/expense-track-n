const express = require('express')
const router = express.Router()

const { authenticator } = require('../middleware/auth.js')

const home = require('./modules/home.js')
const records = require('./modules/records.js')
const users = require('./modules/users.js')

router.use('/users', users)
router.use('/records', authenticator, records)
router.use('/', authenticator, home)

module.exports = router