//contact.js

const app = getApp();
var isFilled = [false, false, false];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    disable: true,
    wximgurl: '../../icon/icon_wx.png',
    qqimgurl: '../../icon/icon_qq.png',
    phimgurl: '../../icon/icon_phone.png',
  },

  handleWechatInput: function (e) {
    console.log(e.detail.value)
    if (e.detail.value.length > 0) {
      console.log(e.detail.value)
      isFilled[0] = true
    }
    else {
      isFilled[0] = false
    }
    app.globalData.wechat = e.detail.value
    console.log("isFilled =", isFilled)
    this.setData({
      disable: !(isFilled[0] || isFilled[1] || isFilled[2])
    })
  },

  handleQQInput: function (e) {
    console.log("e =", e);
    if (e.detail.value.length > 0) {
      isFilled[1] = true
    }
    else {
      isFilled[1] = false
    }
    app.globalData.qq = e.detail.value
    console.log("isFilled =", isFilled)
    this.setData({
      disable: !(isFilled[0] || isFilled[1] || isFilled[2])
    })
  },

  handleCellphoneInput: function (e) {
    if (e.detail.value.length > 0) {
      isFilled[2] = true
    }
    else {
      isFilled[2] = false
    }
    app.globalData.cellphone = e.detail.value
    console.log("isFilled =", isFilled)
    this.setData({
      disable: !(isFilled[0] || isFilled[1] || isFilled[2])
    })
  },

  formSubmit: function (e) {
    wx.cloud.callFunction({
      name: "getInfo",
      data: {
        cloudSet: "info", 
        openId: app.globalData.openId,
        wechat: app.globalData.wechat,
        qq: app.globalData.qq,
        cellphone: app.globalData.cellphone,
      },
    }).then(res => {
      if (!res.result.data.length) {
        const db = wx.cloud.database()
        db.collection('info').add({
          data: {
            wechat: app.globalData.wechat,
            qq: app.globalData.qq,
            cellphone: app.globalData.cellphone,
            userInfo: app.globalData.userInfo,
            authorized: false
          },
          success: res => {
            wx.showModal({
              title: '提示',
              content: '注册成功，请验证学生身份以正常使用小程序功能',
              cancelText: '取消',
              confirmText: '确认',
              success: function (res) {
                if (res.cancel) {
                  //这个跳转是左边按钮的跳转链接
                  wx.switchTab({
                    url: '../my/my',
                  })
                } else {
                  //这里是右边按钮的跳转链接
                  wx.redirectTo({
                    url: '../authorize/authorize',
                  })
                }
              }
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            app.globalData.info_id = res._id
            app.globalData.registered = true
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      }
      else {
        const db = wx.cloud.database()
        db.collection("info").doc(res.result.data[0]._id).update({
          data: {
            wechat: app.globalData.wechat,
            qq: app.globalData.qq,
            cellphone: app.globalData.cellphone,
            userInfo: app.globalData.userInfo
          }
        }).then(res => {
          console.log(res)
          wx.showToast({
            title: '修改成功',
          })
          wx.switchTab({
            url: '../my/my',
          })
        }).catch(err => {
          console.error(err)
          wx.showToast({
            title: '更新记录失败',
            icon: 'none'
          })
        })
      }
    }).catch(err => { console.log(err) }
    )
  }
})