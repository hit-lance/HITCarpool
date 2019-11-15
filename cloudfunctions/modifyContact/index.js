const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command

exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('info').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('info').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
      _openid: _.eq(event.openId)
    }).update({
      data: {
        wechat: event.wechat,
        qq: event.qq,
        cellphone: event.cellphone,
      }
    })
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