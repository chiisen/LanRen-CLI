const fs = require("fs")
const clc = require("cli-color")

const { writeAlter, appendAlter, createFolder } = require("../file/file")
const { denomIndexArray } = require("../commander/denomIndexArray")
const { successColor } = require("../color/color")
const { getGameIdList } = require("./getGameIdList")
const { getExcel } = require("./getExcel")

/**
 * 讀取 updateDenomList.xlsx
 */
function readXlsx() {
  const updateDenomListXlsx = `updateDenomList.xlsx`
  if (!fs.existsSync(updateDenomListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${updateDenomListXlsx}`)
    process.exit(1)
  }
  const gameIdListXlsx = `gameIdList.xlsx`
  if (!fs.existsSync(gameIdListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${gameIdListXlsx}`)
    process.exit(1)
  }

  const gameIdList = getGameIdList(gameIdListXlsx)
  createSql(updateDenomListXlsx, gameIdList)
}

/**
 * 建立 SQL 腳本
 */
function createSql(updateDenomListXlsx, gameIdList) {
  console.log("讀取檔案: " + clc.magenta(`./${updateDenomListXlsx}`))

  const csvData = getExcel(updateDenomListXlsx)

  const subPath = createFolder(`set_denom`, "updateDenomList")

  const nextLine = "\r\n"

  const denomAry = []
  csvData.map((x) => {
    const denom = x[0]
    let denomList = x[1]
    const indexList = denomIndexArray(denomList)
    const cid = x[2]
    const data = {
      denom,
      indexList,
      cid,
    }
    denomAry.push(data)
    console.log(denom)
  })

  const insertTitleCurrency =
    nextLine +
    nextLine +
    `
------------------------------
-- game.game_denom_setting
------------------------------`
  writeAlter(subPath, insertTitleCurrency)

  denomAry.map((x) => {
    const denom = x.denom
    const indexList = x.indexList
    const defaultIndex = indexList[0]
    const cid = x.cid

    gameIdList.map((g) => {
      const insertText = `
INSERT INTO \`game\`.\`game_denom_setting\` (\`Cid\`, \`GameId\`, \`Currency\`, \`Denom\`, \`DefaultDenomId\`) 
VALUES ("${cid}",${g},'${denom}',"${indexList}",${defaultIndex})
ON DUPLICATE KEY UPDATE Denom = '${indexList}', DefaultDenomId = ${defaultIndex};`

      appendAlter(subPath, insertText)
    })

    appendAlter(subPath, nextLine)
  })

  console.log(successColor(`設定多筆【遊戲幣別】完成!`))
}

/**
 * 設定幣別 - 讀取 updateDenomList.xlsx
 * -l
 *
 * @param {*} opts[0] denom
 */
function set_denom() {
  readXlsx()
}

module.exports = { set_denom }
