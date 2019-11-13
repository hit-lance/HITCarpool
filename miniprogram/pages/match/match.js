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
   * 计算时间差
   */
  calTime(a) {
    const userTime = (new Date(this.data.userTime).getTime());
    return Math.abs((new Date(a.time).getTime()) - userTime);
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
      if (res.data) {
        res.data.sort(function (a, b) { return calTime(a) - calTime(b); });
        console.log("after sort res =", res);
        let data = [];
        for (var idx in res.data) 
          if (calTime(res.data[idx]) <= 3 * 60 * 60 * 1000)
            data.push(res.data[idx]);
          else
            break;
        if (!data.length) {
          console.error("None");
          wx.showToast({
            title: '抱歉，数据库里没有符合要求的数据！（您可以尝试换个出发时间）',
            icon: 'none'
          })
        } else {
          this.setData({
            list: data
          });
        }
      }
    }).catch(e => {
      console.error(e);
      wx.showToast({
        title: '抱歉，数据库里没有符合要求的数据！（您可以尝试换个出发时间）',
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