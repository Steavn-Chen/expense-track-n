const express = require('express')
const router = express.Router()

const home = require('./modules/home.js')
const records = require('./modules/records.js')

router.use('/', home)
router.use('/records', records)

module.exports = router