#!/usr/bin/env python3
"""
测试完整的分析管道
"""

import os
import sys
from pathlib import Path
import json
import logging

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_pipeline_structure():
    """测试管道结构完整性"""
    logger.info("🔍 测试管道结构...")
    
    # 检查必要的文件和目录
    required_files = [
        'review_analyzer.py',
        'validate_prompts.py',
        'preprocess_data.py'
    ]
    
    required_dirs = [
        'Agent',
        'data',
        'results'
    ]
    
    required_prompts = [
        'Agent/product_type.md',
        'Agent/consumer_profile.md',
        'Agent/consumer_scenario.md',
        'Agent/consumer_motivation.md',
        'Agent/consumer_love.md',
        'Agent/unmet_needs.md',
        'Agent/opportunity.md',
        'Agent/star_rating_root_cause.md',
        'Agent/competitor.md'
    ]
    
    # 检查文件
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    # 检查目录
    missing_dirs = []
    for dir in required_dirs:
        if not Path(dir).exists():
            missing_dirs.append(dir)
    
    # 检查prompt文件
    missing_prompts = []
    for prompt in required_prompts:
        if not Path(prompt).exists():
            missing_prompts.append(prompt)
    
    # 报告结果
    if missing_files or missing_dirs or missing_prompts:
        logger.error("❌ 管道结构不完整:")
        if missing_files:
            logger.error(f"  缺少文件: {missing_files}")
        if missing_dirs:
            logger.error(f"  缺少目录: {missing_dirs}")
        if missing_prompts:
            logger.error(f"  缺少prompt: {missing_prompts}")
        return False
    else:
        logger.info("✅ 管道结构完整")
        return True

def test_data_availability():
    """测试数据文件可用性"""
    logger.info("🔍 测试数据可用性...")
    
    data_files = [
        'data/cleaned/customer_reviews_cleaned.csv',
        'data/cleaned/competitor_reviews_cleaned.csv'
    ]
    
    missing_data = []
    for file in data_files:
        if not Path(file).exists():
            missing_data.append(file)
    
    if missing_data:
        logger.error(f"❌ 缺少数据文件: {missing_data}")
        return False
    else:
        logger.info("✅ 数据文件完整")
        return True

def test_parameter_validation():
    """测试参数验证"""
    logger.info("🔍 测试参数验证...")
    
    try:
        import subprocess
        result = subprocess.run(
            ['python3', 'validate_prompts.py'],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        if result.returncode == 0 and "🎉 所有prompt文件的参数都正确!" in result.stdout:
            logger.info("✅ 参数验证通过")
            return True
        else:
            logger.error("❌ 参数验证失败")
            logger.error(result.stdout)
            return False
    except Exception as e:
        logger.error(f"❌ 参数验证异常: {str(e)}")
        return False

def test_data_preprocessing():
    """测试数据预处理"""
    logger.info("🔍 测试数据预处理...")
    
    # 检查原始数据文件是否存在
    original_files = [
        'data/Customer ASIN Reviews.csv',
        'data/Competitor ASIN Reviews.csv'
    ]
    
    missing_original = []
    for file in original_files:
        if not Path(file).exists():
            missing_original.append(file)
    
    if missing_original:
        logger.warning(f"⚠️  原始数据文件不存在: {missing_original}")
        logger.info("✅ 跳过预处理测试 - 使用已清理的数据")
        return True
    
    try:
        import subprocess
        result = subprocess.run(
            ['python3', 'preprocess_data.py', 'data/Customer ASIN Reviews.csv', 'data/Competitor ASIN Reviews.csv'],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        if result.returncode == 0:
            logger.info("✅ 数据预处理成功")
            # 显示统计信息
            output_lines = result.stdout.strip().split('\n')
            for line in output_lines[-5:]:  # 显示最后几行统计信息
                if line.strip():
                    logger.info(f"  {line}")
            return True
        else:
            logger.error("❌ 数据预处理失败")
            logger.error(result.stderr)
            return False
    except Exception as e:
        logger.error(f"❌ 数据预处理异常: {str(e)}")
        return False

def test_analyzer_import():
    """测试分析器导入"""
    logger.info("🔍 测试分析器导入...")
    
    try:
        from review_analyzer import ReviewAnalyzer
        analyzer = ReviewAnalyzer()
        logger.info("✅ 分析器导入成功")
        return True
    except Exception as e:
        logger.error(f"❌ 分析器导入失败: {str(e)}")
        return False

def test_prompt_loading():
    """测试prompt加载"""
    logger.info("🔍 测试prompt加载...")
    
    try:
        from review_analyzer import ReviewAnalyzer
        analyzer = ReviewAnalyzer()
        
        # 测试加载所有prompt文件
        prompts = [
            'product_type.md',
            'consumer_profile.md',
            'consumer_scenario.md',
            'consumer_motivation.md',
            'consumer_love.md',
            'unmet_needs.md',
            'opportunity.md',
            'star_rating_root_cause.md',
            'competitor.md'
        ]
        
        for prompt_file in prompts:
            prompt_content = analyzer.load_prompt(prompt_file)
            if not prompt_content:
                logger.error(f"❌ {prompt_file} 内容为空")
                return False
        
        logger.info("✅ 所有prompt文件加载成功")
        return True
    except Exception as e:
        logger.error(f"❌ prompt加载失败: {str(e)}")
        return False

def test_data_loading():
    """测试数据加载"""
    logger.info("🔍 测试数据加载...")
    
    try:
        from review_analyzer import ReviewAnalyzer
        analyzer = ReviewAnalyzer()
        
        # 测试数据加载和清理
        cleaned_data = analyzer.load_and_clean_data(
            'data/cleaned/customer_reviews_cleaned.csv',
            'data/cleaned/competitor_reviews_cleaned.csv'
        )
        
        if 'customer_review' not in cleaned_data or 'competitor_review' not in cleaned_data:
            logger.error("❌ 数据加载结果不完整")
            return False
        
        customer_count = len(cleaned_data['customer_review'])
        competitor_count = len(cleaned_data['competitor_review'])
        
        logger.info(f"✅ 数据加载成功 - 客户评论: {customer_count}条, 竞争对手评论: {competitor_count}条")
        return True
    except Exception as e:
        logger.error(f"❌ 数据加载失败: {str(e)}")
        return False

def analyze_pipeline_flow():
    """分析管道流程"""
    logger.info("🔍 分析管道流程...")
    
    # 定义分析流程
    pipeline_steps = {
        1: {
            'name': 'product_type',
            'description': '产品类型分析',
            'inputs': ['product_type'],
            'outputs': ['product_type_result']
        },
        2: {
            'name': 'consumer_analysis',
            'description': '消费者分析 (5个并行步骤)',
            'steps': [
                'consumer_profile',
                'consumer_scenario', 
                'consumer_motivation',
                'consumer_love',
                'unmet_needs'
            ],
            'inputs': ['product_type', 'customer_review_data'],
            'outputs': ['consumer_profile', 'consumer_scenario', 'consumer_motivation', 'consumer_love', 'unmet_needs']
        },
        3: {
            'name': 'opportunity',
            'description': '机会分析',
            'inputs': ['product_type', 'consumer_love', 'unmet_needs', 'consumer_scenario', 'customer_review_data'],
            'outputs': ['opportunity_result']
        },
        4: {
            'name': 'star_rating_root_cause',
            'description': '星级评分根因分析',
            'inputs': ['product_type', 'consumer_love', 'unmet_needs', 'customer_review_data'],
            'outputs': ['star_rating_analysis']
        },
        5: {
            'name': 'competitor',
            'description': '竞争对手分析',
            'inputs': ['product_type', 'consumer_love', 'unmet_needs', 'consumer_motivation', 'customer_review_data', 'competitor_review_data'],
            'outputs': ['competitor_analysis']
        }
    }
    
    logger.info("📋 分析管道流程:")
    for step_num, step_info in pipeline_steps.items():
        logger.info(f"  步骤{step_num}: {step_info['description']}")
        if 'steps' in step_info:
            for substep in step_info['steps']:
                logger.info(f"    - {substep}")
        logger.info(f"    输入: {step_info['inputs']}")
        logger.info(f"    输出: {step_info['outputs']}")
    
    return True

def main():
    """主测试函数"""
    logger.info("🚀 开始测试分析管道...")
    logger.info("=" * 60)
    
    tests = [
        ("管道结构", test_pipeline_structure),
        ("数据可用性", test_data_availability),
        ("参数验证", test_parameter_validation),
        ("数据预处理", test_data_preprocessing),
        ("分析器导入", test_analyzer_import),
        ("Prompt加载", test_prompt_loading),
        ("数据加载", test_data_loading),
        ("管道流程分析", analyze_pipeline_flow)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        logger.info(f"\n📋 测试: {test_name}")
        try:
            if test_func():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            logger.error(f"❌ {test_name} 测试异常: {str(e)}")
            failed += 1
    
    logger.info("\n" + "=" * 60)
    logger.info(f"📊 测试结果: {passed} 通过, {failed} 失败")
    
    if failed == 0:
        logger.info("🎉 所有测试通过! 分析管道准备就绪")
        return True
    else:
        logger.error("⚠️  存在问题，请检查失败的测试项")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
