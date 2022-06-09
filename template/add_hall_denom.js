const fs = require("fs")
const clc = require("cli-color")

const { successColor } = require("../color/color")
const { writeAlter, appendAlter, writeReadme, createFolder } = require("../file/file")
const { getExcel } = require("./getExcel")
const { isNumeric } = require("../tool")

/**
 * 讀取 hallDenomList.xlsx
 */
function readXlsx(currency) {
  const hallDenomListXlsx = `hallDenomList.xlsx`
  if (!fs.existsSync(hallDenomListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${hallDenomListXlsx}`)
    process.exit(1)
  }

  createSql(hallDenomListXlsx, currency)
}

/**
 * 建立 SQL 腳本
 */
function createSql(hallDenomListXlsx, currency) {
  console.log("讀取檔案: " + clc.magenta(`./${hallDenomListXlsx}`))

  const denomListData = getExcel(hallDenomListXlsx)
  const subPath = createFolder(`add_hall_denom`, currency)
  Readme(subPath, currency)

  const nextLine = "\r\n"
  const insertTitleDefault = `
------------------------------
-- currency: ${currency}
------------------------------`
  writeAlter(subPath, insertTitleDefault)

  const newCurrency = currency
  denomListData.map((x) => {
    const cid = x[0]
    const gameId = x[1]
    const currency = newCurrency // x[2]
    const denom = x[3]
    const defaultDenomId = x[4]
    const defaultPremadeBetGoldId = x[5]

    if (isNumeric(gameId)) {
      const data = {
        cid,
        gameId,
        currency,
        denom,
        defaultDenomId,
        defaultPremadeBetGoldId,
      }

      console.log(data)

      const insertText = `
  INSERT INTO \`game\`.\`game_denom_setting\` (\`Cid\`,\`GameId\`,\`Currency\`,\`Denom\`,\`DefaultDenomId\`,\`DefaultPremadeBetGoldId\`) 
  VALUES ('${cid}',${gameId},"${currency}","${denom}",${defaultDenomId},${defaultPremadeBetGoldId})
  ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`), \`DefaultDenomId\` = VALUES(\`DefaultDenomId\`), \`DefaultPremadeBetGoldId\` = VALUES(\`DefaultPremadeBetGoldId\`);` + nextLine

      appendAlter(subPath, insertText)
    }

  })

  console.log(successColor(`指定【幣別 ${currency}】設定 HALL 遊戲面額腳本建立完成!`))
  console.log(successColor(`記得替換Cid!`))
}

/**
 * 寫入 README
 * @param {string} subPath
 */
function Readme(subPath, currency) {
  const insertText = `
  指定【幣別 ${currency} 】設定 HALL 遊戲面額設定

 1.執行 alter.sql`
  writeReadme(subPath, insertText)
}

/**
 * 指定幣別設定 HALL 遊戲面額 - 讀取 hallDenomList.xlsx
 * -w
 *
 * @param {*} opts[0] currency
 */
function add_hall_denom(currency) {
  readXlsx(currency)
}

module.exports = { add_hall_denom }
