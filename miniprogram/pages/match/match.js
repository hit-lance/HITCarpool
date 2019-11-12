// pages/match/match.js
const app = getApp()
var distanceBetweenTime = [];
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
    const db = wx.cloud.database();
    const userOpenId = app.globalData.openId;
    const _ = db.command;
    console.log("userOpenId =", userOpenId);
    db.collection('man').where({
      _openid: _.neq(userOpenId),
      destination: this.data.userDst,
      source: this.data.userSrc
    }).get().then((res) => {
      console.log("succuss, res =", res);
      console.log("res.data[0]._openid =", res.data[0]._openid);
      const userTime = (new Date(this.data.userTime).getTime());
      if (res.data) {
        res.data.sort(function (a, b) {
          var ta = Math.abs((new Date(a.time).getTime()) - userTime);
          var tb = Math.abs((new Date(b.time).getTime()) - userTime);
          return ta - tb;
        });
        console.log("after sort res =", res);
        let data = res.data;
        this.setData({
          list: data
        });
      }
    }).catch(e => {
      console.error(e);
      wx.showToast({
        title: 'db fail',
        icon: 'none'
      })
    });
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
      userDst: e.userDst
    })
  },

})