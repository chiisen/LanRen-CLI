const fs = require("fs")
const clc = require("cli-color")
const { parse } = require("csv-parse")

const { warnColor, successColor } = require("../color/color")

/**
 * 讀取 denomListCsv.csv
 * @param {*} opts
 */
function readcsv() {
  const denomListCsv = `denomList.csv`
  if (!fs.existsSync(denomListCsv)) {
    console.error(`\n 讀檔失敗，找不到 ${denomListCsv}`)
    process.exit(1)
  }

  const rootPath = `add_denom`
  const path = `./${rootPath}`
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  const denom = "denomList"
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

  console.log("建立目錄: " + subPath)

  README(fs, subPath)

  if (!fs.existsSync(`./${denomListCsv}`)) {
    console.log("檔案不存在: " + `./${denomListCsv}`)
  }

  console.log("讀取檔案: " + `./${denomListCsv}`)
  fs.readFile(`./${denomListCsv}`, async (err, data) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(clc.cyan("csv-parse start"))

    const csvData = []
    fs.createReadStream(`./${denomListCsv}`)
      .pipe(parse({ delimiter: ":" }))
      .on("data", function (csvrow) {
        //do something with csvrow
        csvData.push(csvrow)
        console.log(csvrow)
      })
      .on("end", function () {
        //do something with csvData
        console.log(clc.cyan("csv-parse end"))
      })
  })

  console.log(successColor(`新增多筆【遊戲幣別】完成!`))
}

/**
 * 寫入 README
 * @param {*} opts
 */
function README(fs, subPath) {
  fs.writeFileSync(
    `${subPath}/README.md`,
    `請確定在後台有新增【遊戲幣別】與設定【匯率】
後台操作可以參考 http://jira.i8.games/confluence/pages/viewpage.action?pageId=27590719

請 IT 執行 alter.sql`,
    "utf8"
  )
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
    process.exit(1)
  }
  if (denom == undefined) {
    console.error(`請輸入新增幣別`)
    process.exit(1)
  }
  const denomCsv = `gameList.csv`
  const indexList = opts[1]
  if (indexList == undefined) {
    console.error(`請輸入面額索引列表`)
    process.exit(1)
  }

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
        //do something with csvrow
        csvData.push(csvrow)
      })
      .on("end", function () {
        //do something with csvData
        console.log(clc.cyan("csv-parse end"))

        const rootPath = `add_denom`
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

        README(fs, subPath)

        const nextLine = "\r\n"
        fs.writeFileSync(
          `${subPath}/alter.sql`,
          `INSERT INTO \`game\`.\`game_default_currency_denom\` (\`Currency\`,\`Denom\`) VALUES ('${denom}',"${indexList}")
ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);` +
            nextLine +
            nextLine,
          "utf8"
        )

        csvData.map((x) => {
          if (isNumeric(x)) {
            fs.appendFileSync(
              `${subPath}/alter.sql`,
              `INSERT INTO \`game\`.\`game_currency_denom_setting\` (\`GameId\`, \`Currency\`, \`Denom\`) 
  VALUES (${x},'${denom}',"${indexList}")
  ON DUPLICATE KEY UPDATE \`Denom\` = VALUES(\`Denom\`);` +
                nextLine +
                nextLine
            )
          }
        })

        console.log(successColor(`新增【遊戲幣別:`) + warnColor(`${denom}】完成!`))
      })
  })
}

function isNumeric(value) {
  return /^-?\d+$/.test(value)
}

module.exports = { add_denom }
