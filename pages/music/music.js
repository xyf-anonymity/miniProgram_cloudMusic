// pages/music/music.js
import http from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //歌曲是否播放
    songsDetail: {}, //歌曲的详情
    songUrl:"" //歌曲的播放地址
  },

  //播放音乐
  musicPlay: function () {
    this.setData({
      isPlay:!this.data.isPlay
    })

    wx.playBackgroundAudio({
      dataUrl:this.data.songUrl
    })

    this.BackgroundAudioManager.src = 'http://m7.music.126.net/20210414221804/345b83aadf355c4388295b4141ce8c28/ymusic/8781/d003/c48d/68ad3474b76dd9992911d59c0178c008.mp3'
   /*  //播放歌曲
    if (this.data.isPlay) {
      console.log(this.BackgroundAudioManager)
      console.log(this.data.songUrl)
      this.BackgroundAudioManager.src = this.data.songUrl
    } */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //根据 id 获取歌曲详情
    http('/song/detail', { ids: options.musicId })
      .then((value) => {
        if (value.code === 200) {
          this.setData({songsDetail:value.songs[0]})
        }
        //设置页面上方的文字为歌曲名字
        wx.setNavigationBarTitle({
          title:value.songs[0].name
        })
      })
      .catch((error) => { console.log(error) })
    
    //根据 id 获取歌曲Url
    http('/song/url', { id: options.musicId })
      .then((value) => {
        if (value.code === 200) {
          this.setData({
            songUrl:value.data[0].url
          })
        }
      })
      .catch((error) => { console.log(error) })
    
    //获取背景音频管理器
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
   
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