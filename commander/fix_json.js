const { fix_json } = require("fix-json-format")

const { successColor } = require("../color/color")

/**
 * 格式化 json 字串
 *
 * @param {string} str
 */
function fixJson(str) {
  console.log(successColor(fix_json(str)))
}

module.exports = { fixJson }
