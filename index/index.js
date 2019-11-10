var app = getApp()
var util = require('../../util/util.js')
var currenTime = util.formatTime(new Date())
const currenT = []
const hours = []
const mins = []
const month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
let currentDay
let curHour
let curMin
curHour=currenTime[2]+"时"
curMin=currenTime[3]+"分"
for (let i = 0; i <= 14; i++) {
  currentDay = (currenTime[1] + i) % month[currenTime[0]]
  currenT.push(currenTime[0] + "月" + currentDay + "日")
}

for (let i = 0; i <= 23; i++) {
  hours.push(i + "时")
}

for (let i = 0; i <= 59; i++) {
  mins.push(i + "分")
}

Page({
  data: {
    array0: currenT,
    location: ['一校区', '二校区', '建筑学院', '哈尔滨站', '哈尔滨西站', '太平机场'],
    number: ['1人', '2人', '3人'],
    wechat: '',
    qq:'',
    phone:'',
    default1: '从哪儿出发',
    default2:'到哪儿去',
    default3:'拼车时间',
    default4:'拼车人数',
    start: 10 ,
    end: 10,
    num: 10,
    hours: hours,
    hour: 24,
    mins: mins,
    min: 60,
    value1: [0, 0, 0],
    multiArray: [currenT, hours, mins],
    allValue:'',
    curHour:curHour,
    curMin:curMin
  },

  onLoad: function () {
    this.setData({
      currenTime: currenT[1]
    });
  },
  formSubmit: function (e) {
   
    if ((e.detail.value.qq == "") && (e.detail.value.wechat == "") && (e.detail.value.phone == "")) {
      wx.showToast({
        title: '请输入联系方式',
      })
      console.log('[数据库] [新增记录] 失败：')
    }
    else if((e.detail.value.start===0)||(e.detail.value.end===0)||(e.detail.value.num===0)||(e.detail.value.time===[0,0,0]))
    {
        wx.showToast({
          title: '请填写需求',
        })
    }
    else{
    console.log('form发生了submit事件，携带数据为：',e.detail.value)
    const db = wx.cloud.database()

    db.collection('man').add({
       data: {
         man:e.detail.value,
         st:e.detail.value.index1
       },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          man: e.detail.value,
          st:e.detail.value.index1
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
    
    wx.navigateTo({
      url: '../match/match',
      success: function(res) {console.log(res)}
    })
    }
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      value1: e.detail.value
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

  bindPickerChange1: function (e) {
    this.setData({
      start: e.detail.value,
      default1: this.data.location[e.detail.value]
    })
  },
  bindPickerChange2: function (e) {
    this.setData({
      end: e.detail.value,
       default2: this.data.location[e.detail.value]
    })
  },
  bindPickerChange3: function (e) {
    this.setData({
      num: e.detail.value,
      default4:this.data.number[e.detail.value]
    })
  },
  wechat: function (e) {
    this.setData({
      wechat: e.detail.value
    })
  },
  qq:function(e){
    this.setData({
      qq:e.detail.value
    })
  },
  phone:function(e){
    let val=this.validateNumber(e.detail.value)
    this.setData({
      phone:e.detail.value
    })
  },
  validateNumber(val){
    return val.replace(/\D/g,'')
  }

})