var str = 'aaaabbbccccddfgh'
function charCount(string) {
  //建立空的目標物件
  var counter = {}
  for (var i = 0; i < str.length; i++) {
    //對於每個目標字串的字元執行以下動作
    var v = str.charAt(i)
    if (counter[v] && counter[v].value == v) {
      //若字元已出現在 counter 中，將其count加一
      counter[v].count = ++counter[v].count
    } else {
      //若字元未出現在 counter 中，創立value為該字元、count為1的物件
      counter[v] = {}
      counter[v].count = 1
      counter[v].value = v
    }
  }
  //回傳計數器
  return counter
}
console.log(charCount(str))

// 設立一個字串
var str2 = 'aaaabbbccccddfgh'
// 設定立一個統計字串字母個數的函式
function charCount2(string) {
  // 設定結果物件
  const data = {}
  // 先把一整個字串拆成個別獨立的陣列
  const strData = string.split('')
  // 對strData執行以下動作
  strData.forEach((item, _index) => {
  // 假設字元不在 data 物件中就新增 value 為該字， count 數為 1。
    if (!data[item]) {
      data[item] = { count : 1, value : item }
    } 
    // 若字元己在 data 裡， 其中的 count 數加 1。
    else {
      data[item].count = ++ data[item].count
    }
  })
  return data

}

console.log('this 2', charCount2(str2))