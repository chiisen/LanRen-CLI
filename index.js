#!/usr/bin/env node

const { inspect } = require("util")

const program = require("commander")

program
  .version("0.0.1")
  .option("-s | --spicy <on>", "spicy, Add spicy") // <變數> 會被視作參數
  .option("-P | --no-parsley", "no parsley, Remove parsley") // no- 開頭會預設 parsley 為 true
  .option("-t | --teatype [teatype]", "給我一杯 [teatype]", "紅茶") // 可以沒有參數，最後的'紅茶'是預設值
  .option("-c | --cc <cctype>", "cc <cctype>") // 一定要填參數
  .parse()

const opts = program.opts()
console.log("command option: " + inspect(opts))

for (const key in opts) {
  console.log(`command type: ${key} ${program.getOptionValue(key)}`)
}

if (opts.spicy) console.log("spicy")

if (opts.parsley) console.log("parsley")

if (opts.teatype) {
  console.log("給我一杯 %s", opts.teatype)
} else {
  console.log("謝謝!我不渴唷!")
}

if (opts.cc) {
  console.log("cc %s", opts.cc)
} else {
  console.log("謝謝!cc!")
}
