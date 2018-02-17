Component({

  properties: {
    // content: {
    //   type: String,
    //   value: ''
    // },
    tags: {
      type: Array,
      value: []
    },
    extra: {
      type: String,
      value: ''
    },
    finished: {
      type: Boolean,
      value: false
    },
    index: {
      type: Number,
      value: 0
    },
    action: {
      type: String,
      value: ''
    }
  },

  data: {
    collapsed: true
  },

  methods: {
    removeTodo: function (e) {
      this.triggerEvent('itemremove', e.currentTarget.dataset.index)
    },
    toggleExtra: function(e) {
      this.setData({
        collapsed: !this.data.collapsed
      });
    }
  }
})
