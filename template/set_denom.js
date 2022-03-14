const fs = require("fs")
const clc = require("cli-color")
const { parse } = require("csv-parse")
const xlsx = require("node-xlsx") // 引入 node-xlsx 模組

const { writeAlter, appendAlter, createFolder } = require("../file/file")
const { denomIndexArray } = require("../commander/denomIndexArray")
const { warnColor, successColor } = require("../color/color")
const { isNumeric } = require("../tool")

/**
 * 讀取 updateDenomList.xlsx
 * @note excel .xlsx 範例: BDT 5:1,10:1,20:1,50:1,100:1 cid
 * ',' 置換為 '|'
 */
function readcsv() {
  const updateDenomListXlsx = `updateDenomList.xlsx`
  if (!fs.existsSync(updateDenomListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${updateDenomListXlsx}`)
    process.exit(1)
  }
  const gameListXlsx = `gameList.xlsx`
  if (!fs.existsSync(gameListXlsx)) {
    console.error(`\n 讀檔失敗，找不到 ${gameListXlsx}`)
    process.exit(1)
  }

  console.log(clc.cyan("excel-parse start(gameList)"))

  const gameIdList = []
  const sheets = xlsx.parse(gameListXlsx)
  const sheet = sheets[0]
  // 輸出每行內容
  sheet.data.forEach((row) => {
    //console.log(row)
    // 陣列格式, 根據不同的索引取數據
    if (isNumeric(row)) {
      gameIdList.push(row)
    } else {
      console.log(clc.red(row) + " 不是數值")
    }
  })

  console.log(clc.cyan("excel-parse end(gameList)"))

  createUpdateDenomList(updateDenomListXlsx, gameIdList)
}

/**
 *
 */
function createUpdateDenomList(updateDenomListXlsx, gameIdList) {
  console.log("讀取檔案: " + clc.magenta(`./${updateDenomListXlsx}`))

  console.log(clc.cyan("excel-parse start"))

  const csvData = []
  const sheets = xlsx.parse(updateDenomListXlsx)
  const sheet = sheets[0]
  // 輸出每行內容
  sheet.data.forEach((row) => {
    console.log(row)
    // 陣列格式, 根據不同的索引取數據
    csvData.push(row)
  })

  console.log(clc.cyan("excel-parse end"))

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

  console.log(successColor(`新增多筆【遊戲幣別】完成!`))
}

/**
 * 新增幣別
 *
 * @param {*} opts[0] denom
 */
function set_denom(opts) {
  const denom = opts[0]
  if (denom == undefined) {
    console.error(`請輸入設定幣別`)
    process.exit(1)
  }
  if (denom === "readcsv") {
    readcsv()
    return //@note 由於是非同步處理，所以不能在執行完馬上呼叫 process.exit(1)
  }
  const denomCsv = `gameList.csv`
  const indexList = opts[1]
  if (indexList == undefined) {
    console.error(`請輸入面額索引列表`)
    process.exit(1)
  }

  const defaultIndex = indexList.split(",")[0]

  const cId = opts[2]

  if (!fs.existsSync(denomCsv)) {
    console.error(`\n 讀檔失敗，找不到 ${denomCsv}`)
    process.exit(1)
  }

  fs.readFile(`./${denomCsv}`, async (err, data) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(clc.cyan("csv-parse start"))

    const csvData = []
    fs.createReadStream(`./${denomCsv}`)
      .pipe(parse({ delimiter: ":" }))
      .on("data", function (csvrow) {
        //console.log(csvrow)
        //do something with csvrow
        csvData.push(csvrow)
      })
      .on("end", function () {
        //do something with csvData
        //console.log(csvData)

        console.log(clc.cyan("csv-parse end"))

        const rootPath = `set_denom`
        const path = `./${rootPath}`
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path)
        }

        let subPath = `${path}/${denom}`
        let count = 0
        do {
          if (!fs.existsSync(subPath)) {
            fs.mkdirSync(subPath)
          } else {
            count += 1
            subPath += `-${count}`
            continue
          }
        } while (!fs.existsSync(subPath))

        const nextLine = "\r\n"

        fs.writeFileSync(`${subPath}/alter.sql`, `-- 設定幣別` + nextLine + nextLine, "utf8")

        csvData.map((x) => {
          if (isNumeric(x)) {
            fs.appendFileSync(
              `${subPath}/alter.sql`,
              `INSERT INTO game.game_denom_setting(Cid, GameId, Currency, Denom, DefaultDenomId) 
          VALUES('${cId}','${x}', '${denom}',  '${indexList}', ${defaultIndex}  ) 
          ON DUPLICATE KEY UPDATE Denom = '${indexList}', DefaultDenomId = '${defaultIndex}';` +
                nextLine +
                nextLine
            )
          }
        })

        console.log(successColor(`設定【遊戲幣別:`) + warnColor(`${denom}】完成!`))
      })
  })
}

module.exports = { set_denom }
