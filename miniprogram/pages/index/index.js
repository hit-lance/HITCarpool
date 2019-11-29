const app = getApp()
var isFilled = [false, false, false, false];
var date = new Date();
var currentMonth = date.getMonth();
var currentDay = date.getDay();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
var util = require('../../util/util.js')
var thereIsNoToday = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    auth: 0,
    disable: true,
    hasUserInfo: app.globalData.userInfo,
    registered: app.globalData.registered,
    authorized: app.globalData.authorized,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    location: ['一校区', '二校区', '建筑学院', '哈尔滨站', '哈尔滨西站', '太平机场'],
    multiArray: [[''], [0], [0]],
    nums: ['1人', '2人', '3人'],
    index1: 0,
    index2: 0,
    index3: 0,
    color: "grey",
    multiIndex: [0, 0, 0],
    src: '出发地',
    dst: '目的地',
    time: '出发时间',
    num: '人数'
  },

  onShow: function () {
    let that = this;
    thereIsNoToday = (currentHours == 23) && (currentMinute > 50);
    if (app.globalData.registered && app.globalData.authorized) {
      that.test()
    } else {
      app.userInfoReadyCallback = () => {
        that.test()
      }
    }
  },

  test: function () {
    this.setData({
      registered: app.globalData.registered,
      authorized: app.globalData.authorized
    })
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
    } else{
      this.setData({
        hasUserInfo: true
      })
    } 
  },
  pickerTap: function () {
    var monthDay = [];
    if (!thereIsNoToday) monthDay.push("今天");
    monthDay.push("明天");
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

    if (data.multiIndex[0] === 0 && !thereIsNoToday) {
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
    var monthDay = [];
    if (!thereIsNoToday) monthDay.push("今天");
    monthDay.push("明天");
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
      if (e.detail.value === 0 && !thereIsNoToday) {
        that.loadData(hours, minute);
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
      } else {
        that.loadHoursMinute(hours, minute);
        if (preIndex === 0 && !thereIsNoToday) {
          data.multiIndex[1] += currentHours;
          const _ = Math.trunc((currentMinute - 1) / 10) + 1;
          data.multiIndex[2] += _;
        }
      }

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0 && !thereIsNoToday) {
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
      if (data.multiIndex[0] === 0 && !thereIsNoToday) {

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
    var minuteIndex = Math.trunc((currentMinute - 1) / 10) * 10 + 10;

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
    var minuteIndex = Math.trunc((currentMinute - 1) / 10) * 10 + 10

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
    isFilled[2] = true;
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
      time: monthDay + " " + hours + ":" + minute,
      disable: !(isFilled[0] && isFilled[1] && isFilled[2] && isFilled[3])
    })
  },

  bindPickerChange1: function (e) {
    isFilled[0] = true;
    this.setData({
      index1: e.detail.value,
      src: this.data.location[e.detail.value],
      disable: !(isFilled[0] && isFilled[1] && isFilled[2] && isFilled[3])
    })
  },

  bindPickerChange2: function (e) {
    isFilled[1] = true;
    this.setData({
      index2: e.detail.value,
      dst: this.data.location[e.detail.value],
      disable: !(isFilled[0] && isFilled[1] && isFilled[2] && isFilled[3])
    })
  },

  bindPickerChange3: function (e) {
    isFilled[3] = true;
    this.setData({
      index3: e.detail.value,
      num: this.data.nums[e.detail.value],
      disable: !(isFilled[0] && isFilled[1] && isFilled[2] && isFilled[3])
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
      db.collection('carpool').add({
        data: {
          source: this.data.src,
          destination: this.data.dst,
          time: util.formatTime(this.data.time, date),
          num: Number(this.data.num.split("人")[0]),
        },
        success: res => {
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          console.error('[数据库] [新增记录] 失败：', err)
        }
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
  },

})


