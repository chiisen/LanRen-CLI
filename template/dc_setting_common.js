const fs = require("fs")
const { warnColor, successColor } = require("../color/color")

/**
 * 新增通用型單錢包的 dc_setting
 *
 * @param {*} dc
 */
function dc_setting_common(dc) {
  const rootPath = `dc_setting_common`
  const path = `./${rootPath}`
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }

  let subPath = `${path}/${dc}`
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
    `調整 ${dc} 的 dc setting 設定資料
    1. 執行 alter.sql`,
    "utf8"
  )

  fs.writeFileSync(
    `${subPath}/alter.sql`,
    `INSERT INTO \`game\`.\`dc_setting\` 
    (
     \`DC\`,
     \`ApiHandler\`,
     \`Endpoint\`,
     \`ApiKey\`,
     \`IsExternalGameToken\`,
     \`IsExternalQuota\`,
     \`IsDefaultGameSplash\`,
     \`ExtraJSON\`
     ) 
    VALUES 
    (
     '${dc}',
     'Common',
     'http://',
     NULL,
     '0',
     '1',
     '0',
     NULL
     );`,
    "utf8"
  )

  console.warn(warnColor(`內容要重新填過!`))
  console.log(successColor(`新增通用型單錢包的 dc_setting 完成!`))
}

module.exports = { dc_setting_common }
