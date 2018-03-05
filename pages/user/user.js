Page({

  data: {
    avatar: '',
    name: ''
  },

  onLoad: function () {
    this.setData({
      avatar: wx.getStorageSync('avatar') || 'https://yunlaiwu0.cn-bj.ufileos.com/teacher_avatar.png',
      name: wx.getStorageSync('name') || ''
    });
  },

  //未点完成失去焦点复原（change优先于blur触发）
  blurName: function(e) {
    this.setData({ name: wx.getStorageSync('name') });
  },

  changeName: function(e) {
    var name = e.detail.value.trim();

    if(name) {
      wx.setStorageSync('name', name);
    }

  },

  changeAvatar: function(e) {

    var that = this;
    
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.saveFile({
          tempFilePath: tempFilePaths[0],
          success: function (res) {
            var savedFilePath = res.savedFilePath;
            wx.setStorageSync('avatar', savedFilePath);
            that.setData({avatar: savedFilePath});
          }
        });
      }
    })
  }
})