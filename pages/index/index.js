Page({
  data: {
    result: '0', // 显示结果
    lastOperator: '', // 上一个操作符
    firstNumber: '', // 第一个数字
    secondNumber: '', // 第二个数字
    isNewInput: true, // 是否是新输入
    isCalculated: false // 是否已经计算过结果
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
        isCalculated: false
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

  // 点击操作符按钮
  tapOperator: function(e) {
    const operator = e.currentTarget.dataset.operator;
    let { firstNumber, secondNumber, lastOperator, result, isCalculated } = this.data;
    
    if (operator === 'AC') {
      // 清除所有
      this.setData({
        result: '0',
        firstNumber: '',
        secondNumber: '',
        lastOperator: '',
        isNewInput: true,
        isCalculated: false
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
        const calculatedResult = this.calculate(parseFloat(firstNumber), parseFloat(secondNumber), lastOperator);
        this.setData({
          result: calculatedResult.toString(),
          firstNumber: calculatedResult.toString(),
          secondNumber: '',
          lastOperator: '',
          isNewInput: true,
          isCalculated: true
        });
      }
      return;
    }
    
    // 其他操作符 (+, -, ×, ÷)
    if (firstNumber && secondNumber && lastOperator) {
      // 如果已经有两个数字和一个操作符，先计算结果
      const calculatedResult = this.calculate(parseFloat(firstNumber), parseFloat(secondNumber), lastOperator);
      this.setData({
        result: calculatedResult.toString(),
        firstNumber: calculatedResult.toString(),
        secondNumber: '',
        lastOperator: operator,
        isNewInput: true
      });
    } else {
      // 设置操作符
      this.setData({
        lastOperator: operator,
        isNewInput: true
      });
    }
  },

  // 计算结果
  calculate: function(num1, num2, operator) {
    switch (operator) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '×':
        return num1 * num2;
      case '÷':
        return num2 !== 0 ? num1 / num2 : 'Error';
      default:
        return num2;
    }
  }
}) 