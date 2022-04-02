const moment = require('moment')

module.exports = {
  getDate: function(date) {
    return moment(date).format('YYYY-MM-DD')
  }
}