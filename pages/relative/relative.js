// pages/relative/relative.js

// 亲戚关系数据库
const relationData = {
  // 自己
  'self': '我',
  
  // 父母
  'f': '爸爸',
  'm': '妈妈',
  
  // 兄弟姐妹
  'xb': '兄弟',
  'ob': '哥哥',
  'lb': '弟弟',
  'xs': '姐妹',
  'os': '姐姐',
  'ls': '妹妹',
  
  // 夫妻
  'h': '丈夫',
  'w': '妻子',
  
  // 儿女
  's': '儿子',
  'd': '女儿',
  
  // 祖父母
  'f,f': '爷爷',
  'f,m': '奶奶',
  'm,f': '外公',
  'm,m': '外婆',
  
  // 曾祖父母
  'f,f,f': '曾祖父',
  'f,f,m': '曾祖母',
  'f,m,f': '曾外祖父',
  'f,m,m': '曾外祖母',
  'm,f,f': '外曾祖父',
  'm,f,m': '外曾祖母',
  'm,m,f': '外曾外祖父',
  'm,m,m': '外曾外祖母',
  
  // 伯叔姑舅姨
  'f,ob': '伯父',
  'f,lb': '叔叔',
  'f,xs': '姑姑',
  'f,os': '姑姑',
  'f,ls': '姑姑',
  'm,xb': '舅舅',
  'm,ob': '舅舅',
  'm,lb': '舅舅',
  'm,xs': '姨妈',
  'm,os': '姨妈',
  'm,ls': '姨妈',
  
  // 舅祖父等
  'f,m,xb': '舅祖父',
  'f,m,ob': '舅祖父',
  'f,m,lb': '舅祖父',
  'f,f,xb': '伯祖父/叔祖父',
  'f,f,ob': '伯祖父',
  'f,f,lb': '叔祖父',
  'f,f,xs': '姑祖母',
  'f,f,os': '姑祖母',
  'f,f,ls': '姑祖母',
  'm,f,xb': '舅外祖父',
  'm,f,ob': '舅外祖父',
  'm,f,lb': '舅外祖父',
  'm,f,xs': '姨外祖母',
  'm,f,os': '姨外祖母',
  'm,f,ls': '姨外祖母',
  'm,m,xb': '舅外祖父',
  'm,m,ob': '舅外祖父',
  'm,m,lb': '舅外祖父',
  'm,m,xs': '姨外祖母',
  'm,m,os': '姨外祖母',
  'm,m,ls': '姨外祖母',
  
  // 兄弟姐妹的配偶
  'ob,w': '嫂子',
  'lb,w': '弟媳',
  'os,h': '姐夫',
  'ls,h': '妹夫',
  
  // 夫妻的父母
  'h,f': '公公',
  'h,m': '婆婆',
  'w,f': '岳父',
  'w,m': '岳母',
  
  // 夫妻的兄弟姐妹
  'h,ob': '大伯子',
  'h,lb': '小叔子',
  'h,xs': '姑子',
  'h,os': '大姑子',
  'h,ls': '小姑子',
  'w,xb': '舅子',
  'w,ob': '大舅子',
  'w,lb': '小舅子',
  'w,xs': '姨子',
  'w,os': '大姨子',
  'w,ls': '小姨子',
  
  // 子女的配偶
  's,w': '儿媳',
  'd,h': '女婿',
  
  // 孙子女
  's,s': '孙子',
  's,d': '孙女',
  'd,s': '外孙',
  'd,d': '外孙女',
  
  // 曾孙子女
  's,s,s': '曾孙',
  's,s,d': '曾孙女',
  's,d,s': '曾外孙',
  's,d,d': '曾外孙女',
  'd,s,s': '外曾孙',
  'd,s,d': '外曾孙女',
  'd,d,s': '外曾外孙',
  'd,d,d': '外曾外孙女',
  
  // 侄子女/外甥
  'xb,s': '侄子',
  'ob,s': '侄子',
  'lb,s': '侄子',
  'xb,d': '侄女',
  'ob,d': '侄女',
  'lb,d': '侄女',
  'xs,s': '外甥',
  'os,s': '外甥',
  'ls,s': '外甥',
  'xs,d': '外甥女',
  'os,d': '外甥女',
  'ls,d': '外甥女',
  
  // 堂/表兄弟姐妹
  'f,xb,s': '堂兄弟',
  'f,ob,s': '堂兄弟',
  'f,lb,s': '堂兄弟',
  'f,xb,d': '堂姐妹',
  'f,ob,d': '堂姐妹',
  'f,lb,d': '堂姐妹',
  'f,xs,s': '表兄弟',
  'f,os,s': '表兄弟',
  'f,ls,s': '表兄弟',
  'f,xs,d': '表姐妹',
  'f,os,d': '表姐妹',
  'f,ls,d': '表姐妹',
  'm,xb,s': '表兄弟',
  'm,ob,s': '表兄弟',
  'm,lb,s': '表兄弟',
  'm,xb,d': '表姐妹',
  'm,ob,d': '表姐妹',
  'm,lb,d': '表姐妹',
  'm,xs,s': '表兄弟',
  'm,os,s': '表兄弟',
  'm,ls,s': '表兄弟',
  'm,xs,d': '表姐妹',
  'm,os,d': '表姐妹',
  'm,ls,d': '表姐妹'
};

// 关系代码映射
const relationCodeMap = {
  'father': 'f',
  'mother': 'm',
  'elder_brother': 'ob',
  'younger_brother': 'lb',
  'elder_sister': 'os',
  'younger_sister': 'ls',
  'husband': 'h',
  'wife': 'w',
  'son': 's',
  'daughter': 'd'
};

// 关系显示文本
const relationDisplayMap = {
  'father': '爸',
  'mother': '妈',
  'elder_brother': '哥',
  'younger_brother': '弟',
  'elder_sister': '姐',
  'younger_sister': '妹',
  'husband': '夫',
  'wife': '妻',
  'son': '子',
  'daughter': '女',
  'of': '的'
};

// 计算亲戚关系
const calculateRelation = (relations) => {
  if (relations.length === 0) return '我';
  
  // 过滤掉"of"关系，只保留实际亲戚关系
  const filteredRelations = relations.filter(rel => rel !== 'of');
  
  if (filteredRelations.length === 0) return '我';
  
  // 将关系代码转换为标准代码
  const relationCodes = filteredRelations.map(rel => relationCodeMap[rel] || rel);
  
  // 构建关系路径
  const relationPath = relationCodes.join(',');
  
  // 直接查找完整关系
  if (relationData[relationPath]) {
    return relationData[relationPath];
  }
  
  // 尝试规范化路径（将ob/lb替换为xb，os/ls替换为xs）
  const normalizedPath = relationPath
    .replace(/ob|lb/g, 'xb')
    .replace(/os|ls/g, 'xs');
  
  if (relationData[normalizedPath]) {
    return relationData[normalizedPath];
  }
  
  // 如果找不到完整匹配，尝试分解关系
  return processComplexRelation(relationCodes);
};

// 处理复杂关系
const processComplexRelation = (relationCodes) => {
  // 如果只有一个关系，直接返回
  if (relationCodes.length === 1) {
    const code = relationCodes[0];
    return relationData[code] || '未知';
  }
  
  // 尝试从最长的关系开始匹配
  for (let i = relationCodes.length; i > 0; i--) {
    const subPath = relationCodes.slice(0, i).join(',');
    if (relationData[subPath]) {
      // 如果找到匹配，处理剩余部分
      const remaining = relationCodes.slice(i);
      if (remaining.length === 0) {
        return relationData[subPath];
      } else {
        // 递归处理剩余部分
        const prefix = relationData[subPath];
        const suffix = processComplexRelation(remaining);
        return `${prefix}的${suffix}`;
      }
    }
  }
  
  // 如果无法匹配，尝试分解关系
  const firstCode = relationCodes[0];
  const restCodes = relationCodes.slice(1);
  
  if (relationData[firstCode]) {
    const prefix = relationData[firstCode];
    const suffix = processComplexRelation(restCodes);
    return `${prefix}的${suffix}`;
  }
  
  return '未知';
};

// 获取关系显示文本
const getRelationDisplay = (relation) => {
  return relationDisplayMap[relation] || relation;
};

Page({
  data: {
    relationPath: '',
    result: '我',
    relations: [],
    activeButton: ''
  },

  onLoad: function() {
    
  },

  // 处理关系按钮点击
  handleRelation: function(e) {
    const relation = e.currentTarget.dataset.relation;
    let { relations, relationPath } = this.data;
    
    // 更新关系路径
    if (relation === 'of') {
      relationPath += '的';
    } else {
      relationPath += getRelationDisplay(relation);
    }
    
    // 添加关系
    relations.push(relation);
    
    // 更新数据
    this.setData({
      relations,
      relationPath,
      activeButton: relation
    });
    
    // 自动计算结果
    this.calculateResult();
  },

  // 处理清除按钮点击
  handleClear: function() {
    this.setData({
      relationPath: '',
      result: '我',
      relations: [],
      activeButton: 'clear'
    });
  },

  // 处理回退按钮点击
  handleBack: function() {
    let { relations, relationPath } = this.data;
    
    if (relations.length > 0) {
      const lastRelation = relations.pop();
      
      // 更新关系路径
      if (lastRelation === 'of') {
        relationPath = relationPath.substring(0, relationPath.length - 1);
      } else {
        const lastRelationText = getRelationDisplay(lastRelation);
        relationPath = relationPath.substring(0, relationPath.length - lastRelationText.length);
      }
      
      // 更新数据
      this.setData({
        relations,
        relationPath,
        activeButton: 'back'
      });
      
      // 自动计算结果
      this.calculateResult();
    }
  },

  // 处理计算按钮点击
  handleCalculate: function() {
    this.calculateResult();
    this.setData({
      activeButton: 'calculate'
    });
  },

  // 计算结果
  calculateResult: function() {
    const { relations } = this.data;
    const result = calculateRelation(relations);
    
    this.setData({
      result
    });
  }
})