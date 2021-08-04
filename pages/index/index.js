import request from '../utils/request'
const appInstance = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [], //轮播图数据
        recommendList: [], // 推荐歌曲数据
        topList: [], // 各种排行榜单
        topListMuisc: []
    },
    toTodaySong() {
        wx.navigateTo({
            url: '/pages/TodaySong/TodaySong',
        });
    },
    toPlayList(e) {
        
        wx.navigateTo({
            url: '/pages/playList/playList?id=' + e.currentTarget.id,
        })
    },
    toSearch(){
        wx.navigateTo({
            url: '/pages/search/search',
        });
    },
    toSongTop(e) {
        wx.navigateTo({
            url: '/pages/song/song?musicId=' + e.currentTarget.id,
            success: ()=>{
                appInstance.globalData.musicId = e.currentTarget.id
                appInstance.globalData.isMusicPlay = true
                let topindex = e.currentTarget.dataset.topindex
                appInstance.globalData.currentMusicList = this.data.topListMuisc[topindex]
                appInstance.globalData.currentMusicIndex = e.currentTarget.dataset.index
            }
        })
    },
    toRecommend(){
        wx.navigateTo({
          url: '/pages/recommend/recommend',
        })
    },
    toTopList(){
        wx.navigateTo({
          url: '/pages/topList/topList',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let bannerListData = await request('/banner', '{type: 2}')
        this.setData({
            bannerList: bannerListData.banners,
        })
        let recommendListData = await request('/personalized', { limit: 10 })
        this.setData({
            recommendList: recommendListData.result,
        })
        let topData = await request("/toplist/detail")
        let topListDataTemp = topData.list;
        let topListMuiscDataTemp = [];
        let topListMuiscData = [];
        let topListData = topListDataTemp.slice(0, 8) //仅保留8个榜单
        this.setData({
            topList: topListData
        })
        for (let i = 0; i < topListData.length; i++) {
            topListMuiscDataTemp[i] = await request("/playlist/detail?id=" + topListData[i].id)
            topListMuiscData[i] = topListMuiscDataTemp[i].playlist.tracks
            topListMuiscData[i].splice(10) // 仅保留榜单的前10个音乐
            this.setData({
                topListMuisc: topListMuiscData
            })
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