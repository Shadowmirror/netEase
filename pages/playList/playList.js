// pages/playlist/playlist.js
import request from '../utils/request'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listid: '',//歌单id
        playList: [],//歌曲对象
        listImg: '',//歌单图片
        name: '',//歌单名称
        index: 0,//下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取歌单id
        let listid = options.id;
        this.setData({
            listid: listid
        })
        if(!app.globalData.currentListId || app.globalData.currentListId == options.id){
            app.globalData.currentListId = options.id
        }
        //获取歌单歌曲
        this.getPlayList(listid);
        
        
    },

    //获取歌单所对应的歌曲
    async getPlayList(listid) {
        let playListData = await request("/playlist/detail", { id: listid });
        this.setData({
            playList: playListData.playlist.tracks,
            listImg: playListData.playlist.coverImgUrl,
            name: playListData.playlist.name
        })
        if(app.globalData.currentListId == listid && app.globalData.currentMusicList[0].id == playListData.playlist.tracks[0].id){
            app.globalData.currentMusicList = playListData.playlist.tracks
        }
        // 动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.name
        })
    },

    //跳转至song页面
    toSong(e) {
        let { song, index } = e.currentTarget.dataset
        this.setData({
            index
        })
        app.globalData.currentMusicIndex = index
        app.globalData.musicId = song.id
        app.globalData.currentMusicList = this.data.playList
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