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
  .option("-e | --rsa_en <decryptString>", "解密 [decryptString]")
  .option("-c | --rsa_cr <dc>", "產生指定 dc 的 RSA public/private key 檔案")
  .option("-s | --dcsetting_common <dc>", "新增通用型單錢包的 dc_setting")
  .parse()

const isDumpOption = false

const opts = program.opts()

// @note 印出 option 的參數
if (isDumpOption) {
  console.log("command option: " + inspect(opts)) // 全部一行

  for (const key in opts) {
    console.log(`command type: ${key} ${program.getOptionValue(key)}`) // 一個一行印
  }
}

if (opts.rsa_en && opts.default) {
  // `XURMCTI2iufOI1AeyIKJmn8RmOEiEZAlUJHAw+RrwE0Yb/0OswwBA6yviW6Yd6dePkSL7Q1hsgCfdRFcpPKIjvzIyNs58Hi4Ib7QtHl5qLuQUJVqenohEsYx7PWV4gbC5GPRB8uDkLJCbnDXQr1iRU9/nUgHIGBq8x5rBKjE1ejnovSEETgVGh8+HbLpMC36jJfS4dwRT7aatZ96AJED+COuAFC8icnjcssQEBnQg675wDo7vi5UrXLac8tLxEQwg61VMYjiC63xw19Vf2W/ueR3Es9B5lStREFqdf9hD5mHkjuMYWIMNhsKm60cZ48WqiArwwZsFWsINCUcDJD8WEBWqfocEVnH3nAg9GIfnIwsjEqHZxjmyatvVkF0PYwOZD8NqhWh2sv0jBpR/8WP+rwfuMVKoWdJlU6qmySHlAtektX5CHvUH2lEZh4r8xL6CrwveVi56f0O9EBaSaAUNebTgFr5jNLiJH0URqApTOHdHzqWHdaMtaebNcaTjVKKm+fEG9bFICI5r2tNDwq9tg0xFl8660mchZM1TuHkA1FDoKMVTRWbmeT9Gpgrc6dCbdOxAFyMOxktwZ706jrZuruZmnGonkd1uz1BpVoJQgYKxNTY61ObwRvc4T8BHMGoijyp7KCJh2XBSpTas4dqgtfVQtHqZ1Bu6L/Z2Tj+nNhRFc/xpqCYmzVBZKOUkivj1+BgcOClSEu4A+E1lopgvfOVLN2LYnlylgQfC77BvcPtLxoCLgCOLKbYR6+vYvUO5jJooIrVgm5guuYbKHv5gpJpsHrIVlbd0vnSgA9gBNsvzuLJmkoS+MigPGV7IouVvUVccTbd7cIqTMWqK/w+BK8R79zj4cX2OvtoPiANLb2wwM7cmv9z9/AY+HRNdNzxgTZ/fVIa0s9CKl1o27FZprcHPcwdiYAvU+EvOAEHS1WAnbmWO1c/SenZjkdCME92q+xNy/CYM7JDrDEVRcmCM8/5EhXFgE0h3oeNGYs/CJhq9ZMcZEVISyAu184GB7DB`
  // 上面可測試解密
  const decryptString = program.getOptionValue("rsa_en")

  // Load private key by dc
  const privateKey = fs.readFileSync("private.pem", { encoding: "utf8" }) // private.pem 目前是 FATCAT
  const decrypted = rsa.decrypt(privateKey, decryptString)
  console.log("decrypted=\n" + decrypted)
}

// 產生指定 dc 的 RSA public/private key 檔案與 sql script
if (opts.rsa_cr) {
  rsa.exportKey(program.getOptionValue("rsa_cr"))
}

if (opts.dcsetting_common) {
  template.dc_setting_common(program.getOptionValue("dcsetting_common"))
}
