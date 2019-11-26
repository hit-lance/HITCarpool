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
   * 显示弹窗
   */
  buttonTap: function (event) {
    var theId = event.currentTarget.dataset.unique, theIndex = -1;
    console.log("this.matchResult =", this.data.matchResult)
    for (let index in this.data.matchResult) {
      console.log("index =", index, "unique =", this.data.matchResult[index].unique)
      if (theId === this.data.matchResult[index].unique) {
        theIndex = index
        break
      }
    }
    var str = 'matchResult[' + theIndex + '].modalHidden';
    this.setData({
      [str]: false,
    })
  },

  /**
    * 点击取消
    */
  modalCandel: function (event) {
    // do something
    var theId = event.currentTarget.dataset.unique, theIndex = -1;
    console.log("this.matchResult =", this.data.matchResult)
    for (let index in this.data.matchResult) {
      console.log("index =", index, "unique =", this.data.matchResult[index].unique)
      if (theId === this.data.matchResult[index].unique) {
        theIndex = index
        break
      }
    }
    console.log("theId =", theId)
    console.log("index =", theIndex)
    var str = 'matchResult[' + theIndex + '].modalHidden';
    this.setData({
      [str]: true,
    })
  },

  /**
    *  点击确认
    */
  modalConfirm: function (event) {
    // do something
    var theId = event.currentTarget.dataset.unique, theIndex = -1;
    console.log("this.matchResult =", this.data.matchResult)
    for (let index in this.data.matchResult) {
      console.log("index =", index, "unique =", this.data.matchResult[index].unique)
      if (theId === this.data.matchResult[index].unique) {
        theIndex = index
        break
      }
    }
    console.log("theId =", theId)
    console.log("index =", theIndex)
    var str = 'matchResult[' + theIndex + '].modalHidden';
    this.setData({
      [str]: true,
    })
  },

  /**
   * 获取匹配数据
   */
getMatchData: function () {
  wx.showLoading({
    title: '正在为您匹配',
  })
  var that = this;
  wx.cloud.callFunction({
    name: 'getData',
    data: {
      userDst: this.data.userDst,
      userSrc: this.data.userSrc,
      userTime: this.data.userTime,
      userNum: this.data.userNum,
      openId: app.globalData.openId
    },
    success: (res) => {
      console.log(res.result.data)
      //matchResult中存匹配到的拼车信息以及openid
      if (res.result && res.result.data.length) {
        console.log(res.result.data)
        var data = res.result.data, userTime = that.data.userTime;
        data.sort(function (a, b) { return Math.abs(a.time - userTime) - Math.abs(b.time - userTime); });
        if (data.length) {
          // 对matchResult中的每一个openid，去info集合中查找对应的联系方式以及userinfo
          const promises = data.map(async function(info) {
            var fixedinfo = {};
            console.log(info)
            fixedinfo.unique = info._id
            fixedinfo.num = info.num
            fixedinfo.source = info.source
            fixedinfo.destination = info.destination
            fixedinfo.time = that.transTime(info.time);
            fixedinfo.wechat = ""
            fixedinfo.qq = ""
            fixedinfo.cellphone = ""
            fixedinfo.nickName = ""
            fixedinfo.avatarUrl = ""
            fixedinfo.modalHidden = true
            var promise =  new Promise(resolve => {
              wx.cloud.callFunction({
                name: "getInfo",
                data: {
                  cloudSet: "info",
                  openId: info._openid
                },
              }).then(res => {
                fixedinfo.wechat = res.result.data[0].wechat
                fixedinfo.qq = res.result.data[0].qq
                fixedinfo.cellphone = res.result.data[0].cellphone
                fixedinfo.nickName = res.result.data[0].userInfo.nickName
                fixedinfo.avatarUrl = res.result.data[0].userInfo.avatarUrl
                resolve(fixedinfo)
              }).catch(err => { console.log(err) });
            })
            let test = await promise;
            console.log("test =", test);
            return fixedinfo
          })
          console.log(promises);
          Promise.all(promises).then(res => {
            //打印返回信息
            console.log("res =", res);
            this.setData({
              matchResult: res
            })
          }).catch((reason) => {
            console.log("fail")
          });
        } 
      } 
      wx.hideLoading()
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
    this.getMatchData();
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