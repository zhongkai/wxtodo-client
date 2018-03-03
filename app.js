var config = require('./config');

App({
  onLaunch: function() {
    this.checkLogin();
  },
  login: function() {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://i4wt4wyj.qcloud.la/login',
            data: {
              code: res.code
            },
            success: function (res) {
              var skey = res.data.skey;

              //如果获取不到skey，则重试
              if(!skey) {
                that.login();
                return;
              }

              wx.setStorageSync('skey', skey);
              that.getUserInfo();
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getUserInfo: function() {
    var that = this;
    this.request({
      url: config.host + '/user',
      success: function (res) {
        var data = res.data;
        if (data.isLogin) {
          //TODO
        }
        else {
          that.login();
        }
      }
    });
  },
  checkLogin: function() {
    var skey = wx.getStorageSync('skey');
    if(skey) {
      this.getUserInfo();
    }
    else {
      this.login();
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
  },
  request: function(obj) {
    var skey = wx.getStorageSync('skey');
    obj.header = {
      skey: skey,
      'content-type': 'application/json'
    };
    return wx.request(obj);
  },
  globalData: {
    userInfo: {

    }
  }
})
