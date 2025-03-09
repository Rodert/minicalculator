Page({
  data: {
    loanType: 'commercial', // 贷款类型：商业贷款、公积金贷款、组合贷款
    commercialAmount: '', // 商业贷款金额（万元）
    fundAmount: '', // 公积金贷款金额（万元）
    loanYears: 30, // 贷款年限
    yearOptions: Array.from({length: 30}, (_, i) => 30 - i), // 可选择的按揭年数，从30年递减到1年
    repaymentMethod: 'equal', // 还款方式：等额本息(equal)、等额本金(principal)
    commercialRate: 4.9, // 商业贷款基准利率
    commercialRateFactor: 1, // 商业贷款利率倍数
    actualCommercialRate: 4.9, // 商业贷款实际利率
    fundRate: 3.1, // 公积金贷款基准利率
    fundRateFactor: 1, // 公积金贷款利率倍数
    actualFundRate: 3.1, // 公积金贷款实际利率
    showResult: false, // 是否显示计算结果
    monthlyPayment: '0.00', // 每月还款
    totalInterest: '0.00', // 支付利息
    totalPayment: '0.00', // 还款总额
    firstMonthPayment: '0.00', // 首月还款（等额本金时使用）
    lastMonthPayment: '0.00', // 末月还款（等额本金时使用）
    monthlyDecrement: '0.00' // 每月递减金额（等额本金时使用）
  },

  onLoad: function() {
    // 初始化实际利率
    this.calculateActualRate();
  },

  // 加载历史记录
  loadHistory: function() {
    try {
      const history = wx.getStorageSync('mortgageHistory');
      if (history) {
        this.setData({
          historyList: JSON.parse(history)
        });
      }
    } catch (e) {
      console.error('加载历史记录失败', e);
    }
  },

  // 保存历史记录
  saveHistory: function() {
    try {
      const { loanType, commercialAmount, fundAmount, loanYears, repaymentMethod,
             actualCommercialRate, actualFundRate, monthlyPayment, totalInterest,
             totalPayment, firstMonthPayment, lastMonthPayment, monthlyDecrement } = this.data;

      let historyList = this.data.historyList;
      
      // 创建新的历史记录
      const newRecord = {
        timestamp: new Date().getTime(),
        loanType,
        commercialAmount,
        fundAmount,
        loanYears,
        repaymentMethod,
        actualCommercialRate,
        actualFundRate,
        monthlyPayment,
        totalInterest,
        totalPayment,
        firstMonthPayment,
        lastMonthPayment,
        monthlyDecrement
      };

      // 添加新记录到开头
      historyList.unshift(newRecord);
      
      // 限制历史记录数量为20条
      if (historyList.length > 20) {
        historyList = historyList.slice(0, 20);
      }
      
      // 更新数据
      this.setData({
        historyList: historyList
      });
      
      // 保存到本地存储
      wx.setStorageSync('mortgageHistory', JSON.stringify(historyList));

      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
    } catch (e) {
      console.error('保存历史记录失败', e);
      wx.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 清除历史记录
  clearHistory: function() {
    this.setData({
      historyList: []
    });
    wx.setStorageSync('mortgageHistory', '[]');
    wx.showToast({
      title: '已清除历史记录',
      icon: 'success',
      duration: 2000
    });
  },

  // 使用历史记录项
  useHistoryItem: function(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.historyList[index];
    
    this.setData({
      ...item,
      showHistory: false,
      showResult: true
    });
  },

  // 显示历史记录
  showHistoryPanel: function() {
    this.setData({
      showHistory: true
    });
  },

  // 隐藏历史记录
  hideHistory: function() {
    this.setData({
      showHistory: false
    });
  },
  // 切换贷款类型
  switchLoanType: function(e) {
    const type = e.currentTarget.dataset.type;
    
    // 清除之前的贷款金额
    let updateData = {
      loanType: type,
      showResult: false // 切换类型时隐藏结果
    };
    
    // 根据新的贷款类型设置默认值
    switch(type) {
      case 'commercial':
        updateData.commercialRate = 4.9;
        updateData.commercialRateFactor = 1;
        updateData.commercialAmount = '';
        updateData.fundAmount = '';
        break;
      case 'fund':
        updateData.fundRate = 3.1;
        updateData.fundRateFactor = 1;
        updateData.commercialAmount = '';
        updateData.fundAmount = '';
        break;
      case 'combined':
        updateData.commercialRate = 4.9;
        updateData.commercialRateFactor = 1;
        updateData.fundRate = 3.1;
        updateData.fundRateFactor = 1;
        updateData.commercialAmount = '';
        updateData.fundAmount = '';
        break;
    }
    
    this.setData(updateData);
    this.calculateActualRate();
  },

  // 处理商业贷款金额输入
  handleCommercialAmountInput: function(e) {
    this.setData({
      commercialAmount: e.detail.value,
      showResult: false
    });
  },

  // 处理公积金贷款金额输入
  handleFundAmountInput: function(e) {
    this.setData({
      fundAmount: e.detail.value,
      showResult: false
    });
  },

  // 处理商业贷款利率输入
  handleCommercialRateInput: function(e) {
    this.setData({
      commercialRate: e.detail.value,
      showResult: false
    });
    this.calculateActualCommercialRate();
  },

  // 处理商业贷款利率倍数输入
  handleCommercialRateFactorInput: function(e) {
    this.setData({
      commercialRateFactor: e.detail.value,
      showResult: false
    });
    this.calculateActualCommercialRate();
  },

  // 处理公积金贷款利率输入
  handleFundRateInput: function(e) {
    this.setData({
      fundRate: e.detail.value,
      showResult: false
    });
    this.calculateActualFundRate();
  },

  // 处理公积金贷款利率倍数输入
  handleFundRateFactorInput: function(e) {
    this.setData({
      fundRateFactor: e.detail.value,
      showResult: false
    });
    this.calculateActualFundRate();
  },

  // 计算商业贷款实际利率
  calculateActualCommercialRate: function() {
    const { commercialRate, commercialRateFactor } = this.data;
    const actualCommercialRate = (parseFloat(commercialRate) * parseFloat(commercialRateFactor || 1)).toFixed(2);
    this.setData({ actualCommercialRate });
  },

  // 计算公积金贷款实际利率
  calculateActualFundRate: function() {
    const { fundRate, fundRateFactor } = this.data;
    const actualFundRate = (parseFloat(fundRate) * parseFloat(fundRateFactor || 1)).toFixed(2);
    this.setData({ actualFundRate });
  },

  calculateActualRate: function() {
    this.calculateActualCommercialRate();
    this.calculateActualFundRate();
  },

  // 选择还款方式
  selectRepaymentMethod: function(e) {
    this.setData({
      repaymentMethod: e.detail.value,
      showResult: false
    });
  },

  // 选择按揭年数
  selectLoanYears: function(e) {
    this.setData({
      loanYears: this.data.yearOptions[e.detail.value],
      showResult: false
    });
  },

  // 计算贷款
  calculateLoan: function() {
    const { loanType, commercialAmount, fundAmount, loanYears, actualCommercialRate, actualFundRate, repaymentMethod } = this.data;
    
    let commercialPrincipal = 0;
    let fundPrincipal = 0;

    if (loanType === 'commercial' || loanType === 'combined') {
      if (!commercialAmount || commercialAmount <= 0) {
        wx.showToast({
          title: '请输入正确的商业贷款金额',
          icon: 'none'
        });
        return;
      }
      commercialPrincipal = parseFloat(commercialAmount) * 10000;
    }

    if (loanType === 'fund' || loanType === 'combined') {
      if (!fundAmount || fundAmount <= 0) {
        wx.showToast({
          title: '请输入正确的公积金贷款金额',
          icon: 'none'
        });
        return;
      }
      fundPrincipal = parseFloat(fundAmount) * 10000;
    }

    // 总贷款金额
    const principal = commercialPrincipal + fundPrincipal;
    // 商业贷款月利率
    const commercialMonthlyRate = actualCommercialRate / 100 / 12;
    // 公积金贷款月利率
    const fundMonthlyRate = actualFundRate / 100 / 12;
    // 还款月数
    const months = loanYears * 12;

    // 根据贷款类型计算使用的月利率
    let monthlyRate;
    if (loanType === 'commercial') {
      monthlyRate = commercialMonthlyRate;
    } else if (loanType === 'fund') {
      monthlyRate = fundMonthlyRate;
    } else {
      // 组合贷款的情况，使用加权平均利率
      monthlyRate = (commercialPrincipal * commercialMonthlyRate + fundPrincipal * fundMonthlyRate) / principal;
    }

    if (repaymentMethod === 'equal') {
      // 等额本息
      // 公式：每月还款 = 贷款本金 × 月利率 × (1 + 月利率)^还款月数 ÷ [(1 + 月利率)^还款月数 - 1]
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - principal;

      this.setData({
        showResult: true,
        monthlyPayment: monthlyPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2)
      });
    } else {
      // 等额本金
      // 每月本金 = 贷款本金 ÷ 还款月数
      const monthlyPrincipal = principal / months;
      // 每月递减金额 = 每月本金 × 月利率
      const monthlyDecrement = monthlyPrincipal * monthlyRate;
      // 首月还款 = 每月本金 + 贷款本金 × 月利率
      const firstMonthPayment = monthlyPrincipal + principal * monthlyRate;
      // 末月还款 = 每月本金 + 每月本金 × 月利率
      const lastMonthPayment = monthlyPrincipal + monthlyPrincipal * monthlyRate;
      // 总利息 = (首月还款 + 末月还款) × 还款月数 ÷ 2 - 贷款本金
      const totalInterest = (firstMonthPayment + lastMonthPayment) * months / 2 - principal;
      // 总还款 = 贷款本金 + 总利息
      const totalPayment = principal + totalInterest;

      this.setData({
        showResult: true,
        firstMonthPayment: firstMonthPayment.toFixed(2),
        lastMonthPayment: lastMonthPayment.toFixed(2),
        monthlyDecrement: monthlyDecrement.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2)
      });
    }
  },
  
  // 保存结果为图片
  saveAsImage: function() {
    const that = this;
    
    // 请求授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.drawAndSaveImage();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存图片到相册',
                confirmText: '去授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting['scope.writePhotosAlbum']) {
                          that.drawAndSaveImage();
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          that.drawAndSaveImage();
        }
      }
    });
  },

  // 绘制并保存图片
  drawAndSaveImage: function() {
    const that = this;
    const { loanType, commercialAmount, fundAmount, loanYears, repaymentMethod,
           actualCommercialRate, actualFundRate, monthlyPayment, totalInterest,
           totalPayment, firstMonthPayment, lastMonthPayment, monthlyDecrement } = this.data;
    
    // 获取画布上下文
    const ctx = wx.createCanvasContext('resultCanvas');
    
    // 设置背景色
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, 750, 1000);
    
    // 设置标题
    ctx.setFillStyle('#333333');
    ctx.setFontSize(36);
    ctx.setTextAlign('center');
    
    let loanTypeText = '';
    switch(loanType) {
      case 'commercial':
        loanTypeText = '商业贷款';
        break;
      case 'fund':
        loanTypeText = '公积金贷款';
        break;
      case 'combined':
        loanTypeText = '组合贷款';
        break;
    }
    
    ctx.fillText(`${loanTypeText}计算结果`, 375, 80);
    
    // 绘制分割线
    ctx.setStrokeStyle('#eeeeee');
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(700, 100);
    ctx.stroke();
    
    // 设置内容字体
    ctx.setFontSize(28);
    ctx.setTextAlign('left');
    
    // 绘制贷款信息
    let y = 150;
    
    // 贷款金额
    if (loanType === 'commercial' || loanType === 'combined') {
      ctx.fillText(`商业贷款金额: ${commercialAmount}万元`, 50, y);
      y += 50;
      ctx.fillText(`商业贷款利率: ${actualCommercialRate}%`, 50, y);
      y += 50;
    }
    
    if (loanType === 'fund' || loanType === 'combined') {
      ctx.fillText(`公积金贷款金额: ${fundAmount}万元`, 50, y);
      y += 50;
      ctx.fillText(`公积金贷款利率: ${actualFundRate}%`, 50, y);
      y += 50;
    }
    
    // 贷款年限和还款方式
    ctx.fillText(`贷款年限: ${loanYears}年`, 50, y);
    y += 50;
    ctx.fillText(`还款方式: ${repaymentMethod === 'equal' ? '等额本息' : '等额本金'}`, 50, y);
    y += 50;
    
    // 绘制分割线
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(700, y);
    ctx.stroke();
    y += 50;
    
    // 绘制计算结果
    ctx.setFontSize(32);
    ctx.setFillStyle('#007aff');
    
    if (repaymentMethod === 'equal') {
      ctx.fillText(`每月还款: ¥${monthlyPayment}`, 50, y);
      y += 60;
    } else {
      ctx.fillText(`首月还款: ¥${firstMonthPayment}`, 50, y);
      y += 60;
      ctx.fillText(`末月还款: ¥${lastMonthPayment}`, 50, y);
      y += 60;
      ctx.fillText(`每月递减: ¥${monthlyDecrement}`, 50, y);
      y += 60;
    }
    
    ctx.fillText(`支付利息: ¥${totalInterest}`, 50, y);
    y += 60;
    ctx.fillText(`还款总额: ¥${totalPayment}`, 50, y);
    y += 80;
    
    // 添加水印
    ctx.setFontSize(24);
    ctx.setFillStyle('#999999');
    ctx.setTextAlign('center');
    ctx.fillText('迷你计算器小程序生成', 375, y);
    
    // 绘制完成后保存图片
    ctx.draw(false, function() {
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'resultCanvas',
          success: function(res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function() {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                });
              },
              fail: function(err) {
                console.error('保存图片失败', err);
                wx.showToast({
                  title: '保存失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            });
          },
          fail: function(err) {
            console.error('生成图片失败', err);
            wx.showToast({
              title: '生成图片失败',
              icon: 'none',
              duration: 2000
            });
          }
        });
      }, 200); // 延迟一点时间确保画布已经渲染完成
    });
  }
})