// pages/match/match.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    userTime: 0,
    userSrc: "",
    userDst: "",
    userNum: 0
  },
  /**
   * 获取数据
   */

  getData() {
    const _ = this.data;
    console.log(_);
    console.log("openId =", app.globalData.openId);
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        userDst: _.userDst,
        userSrc: _.userSrc,
        userTime: _.userTime,
        userNum: _.userNum,
        openId: app.globalData.openId
      },
      success: res => {
        if (res.result && res.result.data.length) {
          res.result.data.sort(function(a, b) { return Math.abs(a.time - _.userTime) - Math.abs(b.time - _.userTime); });
          for (var idx in res.result.data) {
            const theDate = new Date(res.result.data[idx].time);
            res.result.data[idx].time = (theDate.getMonth() + 1) + "/" + theDate.getDate() + " " + theDate.getHours() + ":" + theDate.getMinutes();
          }
          console.log("res =", res);
          this.setData({
            list: res.result.data
          })
        } else {
          wx.showToast({
            title: '您好，数据库里没有您想要的信息！',
            icon: 'none',
          })
        }
      }, 
      fail: e => {
        console.error(e);
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面安装
   */
  onLoad: function (e) {
    console.log(e);
    this.setData({
      userTime: Number(e.userTime),
      userSrc: e.userSrc,
      userDst: e.userDst,
      userNum: Number(e.userNum)
    })
  },

})