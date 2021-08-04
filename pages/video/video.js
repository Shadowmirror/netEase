import request from '../utils/request'
// pages/video/video.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], // 导航标签数据
        navId: '', // 导航的标识
        videoList: [], // 视频列表数据
        videoListUrl: [], // 视频url
        videoId: '', // 视频id标识
        videoUpdateTime: [], // 记录video播放的时长
        isTriggered: false, // 标识下拉刷新是否被触发,
        videoGroupListOffset: {}
    },
    toSearch(){
        wx.navigateTo({
            url: '/pages/search/search',
        });
    },
    // 获取导航数据
    async getVideoGroupListData() {
        let videoGroupListData = await request('/video/group/list');
        // 过滤无视频页面
        let temp = videoGroupListData.data.slice(0, 14)
        let videoGroupListDataTemp = []
        for (let i = 0; i < temp.length; i++) {

            if (temp[i].id == 262158 || temp[i].id == 258122) {
                continue
            } else {
                videoGroupListDataTemp.push(temp[i])
            }
        }
        this.setData({
            videoGroupList: videoGroupListDataTemp,
            navId: videoGroupListDataTemp[0].id
        })

        // 获取视频列表数据
        this.getVideoList(this.data.navId, 0);
        this.setData({
            [`videoGroupListOffset.${this.data.navId}`]: 0
        })
    },
    // 获取视频列表数据
    async getVideoList(navId, offset) {
        if(offset == 0){
            if (!navId) { // 判断navId为空串的情况
                return;
            }
            let videoListData = await request('/video/group', {
                id: navId, offset
            });
            let videoListUrlTemp = []
            let videoList = videoListData.datas
            this.setData({
                videoList,
                isTriggered: false // 关闭下拉刷新
            })
            for (let i = 0; i < videoList.length; i++) {
                videoListUrlTemp[i] = await request('/video/url', { id: videoList[i].data.vid })
                videoListUrlTemp[i] = videoListUrlTemp[i].urls[0].url
                this.setData({
                    videoListUrl: videoListUrlTemp
                })
            }
        }
        else{
            let videoListData = await request('/video/group', {
                id: navId, offset
            });
            let videoListUrlTemp = []
            let videoList = this.data.videoList
            videoList.push(...videoListData.datas)
            this.setData({
                videoList
            })
            for (let i = 0; i < videoList.length; i++) {
                videoListUrlTemp[i] = await request('/video/url', { id: videoList[i].data.vid })
                videoListUrlTemp[i] = videoListUrlTemp[i].urls[0].url
            }
            let videoListUrl = this.data.videoListUrl
            videoListUrl.push(...videoListUrlTemp)
            this.setData({
                videoListUrl
            })
        }
        // 关闭消息提示框
        wx.hideLoading();
    },
    // 点击切换导航的回调
    changeNav(e) {
        // 清除上一个标签的视频数据
        let prevNavId = this.data.navId;
        let videoGroupListOffset = this.data.videoGroupListOffset
        videoGroupListOffset[prevNavId] = 0;
        this.setData({
            videoGroupListOffset
        })
        let navId = e.currentTarget.id; // 通过id向e传参的时候如果传的是number会自动转换成string
        // let navId = e.currentTarget.dataset.id;
        this.setData({
            navId: navId >>> 0,
            videoList: [],
            videoListUrl: []
        })
        // 显示正在加载
        wx.showLoading({
            title: '正在加载'
        })
        // 动态获取当前导航对应的视频数据
        this.getVideoList(this.data.navId, 0);
        this.setData({
            [`videoGroupListOffset.${navId}`]: 0
        })
    },
    handlePlay(e) {
    let vid = e.currentTarget.id;
    // 更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })
    },
    // 上拉刷新
    handleRefresher(e){
        // 清除上一个标签的视频数据
        let prevNavId = this.data.navId;
        let videoGroupListOffset = this.data.videoGroupListOffset
        videoGroupListOffset[prevNavId] = 0;
        this.getVideoList(this.data.navId, 0)
    },
    // 触底加视频
    handleToLower(){
        let navId = this.data.navId
        let videoGroupListOffset = this.data.videoGroupListOffset
        this.getVideoList(navId, ++videoGroupListOffset[navId])
        this.setData({
            videoGroupListOffset
        })
    },
    // // 页面下拉动作
    // onPullDownRefresh(){
    //     console.log("页面下拉")
    // },
    // // 页面上拉触底
    // onReachBottom(){
    //     console.log("页面触底")
    // },
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
        // 获取导航数据
        this.getVideoGroupListData();
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