#!/usr/bin/env python3
"""
测试参数流转逻辑
"""

import json
import logging
from review_analyzer import ReviewAnalyzer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_extract_clean_result():
    """测试结果提取逻辑"""
    logger.info("🔍 测试结果提取逻辑...")
    
    analyzer = ReviewAnalyzer()
    
    # 测试用例1: 正常的JSON结果
    test_result_1 = {
        "consumer_profile": {
            "demographics": {"age": "25-35"},
            "behavior": {"usage": "daily"}
        }
    }
    
    clean_1 = analyzer.extract_clean_result(test_result_1)
    logger.info(f"测试1 - 正常JSON: {clean_1 is not None}")
    
    # 测试用例2: 包含错误的结果
    test_result_2 = {
        "error": "JSON解析失败",
        "raw_output": "这是原始输出"
    }
    
    clean_2 = analyzer.extract_clean_result(test_result_2)
    logger.info(f"测试2 - 错误结果: {clean_2 is None}")
    
    # 测试用例3: 只有raw_output的结果
    test_result_3 = {
        "raw_output": '{"analysis": "success", "data": [1,2,3]}'
    }
    
    clean_3 = analyzer.extract_clean_result(test_result_3)
    logger.info(f"测试3 - Raw输出提取: {clean_3 is not None and 'analysis' in clean_3}")
    
    # 测试用例4: 混合结果
    test_result_4 = {
        "analysis": {"result": "good"},
        "raw_output": "原始输出"
    }
    
    clean_4 = analyzer.extract_clean_result(test_result_4)
    logger.info(f"测试4 - 混合结果: {clean_4 is not None and 'raw_output' not in clean_4}")

def test_prepare_context_data():
    """测试上下文数据准备"""
    logger.info("🔍 测试上下文数据准备...")
    
    analyzer = ReviewAnalyzer()
    
    # 测试包含None值的上下文
    context_with_none = {
        "product_type": "webcams",
        "consumer_love": None,
        "unmet_needs": {"data": "valid"},
        "error_result": {"error": "分析失败"}
    }
    
    prepared = analyzer.prepare_context_data(context_with_none)
    
    logger.info("准备后的上下文:")
    for key, value in prepared.items():
        if isinstance(value, str) and "[" in value:
            logger.info(f"  {key}: 占位符 - {value[:50]}...")
        else:
            logger.info(f"  {key}: {type(value)} - {str(value)[:50]}...")

def test_json_extraction():
    """测试JSON提取"""
    logger.info("🔍 测试JSON提取...")
    
    analyzer = ReviewAnalyzer()
    
    # 测试复杂的嵌套JSON
    complex_output = '''
    根据分析，我得出以下结论：
    
    ```json
    {
      "consumer_profile": {
        "demographics": {
          "age_groups": [
            {
              "range": "25-35",
              "percentage": 45.2,
              "characteristics": "tech-savvy professionals"
            }
          ]
        },
        "behavior": {
          "usage_patterns": ["work", "entertainment"],
          "purchase_motivation": "quality and features"
        }
      }
    }
    ```
    
    这是完整的分析结果。
    '''
    
    extracted = analyzer.extract_json_from_output(complex_output)
    if extracted:
        try:
            parsed = json.loads(extracted)
            logger.info("✅ 复杂JSON提取成功")
            logger.info(f"提取的结构: {list(parsed.keys())}")
        except json.JSONDecodeError as e:
            logger.error(f"❌ JSON解析失败: {e}")
    else:
        logger.error("❌ 未能提取JSON")

def main():
    """主测试函数"""
    logger.info("🚀 开始测试参数流转逻辑...")
    logger.info("=" * 50)
    
    test_extract_clean_result()
    logger.info("-" * 30)
    test_prepare_context_data()
    logger.info("-" * 30)
    test_json_extraction()
    
    logger.info("=" * 50)
    logger.info("🏁 参数流转测试完成")

if __name__ == "__main__":
    main()
