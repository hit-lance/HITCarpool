const app = getApp()
var date = new Date();
var currentMonth = date.getMonth();
var currentDay = date.getDay();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
var util = require('../../util/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    location: ['一校区', '二校区', '建筑学院', '哈尔滨站', '哈尔滨西站', '太平机场'],
    multiArray: [[''], [0], [0]],
    nums: ['1人', '2人', '3人'],
    index1: 0,
    index2: 0,
    index3: 0,
    color: "grey",
    multiIndex: [0, 0, 0],
    src: '从哪儿出发',
    dst: '您要去哪儿',
    time: '出发时间',
    num: '出发人数',
    wximgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%BE%AE%E4%BF%A1%20(1).png?sign=bcfccda64816d93550d3d84502a1aafa&t=1573632057',
    qqimgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/QQ.png?sign=c66cba101605f15a2d70af554c8b3585&t=1573632085',
    phimgurl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E6%89%8B%E6%9C%BA.png?sign=d2f71881cfbb260ce9de3c68021b90ca&t=1573569891',
    bluepointUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%8D%95%E8%89%B2%E5%9C%86%E7%82%B9.png?sign=67c6ea8d08dc8a0512d2370782108331&t=1573570041',
    greenpointUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E5%8D%95%E8%89%B2%E5%9C%86%E7%82%B9%20(1).png?sign=a8e3254ff21e3e1c8ab779db9820cb0f&t=1573570068',
    timeUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E6%97%B6%E9%97%B4.png?sign=4fc61cf4061c0422e4196440557e6d7e&t=1573570096',
    peopleUrl: 'https://6361-carpool-2kcqi-1300592193.tcb.qcloud.la/%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90/%E4%BA%BA.png?sign=e003d9f4efb21f53a399315366fe9624&t=1573570120'
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log("getUserInfo:", e);
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      nickName: e.detail.userInfo.nickName,
      gender: e.detail.userInfo.gender,
      avatarUrl: e.detail.userInfo.avatarUrl
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  pickerTap: function () {
    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    // 月-日
    for (var i = 2; i <= 14; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },

  bindMultiPickerColumnChange: function (e) {
    var that = this;
    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    var preIndex = data.multiIndex[e.detail.column];
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {
        that.loadData(hours, minute);
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
      } else {
        that.loadHoursMinute(hours, minute);
        if (preIndex === 0) {
          data.multiIndex[1] += currentHours;
          const _ = Math.trunc((currentMinute - 1) / 10) + 1;
          data.multiIndex[2] += _;
        }
      }

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
          data.multiIndex[2] = 0;
        } else {
          that.loadMinute(hours, minute);
          if (preIndex === 0) {
            const _ = Math.trunc((currentMinute - 1) / 10) + 1;
            data.multiIndex[2] += _;
          }
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {
    var minuteIndex = Math.trunc((currentMinute-1)/10)*10+10;

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
          hours.push(i + "点");
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i + "分");
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
          hours.push(i + "点");
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i + "分");
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
        hours.push(i + "点");
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i + "分");
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex = Math.trunc((currentMinute-1)/10)*10+10

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
            hours.push(i + "点");
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
          hours.push(i + "点");
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i + "分");
    }
  },

  bindMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    hours = hours.substr(0, hours.length - 1);
    if (hours < 10)
      hours = "0" + hours

    minute = minute.substr(0, minute.length - 1);
    if (minute === "0")
      minute = "00"

    that.setData({
      time: monthDay + " " + hours + ":" + minute
    })
  },

  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value,
      src: this.data.location[e.detail.value]
    })
  },

  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value,
      dst: this.data.location[e.detail.value]
    })
  },

  bindPickerChange3: function (e) {
    this.setData({
      index3: e.detail.value,
      num: this.data.nums[e.detail.value]
    })
  },

  handleWechatInput: function (e) {
    app.globalData.wechat = e.detail.value
  },

  handleQQInput: function (e) {
    app.globalData.qq = e.detail.value
  },

  handleCellphoneInput: function (e) {
    app.globalData.cellphone = e.detail.value
  },

  formSubmit: function (e) {
    if (this.data.src === "从哪儿出发") {
      wx.showToast({
        title: '请选出发地',
        icon: 'none'
      })
    }

    else if (this.data.dst === "您要去哪儿") {
      wx.showToast({
        title: '请选目的地',
        icon: 'none'
      })
    }

    else if (this.data.time === "出发时间") {
      wx.showToast({
        title: '请选出发时间',
        icon: 'none'
      })
    }

    else if (this.data.num === "出发人数") {
      wx.showToast({
        title: '请选择人数',
        icon: 'none'
      })
    }

    else if ((app.globalData.qq == "") && (app.globalData.wechat == "") && (app.globalData.cellphone == "")) {
      wx.showToast({
        title: '请填联系方式',
        icon: 'none'
      })
      console.log('[数据库] [新增记录] 失败：')
    }

    else if (this.data.src === this.data.dst) {
      wx.showToast({
        title: '起终点相同！',
        icon: 'none'
      })
    }

    else {
      const db = wx.cloud.database()
      console.log(e.detail)
      db.collection('man').add({
        data: {
          source: this.data.src,
          destination: this.data.dst,
          time: util.formatTime(this.data.time, date),
          num: Number(this.data.num.split("人")[0]),
          wechat: app.globalData.wechat,
          qq: app.globalData.qq,
          cellphone: app.globalData.cellphone,
          nickName: this.data.userInfo.nickName,
          gender: this.data.userInfo.gender,
          avatarUrl: this.data.userInfo.avatarUrl,
          isDone: false
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            counterId: res._id,
          })
          wx.showToast({
            title: '新增记录成功',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
      this.setData({
        allValue: e.detail.value
      })

      //跳到匹配结果页
      wx.navigateTo({
        url: '../match/match?userTime=' + util.formatTime(this.data.time, date) + 
          '&userSrc=' + this.data.src + '&userDst=' + this.data.dst + '&userNum=' + Number(this.data.num.split("人")[0]),
        success: function (res) {
          console.log(res)
        }
      })
    }
  }
})