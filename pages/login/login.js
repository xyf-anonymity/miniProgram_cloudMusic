import http from '../../utils/http'
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password: '',
    //profile:{} //用户登录后的个人信息
  },

  //收集表单数据
  getInputValue: function (e) {
    let type = e.currentTarget.id
    this.setData({
      [type]:e.detail.value
    })
  },

  //点击登录
  handleLogin: function () {
    const { phone,password } = this.data
    
    //前端验证手机号以及密码
    if (!phone) {
      wx.showToast({
        title: "手机号不能为空",
        icon :"none"
      })
      return
    }

    //验证手机号码格式正确与否
    // let regPhone = /^1(3|4|5|6|7|8|9)\d{9}/
    let regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    if (!regPhone.test(phone)) {
      wx.showToast({
        title: "手机号格式不正确",
        icon :"none"
      })
      return
    }

    //验证密码是否为空
    if (!password) {
      wx.showToast({
        title: "密码不能为空",
        icon :"none"
      })
      return
    }

    //验证通过发送登录请求

    let showToastFn = function (msg) {
      wx.showToast({
        title: msg,
        icon :"none"
      })
    }

    http('/login/cellphone',{phone,password,timestamp:new Date().getTime(),needCookie:true},"POST")
      .then((value) => {
        if (value.code === 200) {
          // this.setData({ profile: value.profile })
          wx.setStorageSync('profile',JSON.stringify(value.profile))
          wx.setStorageSync('token',value.token)
          //登录成功，跳转到个人中心页面
          wx.switchTab({
            url:'/pages/personal/personal'
          })
        }
        else if (value.code === 501) showToastFn(value.msg) //后端验证 账号不存在 
        else if (value.code === 502) showToastFn(value.msg) //后端验证 密码错误
        else showToastFn('登录失败')
      })
      .catch((error) => {
        console.log('error:',error)
      })
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