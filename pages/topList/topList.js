// pages/topList/topList.js
import request from "../utils/request"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topListTotal: [],
        topList: [],
        length: 10,
        more: "更多..."
    },
    async getTopList() {
        let topData = await request("/toplist/detail")
        let topListTotal = topData.list;
        let topList = topListTotal.slice(0, 10)
        this.setData({
            topListTotal,
            topList
        })
    },
    toPlayList(e) {
        wx.navigateTo({
            url: '/pages/playList/playList?id=' + e.currentTarget.id,
        })
    },
    more() {
        let {
            length,
            topListTotal,
            topList
        } = this.data
        if(length == topListTotal.length){
            return
        }
        if(length + 10 < topListTotal.length){
            length = length + 10
        }else{
            length = topListTotal.length
            this.setData({
                more: "没有更多了"
            })
        }
        topList = topListTotal.slice(0, length)
        this.setData({
            length,
            topList
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getTopList()
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