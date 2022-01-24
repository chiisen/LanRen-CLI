#!/usr/bin/env node

const { inspect } = require("util")
const rsa = require("./rsa/rsa")
const { dc_setting_common } = require("./template/dc_setting_common")
const { dc_setting_update_endpoint } = require("./template/dc_setting_update_endpoint")

const fs = require("fs")

const program = require("commander")

program
  .version("0.0.4")
  .name("LanRen-CLI") // 專案名稱
  .usage("-[命令參數] '副參數1' '副參數2' ...") // 使用說明
  program.addHelpText('beforeAll', `
Example:
  $ lr -h`)
  .requiredOption("-p, --password <word>", "啟用密碼") // 必填選項
  .option("-d | --no-non_debug", "是否不顯示 debug 資訊") // --no- 開頭會預設 non_debug 為 true
  .option("-o | --option_type [option_type]", "顯示參數內容的格式 [option_type]", 0) // 可以不填 option_type ，預設為 0
  .option("-e | --rsa_encrypt <decryptString>", "RSA 解密加密字串，須配合 private.pem")
  .option("-c | --rsa_create <dc>", "產生指定 dc 的 RSA public/private key 檔案")
  .option("-s | --dcsetting_common <dc>", "新增通用型單錢包的 dc_setting")
  .option("-u | --dcsetting_update_endpoint <dc>", "更新 dc_setting 的 endpoint")
  .option("-n, --numbers <numbers...>", "多個數值參數")
  .option("-r, --strings <strings...>", "多個字串參數")
  .showHelpAfterError("<使用 -h 參數可以提示更多使用功能>") // 錯誤提示訊息
  .parse()

const opts = program.opts()

console.log(`是否不顯示 debug 資訊: non_debug = ${opts.non_debug} ` + (opts.non_debug ? "(不顯示)" : "(顯示)"))

/**
 * @note 印出 option 的參數
 */
if (!opts.non_debug) {
  // 顯示參數內容的格式
  console.log(`顯示參數內容的格式: opts.option_type = ${opts.option_type} `)
  if (opts.option_type === 0) {
    console.log("command option: " + inspect(opts)) // 全部一行
  } else {
    for (const key in opts) {
      console.log(`command type: ${key} ${program.getOptionValue(key)}`) // 一個一行印
    }
  }
}

/**
 * @note 必填選項-啟用密碼
 */
if (opts.password !== "9487") {
  console.log(`啟用密碼(${opts.password})錯誤!!!`)
  return
}

/**
 * @note 多個數值參數
 */
if (opts.numbers) {
  opts.numbers.map((x) => {
    console.log(`numbers=${x}`)
  })
}

/**
 * @note 多個字串參數
 */
if (opts.strings) {
  opts.strings.map((x) => {
    console.log(`strings=${x}`)
  })
}

/**
 * @note RSA 解密加密字串，須配合 private.pem
 */
if (opts.rsa_encrypt) {
  console.log(`\n 開始 RSA 解密`)
  // `XURMCTI2iufOI1AeyIKJmn8RmOEiEZAlUJHAw+RrwE0Yb/0OswwBA6yviW6Yd6dePkSL7Q1hsgCfdRFcpPKIjvzIyNs58Hi4Ib7QtHl5qLuQUJVqenohEsYx7PWV4gbC5GPRB8uDkLJCbnDXQr1iRU9/nUgHIGBq8x5rBKjE1ejnovSEETgVGh8+HbLpMC36jJfS4dwRT7aatZ96AJED+COuAFC8icnjcssQEBnQg675wDo7vi5UrXLac8tLxEQwg61VMYjiC63xw19Vf2W/ueR3Es9B5lStREFqdf9hD5mHkjuMYWIMNhsKm60cZ48WqiArwwZsFWsINCUcDJD8WEBWqfocEVnH3nAg9GIfnIwsjEqHZxjmyatvVkF0PYwOZD8NqhWh2sv0jBpR/8WP+rwfuMVKoWdJlU6qmySHlAtektX5CHvUH2lEZh4r8xL6CrwveVi56f0O9EBaSaAUNebTgFr5jNLiJH0URqApTOHdHzqWHdaMtaebNcaTjVKKm+fEG9bFICI5r2tNDwq9tg0xFl8660mchZM1TuHkA1FDoKMVTRWbmeT9Gpgrc6dCbdOxAFyMOxktwZ706jrZuruZmnGonkd1uz1BpVoJQgYKxNTY61ObwRvc4T8BHMGoijyp7KCJh2XBSpTas4dqgtfVQtHqZ1Bu6L/Z2Tj+nNhRFc/xpqCYmzVBZKOUkivj1+BgcOClSEu4A+E1lopgvfOVLN2LYnlylgQfC77BvcPtLxoCLgCOLKbYR6+vYvUO5jJooIrVgm5guuYbKHv5gpJpsHrIVlbd0vnSgA9gBNsvzuLJmkoS+MigPGV7IouVvUVccTbd7cIqTMWqK/w+BK8R79zj4cX2OvtoPiANLb2wwM7cmv9z9/AY+HRNdNzxgTZ/fVIa0s9CKl1o27FZprcHPcwdiYAvU+EvOAEHS1WAnbmWO1c/SenZjkdCME92q+xNy/CYM7JDrDEVRcmCM8/5EhXFgE0h3oeNGYs/CJhq9ZMcZEVISyAu184GB7DB`
  // 上面可測試解密
  const decryptString = program.getOptionValue("rsa_encrypt")

  // Load private key by dc
  if (!fs.existsSync("private.pem")) {
    console.error(`\n RSA 解密失敗，找不到 private.pem`)
    return
  }
  const privateKey = fs.readFileSync("private.pem", { encoding: "utf8" }) // private.pem 目前是 FATCAT
  console.log(`privateKey = \n${privateKey}`)
  const decrypted = rsa.decrypt(privateKey, decryptString)
  console.log("\ndecrypted=\n" + decrypted)
  console.log(`\n 結束 RSA 解密`)
}

/**
 * @note 產生指定 dc 的 RSA public/private key 檔案與 sql script
 */
if (opts.rsa_create) {
  rsa.exportKey(`rsa_create`, program.getOptionValue("rsa_create"))
}

/**
 * @note 新增通用型單錢包的 dc_setting
 */
if (opts.dcsetting_common) {
  dc_setting_common(program.getOptionValue("dcsetting_common"))
}

/**
 * @note 更新 dc_setting 的 endpoint
 */
if (opts.dcsetting_update_endpoint) {
  dc_setting_update_endpoint(program.getOptionValue("dcsetting_update_endpoint"))
}
