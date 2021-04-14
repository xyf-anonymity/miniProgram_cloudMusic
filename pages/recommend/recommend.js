// pages/recommend/recommend.js
import http from '../../utils/http'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: new Date().getDate(), //日期
    mouth: new Date().getMonth() + 1, //月份
    recommendMusicData:[] //每日推荐歌曲的列表数组
  },

  // 点击去播放歌曲
  toPlayMusic: function (e) {
    wx.navigateTo({
      url:"/pages/music/music?musicId=" + e.currentTarget.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http('/recommend/songs')
      .then((value) => {
        if (value.code === 200) {
          this.setData({
            recommendMusicData:value.data.dailySongs
          })
        }
      })
      .catch((error)=>{console.log(error)})
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