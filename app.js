var config = require('./config');

App({
  onLaunch: function() {
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    this.checkLogin();
  },
  login: function() {
    var that = this;
    wx.login({
      success: function (res) {
        // 登录请求
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
      }
    });
  },
  getUserInfo: function() {
    var that = this;
    this.request({
      url: '/user',
      success: function (res) {
        // 未登录
        if (res.statusCode === 401) {
          that.login();
        }
        else {
          // 未注册用户
          if (res.statusCode === 400) {
            that.registerUser();
          }
          else {
            that.globalData.userInfo = res.data;
            wx.hideLoading();
          }
        }
      }
    });
  },
  registerUser: function() {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        userInfo = {
          name: userInfo.nickName,
          avatar: userInfo.avatarUrl
        };
        that.request({
          url: '/user',
          method: 'post',
          data: userInfo,
          success: function (res) {
            that.globalData.userInfo = userInfo;
            wx.hideLoading();
          }
        });
      },
      //授权失败，用默认值注册
      fail: function() {
        that.request({
          url: '/user',
          method: 'post',
          data: that.globalData.userInfo,
          success: function (res) {
            wx.hideLoading();
          }
        });
      }
    })
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
    obj.url = config.host + obj.url;
    obj.header = {
      skey: skey,
      version: config.apiVersion
    };
    return wx.request(obj);
  },
  globalData: {
    //默认值
    userInfo: {
      name: 'todo新手',
      avatar: 'https://yunlaiwu0.cn-bj.ufileos.com/teacher_avatar.png'
    }
  }
})
