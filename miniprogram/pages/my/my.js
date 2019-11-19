//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    auth: 0,
    userInfo: {},
    wechat: '',
    qq: '',
    cellphone: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    authorized: app.globalData.authorized
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    this.setData({
      wechat: app.globalData.wechat,
      qq: app.globalData.qq,
      cellphone: app.globalData.cellphone,
      authorized: app.globalData.authorized
    })

    console.log(app.globalData.openId)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    if(!app.globalData.registered) {
      wx.showModal({
        title: '提示',
        content: '注册成功，请填写联系方式以完成注册',
        cancelText: '取消',
        confirmText: '确认',
        success: function (res) {
          if (res.cancel) {
            //这个跳转是左边按钮的跳转链接
            wx.redirectTo({
              url: '../my/my'
            })
          } else {
            //这里是右边按钮的跳转链接
            wx.redirectTo({
              url: '../contact/contact'
            })
          }
        }
      })
      // this.goToContactPage()
    }
    }
  },

  goToContactPage: function (e) {
    wx.navigateTo({
      url: '../contact/contact',
      success: function (res) {
        console.log(res)
      }
    })
  },
  
  goToHistoryPage: function (e) {
    wx.navigateTo({
      url: '../history/history',
      success: function (res) {
        console.log(res)
      }
    })
  },

  goToAuthorizePage: function (e) {
    wx.navigateTo({
      url: '../authorize/authorize',
      success: function (res) {
        console.log(res)
      }
    })
  }
})