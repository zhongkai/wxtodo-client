Page({

  data: {
    avatar: '',
    name: ''
  },

  onShow: function () {
    this.setData(getApp().globalData.userInfo);
  },

  navTo: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.target == 'setting' ? '/pages/setting/setting' : '/pages/user/user'
    });
  }

})