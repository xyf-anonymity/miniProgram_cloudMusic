// pages/music/music.js
import http from '../../utils/http'
import PubSub from 'pubsub-js'
import moment from 'moment'
let appData = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //歌曲是否播放
    musicId:'', // 歌曲的 id
    songsDetail: {}, //歌曲的详情
    songUrl: '', //歌曲的播放地址
    currentTime: '00:00', //歌曲播放的时间进度
    duration: '00:00', //歌曲的总时长
    currentProgressWidth: 0 //进度条的宽度
  },

  //播放音乐
  musicPlay: function () {

    this.setData({
      isPlay:!this.data.isPlay
    })

    let {isPlay,musicId,songUrl} = this.data
    
    //把歌曲 id 存放到 app 的数据 Data 中,并把其中的 isPlay 于本地保持一致
    appData.globalData.musicId = musicId
    appData.globalData.isPlay = isPlay
    
    //播放歌曲
    if (isPlay) {
      //为了动画延迟 1s
      setTimeout(() => {
        wx.playBackgroundAudio({
          dataUrl:songUrl
        }) 
      },1000)
    } else {
      wx.pauseBackgroundAudio()
    }
  },

  //处理切歌：上一首或下一首
  switchMusic: function (e) {
    let type 
    if(e !== 'next') type = e.currentTarget.dataset.type
    else type = e 
    console.log(type)

    //把播放的歌曲停下
    this.BackgroundAudioManager.pause()
    this.BackgroundAudioManager.stop()
    PubSub.publish('switchMusicType', type)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //根据全局 app 数据中的歌曲播放状态 isPlay 和 歌曲 id：musicId 判断歌曲是否已经播放，已经播放就给本地 isPlay 置为全局的 isPlay
    /* if (appData.globalData.isPlay && appData.globalData.musicId>>>0 === options.musicId>>>0) {
      this.setData({
        isPlay:true
      })
    } */

    //切歌完成后根据歌曲 id 请求播放地址并播放
    PubSub.subscribe('switchMusicById', (name, musicId) => {
      //获取歌曲的详情和播放地址
      this.getMusicDetailAndUrl(musicId)
    })

    //获取歌曲的详情和播放地址
    this.getMusicDetailAndUrl(options.musicId>>>0)

    //获取背景音频管理器
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
    
    //监听音乐播放事件
    wx.onBackgroundAudioPlay(() => {
      this.changeIsPlay(true)
    })

    //监听音乐暂停事件
    wx.onBackgroundAudioPause(() => {
      this.changeIsPlay(false)
    })

    //监听音乐停止事件
    wx.onBackgroundAudioStop(() => {
     this.changeIsPlay(false)
    })

    //监听背景音频播放进度更新事件
    this.BackgroundAudioManager.onTimeUpdate(() => {

      //根据歌曲播放的时间进度和歌曲的总时长之间的比例求出进度条播放时的实时宽度
      const { currentTime, duration } = this.BackgroundAudioManager
      let currentProgressWidth = (currentTime / duration) * 360
      this.setData({
        currentProgressWidth,
        currentTime:moment(currentTime*1000).format('mm:ss')
      })

      //非会员歌曲，当歌曲播放完时自动跳到下一首
      const { currentTime: dataCurrentTime, duration: dataDuration } = this.data
      if (dataCurrentTime === dataDuration && currentTime !== 0) {
        this.switchMusic('next')
      } 
    })
    
    
  },


  //封装一个获取歌曲详情和播放地址的方法
  getMusicDetailAndUrl: function (musicId) {
    
    //根据 id 获取歌曲详情
    http('/song/detail',{ids:musicId})
    .then((value) => {

      if (value.code === 200) {
        this.setData({
          songsDetail: value.songs[0],
          musicId,
          duration:moment(value.songs[0].dt).format('mm:ss')
        })
      }

      //设置页面上方的标题为歌曲名字
      wx.setNavigationBarTitle({
        title:value.songs[0].name
      })

    })
      .catch((error) => { console.log(error) })
    
    //防止反复请求正在播放的歌曲 Url
    if (appData.globalData.musicId>>>0 === musicId && appData.globalData.isPlay) {
      this.setData({
        isPlay:true,
      })
      return
    }
    
    //根据 id 获取歌曲 Url
    http('/song/url',{id:musicId })
      .then((value) => {
        if (value.code === 200) {
          this.setData({ songUrl: value.data[0].url })
          
          //播放歌曲 
          this.musicPlay()
        }

      })
      .catch((error) => { console.log(error) })
  },

  //封装的用于改变全局 app 和 music 页面中的 isPlay 的状态
  changeIsPlay: function (flag) {
    appData.globalData.isPlay = flag
    this.setData({ isPlay: flag })
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