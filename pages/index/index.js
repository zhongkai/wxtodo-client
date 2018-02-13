Page({
  data: {
    todo: '',
    todos: [],
    leftCount: 1,
    allFinished: false,
    allSetting: true,
    clearSetting: true
  },

  onLoad: function() {

    console.info('loading index...');

    var that = this;
    getApp().checkLogin(function() {

      that.load();

      var allSetting = wx.getStorageSync('allSetting');
      if (typeof allSetting == 'boolean') {
        that.setData({ allSetting: allSetting });
      }

      var clearSetting = wx.getStorageSync('clearSetting');
      if (typeof clearSetting == 'boolean') {
        that.setData({ clearSetting: clearSetting });
      }
    });
  },

  onPullDownRefresh: function() {
    this.load();
  },

  onItemRemove: function (e) {
    var index = e.currentTarget.dataset.index;
    var todos = this.data.todos;
    var remove = todos.splice(index, 1)[0];
    var that = this;

    getApp().request({
      url: '/todos/' + remove.id,
      method: 'delete',
      success: function() {
        that.setData({
          todos: todos,
          leftCount: that.data.leftCount - (remove.finished ? 0 : 1)
        });
        getApp().writeHistory(remove, 'delete', +new Date());
      }
    });

  },

  load: function() {

    var that = this;

    wx.showLoading({
      title: '加载待办项目',
      mask: true
    });
      
    getApp().request({
      url: '/todos',
      success: function (res) {
        var todos = res.data.map(function(todo) {
          todo.finished = todo.status == 1;
          todo.tags = [todo.tag1, todo.tag2, todo.tag3].filter(function(tagContent) {
            return tagContent;
          });
          return todo;
        });
        var leftCount = todos.filter(function (item) {
          return item.status == 0;
        }).length;
        that.setData({ todos: todos, leftCount: leftCount, allFinished: !leftCount });
        wx.hideLoading();
      }
    });
  },

  inputTodo: function (e) {
    this.setData({ todo: e.detail.value });
  },

  addTodo: function (e) {
    if (!this.data.todo || !this.data.todo.trim()) return;
    var todos = this.data.todos;
    var that = this;

    getApp().request({
      url: '/todos',
      method: 'POST',
      data: {
        content: this.data.todo
      },
      success: function(result) {
        var todo = { id: result.data[0], content: that.data.todo, finished: false };
        todos.push(todo);
        that.setData({
          todo: '',
          todos: todos,
          leftCount: that.data.leftCount + 1
        });
        getApp().writeHistory(todo, 'create', +new Date());
      }
    });

  },

  toggleTodo: function (e) {
    var index = e.currentTarget.dataset.index;
    var todos = this.data.todos;
    var todo = todos[index];
    var that = this;

    getApp().request({
      url: '/todos/' + todo.id,
      method: 'PATCH',
      data: {
        status: todo.finished ? 0 : 1
      },
      success: function() {
        todo.finished = !todo.finished;
        var leftCount = that.data.leftCount + (todo.finished ? -1 : 1);
        that.setData({
          todos: todos,
          leftCount: leftCount,
          allFinished: !leftCount
        });
        getApp().writeHistory(todo, todo.finished ? 'finish' : 'restart', +new Date());
      }
    });
    
  },

  toggleAll: function (e) {
    var allFinished = !this.data.allFinished;
    var toggles = this.data.todos.filter(function (todo) {
      return todo.finished != allFinished;
    });
    var that = this;
    
    getApp().request({
      url: '/todos/batch',
      method: 'POST',
      data: {
        action: 'update',
        items: toggles.map(function (todo) { return todo.id; }),
        attrs: {
          status: allFinished ? 1 : 0
        }
      },
      success: function () {
        var todos = that.data.todos.map(function(todo) {
          todo.finished = allFinished;
          return todo;
        });
        that.setData({
          todos: todos,
          leftCount: allFinished ? 0 : todos.length,
          allFinished: allFinished
        });
        getApp().writeHistory(null, allFinished ? 'finishAll' : 'restartAll', +new Date());
      }
    });
    
  },
  
  clearFinished: function (e) {
    var todos = this.data.todos;
    var finished = todos.filter(function (todo) {
      return todo.finished;
    });
    var that = this;
    
    getApp().request({
      url: '/todos/batch',
      method: 'POST',
      data: {
        action: 'delete',
        items: finished.map(function(todo){ return todo.id; })
      },
      success: function() {
        var remains = todos.filter(function (todo) {
          return !todo.finished;
        });
        that.setData({ todos: remains });
        getApp().writeHistory(null, 'clear', +new Date());
      }
    });
    
    
  },

  createItem: function (e) {
    wx.navigateTo({ url: '/pages/detail/detail' })
  }
})
