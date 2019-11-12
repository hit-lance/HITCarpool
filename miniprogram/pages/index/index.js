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
    num: ['1人', '2人', '3人'],
    index1: 0,
    index2: 0,
    index3: 0,
    multiIndex: [0, 0, 0],
    src: '从哪儿出发',
    dst: '您要去哪儿',
    time: '出发时间',
    peopleNum: '出发人数',
    wechat: '',
    qq: '',
    cellphone: '',
    nickName: '',
    gender: 0,
    avatarUrl: ''
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
    console.log(e)
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  pickerTap: function () {
    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    // 月-日
    for (var i = 2; i <= 124; i++) {
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
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {
        that.loadData(hours, minute);
      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

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
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        if (i >= 6)
          hours.push(i + "点");
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i + "分");
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        if (i >= 6)
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
      if (i >= 6)
        hours.push(i + "点");
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i + "分");
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        if (i >= 6)
          if (i >= 6)
            hours.push(i + "点");
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        if (i >= 6)
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
      peopleNum: this.data.num[e.detail.value]
    })
  },

  handleWechatInput: function (e) {
    this.setData({
      wechat: e.detail.value
    })
  },

  handleQQInput: function (e) {
    this.setData({
      qq: e.detail.value
    })
  },

  handleCellphoneInput: function (e) {
    this.setData({
      cellphone: e.detail.value
    })
  },

  formSubmit: function (e) {
    if (this.data.src === 0) {
      wx.showToast({
        title: '请选择出发地',
      })
    }

    else if (this.data.dst === 0) {
      wx.showToast({
        title: '请选择目的地',
      })
    }

    else if (this.data.peopleNum === 0) {
      wx.showToast({
        title: '请选择人数',
      })
    }

    else if ((this.data.qq == "") && (this.data.wechat == "") && (this.data.cellphone == "")) {
      wx.showToast({
        title: '请填联系方式',
      })
      console.log('[数据库] [新增记录] 失败：')
    }

    else {

      const db = wx.cloud.database()
      console.log(e.detail)
      db.collection('man').add({
        data: {
          source: this.data.src,
          destination: this.data.dst,
          time: util.formatTime(this.data.time, date),
          peopleNumber: Number(this.data.peopleNum.split("人")[0]),
          wechat: this.data.wechat,
          qq: this.data.qq,
          cellphone: this.data.cellphone,
          nickName: this.data.nickName,
          gender: this.data.gender,
          avatarUrl: this.data.avatarUrl,
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
    }
  },
  GotoNxtPage() {
    wx.navigateTo({
      url: '../match/match',
      success: function (res) {
        console.log(res)
      }
    })
  }
})