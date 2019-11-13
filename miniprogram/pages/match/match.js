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
  * 将时间戳转化为标准形式
  */

  transTime(theTime) {
    const theDate = new Date(theTime);
     return (theDate.getMonth() + 1) + "/" + theDate.getDate() + " " + theDate.getHours() + ":" + theDate.getMinutes();
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
        console.log("userTime =", this.data.userTime, this.transTime(this.data.userTime));
        console.log("before res =", res);
        if (res.result && res.result.data.length) {
          var data = res.result.data, lst = [];
          data.sort(function(a, b) { return Math.abs(a.time - _.userTime) - Math.abs(b.time - _.userTime); });
          for (var idx in data) 
            if (Math.abs(data[idx].time - _.userTime) <= 3 * 60 * 60 * 1000) {
              lst.push(data[idx]);
              lst[idx].time = this.transTime(data[idx].time);
            }
          if (lst.length()) {
            this.setData({
              list: lst
            })
          } else {
            wx.showToast({
              title: '您好，数据库里没有您想要的信息！',
              icon: 'none',
            })
          }
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