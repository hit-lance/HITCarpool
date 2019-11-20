// pages/match/match.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchResult: [],
    userTime: 0,
    userSrc: "",
    userDst: "",
    userNum: 0,
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
   * 显示弹窗
   */
  buttonTap: function () {
    this.setData({
      modalHidden: false,
    })
  },

  /**
    * 点击取消
    */
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  /**
    *  点击确认
    */
  modalConfirm: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  getData(callback) {
    console.log("getData in");
    console.log(app.globalData.openId);
    console.log(this.data);
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        userDst: this.data.userDst,
        userSrc: this.data.userSrc,
        userTime: this.data.userTime,
        userNum: this.data.userNum,
        openId: app.globalData.openId
      },
      success: res => {
        console.log("getData success");
        if (res.result && res.result.data.length) {
          var data = res.result.data, fixedMatchResult = [], userTime = this.data.userTime;
          data.sort(function (a, b) { return Math.abs(a.time - userTime) - Math.abs(b.time - userTime); });
          for (var idx in data) {
            fixedMatchResult.push(data[idx]);
            fixedMatchResult[idx].time = this.transTime(data[idx].time);
          }
          if (fixedMatchResult.length) {
            for (var idx in fixedMatchResult) {
              (function (idx) {
                console(idx, fixedMatchResult[idx]);
                wx.cloud.callFunction({
                  name: "getInfo",
                  data: {
                    cloudSet: "info",
                    openId: fixedMatchResult[idx]._openid
                  },
                }).then(res => {
                  fixedMatchResult[idx].wechat = res.result.data[0].wechat
                  fixedMatchResult[idx].qq = res.result.data[0].qq
                  fixedMatchResult[idx].cellphone = res.result.data[0].cellphone
                  fixedMatchResult[idx].nickName = res.result.data[0].userInfo.nickName
                  fixedMatchResult[idx].gender = res.result.data[0].userInfo.gender
                  fixedMatchResult[idx].avatarUrl = res.result.data[0].userInfo.avatarUrl
                  }).catch(err => { console.log(err) })
                  setTimeout(function () {
                    callback(fixedMatchResult);
                  }, 3000);
              })(idx)
              console(idx, fixedMatchResult[idx]);
            }
            this.setData({
              matchResult: fixedMatchResult
            })
            console.log(this.data.matchResult);
            console.log(fixedMatchResult);
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
    var that=this
    this.getData(function (fixedMatchResult){
      that.setData({
        matchResult: fixedMatchResult
      })
    });
  },

  /**
   * 生命周期函数--监听页面安装
   */
  onLoad: function (e) {
    this.setData({
      userTime: Number(e.userTime),
      userSrc: e.userSrc,
      userDst: e.userDst,
      userNum: Number(e.userNum)
    })
  },

})