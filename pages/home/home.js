Page({
  data: {
    
  },

  onLoad: function() {
    
  },

  // 导航到不同类型的计算器
  navigateToCalculator: function(e) {
    const type = e.currentTarget.dataset.type;
    
    switch(type) {
      case 'normal':
        // 导航到通用计算器
        wx.navigateTo({
          url: '/pages/index/index'
        });
        break;
      case 'relative':
        // 亲戚称呼计算器（暂未实现）
        wx.showToast({
          title: '功能开发中',
          icon: 'none',
          duration: 1500
        });
        break;
      case 'unit':
        // 单位换算计算器（暂未实现）
        wx.showToast({
          title: '功能开发中',
          icon: 'none',
          duration: 1500
        });
        break;
      case 'mortgage':
        // 房贷计算器（暂未实现）
        wx.showToast({
          title: '功能开发中',
          icon: 'none',
          duration: 1500
        });
        break;
      default:
        break;
    }
  }
}) 