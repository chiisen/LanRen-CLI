const { successColor } = require("../color/color")

/**
 * 使用 token 產生網址
 *
 * @param {string} url_token
 */
function url_token(url_token) {
  console.log(successColor(`http://api2.i8.games/pageJumper/VA/login?token=${url_token}&language=zh-CN&icon=VA`))
}

module.exports = { url_token }
