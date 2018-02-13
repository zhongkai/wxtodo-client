App({
  onLaunch: function() {

    var name = wx.getStorageSync('name');
    var avatar = wx.getStorageSync('avatar');

    if (!name || !avatar) {
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo;
          wx.setStorageSync('name', userInfo.nickName);
          wx.setStorageSync('avatar', userInfo.avatarUrl);
        }
      });
    }
  },
  writeHistory: function (todo, action, timestamp) {
    var history = wx.getStorageSync('history') || [];
    history.push({
      todo: todo ? {
        content: todo.content || '',
        tags: todo.tags || [],
        extra: todo.extra || ''
      } : null,
      action: action,
      timestamp: timestamp
    });
    wx.setStorageSync('history', history);
  }
})
