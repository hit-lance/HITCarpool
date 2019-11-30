// pages/match/match.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyData: null,
    modalHidden: true,
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
              wx.hideLoading()
            }
          })
        }else {
          wx.hideLoading()
        }
      },
      fail: e => {
        console.error(e);
        wx.hideLoading()
      }
    })
  },


})