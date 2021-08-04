import request from "../utils/request"
// pages/recommend/recommend.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        limit: 10,
        recommendList: []
    },
    async getRecommendList(){
        let {
            limit
        } = this.data
        let recommendListData = await request('/personalized', {limit})
        this.setData({
            recommendList: recommendListData.result,
        })
    },
    toPlayList(e) {

        wx.navigateTo({
            url: '/pages/playList/playList?id=' + e.currentTarget.id,
        })
    },

    more(){
        let {limit} = this.data
        this.setData({
            limit: limit+10
        })
        this.getRecommendList()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.getRecommendList()
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