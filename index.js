#!/usr/bin/env node

const { inspect } = require("util")
const rsa = require("./rsa/rsa")

const program = require("commander")

program
  .version("0.0.2")
  .option("-P | --no-parsley", "no parsley, Remove parsley") // no- 開頭會預設 parsley 為 true
  .option("-t | --teatype [teatype]", "給我一杯 [teatype]", "紅茶") // 可以沒有參數，最後的'紅茶'是預設值
  .option("-r | --rsacr <dc>", "產生指定 dc 的 RSA public/private key 檔案")
  .parse()

const opts = program.opts()
console.log("command option: " + inspect(opts))

for (const key in opts) {
  console.log(`command type: ${key} ${program.getOptionValue(key)}`)
}

if (opts.parsley) console.log("parsley")

if (opts.teatype) {
  console.log("給我一杯 %s", opts.teatype)
} else {
  console.log("謝謝!我不渴唷!")
}

// 產生指定 dc 的 RSA public/private key 檔案與 sql script
if (opts.rsacr) {
  rsa.exportKey(program.getOptionValue("rsacr"))
}
