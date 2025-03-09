Page({
  data: {
    
  },

  onLoad: function() {
    
  },

  // 处理功能点击
  handleFunction: function(e) {
    const type = e.currentTarget.dataset.type;
    
    switch(type) {
      case 'history':
        wx.showToast({
          title: '计算历史功能开发中',
          icon: 'none',
          duration: 1500
        });
        break;
      case 'feedback':
        wx.showToast({
          title: '意见反馈功能开发中',
          icon: 'none',
          duration: 1500
        });
        break;
      case 'about':
        wx.showModal({
          title: '关于我们',
          content: '计算器大全 v1.0.0\n一款功能强大的多功能计算器应用',
          showCancel: false
        });
        break;
      case 'settings':
        wx.showToast({
          title: '设置功能开发中',
          icon: 'none',
          duration: 1500
        });
        break;
      default:
        break;
    }
  }
}) 