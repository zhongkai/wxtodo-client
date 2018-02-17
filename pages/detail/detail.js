Page({
  data: {
    content: '',
    tag: '',
    tags: [],
    extra: ''
  },

  inputContent: function(e) {
    this.setData({ content: e.detail.value.trim() });
  },

  inputExtra: function (e) {
    this.setData({ extra: e.detail.value.trim() });
  },

  addTag: function (e) {
    var tag = e.detail.value.trim();
    if (!tag) return;
    var tags = this.data.tags;
    tags.push(tag);
    this.setData({tag: '', tags: tags});
  },

  removeTag: function (e) {
    var index = e.currentTarget.dataset.index;
    var tags = this.data.tags;
    tags.splice(index, 1);
    this.setData({
      tags: tags
    });
  },

  create: function() {
    if(!this.data.content) {
      wx.showToast({title: '请填写待办内容~', icon: 'none'});
      return;
    }
    var todos = wx.getStorageSync('todos') || [];
    var todo = {
      content: this.data.content,
      tags: this.data.tags,
      extra: this.data.extra
    };
    todos.push(todo);
    wx.setStorageSync('todos', todos);
    getApp().writeHistory(todo, 'create', +new Date());
    wx.navigateBack();
  }
})