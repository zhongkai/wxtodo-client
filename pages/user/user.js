var config = require('../../config');

Page({

  data: {
    avatar: '',
    name: ''
  },

  onShow: function () {
    this.setData(getApp().globalData.userInfo);
  },

  changeName: function(e) {
    var name = e.detail.value.trim();
    var that = this;

    if(name) {

      wx.showLoading({
        title: '更新用户信息',
        mask: true
      });
      
      getApp().request({
        url: '/user',
        method: 'patch',
        data: {
          name: name
        },
        success: function() {
          wx.hideLoading();
          getApp().globalData.userInfo.name = name;
          that.data.name = name;
        }
      });
    }
    else {
      this.setData({
        name: this.data.name
      });
    }

  },

  changeAvatar: function(e) {

    var that = this;
    
    wx.chooseImage({
      success: function (res) {

        wx.showLoading({
          title: '更新用户信息',
          mask: true
        });

        wx.uploadFile({
          header: {
            skey: wx.getStorageSync('skey')
          },
          url: config.host + '/user/avatar',
          filePath: res.tempFilePaths[0],
          name: 'avatar',
          success: function(res) {
            getApp().request({
              url: '/user',
              method: 'patch',
              data: {
                avatar: res.data
              },
              success: function () {
                wx.hideLoading();
                getApp().globalData.userInfo.avatar = res.data;
                that.setData({ avatar: res.data });
              }
            });

          }
        });
        
      }
    });
  }
})