// pages/match/match.js
var distanceBetweenTime = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    userTime: "",
    userSrc: "",
    userDst: "",
    userOpenId: ""
  },

  /**
   * 获取数据
   */

  getData() {
    const db = wx.cloud.database();
    db.collection('man').where({
      destination: this.data.userDst,
      source: this.data.userSrc
    }).get().then((res) => {
      console.log("succuss, res = ", res);
      let data = res.data;
      for (var idx1 in data) {
        console.log("str =", data[idx1]['time']);
        console.log("number =", new Date(data[idx1]['time']).getTime());
      }
      this.setData({
        list: data
      });
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
      userDst: e.userDst,
      userOpenId: e.userOpenId
    })
  },

})