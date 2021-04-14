// pages/personal/personal.js
import http from '../../utils/http'
let startY = 0; //初始化手指点下去的那个位置
let endY = 0; //初始化手指滑动到最后那一点的位置
let distantY = 0; //初始化手指滑动的距离

Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTranslate: 0,
    coverTransition: "",
    profile: {}, //登录后用户的个人信息
    allData:[] //歌曲所有播放记录
  },


  tologin: function () {
    if(this.data.profile.nickname) return //登录成功不允许再跳转到登录页面
    wx.navigateTo({
      url:"/pages/login/login"
    })
  },

  // 手指按下
  handleTouchStart: function (e) {
    startY = e.touches[0].clientY
    this.setData({
      // coverTranslate: 0,
      coverTransition:"0s transform linear"
    })
  },

  //手指移动
  handleTouchMove: function (e) {
    endY = e.touches[0].clientY
    distantY = endY - startY

    if(distantY < 0) distantY = 0 
    if(distantY >= 100) distantY = 100 
    this.setData({
      coverTranslate:distantY
    })
  },
  //手指抬起
  handleTouchEnd: function (e) {
    this.setData({
      coverTranslate: 0,
      coverTransition:".8s transform linear"
    })
  },

  //退出登录
  logout: function () {

    wx.showModal({
      title: "是否退出？",
      success(res) {
        if (res.confirm) {

          http('/logout')
            .then((value) => {
              if (value.code === 200) {

                wx.switchTab({
                  url:"/pages/index/index"
                })
                
                wx.showToast({
                  title:"退出成功"
                })
              }
            })
            .catch((error) => { console.log(error) })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 


/*     http('/logout')
    .then((value) => {
      if (value.code === 200) {

        wx.switchTab({
          url:"/pages/index/index"
        })
        
        wx.showToast({
          title:"退出成功"
        })
      }
    })
    .catch((error) => { console.log(error) }) */


    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    //边界条件防止切换一次路由就请求一次数据，即当用户信息和播放记录都拿到时就不需要再发送请求拿数据了
    if(this.data.profile.nickname && this.data.allData.length) return

    //登录成功后跳转到个人中心页面 拿取用户登录后的信息
    let profile = {}
    if (wx.getStorageSync('profile')) {
      profile = JSON.parse(wx.getStorageSync('profile'))
    }
    this.setData({ profile })
    
    //登录成功后发送请求获取用户最近播放列表
    if (this.data.profile.nickname) {
      http('/user/record', { uid: this.data.profile.userId, type: 0 })
        .then((value) => {
          if (value.code === 200) {
            this.setData({allData:value.allData})
          }
        })
        .catch((error)=>{console.log(error)})
    }
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

  }
})
