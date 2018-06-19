//index.js
//获取应用实例
var app = getApp();
console.log(app, 'app');
var wxbarcode = require('../../utils/index');
var util = require('../../utils/index');
//index.js

Page({
    data: {
        nickname: '',
        headerImage: '',
        lever: '黄金会员',
        memberNo: '',
        userInfo: {},
        code: '',
        animationData: {},
        animationBarcode: {},
        animationContainer: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        btnImg: '',
    },
    onLoad: function () {
        var that = this;
        if (app.globalData.userInfo) {
            that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (that.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                that.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    that.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(res.userInfo)
                            //用户已经授权过
                        }
                    })
                }
            }
        });
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            });
        })
    },
    onShow: function () {
        var that = this;
        var animation = wx.createAnimation({
            duration: 100,
            timingFunction: 'ease',
        });

        var animationB = wx.createAnimation({
            duration: 100,
            timingFunction: 'ease',
        });

        var animationC = wx.createAnimation({
            duration: 100,
            timingFunction: 'ease',
        });

        that.animation = animation;
        that.animationB = animationB;
        that.animationC = animationC;
        that.setData({
            animationData: animation.export(),
            animationBarcode: animation.export(),
            animationContainer: animation.export()
        });

        setTimeout(function () {
            that.setData({
                animationData: animation.export(),
                animationBarcode: animationB.export()
            })
        }.bind(that), 100);
        var value = wx.getStorageSync('key');
        that.setData({
            code: value.memberNo,
            btnImg: value.btnImg
        });
        wxbarcode.barcode('barcode', value.memberNo + ' ', 493, 124);
    },
    //事件处理函数
    detailClick: function () {
        wx.navigateTo({
            url: '../../pages/userInfo/userInfo'
        });
    },
    barCodeShow: function (e) {
        var that = this;
        var hei = '400rpx';
        that.animation.opacity(0).step();
        that.animationB.translateY(100).step();
        that.animationC.height(hei).step();
        that.setData({
            animationData: that.animation.export(),
            animationBarcode: that.animationB.export(),
            animationContainer: that.animationC.export(),
            flag: true,
        })
    },
    barCodeHide: function () {
        var that = this;
        var hei = '260rpx';
        that.animationB.translateY(0).step();
        that.animation.opacity(1).step();
        that.animationC.height(hei).step();
        that.setData({
            animationData: that.animation.export(),
            animationBarcode: that.animationB.export(),
            animationContainer: that.animationC.export(),
            flag: false,
        })
    },
    getUserInfo: function (e) {
        var that = this;
        if (e.detail.userInfo) {
            wx.getUserInfo({
                success: function (res) {
                    util.getData(
                        "https://***.com",
                        'POST',
                        {
                            jsCode: app.globalData.code,
                            encryptedData: res.encryptedData,
                            iv: res.iv
                        }
                    )
                        .then(function (data) {
                            wx.setStorageSync('key', {
                                mobile: data.data.result.mobile,
                                birthday: data.data.result.birthday,
                                sex: data.data.result.sex,
                                memberNo: data.data.result.memberNo,
                                btnImg: true
                            });
                            var value = wx.getStorageSync('key');
                            that.setData({
                                code: value.memberNo,
                                btnImg: value.btnImg
                            });
                            var codeValue = value.memberNo + ' ';
                            console.log(value.memberNo, 'value.memberNo');
                            wxbarcode.barcode('barcode', codeValue, 493, 124);
                        });
                }
            })
        } else {
            //用户按了拒绝按钮
        }
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
});