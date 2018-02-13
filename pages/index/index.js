Page({
  data: {
    todo: '',
    todos: [],
    leftCount: 1,
    allFinished: false,
    allSetting: true,
    clearSetting: true
  },

  save: function () {
    wx.setStorageSync('todos', this.data.todos);
  },

  onShow: function () {
    var todos = wx.getStorageSync('todos');
    if (todos) {
      var leftCount = todos.filter(function (item) {
        return !item.finished
      }).length;
      this.setData({ todos: todos, leftCount: leftCount });
    }

    var allSetting = wx.getStorageSync('allSetting');
    if(typeof allSetting == 'boolean') {
      this.setData({ allSetting: allSetting});
    }

    var clearSetting = wx.getStorageSync('clearSetting');
    if (typeof clearSetting == 'boolean') {
      this.setData({ clearSetting: clearSetting });
    }
  },

  onItemRemove: function (e) {
    var index = e.currentTarget.dataset.index;
    var todos = this.data.todos;
    var remove = todos.splice(index, 1)[0];
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount - (remove.finished ? 0 : 1)
    });
    this.save();
    getApp().writeHistory(remove, 'delete', +new Date());
  },

  inputTodo: function (e) {
    this.setData({ todo: e.detail.value });
  },

  addTodo: function (e) {
    if (!this.data.todo || !this.data.todo.trim()) return;
    var todos = this.data.todos;
    var todo = { content: this.data.todo, finished: false };
    todos.push({ content: this.data.todo, finished: false });
    this.setData({
      todo: '',
      todos: todos,
      leftCount: this.data.leftCount + 1
    });
    this.save();
    getApp().writeHistory(todo, 'create', +new Date());
  },

  toggleTodo: function (e) {
    var index = e.currentTarget.dataset.index;
    var todos = this.data.todos;
    var todo = todos[index];
    todo.finished = !todo.finished;
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todo.finished ? -1 : 1)
    });
    this.save();
    getApp().writeHistory(todo, todo.finished ? 'finish' : 'restart', +new Date());
  },

  toggleAll: function (e) {
    this.data.allFinished = !this.data.allFinished
    var todos = this.data.todos
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].finished = this.data.allFinished;
    }
    this.setData({
      todos: todos,
      leftCount: this.data.allFinished ? 0 : todos.length
    })
    this.save();
    getApp().writerHistory(null, this.data.allFinished ? 'finishAll' : 'restartAll', +new Date());
  },
  
  clearFinished: function (e) {
    var todos = this.data.todos
    var remains = []
    for (var i = 0; i < todos.length; i++) {
      todos[i].finished || remains.push(todos[i]);
    }
    this.setData({ todos: remains });
    this.save();
    getApp().writerHistory(null, 'clear', +new Date());
  },

  createItem: function (e) {
    wx.navigateTo({ url: '/pages/detail/detail' })
  }
})
