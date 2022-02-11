function errorColor(str) {
  // 添加 ANSI 转义字符，以将文本输出为红色
  return `\x1b[31m${str}\x1b[0m`
}

function warnColor(str) {
  return `\x1b[33m${str}\x1b[0m`
}

function successColor(str) {
  return `\x1b[32m${str}\x1b[0m`
}

module.exports = { errorColor, warnColor, successColor }
