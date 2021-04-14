import http from '../../utils/http'
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoLabel: [],//视频标签列表
    labelId: '' ,//点击视频标签的 id
    videoData: [], //每个视频分类标签下的一组视频
    vid: '',  //请求视频地址的 id
    videoUrl: '', //视频的播放地址
    videoMemoryArr: [], //存放着每一个视频播放记录的数组
    videoPlayMemoryTime: null, //记录视频播放的位置
    refresherTrigger: false //下拉刷新的状态 true 为下拉
  },

  //点击视频分类标签
  handleLabel: function (e) {

    let id = e
    if (typeof id !== 'number') {
      this.setData({
        labelId: e.currentTarget.dataset.id >>> 0,
        videoData:[]
      })
      id = e.currentTarget.dataset.id
    }

    //加载提示
    wx.showLoading({
      mask:true
    })

    //获取视频标签下对应的视频数据
    http('/video/group', {id})
      .then((value) => {
        if (value.code === 200) {
          wx.hideLoading() //加载隐藏
          let videoData = value.datas.map((item) => {
            return item.data
          })
          this.setData({videoData,refresherTrigger:false})
        }
      })
      .catch((error)=>{console.log(error)})
  },

  //点击播放视频
  handlePlay: function (e) {

    //播放其他视频时，停止当前视频播放
    this.videoContext &&  this.setData({vid:""})  

    //加载提示
    wx.showLoading({
      mask:true
    })

    //根据视频 id 请求视频播放地址
    http('/video/url', { id: e.currentTarget.id })
      .then((value) => {
        if (value.code === 200) {
          wx.hideLoading() //加载隐藏
          this.setData({
            videoUrl: value.urls[0].url,
            vid:e.currentTarget.id
          })
        }
      })
      .catch((error) => { console.log(error) })
    
    // 查找记录视频播放记录的数组中是否存入某视频的播放记录
    const {videoMemoryArr} = this.data
    let resultObj = videoMemoryArr.find(item => item.vid === e.currentTarget.id)

    //有记录则把播放记录更新到 videoPlayMemoryTime 状态中，无则为 null
    if (resultObj) {
      this.setData({videoPlayMemoryTime:resultObj.videoPlayMemoryTime})
    } else this.setData({ videoPlayMemoryTime: null })

    //如果该视频的播放记录时间和视频时长相等，即播放完，把该视频的记录从数组中 videoMemoryArr 移除
    if (resultObj && resultObj.videoPlayMemoryTime === resultObj.duration) {
      this.setData({ videoPlayMemoryTime: null })
      videoMemoryArr.splice(videoMemoryArr.findIndex(item=>item.vid === e.currentTarget.id),1)  
    }
  },

  //生成存视频的播放记录的数组，存入状态 videoMemoryArr 中
  handleBindtimeupdate(e) {


    let {duration,currentTime} = e.detail
    let {videoMemoryArr} = this.data

    //生成一个视频的播放记录
    let obj = {
      vid: e.currentTarget.dataset.vid, //该视频的 id
      videoPlayMemoryTime: currentTime, //该视频的播放时间的位置
      duration //该视频的总时长
    }
    
    //查找是否已经往数组中录入过该视频的播放记录，有则修改播放时间，无则录入
    let findObj = videoMemoryArr.find((item)=>item.vid === e.currentTarget.dataset.vid)
    if (findObj) {
      findObj.videoPlayMemoryTime = currentTime
    } else {
      videoMemoryArr.push(obj)
    }

    this.setData({
      videoMemoryArr,
    }) 
  },

  //自定义下拉刷新被触发的回调
  handleRefresherRefresh: function () {
    //下拉刷新请求最新的数据
    this.handleLabel(this.data.labelId)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //加载提示
    wx.showLoading({
      mask:true
    })

    //获取视频分类列表
    http('/video/category/list')
      .then((value) => {
        // console.log(value)
        //请求视频分类列表需要先登录，跳转到登录页面
        if (value.code === 301 && value.msg === "需要登录") {
          wx.redirectTo({
            url:"/pages/login/login"
          })
        }

        //请求成功
        if (value.code === 200) {
          this.setData({
            videoLabel:value.data.filter(item=>item.name !== 'MV'),
            labelId:value.data.filter(item=>item.name !== 'MV')[0].id //初始活动的视频标签
          })
          this.handleLabel(this.data.labelId>>>0)  //页面一加载请求第一个视频标签的内容 传入该视频标签的 id
        }
      })
      .catch((error) => { console.log(error) })
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

  },

  //创建视频播放的 videoContext 实例对象用以控制某个视频播放暂定等
 /*  controlPlay: function (vid) {
    //播放视频
    this.videoContext = wx.createVideoContext(vid)
    const { videoMemoryArr } = this.data
    let obj = videoMemoryArr.find(item => item.vid === vid)
    console.log(videoMemoryArr)
    if(obj) this.videoContext.seek(obj.videoPlayMemoryTime)
  },  */
})