const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command

exports.main = async (event, context) => {
  // 先取出集合记录总数
  const setName = 'carpool'
  const countResult = await db.collection(setName).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  console.log(event.openId)
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(setName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
      num: _.lte(4 - event.userNum),
      time: _.and(_.gte(event.userTime - 3 * 60 * 60 * 1000), _.lte(event.userTime + 3 * 60 * 60 * 1000)),
      destination: event.userDst,
      source: event.userSrc,
      _openid: _.neq(event.openId)
    }).get()
    tasks.push(promise)
  }
  // 等待所有s
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}
