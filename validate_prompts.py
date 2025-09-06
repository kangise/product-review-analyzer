#!/usr/bin/env python3
"""
验证agent文件夹中所有prompt的参数是否正确
"""

import os
import re
from pathlib import Path

def extract_parameters_from_prompt(prompt_content):
    """从prompt内容中提取所有参数"""
    # 只查找明确的参数占位符格式，排除JSON示例中的内容
    # 查找 {parameter_name} 但排除包含空格、换行符或特殊字符的内容
    parameters = re.findall(r'\{([a-zA-Z_][a-zA-Z0-9_]*)\}', prompt_content)
    return set(parameters)

def validate_prompts():
    """验证所有prompt文件的参数"""
    agent_dir = Path("agent")
    
    # 定义每个prompt文件应该使用的参数
    expected_params = {
        'product_type.md': {'product_type'},
        'consumer_profile.md': {'product_type', 'customer_review_data'},
        'consumer_scenario.md': {'product_type', 'customer_review_data'},
        'consumer_motivation.md': {'product_type', 'customer_review_data'},
        'consumer_love.md': {'product_type', 'customer_review_data'},
        'unmet_needs.md': {'product_type', 'customer_review_data'},
        'opportunity.md': {'product_type', 'consumer_love', 'unmet_needs', 'consumer_scenario', 'customer_review_data', 'competitor_analysis'},
        'star_rating_root_cause.md': {'product_type', 'customer_review_data', 'consumer_love', 'unmet_needs'},
        'competitor.md': {'product_type', 'customer_review_data', 'competitor_review_data', 'consumer_love', 'unmet_needs', 'consumer_motivation'},
        'competitor_analysis_base.md': {'our_love_dimensions', 'our_unmet_dimensions', 'our_motivation_dimensions', 'competitor_review_data'},
        'competitor_comparison.md': {'our_consumer_love', 'our_unmet_needs', 'our_consumer_motivation', 'competitor_consumer_love', 'competitor_unmet_needs', 'competitor_consumer_motivation'},
        'competitor_unique_insights.md': {'competitor_review_data', 'our_analyzed_dimensions'}
    }
    
    print("🔍 验证agent文件夹中的prompt参数...")
    print("=" * 60)
    
    all_valid = True
    
    for prompt_file, expected in expected_params.items():
        prompt_path = agent_dir / prompt_file
        
        if not prompt_path.exists():
            print(f"❌ {prompt_file}: 文件不存在")
            all_valid = False
            continue
        
        with open(prompt_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        actual_params = extract_parameters_from_prompt(content)
        
        # 检查参数
        missing_params = expected - actual_params
        extra_params = actual_params - expected
        
        if missing_params or extra_params:
            print(f"⚠️  {prompt_file}:")
            if missing_params:
                print(f"   缺少参数: {missing_params}")
            if extra_params:
                print(f"   多余参数: {extra_params}")
            all_valid = False
        else:
            print(f"✅ {prompt_file}: 参数正确")
    
    print("=" * 60)
    if all_valid:
        print("🎉 所有prompt文件的参数都正确!")
    else:
        print("⚠️  发现参数问题，请检查上述文件")
    
    return all_valid

if __name__ == "__main__":
    validate_prompts()
