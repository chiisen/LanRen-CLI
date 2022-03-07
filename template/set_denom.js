const fs = require("fs")
const clc = require("cli-color")
const { parse } = require("csv-parse")

const { writeAlter, appendAlter, writeReadme, createFolder } = require("../file/file")
const { denomIndexArray } = require("../commander/denomIndexArray")
const { warnColor, successColor } = require("../color/color")

/**
 * 讀取 denomList.csv
 * @note csv 範例: BDT,5/1|10/1|20/1|50/1|100/1
 * ':' 置換為 '/' 與 ',' 置換為 '|'
 */
 function readcsv() {
  const denomListCsv = `updateDenomList.csv`
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

      const subPath = createFolder(`set_denom`, "updateDenomList")

      const nextLine = "\r\n"

      const denomAry = []
      csvData.map((x) => {
        const strAry = x[0].split(",")
        const denom = strAry[0]
        let denomList = strAry[1]
        denomList = denomList.replace(/\//g, ":")
        denomList = denomList.replace(/\|/g, ",")
        const indexList = denomIndexArray(denomList)
        const cid = strAry[2]
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
-- game_denom_setting
------------------------------`
      appendAlter(subPath, insertTitleCurrency)

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
    })
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

  const defaultIndex = indexList.split(',')[0]

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

function isNumeric(value) {
  return /^-?\d+$/.test(value)
}

module.exports = { set_denom }
