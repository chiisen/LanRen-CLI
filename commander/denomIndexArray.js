var clc = require("cli-color")

/**
 * 將面額字串陣列轉成數值陣列
 * @param {*} str
 */
function denomIndexArray(str) {
  const denomMap = new Map([
    ["100000:1", 1],
    ["50000:1", 2],
    ["10000:1", 3],
    ["5000:1", 4],
    ["2000:1", 5],
    ["1000:1", 6],
    ["500:1", 7],
    ["200:1", 8],
    ["100:1", 9],
    ["50:1", 10],
    ["20:1", 11],
    ["10:1", 12],
    ["5:1", 13],
    ["2:1", 14],
    ["1:1", 15],
    ["1:2", 16],
    ["1:5", 17],
    ["1:10", 18],
    ["1:20", 19],
    ["1:50", 20],
    ["1:100", 21],
    ["1:200", 22],
    ["1:500", 23],
    ["1:1000", 24],
    ["1:2000", 25],
    ["1:5000", 26],
    ["1:10000", 27],
    ["1:50000", 28],
    ["1:100000", 29],
  ])

  const arr = str.split(",")
  const IdxArr = arr.map((x) => {
    const ret = denomMap.get(x)
    if (ret === undefined) {
      console.log(clc.magenta("找不到面額: ") + clc.red(x))
    }
    return ret
  })

  console.log("面額索引陣列: " + clc.yellow(IdxArr))
}

/**
 * 將面額數值陣列轉成字串陣列
 * @param {*} str
 */
 function denomArray(str) {
  const denomMap = new Map([
    [1,"100000:1"],
    [2,"50000:1"],
    [3,"10000:1"],
    [4,"5000:1"],
    [5,"2000:1"],
    [6,"1000:1"],
    [7,"500:1"],
    [8,"200:1"],
    [9,"100:1"],
    [10,"50:1"],
    [11,"20:1"],
    [12,"10:1"],
    [13,"5:1"],
    [14,"2:1"],
    [15,"1:1"],
    [16,"1:2"],
    [17,"1:5"],
    [18,"1:10"],
    [19,"1:20"],
    [20,"1:50"],
    [21,"1:100"],
    [22,"1:200"],
    [23,"1:500"],
    [24,"1:1000"],
    [25,"1:2000"],
    [26,"1:5000"],
    [27,"1:10000"],
    [28,"1:50000"],
    [29,"1:100000"],
  ])

  const arr = str.split(",")
  const IdxArr = arr.map((x) => {
    var n = Number(x)
    const ret = denomMap.get(n)
    if (ret === undefined) {
      console.log(clc.magenta("找不到面額索引: ") + clc.red(x))
    }
    return `"${ret}"`
  })

  console.log("面額陣列: " + clc.yellow(IdxArr))
}

module.exports = { denomIndexArray, denomArray }
