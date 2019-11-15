const app = getApp();
var isFilled=[false,false,false];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    disable: true,
    wximgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%BE%AE%E4%BF%A1%20(1).png?sign=bcfccda64816d93550d3d84502a1aafa&t=1573632057',
    qqimgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/QQ.png?sign=c66cba101605f15a2d70af554c8b3585&t=1573632085',
    phimgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E6%89%8B%E6%9C%BA.png?sign=d2f71881cfbb260ce9de3c68021b90ca&t=1573569891',
    bluepointUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%8D%95%E8%89%B2%E5%9C%86%E7%82%B9.png?sign=67c6ea8d08dc8a0512d2370782108331&t=1573570041',
    greenpointUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%8D%95%E8%89%B2%E5%9C%86%E7%82%B9%20(1).png?sign=a8e3254ff21e3e1c8ab779db9820cb0f&t=1573570068',
    timeUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E6%97%B6%E9%97%B4.png?sign=4fc61cf4061c0422e4196440557e6d7e&t=1573570096',
    peopleUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E4%BA%BA.png?sign=e003d9f4efb21f53a399315366fe9624&t=1573570120'
  },

  handleWechatInput: function (e) {
    console.log(e.detail.value.length)
    if (e.detail.value.length>0) {
      isFilled[0] = true
    }
    else {
      isFilled[0] = false
    }
    app.globalData.wechat = e.detail.value
    this.setData({
      disable: !(isFilled[0] || isFilled[1] || isFilled[2])
    })
  },

  handleQQInput: function (e) {
    if (e.detail.value.length > 0) {
      isFilled[1]=true
    }
    else {
      isFilled[1] = false
    }
    app.globalData.qq = e.detail.value
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
    this.setData({
      disable: !(isFilled[0] || isFilled[1] || isFilled[2])
    })
  },

  formSubmit: function (e) {
    if ((app.globalData.qq == "") && (app.globalData.wechat == "") && (app.globalData.cellphone == "")) {
      wx.showToast({
        title: '请填联系方式',
        icon: 'none'
      })
    }
    else {
      const db = wx.cloud.database()
      console.log(e.detail)
      db.collection('user_info').add({
        data: {
          wechat: app.globalData.wechat,
          qq: app.globalData.qq,
          cellphone: app.globalData.cellphone,
          userInfo: app.globalData.userInfo,
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            counterId: res._id,
          })
          wx.showToast({
            title: '新增记录成功',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
      this.setData({
        allValue: e.detail.value
      })
    }
  }
})