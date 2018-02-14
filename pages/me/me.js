Page({

  data: {
    avatar: '',
    name: ''
  },

  onShow: function () {

    this.setData({
      avatar: wx.getStorageSync('avatar') || 'https://yunlaiwu0.cn-bj.ufileos.com/teacher_avatar.png',
      name: wx.getStorageSync('name') || ''
    });

  },

  navTo: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.target == 'setting' ? '/pages/setting/setting' : '/pages/user/user'
    });
  }

})