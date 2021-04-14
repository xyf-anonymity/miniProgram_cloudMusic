// index.js
import http from '../../utils/http'
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{},
    hasUserInfo:false,
    canIUseGetUserProfile: false,
    bannerList: [], //初始化轮播图
    recommendMusicList: [],
    musicRanks: []
  },

  // 事件处理函数
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    //发送请求轮播图
    http('/banner', { type: 2 })
      .then((value) => {
        if (value.code === 200) {
          this.setData({
            bannerList:value.banners
          })
        }
      })
      .catch((err) => { console.log(err) })
    
    //发送请求推荐歌单
    http('/personalized')
      .then((value) => {
        if (value.code === 200) {
          this.setData({
            recommendMusicList:value.result
          })
        }
      })
      .catch((err) => { console.log(err) })
    
    
    //获取所有歌曲榜单
    http('/toplist/detail')
      .then((value) => {
        if (value.code === 200) {
          let topList = []
          let obj = {}
          value.list.forEach((item) => {
            obj = { name: item.name, id: item.id }
            topList.push(obj)
          })
          return topList //所有歌曲榜单
        }
      })
      .then((topList) => {
        //请求歌曲排行榜（获取歌单详情）
        let num = 0
        let musicRanksItem = {}
        let musicRanks = []
        while (num < topList.length) {
          http('/playlist/detail', { id:topList[num++].id })
            .then((value) => {
              if (value.code === 200) {
                const { id, name, tracks } = value.playlist
                let tracksAl = []
                tracks.slice(0,5) && tracks.slice(0,5).forEach(item => {tracksAl.push(item.al)})
                musicRanksItem = { id, name, tracks: tracksAl }
                musicRanks.push(musicRanksItem)
                this.setData({musicRanks})
              }
            })
        }
      })
      .catch((error)=>{console.log(error)})
    
    
    

   
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail:(res)=>{
        console.log(res)
      }
    })
  },

  toRecommend() {
    wx.navigateTo({
      url:"/pages/recommend/recommend"
    })
  }

})
