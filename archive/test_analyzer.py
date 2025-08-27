#!/usr/bin/env python3
"""
测试评论分析器
"""

import pandas as pd
from review_analyzer import ReviewAnalyzer
import logging

# 设置日志级别
logging.basicConfig(level=logging.INFO)

def create_sample_data():
    """创建示例数据用于测试"""
    
    # 创建示例客户评论数据
    customer_data = {
        'Review Text': [
            'Amazing 4K video quality, love the AI tracking feature!',
            'Great camera but battery life could be better',
            'Easy to use, perfect for travel photography',
            'Software is buggy, needs improvement',
            'Excellent image stabilization, highly recommend'
        ],
        'Rating': [5, 4, 5, 2, 5],
        'Product': ['Camera'] * 5
    }
    
    # 创建示例竞争对手评论数据
    competitor_data = {
        'Review Text': [
            'Good quality but overpriced compared to alternatives',
            'Better software interface than other brands',
            'Hardware feels cheap for the price point',
            'Customer service is responsive and helpful',
            'Features are limited compared to competitors'
        ],
        'Rating': [3, 4, 2, 4, 3],
        'Product': ['Competitor Camera'] * 5
    }
    
    # 保存为CSV文件
    customer_df = pd.DataFrame(customer_data)
    competitor_df = pd.DataFrame(competitor_data)
    
    customer_df.to_csv('sample_customer_reviews.csv', index=False)
    competitor_df.to_csv('sample_competitor_reviews.csv', index=False)
    
    print("示例数据已创建:")
    print("- sample_customer_reviews.csv")
    print("- sample_competitor_reviews.csv")

def test_data_loading():
    """测试数据加载和清理功能"""
    print("\n=== 测试数据加载和清理 ===")
    
    analyzer = ReviewAnalyzer()
    
    try:
        cleaned_data = analyzer.load_and_clean_data(
            'sample_customer_reviews.csv',
            'sample_competitor_reviews.csv'
        )
        
        print(f"客户评论数据: {len(cleaned_data['customer_review'])} 条")
        print(f"竞争对手评论数据: {len(cleaned_data['competitor_review'])} 条")
        
        # 显示数据样本
        print("\n客户评论样本:")
        print(cleaned_data['customer_review'].head(2))
        
        return True
        
    except Exception as e:
        print(f"数据加载测试失败: {e}")
        return False

def test_prompt_loading():
    """测试prompt加载功能"""
    print("\n=== 测试Prompt加载 ===")
    
    analyzer = ReviewAnalyzer()
    
    try:
        # 测试加载一个存在的prompt
        prompt = analyzer.load_prompt('consumer_profile.md')
        print(f"成功加载consumer_profile.md, 长度: {len(prompt)} 字符")
        
        # 显示prompt的前200个字符
        print(f"Prompt预览: {prompt[:200]}...")
        
        return True
        
    except Exception as e:
        print(f"Prompt加载测试失败: {e}")
        return False

def test_prompt_processing():
    """测试prompt模板处理功能"""
    print("\n=== 测试Prompt模板处理 ===")
    
    analyzer = ReviewAnalyzer()
    
    try:
        # 创建测试prompt和上下文
        test_prompt = "分析产品: {product_type}\n数据: {test_data}"
        test_context = {
            'product_type': '360度相机',
            'test_data': {'reviews': ['很好用', '质量不错']}
        }
        
        processed = analyzer.process_prompt_template(test_prompt, test_context)
        print("原始prompt:")
        print(test_prompt)
        print("\n处理后的prompt:")
        print(processed)
        
        return True
        
    except Exception as e:
        print(f"Prompt模板处理测试失败: {e}")
        return False

def main():
    """主测试函数"""
    print("开始测试评论分析器...")
    
    # 创建示例数据
    create_sample_data()
    
    # 运行各项测试
    tests = [
        test_data_loading,
        test_prompt_loading,
        test_prompt_processing
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"测试异常: {e}")
            results.append(False)
    
    # 总结测试结果
    print(f"\n=== 测试总结 ===")
    print(f"通过测试: {sum(results)}/{len(results)}")
    
    if all(results):
        print("✅ 所有基础功能测试通过!")
        print("\n下一步可以:")
        print("1. 完善Agent文件夹中的prompt文件")
        print("2. 运行完整的分析管道")
        print("3. 测试与Q Chat的集成")
    else:
        print("❌ 部分测试失败，请检查配置")

if __name__ == "__main__":
    main()
