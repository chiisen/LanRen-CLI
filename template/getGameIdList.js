const clc = require("cli-color")
const xlsx = require("node-xlsx") // 引入 node-xlsx 模組

const { isNumeric } = require("../tool")

/**
 * 取得 gameIdList
 * 
 * @param {string} gameIdListXlsx
 */
function getGameIdList(gameIdListXlsx) {
  console.log(clc.cyan("excel-parse start(gameIdList)"))

  const gameIdList = []
  const sheets = xlsx.parse(gameIdListXlsx)
  const sheet = sheets[0]
  // 輸出每行內容
  sheet.data.forEach((row) => {
    // 陣列格式, 根據不同的索引取數據
    if (isNumeric(row)) {
      gameIdList.push(row)
    } else {
      console.log(clc.red(row) + " 不是數值")
    }
  })

  console.log(clc.cyan("excel-parse end(gameIdList)"))
  return gameIdList
}

module.exports = { getGameIdList }
