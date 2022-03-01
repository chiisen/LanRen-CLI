const fs = require("fs")
const clc = require("cli-color")

const { warnColor, successColor } = require("../color/color")

/**
 * 更新幣別面額
 *
 * @param {*} opts[0] denom
 */
function update_denom(opts) {
  const denom = opts[0]
  if (denom == undefined) {
    console.error(`請輸入更新幣別`)
    process.exit(1)
  }

  const indexList = opts[1]
  if(indexList == undefined)
  {
    console.error(`請輸入面額索引列表`)
    process.exit(1)
  }

  const rootPath = `update_denom`
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

  fs.writeFileSync(
    `${subPath}/README.md`,
    `更新【遊戲幣別】
      請 IT 執行 alter.sql`,
    "utf8"
  )

  fs.writeFileSync(
    `${subPath}/alter.sql`,
    `SET SQL_SAFE_UPDATES = 0; -- (關閉)當前safe-updates模式

    UPDATE game.game_currency_denom_setting SET Denom = '${indexList}' WHERE Currency = '${denom}';
        
    SET SQL_SAFE_UPDATES = 1; -- (開啟)當前safe-updates模式`,
    "utf8"
  )

  console.log(successColor(`更新【遊戲幣別:`) + warnColor(`${denom}】完成!`))
}

module.exports = { update_denom }
