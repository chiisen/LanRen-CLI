const fs = require("fs")
const clc = require("cli-color")

const { successColor } = require("../color/color")
const { writeAlter, appendAlter, writeReadme, createFolder } = require("../file/file")
const { denomIndexArray } = require("../commander/denomIndexArray")
const { getGameIdList } = require("./getGameIdList")
const { getExcel } = require("./getExcel")

/**
 * 讀取 denomList.xlsx
 */
function readXlsx() {
  const denomListXlsx = `denomList.xlsx`
  if (!fs.existsSync(denomListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${denomListXlsx}`)
    process.exit(1)
  }
  const gameIdListXlsx = `gameIdList.xlsx`
  if (!fs.existsSync(gameIdListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${gameIdListXlsx}`)
    process.exit(1)
  }

  const gameIdList = getGameIdList(gameIdListXlsx)
  createSql(denomListXlsx, gameIdList)
}

/**
 * 建立 SQL 腳本
 */
function createSql(denomListXlsx, gameIdList) {
  console.log("讀取檔案: " + clc.magenta(`./${denomListXlsx}`))

  const denomListData = getExcel(denomListXlsx)
  const subPath = createFolder(`add_denom`, "denomList")
  Readme(subPath)

  const nextLine = "\r\n"
  const insertTitleDefault = `
------------------------------
-- game_default_currency_denom
------------------------------`
  writeAlter(subPath, insertTitleDefault)

  const denomAry = []
  denomListData.map((x) => {
    const denom = x[0]
    let denomList = x[1]
    const indexList = denomIndexArray(denomList)
    const data = {
      denom,
      indexList,
    }
    denomAry.push(data)
    console.log(denom)

    const insertText = `
INSERT INTO \`game\`.\`game_default_currency_denom\` (\`Currency\`,\`Denom\`) VALUES ('${denom}',"${indexList}")
ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);`

    appendAlter(subPath, insertText)
  })

  const insertTitleCurrency =
    nextLine +
    nextLine +
    `
------------------------------
-- game_currency_denom_setting
------------------------------`
  appendAlter(subPath, insertTitleCurrency)

  denomAry.map((x) => {
    const denom = x.denom
    const indexList = x.indexList

    gameIdList.map((g) => {
      const insertText = `
INSERT INTO \`game\`.\`game_currency_denom_setting\` (\`GameId\`, \`Currency\`, \`Denom\`) 
VALUES (${g},'${denom}',"${indexList}")
ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);`

      appendAlter(subPath, insertText)
    })

    appendAlter(subPath, nextLine)
  })

  console.log(successColor(`新增多筆【遊戲幣別】完成!`))
}

/**
 * 寫入 README
 * @param {string} subPath
 */
function Readme(subPath) {
  const insertText = `
請確定在後台有新增【遊戲幣別】與設定【匯率】
後台操作可以參考 http://jira.i8.games/confluence/pages/viewpage.action?pageId=27590719

請 IT 執行 alter.sql`
  writeReadme(subPath, insertText)
}

/**
 * 新增幣別 - 讀取 denomList.xlsx
 * -i
 *
 * @param {*} opts[0] denom
 */
function add_denom() {
  readXlsx()
}

module.exports = { add_denom }
