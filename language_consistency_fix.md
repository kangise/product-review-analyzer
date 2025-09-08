# 语言一致性问题解决方案

## 问题分析
当前中英文输出存在差异的原因：
1. **AI语言偏好**: 不同语言激活不同的认知模式
2. **分析框架差异**: 中英文使用不同的分类和优先级标准
3. **频率计算不一致**: 关键词匹配在不同语言下有差异

## 解决方案

### 方案1: 增强语言指令
在review_analyzer.py中修改语言指令：

```python
if self.output_language == 'zh':
    language_instruction = """

**重要语言和一致性指令：**
1. 请用中文输出所有分析结果，但保持与英文版本完全相同的分析逻辑和分类标准
2. 频率计算必须基于相同的关键词匹配逻辑，不受语言影响
3. 分析维度、优先级排序、重要性判断必须与英文版本保持一致
4. 只改变语言表达，不改变分析结果的本质内容
5. 所有百分比和数值必须基于相同的统计方法
"""
else:
    language_instruction = """

**Important Language and Consistency Instructions:**
1. Output all analysis results in English with consistent analytical logic
2. Frequency calculations must be based on the same keyword matching logic
3. Analysis dimensions, priority rankings, and importance judgments must be consistent
4. All percentages and numerical values must be based on the same statistical methods
"""
```

### 方案2: 标准化分析框架
为每个agent添加一致性指导：

```markdown
# 跨语言一致性要求
**无论输出语言如何，必须遵循以下标准：**
1. 使用相同的分类维度和标准
2. 基于相同的关键词进行频率统计
3. 保持相同的重要性排序逻辑
4. 确保数值计算的一致性
```

### 方案3: 预处理标准化
在数据预处理阶段统一关键词和分类标准，避免语言差异影响分析结果。

## 推荐实施顺序
1. **立即**: 增强语言指令（方案1）
2. **短期**: 为关键agent添加一致性指导（方案2）
3. **长期**: 开发预处理标准化模块（方案3）
