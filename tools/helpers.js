const moment = require('moment')

module.exports = {
  getDate: function(date) {
    return moment(date).format('YYYY-MM-DD')
  },
  getTotal: function(records) {
    let result = 0
    records.forEach((i) => (result += i.amount))
    return result
  }
}