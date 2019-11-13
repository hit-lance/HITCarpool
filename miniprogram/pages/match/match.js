// pages/match/match.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    userTime: "",
    userSrc: "",
    userDst: ""
  },
  /**
   * 获取数据
   */

  getData() {
    const _ = this.data;
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        userDst: _.userDst,
        userSrc: _.userSrc,
        userTime: _.userTime,
        openid: app.globalData.openid
      },
      success: res => {
        console.log("res =", res);
        res.data.sort(function(a, b) { return Math.abs(a.time - _.userTime) - Math.abs(b.time - _.userTime); });
        this.setData({
          list: res.data
        })
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
      userTime: e.userTime,
      userSrc: e.userSrc,
      userDst: e.userDst,
      userNum: e.userNum
    })
  },

})