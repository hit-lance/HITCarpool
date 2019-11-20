//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    image_a: '',
    image_b: '',
    imgPath_a: '',
    imgPath_b: '',
    app_id: 2123939493,
    app_key: 'USKQCiyPOTvdfEMR',
    _openid: 'oMfVH4wZcFIrZ8noriIJJphy1N_4',
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
      imgPath_a: option.imgPath
    }, () => {
      console.log(that.data.imgPath_a)
      that.uploadImage()
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  uploadImage() {
    let that = this
    // 从相册和相机中获取图片
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: function (res) {
        let Abase64 = wx.getFileSystemManager().readFileSync(that.data.imgPath_a, "base64")
        //Abase64 　= 'data:image/jpeg;base64,' + Abase64
        //console.log(Abase64)
        that.setData({
          image_a: Abase64,
          imgPath_b: res.tempFilePaths[0]
        }, () => {
          //console.log(that.data.imgPath)
          wx.getImageInfo({
            src: that.data.imgPath_b,
            success: function (res) {
              console.log("压缩前" + res.width + "x" + res.height)
              //---------利用canvas压缩图片--------------
              var ratio = 2;
              var canvasWidth = res.width //图片原始长宽
              var canvasHeight = res.height
              while (canvasWidth > 300 || canvasHeight > 300) { // 保证宽高在400以内
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
              //----------绘制图形并取出图片路径--------------
              var ctx = wx.createCanvasContext('canvas')
              ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
              ctx.draw(false, setTimeout(function () {
                console.log("绘制完成")
                let cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) *
                  1000)}.png`;
                wx.cloud.uploadFile({
                  cloudPath: cloudPath,
                  filePath: that.data.imgPath_b,
                  success: res => {
                    if (res.statusCode < 300) {
                      console.log(res.fileID);
       
                    }
                  },
                  fail: err => {
                    // 隐藏加载组件并提示
                    wx.hideLoading();
                    wx.showToast({
                      title: '上传失败',
                      icon: 'none'
                    });
                  },
                });
                wx.canvasToTempFilePath({
                  canvasId: 'canvas',
                  fileType: 'jpg',
                  destWidth: canvasWidth,
                  destHeight: canvasHeight,
                  success: function (res) {
                    //console.log(res.tempFilePath)
                    //const savedFilePath = res.tempFilePath;
                    //console.log(savedFilePath)
                    let Bbase64 = wx.getFileSystemManager().readFileSync(res.tempFilePath, "base64");
                    //Bbase64 = 'data:image/jpeg;base64,' + Bbase64
                    that.setData({
                      image_b: Bbase64
                    }, () => {
                      //console.log(that.data.image_a);
                      //console.log(that.data.image_b);
                      //console.log(that.data.app_id)
                      wx.cloud.callFunction({
                        name: 'faceCompare',
                        data: {
                          "param": {
                            "app_id": that.data.app_id,
                            "image_a": that.data.image_a,
                            "image_b": that.data.image_b
                          },
                          "app_key": that.data.app_key
                        },
                      }).then(res => {
                        res = res.result.replace(/\ufeff/g, "");
                        res = JSON.parse(res)
                        console.log(res);
                        //console.log(res.result.data)
                        //console.log(res.result.data.similarity)
                        //    if (res.data.similarity > 70) {
                        if (res.data.similarity > 70) {
                          const db = wx.cloud.database()
                          db.collection("info").doc(app.globalData.info_id).update({
                            data: {
                              authorized: true
                            }
                          }).then(res => {
                            console.log(res)
                            console.log(app.globalData.info_id)
                            app.globalData.authorized=true
                            wx.showToast({
                              title: '认证成功',
                            })
                            wx.switchTab({
                              url: '../my/my',
                            })
                          }).catch(err => {
                            console.error(err)
                            wx.showToast({
                              title: '更新记录失败',
                              icon: 'none'
                            })
                          })


                        } else {
                          wx.showToast({
                            title: '验证失败，请重试',
                            icon: 'none'
                          });
                        }
                      }).catch(err => {
                        console.log("fail" + err);
                      })
                    })
                  },
                  fail: function (res) {
                    console.log("fail")
                  }
                })
              }, 200)) //留一定的时间绘制canvas
            },
            fail: function (res) {
              console.log(res.errMsg)
            },
          })
        })
      },
    })
  }
})