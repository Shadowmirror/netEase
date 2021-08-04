import request from "../utils/request";
let startY = 0 // 手指起始坐标
let moveY = 0 // 手指移动坐标
let moveDistance = 0 // 手指移动距离
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    currentMusicList: [],
    currentMusicIndex: '',
  },
  handleTouchStart(e) {
    //获取起始坐标
    startY = e.touches[0].clientY;
    this.setData({
      coverTransition: ''
    })
  },
  handleTouchMove(e) {
    moveY = e.touches[0].clientY
    moveDistance = moveY - startY
    if (moveDistance <= 0) {
      return
    }
    if (moveDistance >= 100) {
      moveDistance = 100
    }
    // 动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  getCurrentPlayList() {
    let {currentMusicList, currentMusicIndex} = app.globalData
    this.setData({
      currentMusicList,
      currentMusicIndex
    })
    
    
  },
  
  toCurrentSong(e){
    wx.navigateTo({
      url: '/pages/song/song?musicId=' + e.currentTarget.id,
      success: ()=>{
        app.globalData.musicId = e.currentTarget.id
        app.globalData.currentMusicIndex = e.currentTarget.dataset.index
      }
  })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) { // 用户登录
      // 更新userInfo的状态
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      // 获取用户播放记录
      
    }
    
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
    this.getCurrentPlayList()
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