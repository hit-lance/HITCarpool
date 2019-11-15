const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const __ = event; 
  console.log(__);
  try {
    return await db.collection('man').where({
      isDone: false,
      num: _.lte(4 - __.userNum),
      time: _.gte(__.userTime - 3 * 60 * 60 * 1000),
      time: _.lte(__.userTime + 3 * 60 * 60 * 1000),
      destination: __.userDst,
      source: __.userSrc,
      _openid: _.neq(__.openId)
    }).get()
  } catch (e) {
    console.error(e)
  }
}