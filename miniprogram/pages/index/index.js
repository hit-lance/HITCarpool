// pages/mine/mine.js
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    location: ['一校区', '二校区', '建筑学院', '哈尔滨站', '哈尔滨西站', '太平机场'],
    multiArray: [[], [], []],
    num: ['1人', '2人', '3人'],
    wechat: '',
    qq: '',
    cellphone: '',
    default_src: '从哪儿出发',
    default_dst: '您要去哪儿',
    default_date: '出发时间',
    default_num: '出发人数',
    index1: 0,
    index2: 0,
    multiIndex: [0, 0, 0],
    index3: 0,
  },

  pickerTap: function () {
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

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
    date = new Date();
    var that = this;
    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

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
        if (i>=6)
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

  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay != "今天" && monthDay != "明天") {
      var month = monthDay.split("月")[0]; // 返回月
      var day = monthDay.split("月")[1].split("日")[0]; // 返回日
      monthDay = month + "月" + day + "日";
    }


    hours = hours.substr(0, hours.length - 1);
    if (hours < 10)
      hours = "0" + hours

    minute = minute.substr(0, minute.length - 1);
    if (minute === "0")
      minute = "00"

    var default_date = monthDay + " " + hours + ":" + minute;
    that.setData({
      default_date: default_date
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value,
      default_src: this.data.location[e.detail.value]
    })
  },

  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value,
      default_dst: this.data.location[e.detail.value]
    })
  },

  bindPickerChange3: function (e) {
    this.setData({
      index3: e.detail.value,
      default_num: this.data.location[e.detail.value]
    })
  },

  // 以下三个函数好像不能把用户的输入变为字符串
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
    console.log('用户输入手机号:', e) 
    this.setData({
      cellphone: e.detail.value
    })
  }
})
