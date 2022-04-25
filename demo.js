// const user = {
//   id: 42,
//   displayName: 'jdoe',
//   fullName: {
//     firstName: 'John',
//     lastName: 'Doe'
//   }
// }

//  function userId ({ id })  {
//    return id
//  }

//  function whois({ displayName, fullName: { firstName: s } }) {
//    return `${ displayName } is ${ s }`
//  }

//  console.log(userId(user))

//  console.log(whois(user))

//  const { displayName , fullName: { firstName  }}  = user
//   console.log(displayName)

//   console.log([fullName])
// var p3 = new Promise(function (resolve, reject) {
//   // resolve('123')
//   // reject('345')
//   throw new Error('Silenced Exception!')
// })

// p3
// .then(a => console.log(a))
// .catch(function (e) {
//   console.error(e) // This is never called
// })
// console.log(123)
var a = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('hello world')
  }, 1000)
})

a.then(function (value) {
  console.log(a) // Promise {<resolved>: "hello world"}
  console.log(value + '1') // "hello world1"
})
a.then(function (value) {
  console.log(a) // Promise {<resolved>: "hello world"}
  console.log(value + '2') // "hello world2"
})

console.log(a)		
