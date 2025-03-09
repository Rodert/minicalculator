Page({
  data: {
    
  },

  onLoad: function() {
    
  },

  // 导航到不同类型的计算器
  navigateToCalculator: function(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'normal') {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    } else if (type === 'mortgage') {
      wx.navigateTo({
        url: '/pages/mortgage/mortgage'
      });
    } else {
      wx.showToast({
        title: '功能开发中',
        icon: 'none',
        duration: 1500
      });
    }
  }
})