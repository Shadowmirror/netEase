import request from "../utils/request";
const app = getApp()
// pages/TodaySong/TodaySong.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        dailySongs: [],
        index: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 判断用户是否登录
        let userInfo = wx.getStorageSync('userInfo')
        if (!userInfo) {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                success: () => {
                    wx.reLaunch({
                        url: '/pages/login/login',
                    })
                }
            })
        }
        // 日期
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1
        })
        // 获取每日推荐数据
        this.getDailySongs()
    },

    // 获取每日歌曲
    async getDailySongs() {
        let dailyListData = await request('/recommend/songs')
        this.setData({
            dailySongs: dailyListData.data.dailySongs
        })
        if(!app.globalData.currentMusicList || app.globalData.musicId == this.data.dailySongs[0].id){
            app.globalData.currentMusicList = this.data.dailySongs
        }
        
    },

    // 跳转至song页面
    toSong(e) {
        let { song, index } = e.currentTarget.dataset
        this.setData({
            index
        })
        app.globalData.currentMusicList = this.data.dailySongs
        app.globalData.currentMusicIndex = index
        wx.navigateTo({
            url: '/pages/song/song?musicId=' + song.id,
           
        })
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