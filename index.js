#!/usr/bin/env node

const { inspect } = require("util")
const rsa = require("./rsa/rsa")
const template = require("./template/dc_setting_common")

const fs = require("fs")

const program = require("commander")

program
  .version("0.0.2")
  .option("-d | --no-default", "no default, Remove default") // no- 開頭會預設 default 為 true
  .option("-demo | --demo [demoString]", "demo [demoString]", `default`) // 可以不填 demoString ，預設為 default
  .option("-e | --rsa_encrypt <decryptString>", "RSA 解密加密字串，須配合 private.pem")
  .option("-c | --rsa_create <dc>", "產生指定 dc 的 RSA public/private key 檔案")
  .option("-s | --dcsetting_common <dc>", "新增通用型單錢包的 dc_setting")
  .parse()

// 是否顯示參數內容
const isDumpOption = false
const dumpOptionType = 1

const opts = program.opts()

// @note 印出 option 的參數
if (isDumpOption) {
  if (dumpOptionType === 1) {
    console.log("command option: " + inspect(opts)) // 全部一行
  } else {
    for (const key in opts) {
      console.log(`command type: ${key} ${program.getOptionValue(key)}`) // 一個一行印
    }
  }
}

console.log(`default = ${opts.default}`)
console.log(`encrypt = ${opts.rsa_encrypt}`)
if (opts.rsa_encrypt && opts.default) {
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

// 產生指定 dc 的 RSA public/private key 檔案與 sql script
if (opts.rsa_create) {
  rsa.exportKey(`rsa_create`, program.getOptionValue("rsa_create"))
}

if (opts.dcsetting_common) {
  template.dc_setting_common(program.getOptionValue("dcsetting_common"))
}
