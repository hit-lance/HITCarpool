//match.js

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    matchResult: [],
    userTime: 0,
    time:"",
    userSrc: "",
    userDst: "",
    userNum: 0,

    wximgurl: '../../icon/icon_wx.png',
    qqimgurl: '../../icon/icon_qq.png',
    phimgurl: '../../icon/icon_phone.png',
    
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
    for (let index in this.data.matchResult) {
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
    for (let index in this.data.matchResult) {
      if (theId === this.data.matchResult[index].unique) {
        theIndex = index
        break
      }
    }
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
    for (let index in this.data.matchResult) {
      if (theId === this.data.matchResult[index].unique) {
        theIndex = index
        break
      }
    }

    var str = 'matchResult[' + theIndex + '].modalHidden';
    this.setData({
      [str]: true,
    })
  },

/**
 * 判断是否为校区
 */

isSchool: function(str) {
  return (str == '一校区' || str == '二校区' || str == '科技园' || str == '建筑学院');
},

/**
 * 判断起始地与终点是否能匹配上
 */
matchSrcAndDst: function(item) {
  var src1 = this.data.userSrc, src2 = item.source,
        dst1 = this.data.userDst, dst2 = item.destination;
  if ((this.isSchool(src1) != this.isSchool(src2) || (this.isSchool(dst1) != this.isSchool(dst2)))) {
    return 0;
  }
  if (!this.isSchool(src1) && this.isSchool(dst1)) swap(src1, dst1), swap(src2, dst2);
  if (this.isSchool(src1)) {
    if (!this.isSchool(dst1)) {
      return dst1 == dst2;
    }
    if (src1 == "二校区") {
      return src2 == "二校区";
    }
    if (dst1 == "二校区") {
      return dst2 == "二校区";
    }
    if (src2 == "二校区") {
      return src1 == "二校区";
    }
    if (dst2 == "二校区") {
      return dst1 == "二校区";
    }
    return src1 == src2 && dst1 == dst2;
  } 
  return src1 == src2 && dst1 == dst2;
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
      userTime: this.data.userTime,
      userNum: this.data.userNum,
      openId: app.globalData.openId
    },
    success: (res) => {
      //matchResult中存匹配到的拼车信息以及openid
      if (res.result && res.result.data.length) {
        var data = [], userTime = that.data.userTime;
        for (let idx in res.result.data) {
          if (this.matchSrcAndDst(res.result.data[idx]))
            data.push(res.result.data[idx]);
        }
        data.sort(function (a, b) { return Math.abs(a.time - userTime) - Math.abs(b.time - userTime); });
        if (data.length) {
          // 对matchResult中的每一个openid，去info集合中查找对应的联系方式以及userinfo
          const promises = data.map(async function(info) {
            var fixedinfo = {};
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
            fixedinfo.gender=0
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
                fixedinfo.gender=res.result.data[0].userInfo.gender
                resolve(fixedinfo)
              }).catch(err => { console.log(err) });
            })
            let test = await promise;
            return fixedinfo
          })
          Promise.all(promises).then(res => {
            //打印返回信息
            this.setData({
              matchResult: res
            })
            wx.hideLoading()
          }).catch((reason) => {
            console.log("fail")
          });
        } else{
          wx.hideLoading()
        }
      }
      else{
        wx.hideLoading()
      } 
    },
    fail: e => {
      console.error(e);
      wx.hideLoading()
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
      userNum: Number(e.userNum),
      time : this.transTime(Number(e.userTime)),
    })
  },

  copy: function (e) {
    var that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.content,
    });
  },

  deleteTheMessage: function (event) {
    wx.showModal({
      title: '提示',
      content: '您确认取消本次行程吗？',
      confirmText: '确认',
      success: function (res) {
        if (!res.cancel) {
          wx.showLoading({
            title: '正在取消',
          })
          const db = wx.cloud.database();
          db.collection('carpool').doc(app.globalData.carpool_id).remove().then(res => {
            wx.hideLoading()
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 3000
            })
            wx.switchTab({
              url: '../index/index',
            })
          }).catch()
        }
      }
    })
  },

})