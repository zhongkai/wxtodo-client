Page({
  data: {
    actionTexts: {
      'create': '创建',
      'finish': '完成',
      'restart': '重启',
      'delete': '删除',
      'clear': '清空所有待办事项',
      'restartAll': '重启所有待办事项',
      'finishAll': '完成所有待办事项'
    },
    timeSetting: false,
    history: [],
    groupedHistory: {},
    dates: []
  },

  onShow: function () {
    var history = wx.getStorageSync('history');
    console.info(history);
    if (history) {
      this.setData({ history: history });
      this.processHistory();
    }

    var timeSetting = wx.getStorageSync('timeSetting');
    if (typeof timeSetting == 'boolean') {
      this.setData({ timeSetting: timeSetting });
    }
  },

  onHide: function() {
    this.setData({
      history: [],
      groupedHistory: {},
      dates: []
    });
  },

  onItemRemove: function(e) {
    var pos = e.currentTarget.dataset.pos;
    var history = this.data.history;
    history.splice(pos, 1);
    this.setData({
      history: history
    });
    this.processHistory();
    this.save();
  },

  save: function () {
    wx.setStorageSync('history', this.data.history);
  },

  processHistory: function() {
    var history = this.data.history;
    var dates = [];
    var groupedHistory = history.map(function (item, index) {
      item.pos = index;
      var d = new Date(item.timestamp);
      item.date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      item.time = d.getHours() + ':' + d.getMinutes();
      return item;
    }).reverse().reduce(function (prev, cur) {
      if (!prev[cur.date]) {
        prev[cur.date] = [];
        dates.push(cur.date);
      }
      prev[cur.date].push(cur);
      return prev;
    }, {});

    this.setData({
      groupedHistory: groupedHistory,
      dates: dates
    });
  }
})
