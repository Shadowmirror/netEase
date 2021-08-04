import moment from 'moment'
import request from '../utils/request'
// 获取全局实例
const appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, // 音乐是否播放
        song: {}, // 歌曲详情对象
        musicId: '', // 音乐id
        musicLink: '', // 音乐的链接
        currentTime: '00:00', // 实时时间
        durationTime: '00:00', // 总时长
        currentWidth: 0, // 实时进度条的宽度
        lyric: [], //歌词
        lyricTime: 0, //歌词对应的时间
        currentLyric: "", //当前歌词对象
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // options: 用于接收路由跳转的query参数
        // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取掉
        // console.log(JSON.parse(options.songPackage));
        let musicId = options.musicId;
        this.setData({
            musicId
        })
        // 获取音乐详情
        this.getMusicInfo(musicId);
        this.musicControl(true, musicId)
        this.getLyric(musicId)
        // 判断当前页面音乐是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == musicId) {
            // 修改当前页面音乐播放状态为true
            this.setData({
                isPlay: true
            })
        } else {
            this.musicControl(true, musicId)
        }
        // 创建控制音乐播放的实例
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        // 听歌时TodaySong换歌
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId != musicId) {
            this.backgroundAudioManager.stop()
        }

        // 监视音乐播放/暂停/停止
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true);
            // 修改全局音乐播放的状态
            appInstance.globalData.musicId = musicId;
        });
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false);
        });
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false);
        });

        // 监听音乐播放自然结束
        this.backgroundAudioManager.onEnded(() => {
            this.changePlayState(false);
            this.setData({
                currentWidth: 0,
                currentTime: '00:00',
                lyric: [],
                lyricTime: 0,
            })
            this.handleSwitch('next')

        })

        // 监听音乐实时播放的进度
        this.backgroundAudioManager.onTimeUpdate(() => {
            // console.log('总时长: ', this.backgroundAudioManager.duration);
            // console.log('实时的时长: ', this.backgroundAudioManager.currentTime);
            // 格式化实时的播放时间
            let lyricTime = Math.ceil(this.backgroundAudioManager.currentTime);
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
            this.setData({
                lyricTime,
                currentTime,
                currentWidth
            })
            this.getCurrentLyric();

        })
    },
    // 修改播放状态的功能函数
    changePlayState(isPlay) {
        // 修改音乐是否的状态
        this.setData({
            isPlay
        })

        // 修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = isPlay;
    },
    // 获取音乐详情的功能函数
    async getMusicInfo(musicId) {
        let songData = await request('/song/detail', {
            ids: musicId
        });
        // songData.songs[0].dt 单位ms
        let durationTime = moment(songData.songs[0].dt).format('mm:ss');
        this.setData({
            song: songData.songs[0],
            durationTime
        })

        // 动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.song.name
        })
    },
    // 点击播放/暂停的回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        // // 修改是否播放的状态
        // this.setData({
        //   isPlay
        // })

        let {
            musicId,
            musicLink
        } = this.data;
        this.musicControl(isPlay, musicId, musicLink);
    },

    // 控制音乐播放/暂停的功能函数
    async musicControl(isPlay, musicId, musicLink) {

        if (isPlay) { //音乐播放
            //获取音频资源
            if (!musicLink) {
                let musicLinkData = await request('/song/url', {
                    id: musicId
                })
                musicLink = musicLinkData.data[0].url;
                this.setData({
                    musicLink
                })
            }
            //歌曲播放
            this.backgroundAudioManager.src = musicLink;
            this.backgroundAudioManager.title = this.data.song.name;
        } else { //音乐暂停
            this.backgroundAudioManager.pause();
        }
    },

    // 点击切歌的回调
    handleSwitch(e) {
        let type;
        // 自动切歌
        if(e == "next"){
            type = "next"
        }else{
            type = e.currentTarget.id;
        }
        let index = appInstance.globalData.currentMusicIndex
        let MusicList = appInstance.globalData.currentMusicList
        this.backgroundAudioManager.stop()
        if (type === 'pre') { // 上一首
            (index === 0) && (index = MusicList.length);
            index -= 1;
        } else { // 下一首
            (index === MusicList.length - 1) && (index = -1);
            index += 1;
        }
        appInstance.globalData.musicId = MusicList[index].id
        let musicId = appInstance.globalData.musicId
        // 获取音乐详情信息
        this.getMusicInfo(musicId);
        // 自动播放当前的音乐
        this.musicControl(true, musicId);
        this.getLyric(musicId);
        this.setData({
            musicId
        })
        appInstance.globalData.currentMusicIndex = index
    },
    //获取歌词
    async getLyric(musicId) {
        let lyricData = await request("/lyric", {
            id: musicId
        });
        if (lyricData.nolyric) {
            wx.showToast({
                title: '无歌词',
                icon: 'none',
                duration: 3000,
            });
        } else {
            this.formatLyric(lyricData.lrc.lyric);

        }

    },
    //传入初始歌词文本text
    formatLyric(text) {
        let result = [];
        let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
        let row = arr.length; //获取歌词行数
        for (let i = 0; i < row; i++) {
            let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
            let temp_arr = temp_row.split("]"); //我们可以通过“]”对时间和文本进行分离
            let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
            //再对剩下的歌词时间进行处理
            temp_arr.forEach(element => {
                let obj = {};
                let time_arr = element.substr(1, element.length - 1).split(":"); //先把多余的“[”去掉，再分离出分、秒
                let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
                obj.time = s;
                obj.text = text;
                result.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
            });
        }
        result.sort(this.sortRule) //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
        this.setData({
            lyric: result
        })

    },
    sortRule(a, b) { //设置一下排序规则
        return a.time - b.time;
    },
    //控制歌词播放
    getCurrentLyric() {
        let j;
        for (j = 0; j < this.data.lyric.length - 1; j++) {
            if (this.data.lyricTime == this.data.lyric[j].time) {
                this.setData({
                    currentLyric: this.data.lyric[j].text
                })
            }
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