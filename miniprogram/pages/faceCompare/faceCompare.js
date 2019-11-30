//faceCompare.js

const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    image_a: '',
    image_b: '',
    cWidth: null,
    cHeight: null
  },

  onLoad: function (option) {
    var that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    that.setData({
      image_a: option.fileID_a
    }, () => {
      that.uploadImage()
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  uploadImage() {
    let that = this
    // 从相册和相机中获取图片
    var p = new Promise((resolve, reject) => {
      console.log("选取图片")
      resolve()
    })
    p.then(() => {
      return new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          sourceType: ['camera'],
          success: function (res) {
            that.setData({
              imgPath_b: res.tempFilePaths[0]
            }, resolve())
          },
        })
      })
    })
      .then(() => {
        return new Promise((resolve, reject) => {
          wx.showLoading({
            title: '图片压缩中',
          })
          wx.getImageInfo({
            src: that.data.imgPath_b,
            success: res => {
              console.log("压缩前" + res.width + "x" + res.height)
              //---------利用canvas压缩图片--------------
              var ratio = 2;
              var canvasWidth = res.width //图片原始长宽
              var canvasHeight = res.height
              while (canvasWidth > 400 || canvasHeight > 400) { // 保证宽高在400以内
                canvasWidth = Math.trunc(res.width / ratio)
                canvasHeight = Math.trunc(res.height / ratio)
                ratio++;
              }
              that.setData({
                cWidth: canvasWidth,
                cHeight: canvasHeight
              })
              console.log("压缩后" + canvasWidth + "x" + canvasHeight)
              //console.log("success")
              //console.log(res.path)
              resolve(res)
            }
          })
        })
      })
      .then(res => {
        //console.log(res)
        return new Promise((resolve, reject) => {
          var ctx = wx.createCanvasContext('canvas')
          ctx.drawImage(res.path, 0, 0, that.data.cWidth, that.data.cHeight)
          ctx.draw(false, setTimeout(() => {
            console.log("绘制完成")
            wx.canvasToTempFilePath({
              canvasId: 'canvas',
              fileType: 'jpg',
              destWidth: that.data.cWidth,
              destHeight: that.data.cHeight,
              success: res => {
                const savedFilePath = res.tempFilePath;
                console.log(savedFilePath)
                resolve(savedFilePath)
              }
            })
          }, 200))
        })
      })
      .then((savedFilePath) => {
        return new Promise((resolve, reject) => {
          wx.showLoading({
            title: '图片上传中',
          })
          var timestamp = (new Date()).valueOf();
          wx.cloud.uploadFile({
            cloudPath: 'face/' + app.globalData.openId+'-'+timestamp + '.jpg',
            filePath: savedFilePath,
            success: res => {
              that.setData({
                image_b: res.fileID
              })
              //console.log(that.data.image_b)
              resolve()
            }
          })
        })
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          wx.showLoading({
            title: '人脸比对中',
          })
          wx.cloud.callFunction({
            name: 'faceCompare',
            data: {
              fileID_a: that.data.image_a,
              fileID_b: that.data.image_b
            }
          }).then(res => {
            res = res.result.replace(/\ufeff/g, "");
            res = JSON.parse(res)
            console.log(res);
            wx.hideLoading()
            if (res.data.similarity > 50) {
              const db = wx.cloud.database()
              db.collection("info").doc(app.globalData.info_id).update({
                data: {
                  authorized: true
                }
              }).then(res => {
                console.log(res)
                console.log(app.globalData.info_id)
                app.globalData.authorized = true
                wx.hideLoading()
                wx.showToast({
                  title: '认证成功',
                  duration: 3000
                })
                wx.switchTab({
                  url: '../my/my',
                })
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '人脸识别失败',
                showCancel: false,
                confirmText: '重新识别',
                success: function (res) {
                  if (!res.cancel) {
                    that.uploadImage()
                  }
                }
              })
            }
          })
        })
      })
      .catch(() => {
        wx.showModal({
          title: '提示',
          content: '人脸识别失败',
          showCancel: false,
          confirmText: '重新识别',
          success: function (res) {
            if (!res.cancel) {
              that.uploadImage()
            }
          }
        })
      })
  }
})