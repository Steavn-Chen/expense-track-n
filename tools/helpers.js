const moment = require('moment')

module.exports = {
  getDate: function (date) {
    return moment(date).format('YYYY-MM-DD')
  },
  getTotal: function (records) {
    let result = 0
    records.forEach((i) => (result += i.amount))
    return result
  },
  getYear: function (records) {
    let result = []
    if (records.length === 0) {
      return 0
    }
    records.forEach(i => {
      const isCheck = result.includes(moment(i.date).format('YYYY'))
      if (!isCheck) {
        result.push(moment(i.date).format('YYYY'))
      }
    })
    result = result.map(i => (i = { value: i })).sort((a, b) => b - a)
    return result
  }
}