const fs = require("fs")
const clc = require("cli-color")
const { parse } = require("csv-parse")

const { warnColor, successColor } = require("../color/color")
const { writeAlter, appendAlter, writeReadme, createFolder } = require("../file/file")
const { denomIndexArray } = require("../commander/denomIndexArray")

/**
 * 讀取 denomList.csv
 * @note csv 範例: BDT,5/1|10/1|20/1|50/1|100/1
 * ':' 置換為 '/' 與 ',' 置換為 '|'
 */
function readcsv() {
  const denomListCsv = `denomList.csv`
  if (!fs.existsSync(denomListCsv)) {
    console.error(`\n 讀檔失敗，找不到 ${denomListCsv}`)
    process.exit(1)
  }
  const gameListCsv = `gameList.csv`
  if (!fs.existsSync(gameListCsv)) {
    console.error(`\n 讀檔失敗，找不到 ${gameListCsv}`)
    process.exit(1)
  }

  console.log(clc.cyan("csv-parse start(gameList)"))

  const gameIdList = []
  fs.createReadStream(`./${gameListCsv}`)
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow) {
      //do something with csvrow
      if (isNumeric(csvrow)) {
        gameIdList.push(csvrow)
        console.log(csvrow)
      } else {
        console.log(clc.red(csvrow) + " 不是數值")
      }
      //console.log(csvrow)
    })
    .on("end", function () {
      //do something with csvData
      console.log(clc.cyan("csv-parse end(gameList)"))

      createDenomList(denomListCsv, gameIdList)
    })
}

/**
 *
 */
function createDenomList(denomListCsv, gameIdList) {
  console.log("讀取檔案: " + clc.magenta(`./${denomListCsv}`))

  console.log(clc.cyan("csv-parse start"))

  const csvData = []
  fs.createReadStream(`./${denomListCsv}`)
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow) {
      //do something with csvrow
      csvData.push(csvrow)
      //console.log(csvrow)
    })
    .on("end", function () {
      //do something with csvData
      console.log(clc.cyan("csv-parse end"))

      const subPath = createFolder(`add_denom`, "denomList")
      Readme(subPath)

      const nextLine = "\r\n"
      const insertTitleDefault = `
------------------------------
-- game_default_currency_denom
------------------------------`
      writeAlter(subPath, insertTitleDefault)

      const denomAry = []
      csvData.map((x) => {
        const strAry = x[0].split(",")
        const denom = strAry[0]
        let denomList = strAry[1]
        denomList = denomList.replace(/\//g, ":")
        denomList = denomList.replace(/\|/g, ",")
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
    })
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
 * 新增幣別
 *
 * @param {*} opts[0] denom
 */
function add_denom(opts) {
  const denom = opts[0]
  if (denom === "readcsv") {
    readcsv()
    return //@note 由於是非同步處理，所以不能在執行完馬上呼叫 process.exit(1)
  }
  if (denom == undefined) {
    console.error(`請輸入新增幣別`)
    process.exit(1)
  }
  const gameListCsv = `gameList.csv`
  const indexList = opts[1]
  if (indexList == undefined) {
    console.error(`請輸入面額索引列表`)
    process.exit(1)
  }

  if (!fs.existsSync(gameListCsv)) {
    console.error(`\n 讀檔失敗，找不到 ${gameListCsv}`)
    process.exit(1)
  }

  console.log("讀取檔案: " + clc.magenta(`./${gameListCsv}`))
  fs.readFile(`./${gameListCsv}`, async (err, data) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(clc.cyan("csv-parse start"))

    const csvData = []
    fs.createReadStream(`./${gameListCsv}`)
      .pipe(parse({ delimiter: ":" }))
      .on("data", function (csvrow) {
        //do something with csvrow
        if (isNumeric(csvrow)) {
          csvData.push(csvrow)
          console.log(csvrow)
        } else {
          console.log(clc.red(csvrow) + " 不是數值")
        }
      })
      .on("end", function () {
        //do something with csvData
        console.log(clc.cyan("csv-parse end"))

        const subPath = createFolder(`add_denom`, denom)

        Readme(subPath)

        const nextLine = "\r\n"
        const insertText =
          `
-----------------------------
-- game_default_currency_denom
------------------------------
INSERT INTO \`game\`.\`game_default_currency_denom\` (\`Currency\`,\`Denom\`) VALUES ('${denom}',"${indexList}")
ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);` +
          nextLine +
          nextLine
        writeAlter(subPath, insertText)

        appendAlter(
          subPath,
          `
------------------------------
-- game_currency_denom_setting
------------------------------`
        )

        csvData.map((x) => {
          const insertText = `
INSERT INTO \`game\`.\`game_currency_denom_setting\` (\`GameId\`, \`Currency\`, \`Denom\`) 
VALUES (${x},'${denom}',"${indexList}")
ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);`
          appendAlter(subPath, insertText)
        })

        console.log(successColor(`新增【遊戲幣別:`) + warnColor(`${denom}】完成!`))
      })
  })
}

/**
 * 檢查是否為數值
 * @param {*} value
 * @returns
 */
function isNumeric(value) {
  return /^-?\d+$/.test(value)
}

module.exports = { add_denom }
