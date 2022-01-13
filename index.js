#!/usr/bin/env node

var program = require('commander');

program
  .version('0.1.0')
  .option('-s, --spicy', '要辣辣的, Add spicy')
  .option('-P, --no-parsley', '不要香菜, Remove parsley')
  .option('-t, --teatype [teatype]', '給我一杯 [紅茶]', '紅茶')
  .parse(process.argv);

console.log('you ordered:');
if (program.spicy)
  console.log('要辣辣');
else
  console.log('不要辣辣');

if (program.parsley)
  console.log('我要香菜');
else
  console.log('我不要香菜');
console.log('給我一杯 %s', program.teatype);