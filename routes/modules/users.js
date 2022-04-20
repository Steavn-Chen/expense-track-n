const express = require('express')
const { append } = require('express/lib/response')
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('login')

})
router.post('/login', (req, res) => {})

module.exports = router