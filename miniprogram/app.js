//app.js
App({
  globalData: {
    userInfo: null,
    openId: '',
    wechat: '',
    qq: '',
    cellphone: '',
    info_id: '',
    registered: false,
    authorized: false,
    gender:0
  },

  onLaunch: function () {
    let that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'carpool-2kcqi',
        traceUser: true,
      })
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })

    wx.cloud.callFunction({
      name: "wxContext"
    }).then(res => {
      that.globalData.openId = res.result.openid,
        wx.cloud.callFunction({
          name: "getInfo",
          data: {
            cloudSet: "info",
            openId: that.globalData.openId
          },
        }).then(res => {
          that.globalData.wechat = res.result.data[0].wechat
          that.globalData.qq = res.result.data[0].qq
          that.globalData.cellphone = res.result.data[0].cellphone
          that.globalData.info_id = res.result.data[0]._id
          that.globalData.authorized = res.result.data[0].authorized
          that.globalData.registered = true
          that.globalData.gender=res.result.data[0].gender
          if (that.userInfoReadyCallback) {
            that.userInfoReadyCallback()
          }
        }).catch(err => {
        })
    })
  },
})