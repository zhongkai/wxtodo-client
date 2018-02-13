Component({

  properties: {
    content: {
      type: String,
      value: ''
    },
    tags: {
      type: Array,
      value: []
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

  },

  methods: {
    removeTodo: function (e) {
      this.triggerEvent('itemremove', e.currentTarget.dataset.index)
    }
  }
})
