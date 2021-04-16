// app.js
App({
  
  globalData: {
    userInfo: null,
    musicId: '', //背景音频播放的歌曲 id
    isPlay:false, //控制背景音频播放
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
})
