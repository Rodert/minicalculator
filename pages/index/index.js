Page({
  data: {
    result: '0', // 显示结果
    lastOperator: '', // 上一个操作符
    firstNumber: '', // 第一个数字
    secondNumber: '', // 第二个数字
    isNewInput: true, // 是否是新输入
    isCalculated: false, // 是否已经计算过结果
    expression: '', // 当前表达式
    historyList: [], // 历史记录列表
    showHistory: false, // 是否显示历史记录
    pulling: false, // 是否正在下拉
    startY: 0, // 触摸开始的Y坐标
    currentY: 0 // 当前触摸的Y坐标
  },

  onLoad: function() {
    // 从本地存储加载历史记录
    this.loadHistory();
  },

  // 加载历史记录
  loadHistory: function() {
    try {
      const history = wx.getStorageSync('calculatorHistory');
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
  saveHistory: function(expression, result) {
    try {
      let historyList = this.data.historyList;
      
      // 格式化表达式，确保操作符两侧有空格，但不添加等号
      const formattedExpression = expression
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' - ')
        .replace(/×/g, ' × ')
        .replace(/÷/g, ' ÷ ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // 添加新记录到开头
      historyList.unshift({
        expression: formattedExpression,
        result: result,
        timestamp: new Date().getTime()
      });
      
      // 限制历史记录数量为20条
      if (historyList.length > 20) {
        historyList = historyList.slice(0, 20);
      }
      
      // 更新数据
      this.setData({
        historyList: historyList
      });
      
      // 保存到本地存储
      wx.setStorageSync('calculatorHistory', JSON.stringify(historyList));
    } catch (e) {
      console.error('保存历史记录失败', e);
    }
  },

  // 清除历史记录
  clearHistory: function() {
    this.setData({
      historyList: []
    });
    wx.setStorageSync('calculatorHistory', '[]');
  },

  // 隐藏历史记录面板
  hideHistory: function() {
    this.setData({
      showHistory: false
    });
  },

  // 使用历史记录项
  useHistoryItem: function(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.historyList[index];
    
    this.setData({
      result: item.result,
      firstNumber: item.result,
      secondNumber: '',
      lastOperator: '',
      isNewInput: true,
      isCalculated: true,
      showHistory: false
    });
  },

  // 触摸开始
  touchStart: function(e) {
    // 只在结果区域附近的触摸才处理下拉
    const touchY = e.touches[0].clientY;
    // 获取屏幕高度的20%作为有效区域
    const screenHeight = wx.getSystemInfoSync().windowHeight;
    const validArea = screenHeight * 0.2;
    
    if (touchY < validArea) {
      this.setData({
        startY: e.touches[0].clientY,
        currentY: e.touches[0].clientY
      });
    }
  },

  // 触摸移动
  touchMove: function(e) {
    // 如果没有记录startY，说明不是在有效区域开始的触摸，忽略
    if (this.data.startY === 0) return;
    
    const currentY = e.touches[0].clientY;
    const moveDistance = currentY - this.data.startY;
    
    // 只处理下拉手势
    if (moveDistance > 0 && !this.data.showHistory) {
      this.setData({
        currentY: currentY,
        pulling: true
      });
      
      // 如果下拉距离超过阈值，显示历史记录
      if (moveDistance > 60) {
        this.setData({
          showHistory: true
        });
      }
    } else if (moveDistance < -30 && this.data.showHistory) {
      // 上滑手势，隐藏历史记录
      this.setData({
        showHistory: false,
        pulling: false
      });
    }
  },

  // 触摸结束
  touchEnd: function() {
    this.setData({
      pulling: false,
      startY: 0
    });
  },

  // 点击数字按钮
  tapNumber: function(e) {
    const number = e.currentTarget.dataset.number;
    let { result, isNewInput, isCalculated } = this.data;
    
    if (isCalculated) {
      // 如果已经计算过结果，重新开始
      this.setData({
        result: number,
        firstNumber: number,
        secondNumber: '',
        lastOperator: '',
        isNewInput: false,
        isCalculated: false,
        expression: ''
      });
      return;
    }
    
    if (isNewInput || result === '0') {
      // 新输入或当前显示为0，直接替换
      this.setData({
        result: number,
        isNewInput: false
      });
    } else {
      // 追加数字
      this.setData({
        result: result + number
      });
    }
    
    // 更新当前操作的数字
    if (this.data.lastOperator) {
      this.setData({
        secondNumber: this.data.result
      });
    } else {
      this.setData({
        firstNumber: this.data.result
      });
    }
  },

  // 计算结果
  calculate: function(num1, num2, operator) {
    let result;
    
    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '×':
        result = num1 * num2;
        break;
      case '÷':
        if (num2 === 0) {
          return 'Error';
        }
        result = num1 / num2;
        break;
      default:
        return num2;
    }
    
    // 处理精度问题
    // 如果结果是整数，直接返回整数
    // 如果是小数，保留合适的小数位数
    if (Number.isInteger(result)) {
      return result.toString();
    } else {
      // 转换为字符串，避免科学计数法
      const resultStr = result.toString();
      
      // 如果小数部分超过10位，则截取到10位
      if (resultStr.includes('.') && resultStr.split('.')[1].length > 10) {
        return result.toFixed(10).replace(/\.?0+$/, '');
      }
      
      // 移除末尾多余的0
      return resultStr.replace(/\.?0+$/, '');
    }
  },

  // 格式化数字，处理显示问题
  formatNumber: function(num) {
    if (num === 'Error') return num;
    
    // 处理科学计数法
    if (num.includes('e')) {
      const parts = num.split('e');
      const base = parseFloat(parts[0]);
      const exponent = parseInt(parts[1]);
      
      if (exponent > 0) {
        // 大数处理
        return base * Math.pow(10, exponent);
      } else {
        // 小数处理
        return base * Math.pow(10, exponent);
      }
    }
    
    return num;
  },

  // 点击操作符按钮
  tapOperator: function(e) {
    const operator = e.currentTarget.dataset.operator;
    let { firstNumber, secondNumber, lastOperator, result, isCalculated, expression } = this.data;
    
    if (operator === 'AC') {
      // 清除所有
      this.setData({
        result: '0',
        firstNumber: '',
        secondNumber: '',
        lastOperator: '',
        isNewInput: true,
        isCalculated: false,
        expression: ''
      });
      return;
    }
    
    if (operator === '+/-') {
      // 正负号切换
      if (result !== '0') {
        const newResult = result.charAt(0) === '-' ? result.substring(1) : '-' + result;
        this.setData({
          result: newResult
        });
        
        // 更新当前操作的数字
        if (lastOperator) {
          this.setData({
            secondNumber: newResult
          });
        } else {
          this.setData({
            firstNumber: newResult
          });
        }
      }
      return;
    }
    
    if (operator === '%') {
      // 百分比
      if (result !== '0') {
        const newResult = (parseFloat(result) / 100).toString();
        this.setData({
          result: newResult
        });
        
        // 更新当前操作的数字
        if (lastOperator) {
          this.setData({
            secondNumber: newResult
          });
        } else {
          this.setData({
            firstNumber: newResult
          });
        }
      }
      return;
    }
    
    if (operator === '.') {
      // 小数点
      if (result.indexOf('.') === -1) {
        this.setData({
          result: result + '.',
          isNewInput: false
        });
        
        // 更新当前操作的数字
        if (lastOperator) {
          this.setData({
            secondNumber: this.data.result
          });
        } else {
          this.setData({
            firstNumber: this.data.result
          });
        }
      }
      return;
    }
    
    if (operator === '=') {
      // 等号，计算结果
      if (firstNumber && secondNumber && lastOperator) {
        // 构建表达式
        const fullExpression = `${firstNumber} ${lastOperator} ${secondNumber}`;
        const calculatedResult = this.calculate(parseFloat(firstNumber), parseFloat(secondNumber), lastOperator);
        const formattedResult = this.formatNumber(calculatedResult.toString());
        
        // 保存到历史记录
        this.saveHistory(fullExpression, formattedResult);
        
        this.setData({
          result: formattedResult,
          firstNumber: formattedResult,
          secondNumber: '',
          lastOperator: '',
          isNewInput: true,
          isCalculated: true,
          expression: fullExpression
        });
      } else if (firstNumber && !secondNumber && !lastOperator) {
        // 只有一个数字，没有操作符和第二个数字的情况
        // 直接返回该数字
        this.setData({
          result: firstNumber,
          isCalculated: true
        });
      }
      return;
    }
    
    // 其他操作符 (+, -, ×, ÷)
    if (isCalculated) {
      // 如果已经计算过结果，使用当前结果作为第一个数字，开始新的计算
      this.setData({
        firstNumber: result,
        secondNumber: '',
        lastOperator: operator,
        isNewInput: true,
        isCalculated: false
      });
      return;
    }
    
    if (firstNumber && secondNumber && lastOperator) {
      // 如果已经有两个数字和一个操作符，先计算结果
      const fullExpression = `${firstNumber} ${lastOperator} ${secondNumber}`;
      const calculatedResult = this.calculate(parseFloat(firstNumber), parseFloat(secondNumber), lastOperator);
      const formattedResult = this.formatNumber(calculatedResult.toString());
      
      // 保存到历史记录
      this.saveHistory(fullExpression, formattedResult);
      
      this.setData({
        result: formattedResult,
        firstNumber: formattedResult,
        secondNumber: '',
        lastOperator: operator,
        isNewInput: true,
        expression: fullExpression
      });
    } else if (firstNumber && !secondNumber) {
      // 只有第一个数字，设置操作符
      this.setData({
        lastOperator: operator,
        isNewInput: true
      });
    } else if (!firstNumber && result !== '0') {
      // 没有第一个数字，但有结果，使用结果作为第一个数字
      this.setData({
        firstNumber: result,
        lastOperator: operator,
        isNewInput: true
      });
    } else {
      // 其他情况，设置操作符
      this.setData({
        lastOperator: operator,
        isNewInput: true
      });
    }
  },
  handleRelativeButton: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 2000
    })
  }
})