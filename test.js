const array = [1, 2, 3, 4]
const iterator = array.keys()
const result = []
for (let key of iterator) {
  key = { i: key}
  console.log(key)
  result.push(key)
}
console.log('result',result)

const arr = ['aa', 'bb', 'cc', 'dd']
const iterators = arr.values()
const results =[]
for (let value of iterators) {
  value = { i: value}
  console.log(value)
  results.push(value)
}
console.log('results',results)

const ar = ['aa', 'bb', 'cc', 'dd']
const iter = ar.values()
const res = []
for (let value of iter) {
  value = { i: value }
  console.log(value)
  results.push(value)
}
console.log('results', res)