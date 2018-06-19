//logs.js
var app = getApp();
var getPhone = require('../../utils/index');
Page({
    data: {
        userInfo: {},
        mobile: '',
        birthday:'',
        sex: '',
        sexArray: ['男', '女'],
        sexIndex: 0,
        memberNo:''
    },
    onLoad: function (e) {
        var that = this;
        var value = wx.getStorageSync('key');
        this.setData({
            mobile: value.mobile,
            birthday: value.birthday,
            sexIndex: value.sex,
            memberNo:value.memberNo
        });
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据

            that.setData({
                userInfo: userInfo
            })
        })
    },
    bindPickerChange: function (e) {
        this.setData({
            sexIndex: e.detail.value
        })
    },
    bindDateChange: function (e) {
        this.setData({
            birthday: e.detail.value
        })
    }
})