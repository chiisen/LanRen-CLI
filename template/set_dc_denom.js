const fs = require("fs")
const clc = require("cli-color")

const { writeAlter, appendAlter, createFolder } = require("../file/file")
const { denomIndexArray } = require("../commander/denomIndexArray")
const { successColor } = require("../color/color")
const { getExcel } = require("./getExcel")
const { isNumeric } = require("../tool")

/**
 * 讀取 updateDcDenomList.xlsx
 */
function readXlsx() {
  const updateDcDenomListXlsx = `updateDcDenomList.xlsx`
  if (!fs.existsSync(updateDcDenomListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${updateDcDenomListXlsx}`)
    process.exit(1)
  }
  createSql(updateDcDenomListXlsx)
}

function denomPush(denomArray, value) {
  if (value) {
    denomArray.push(value)
  }
}

/**
 * 建立 SQL 腳本
 */
function createSql(updateDcDenomListXlsx) {
  console.log("讀取檔案: " + clc.magenta(`./${updateDcDenomListXlsx}`))

  const csvData = getExcel(updateDcDenomListXlsx)

  const subPath = createFolder(`set_dc_denom`, "updateDcDenomList")

  const nextLine = "\r\n"

  const denomAry = []
  csvData.map((x) => {
    const gameId = x[0]
    if (isNumeric(gameId)) {
      const currency = x[1]
      const defaultDenom = x[2]
      let denomArray = []
      denomPush(denomArray, x[3])
      denomPush(denomArray, x[4])
      denomPush(denomArray, x[5])
      denomPush(denomArray, x[6])
      denomPush(denomArray, x[7])
      let denomList = denomArray.join(",")
      const indexDefault = denomIndexArray(defaultDenom)
      const indexList = denomIndexArray(denomList)
      const cid = x[8]
      const data = {
        gameId,
        currency,
        indexDefault,
        indexList,
        cid,
      }
      denomAry.push(data)
    } else {
      console.log(clc.red(gameId) + " 不是數值")
    }
  })

  const insertTitleCurrency2 =
    nextLine +
    nextLine +
    `
------------------------------
-- game.game_default_currency_denom
------------------------------`
  writeAlter(subPath, insertTitleCurrency2)

  denomAry.map((x) => {
    const gameId = x.gameId
    const currency = x.currency
    const indexList = x.indexList

    const insertText = `
INSERT INTO \`game\`.\`game_currency_denom_setting\` (\`GameId\`, \`Currency\`, \`Denom\`) 
VALUES (${gameId},'${currency}',"${indexList}")
ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);`

    appendAlter(subPath, insertText)
  })

  const insertTitleCurrency =
    nextLine +
    nextLine +
    `
------------------------------
-- game.game_denom_setting
------------------------------`
  writeAlter(subPath, insertTitleCurrency)

  let currencyCount = new Map()
  let gameIdCount = new Map()

  denomAry.map((x) => {
    const gameId = x.gameId
    if (!gameIdCount.has(gameId)) {
      gameIdCount.set(gameId)
    }
    const currency = x.currency
    if (!currencyCount.has(currency)) {
      currencyCount.set(currency)
    }
    const indexList = x.indexList
    const defaultIndex = x.indexDefault
    const cid = x.cid

    const insertText = `
INSERT INTO \`game\`.\`game_denom_setting\` (\`Cid\`, \`GameId\`, \`Currency\`, \`Denom\`, \`DefaultDenomId\`) 
VALUES ("${cid}",${gameId},'${currency}',"${indexList}",${defaultIndex})
ON DUPLICATE KEY UPDATE Denom = '${indexList}', DefaultDenomId = ${defaultIndex};`

    appendAlter(subPath, insertText)
  })

  console.log(successColor(`設定多筆【遊戲幣別】完成! gameId`))
  console.log(successColor(`gameId Count=${gameIdCount.size}`))

  console.log(successColor(`currency Count=${currencyCount.size}`))
}

/**
 * 設定 dc 幣別 - 讀取 updateDcDenomList.xlsx
 * -q
 *
 * @param {*} opts[0] denom
 */
function set_dc_denom() {
  readXlsx()
}

module.exports = { set_dc_denom }
