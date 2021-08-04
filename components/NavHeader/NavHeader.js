// components/NavHeader/NavHeader.js
Component({
    /**
     * 组件的属性列表, 由组件外部传入的数据，等同于Vue中的props
     */
    properties: {
        title: {
            type: String,
            value: '我是title默认值'
        },
        nav: {
            type: String,
            value: '我是nav默认值'
        },
        tap:{
            type: String,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        toWhere(e){
            let where = e.currentTarget.dataset.where
            let url = '/pages/'+where+'/'+where
            wx.navigateTo({
              url
            })
        },
    }
})