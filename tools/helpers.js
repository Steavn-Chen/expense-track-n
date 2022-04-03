const moment = require('moment')

module.exports = {
  getDate: function(date) {
    return moment(date).format('YYYY-MM-DD')
  },
  getTotal: function(records) {
    let result = 0
    records.forEach((i) => (result += i.amount))
    return result
  },
  getYear: function(records) {
    let result = []
    records.forEach(i => {
      const isCheck = result.includes(moment(i.date).format('YYYY'))
      if (!isCheck) {
        result.push(moment(i.date).format('YYYY'))
      }
    })
    // 第一種方法
    result = result.map(i => (i = { value: i }))
    return result
    // 第二種方法
    // const results = []
    // const array = result.values()
    // console.log(array)
    // for (let year of array) {
    //   console.log(year)
    //   year = { value: year}
    //   results.push(year)
    // }
    // return results
  }
}