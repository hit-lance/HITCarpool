// pages/match/match.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyData: "",
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
   * 设置为拼车成功
   */
  cancelTheMessage: function (event) {
    var theId = event.currentTarget.dataset.theid;
    const db = wx.cloud.database();
    db.collection('carpool').doc(theId).update({
      data: {
        isDone: true
      }
    }).then(this.getHistoryData()).catch()
  },
  /**
   * 设置为未拼车
   */
  restoreTheMessage: function (event) {
    var theId = event.currentTarget.dataset.theid;
    const db = wx.cloud.database();
    db.collection('carpool').doc(theId).update({
      data: {
        isDone: false
      }
    }).then(this.getHistoryData()).catch()
  },
  /**
   * 取消行程
   */
  deleteTheMessage: function (event) {
    var theId = event.currentTarget.dataset.theid;
    const db = wx.cloud.database();
    db.collection('carpool').doc(theId).remove().then(this.getHistoryData()).catch()
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

  getHistoryData() {
    console.log("openid =", app.globalData.openId)
    wx.cloud.callFunction({
      name: 'getInfo',
      data: {
        cloudSet: "carpool",
        openId: app.globalData.openId
      },
      success: res => {
        console.log("res =", res);
        this.setData({
          historyData: ""
        })
        if (res.result && res.result.data.length) {
          var data = res.result.data, fixedHistoryData = [];
          wx.cloud.callFunction({
            name: 'getInfo',
            data: {
              cloudSet: "info",
              openId: app.globalData.openId
            },
            success: res => {
              console.log("res =", res);
              console.log("data =", data);
              for (var idx in data) {
                fixedHistoryData.push(data[idx]);
                fixedHistoryData[idx].time = this.transTime(fixedHistoryData[idx].time);
                fixedHistoryData[idx].wechat = res.result.data[0].wechat
                fixedHistoryData[idx].qq = res.result.data[0].qq
                fixedHistoryData[idx].cellphone = res.result.data[0].cellphone
                fixedHistoryData[idx].nickName = res.result.data[0].userInfo.nickName
                fixedHistoryData[idx].gender = res.result.data[0].userInfo.gender
                fixedHistoryData[idx].avatarUrl = res.result.data[0].userInfo.avatarUrl
              }
              if (fixedHistoryData.length) {
                console.log(fixedHistoryData);
                this.setData({
                  historyData: fixedHistoryData
                })
                console.log(this.data.historyData);
              } else {
                this.setData({
                  historyData: ""
                })
                wx.showToast({
                  itle: '您好，数据库里没有您想要的信息！',
                  icon: 'none',
                })
              }
            },
            fail: e => {
              console.error(e);
            }
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
    this.getHistoryData();
  },

  /**
   * 生命周期函数--监听页面安装
   */
  onLoad: function (e) {
  },

})