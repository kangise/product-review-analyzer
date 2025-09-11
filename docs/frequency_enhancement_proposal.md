# 频率计算精度提升方案

## 问题分析
当前AI分析中的频率计算存在以下问题：
1. **主观估算**：AI基于"感觉"给出频率，缺乏客观依据
2. **不可复现**：相同数据不同时间分析结果差异巨大
3. **分类不一致**：痛点归类标准随机变化

## 解决方案

### 方案1: 预处理关键词统计
```python
def calculate_accurate_frequency(reviews, pain_point_keywords):
    """
    基于关键词匹配计算准确频率
    """
    total_reviews = len(reviews)
    matching_reviews = 0
    
    for review in reviews:
        if any(keyword in review.lower() for keyword in pain_point_keywords):
            matching_reviews += 1
    
    return (matching_reviews / total_reviews) * 100

# 示例关键词定义
pain_point_keywords = {
    "防水失效": ["waterproof", "water damage", "leaked", "water inside"],
    "过热问题": ["overheat", "hot", "temperature", "shut down", "heat"],
    "软件问题": ["app crash", "software", "connection failed", "app"]
}
```

### 方案2: 增强Prompt指导
在unmet_needs.md中添加：
```
# 频率计算指导
请基于以下客观标准计算频率：
1. 统计包含相关关键词的评论数量
2. 频率 = (相关评论数 / 总评论数) × 100%
3. 提供具体的计算依据和匹配的评论数量

输出格式：
"问题严重性/频率": "X.X% (基于Y条评论中的Z条匹配)"
```

### 方案3: 二阶段分析
1. **第一阶段**：客观统计各类问题的提及频率
2. **第二阶段**：基于统计结果进行深度分析

## 实施建议
**立即实施**：方案2（增强Prompt指导）
**中期实施**：方案1（预处理统计）
**长期优化**：方案3（二阶段分析）
