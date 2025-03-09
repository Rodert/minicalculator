Page({
  data: {
    
  },

  onLoad: function() {
    
  },

  // 处理功能点击
  handleFunction: function(e) {
    const type = e.currentTarget.dataset.type;
    
    if (type === 'about') {
      wx.showModal({
        title: '关于我们',
        content: '计算器大全 v1.0.0\n一款功能强大的多功能计算器应用',
        showCancel: false
      });
    }
  }
}) 