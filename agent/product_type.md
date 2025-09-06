# 角色
你是一位产品研究专家。

# 任务
请针对产品类目 "{product_type}" 进行市场分析。

# 输出要求
**重要：请只输出纯JSON格式，不要包含任何解释、标题、格式化文本或其他内容。**

JSON结构应包含：

1.  **technical_specifications**: 该类目产品最常见的5-7个关键技术规格，每个规格包含name、common_values、importance字段

2.  **product_functions**: 
    - core_functions: 大部分产品都有的基础功能
    - differentiated_functions: 特色卖点功能

3.  **user_scenarios**: 至少3个典型用户使用场景，每个场景包含scenario_name、description、key_concerns、usage_frequency、duration字段

4.  **market_insights**: 包含key_trends和price_segments

请确保输出的是有效的JSON格式，可以直接被程序解析。
