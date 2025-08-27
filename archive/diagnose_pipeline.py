#!/usr/bin/env python3
"""
诊断分析管道中的问题
"""

import pandas as pd
import json
import logging
from pathlib import Path
from review_analyzer import ReviewAnalyzer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def analyze_data_structure():
    """分析数据结构"""
    logger.info("🔍 分析数据结构...")
    
    # 检查清理后的数据
    customer_file = "data/cleaned/customer_reviews_cleaned.csv"
    competitor_file = "data/cleaned/competitor_reviews_cleaned.csv"
    
    try:
        customer_df = pd.read_csv(customer_file)
        competitor_df = pd.read_csv(competitor_file)
        
        logger.info(f"客户评论数据形状: {customer_df.shape}")
        logger.info(f"客户评论列名: {list(customer_df.columns)}")
        logger.info(f"竞争对手评论数据形状: {competitor_df.shape}")
        logger.info(f"竞争对手评论列名: {list(competitor_df.columns)}")
        
        # 检查Review Text列
        if 'Review Text' in customer_df.columns:
            sample_review = customer_df['Review Text'].iloc[0]
            logger.info(f"客户评论样本长度: {len(sample_review)} 字符")
            logger.info(f"客户评论样本前200字符: {sample_review[:200]}...")
        
        # 检查数据转换为JSON后的大小
        customer_records = customer_df.to_dict('records')
        customer_json = json.dumps(customer_records[:5], indent=2, ensure_ascii=False)
        logger.info(f"前5条客户评论JSON大小: {len(customer_json)} 字符")
        
        return True
    except Exception as e:
        logger.error(f"数据结构分析失败: {str(e)}")
        return False

def analyze_prompt_expectations():
    """分析prompt期望的输入输出格式"""
    logger.info("🔍 分析prompt期望...")
    
    analyzer = ReviewAnalyzer()
    
    # 检查几个关键prompt文件
    key_prompts = ['consumer_profile.md', 'consumer_love.md', 'opportunity.md']
    
    for prompt_file in key_prompts:
        try:
            prompt_content = analyzer.load_prompt(prompt_file)
            
            # 查找JSON相关的要求
            json_mentions = prompt_content.count('JSON') + prompt_content.count('json')
            brace_mentions = prompt_content.count('{') + prompt_content.count('}')
            
            logger.info(f"{prompt_file}:")
            logger.info(f"  - JSON提及次数: {json_mentions}")
            logger.info(f"  - 大括号数量: {brace_mentions}")
            logger.info(f"  - 文件长度: {len(prompt_content)} 字符")
            
            # 查找输出格式要求
            if '```json' in prompt_content.lower():
                logger.info(f"  - 要求markdown JSON格式")
            if '"' in prompt_content and ':' in prompt_content:
                logger.info(f"  - 包含JSON结构示例")
                
        except Exception as e:
            logger.error(f"分析{prompt_file}失败: {str(e)}")

def test_data_serialization():
    """测试数据序列化"""
    logger.info("🔍 测试数据序列化...")
    
    try:
        analyzer = ReviewAnalyzer()
        cleaned_data = analyzer.load_and_clean_data(
            'data/cleaned/customer_reviews_cleaned.csv',
            'data/cleaned/competitor_reviews_cleaned.csv'
        )
        
        # 测试不同的数据准备方法
        context_data = {
            'product_type': 'webcams',
            'customer_review_data': cleaned_data['customer_review']
        }
        
        # 方法1: 完整数据
        optimized_full = analyzer.prepare_context_data(context_data)
        full_json = json.dumps(optimized_full, indent=2, ensure_ascii=False)
        logger.info(f"完整数据JSON大小: {len(full_json)} 字符")
        
        # 方法2: 限制数据量
        limited_data = cleaned_data['customer_review'].head(10)
        context_limited = {
            'product_type': 'webcams',
            'customer_review_data': limited_data
        }
        optimized_limited = analyzer.prepare_context_data(context_limited)
        limited_json = json.dumps(optimized_limited, indent=2, ensure_ascii=False)
        logger.info(f"限制数据JSON大小: {len(limited_json)} 字符")
        
        # 方法3: 只保留关键字段
        key_columns = ['Review Text', 'Review Rating', 'Review Title']
        if all(col in cleaned_data['customer_review'].columns for col in key_columns):
            key_data = cleaned_data['customer_review'][key_columns].head(20)
            context_key = {
                'product_type': 'webcams',
                'customer_review_data': key_data
            }
            optimized_key = analyzer.prepare_context_data(context_key)
            key_json = json.dumps(optimized_key, indent=2, ensure_ascii=False)
            logger.info(f"关键字段数据JSON大小: {len(key_json)} 字符")
        
        return True
    except Exception as e:
        logger.error(f"数据序列化测试失败: {str(e)}")
        return False

def test_json_extraction():
    """测试JSON提取逻辑"""
    logger.info("🔍 测试JSON提取逻辑...")
    
    # 模拟不同的Q Chat输出格式
    test_outputs = [
        # 格式1: 纯JSON
        '{"test": "value", "number": 123}',
        
        # 格式2: Markdown代码块
        '''这是分析结果：

```json
{
  "analysis": "result",
  "data": [1, 2, 3]
}
```

以上是完整分析。''',
        
        # 格式3: 混合内容
        '''根据分析，我发现以下结果：

{
  "key_findings": "important data",
  "recommendations": ["item1", "item2"]
}

这些发现很重要。''',
        
        # 格式4: 复杂嵌套
        '''分析报告：

```json
{
  "consumer_profile": {
    "demographics": {
      "age_groups": [
        {
          "range": "25-35",
          "percentage": 45.2
        }
      ]
    }
  }
}
```'''
    ]
    
    analyzer = ReviewAnalyzer()
    
    for i, output in enumerate(test_outputs, 1):
        logger.info(f"测试输出格式 {i}:")
        extracted = analyzer.extract_json_from_output(output)
        if extracted:
            try:
                parsed = json.loads(extracted)
                logger.info(f"  ✅ 成功提取并解析JSON")
                logger.info(f"  📊 提取的JSON: {extracted[:100]}...")
            except json.JSONDecodeError as e:
                logger.error(f"  ❌ JSON解析失败: {str(e)}")
                logger.error(f"  📄 提取的内容: {extracted[:200]}...")
        else:
            logger.error(f"  ❌ 未能提取JSON")

def analyze_parameter_flow():
    """分析参数流转"""
    logger.info("🔍 分析参数流转...")
    
    # 检查每个步骤的参数依赖
    pipeline_steps = {
        'product_type': {
            'inputs': ['product_type'],
            'outputs': ['product_type_result']
        },
        'consumer_profile': {
            'inputs': ['product_type', 'customer_review_data'],
            'outputs': ['consumer_profile_result']
        },
        'consumer_love': {
            'inputs': ['product_type', 'customer_review_data'],
            'outputs': ['consumer_love_result']
        },
        'opportunity': {
            'inputs': ['product_type', 'consumer_love', 'unmet_needs', 'consumer_scenario', 'customer_review_data'],
            'outputs': ['opportunity_result']
        },
        'competitor': {
            'inputs': ['product_type', 'consumer_love', 'unmet_needs', 'consumer_motivation', 'customer_review_data', 'competitor_review_data'],
            'outputs': ['competitor_result']
        }
    }
    
    logger.info("参数依赖关系:")
    for step, info in pipeline_steps.items():
        logger.info(f"  {step}:")
        logger.info(f"    输入: {info['inputs']}")
        logger.info(f"    输出: {info['outputs']}")
        
        # 检查循环依赖
        if step in info['inputs']:
            logger.error(f"    ⚠️  发现循环依赖: {step}")

def main():
    """主诊断函数"""
    logger.info("🚀 开始诊断分析管道问题...")
    logger.info("=" * 60)
    
    tests = [
        ("数据结构分析", analyze_data_structure),
        ("Prompt期望分析", analyze_prompt_expectations),
        ("数据序列化测试", test_data_serialization),
        ("JSON提取测试", test_json_extraction),
        ("参数流转分析", analyze_parameter_flow)
    ]
    
    for test_name, test_func in tests:
        logger.info(f"\n📋 {test_name}")
        logger.info("-" * 40)
        try:
            test_func()
        except Exception as e:
            logger.error(f"❌ {test_name} 异常: {str(e)}")
    
    logger.info("\n" + "=" * 60)
    logger.info("🏁 诊断完成")

if __name__ == "__main__":
    main()
