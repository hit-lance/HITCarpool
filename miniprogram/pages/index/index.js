var app = getApp()
var util = require('../../util/util.js')
var currenTime = util.formatTime(new Date())
const currenT = []
const hours=[]
const mins=[]
const month=[31,28,31,30,31,30,31,31,30,31,30,31]
let currentDay

for (let i = 0; i <= 14; i++) {
  currentDay = (currenTime[1] + i)%month[currenTime[0]]
  currenT.push(currenTime[0] + "月" + currentDay + "日")
}

for(let i=0;i<=23;i++){
  hours.push(i+"时")
}

for(let i=0;i<=59;i++){
  mins.push(i+"分")
}

Page({
  data: {
    array0: currenT,
    location: ['一校区', '二校区', '建筑学院', '哈尔滨站', '哈尔滨西站', '太平机场'],
    num: ['1人', '2人', '3人'],
    contact: '',
    default: '从哪儿出发',
    index1: 0,
    index2: 0,
    index3: 0,
    hours:hours,
    hour:24,
    mins:mins,
    min:60,
    value1:[0,0,0],
    multiArray:[currenT,hours,mins]
  },

  onLoad: function() {
    this.setData({
      currenTime: currenT[1]
    });
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      value1: this.data.value1
    };
    data.value1[e.detail.column] = e.detail.value;
    
    this.setData(data);
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindPickerChange1: function(e) {
    this.setData({
      index1: e.detail.value,
      default: this.data.location[e.detail.value]
    })
  },
  bindPickerChange2: function(e) {
    this.setData({
      index2: e.detail.value
    })
  },
  bindPickerChange3: function(e) {
    this.setData({
      index3: e.detail.value
    })
  },
  userNameInput: function(e) {
    this.setData({
      contact: e.detail.value
    })
  }
})