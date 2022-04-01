const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/expense-trackerss", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
const Record = require('../record.js')
const recordList = require('./records.json')

db.once('open', () => {
  console.log('mongodb is open')
  return Record.insertMany(recordList)
    .then(() => {
      db.close()
      console.log("insertMany records ok.")
    })
    .catch(err => console.error(err))
})