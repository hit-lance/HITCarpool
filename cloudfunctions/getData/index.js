const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command();
exports.main = async (event, context) => {
  const __ = event.data;
  try {
    return await db.collection('todos').where({
      idDone: false,
      time: _.gt(__.userTime - 3 * 60 * 60 * 1000),
      time: _.lt(__.userTime + 3 * 60 * 60 * 1000),
      destination: __.userDst,
      source: __.userSrc,
      _openid: _.neq(__.openid)
    }).get()
  } catch (e) {
    console.error(e)
  }
}