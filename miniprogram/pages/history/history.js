// pages/match/match.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyData: null,
    modalHidden: true,
    wximgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%BE%AE%E4%BF%A1%20(1).png?sign=bcfccda64816d93550d3d84502a1aafa&t=1573632057',
    qqimgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/QQ.png?sign=c66cba101605f15a2d70af554c8b3585&t=1573632085',
    phimgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E6%89%8B%E6%9C%BA.png?sign=d2f71881cfbb260ce9de3c68021b90ca&t=1573569891',
    bluepointUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%8D%95%E8%89%B2%E5%9C%86%E7%82%B9.png?sign=67c6ea8d08dc8a0512d2370782108331&t=1573570041',
    greenpointUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%8D%95%E8%89%B2%E5%9C%86%E7%82%B9%20(1).png?sign=a8e3254ff21e3e1c8ab779db9820cb0f&t=1573570068',
    timeUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E6%97%B6%E9%97%B4.png?sign=4fc61cf4061c0422e4196440557e6d7e&t=1573570096',
    peopleUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E4%BA%BA.png?sign=e003d9f4efb21f53a399315366fe9624&t=1573570120'
  },

  /**
   * 取消行程
   */
  deleteTheMessage: function (event) {
    wx.showLoading({
      title: '正在取消',
    })
    var temp = this.data.historyData
    var _id = event.currentTarget.dataset.theid;
    console.log(event)
    const db = wx.cloud.database();
    db.collection('carpool').doc(_id).remove().then(res => {
      var index = temp.findIndex(function (element) {
        return element._id == _id
      })
      temp.splice(index, 1);
      this.setData({
        historyData: temp
      })
      wx.hideLoading()
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1000
      })
    }).catch()
  },

  /**
   * 将时间戳转化为标准形式
   */

  transTime(theTime) {
    const theDate = new Date(theTime);
    var minute = theDate.getMinutes();
    if (minute == 0)
      minute = "00";
    return (theDate.getMonth() + 1) + "/" + theDate.getDate() + " " + theDate.getHours() + ":" + minute
  },
  /**
   * 获取数据
   */

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getInfo',
      data: {
        cloudSet: "carpool",
        openId: app.globalData.openId
      },
      success: res => {
        this.setData({
          historyData: ""
        })
        if (res.result && res.result.data.length) {
          var data = res.result.data, historyData = [];
          wx.cloud.callFunction({
            name: 'getInfo',
            data: {
              cloudSet: "info",
              openId: app.globalData.openId
            },
            success: res => {
              for (var idx in data) {
                historyData.push(data[idx]);
                historyData[idx].time = this.transTime(historyData[idx].time);
                historyData[idx].wechat = res.result.data[0].wechat
                historyData[idx].qq = res.result.data[0].qq
                historyData[idx].cellphone = res.result.data[0].cellphone
                historyData[idx].nickName = res.result.data[0].userInfo.nickName
                historyData[idx].gender = res.result.data[0].userInfo.gender
                historyData[idx].avatarUrl = res.result.data[0].userInfo.avatarUrl
              }
              this.setData({
                historyData: historyData
              })
              wx.hideLoading()
            },
            fail: e => {
              console.error(e);
            }
          })
        }else {
          wx.hideLoading()
        }
      },
      fail: e => {
        console.error(e);
      }
    })
  },


})