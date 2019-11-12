// pages/match/match.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ""
  },

  /**
   * 获取数据
   */

  getData() {
    const db = wx.cloud.database();
    db.collection('man').get().then((res) => {
      console.log("succuss, res = ", res);
      let data = res.data;
      for (var mY in data)
      this.setData({
        list: data
      });
    }).catch(e => {
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

})