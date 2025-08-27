#!/usr/bin/env python3
"""
测试opportunity模块是否能正确生成JSON结果
使用已有的前置文件依赖
"""

import json
import sys
import logging
from pathlib import Path
from review_analyzer import ReviewAnalyzer

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_opportunity_module():
    """测试opportunity模块"""
    logger.info("🔍 测试opportunity模块...")
    
    # 使用已有的分析结果目录
    base_dir = Path("analysis_results_20250827_102804")
    
    if not base_dir.exists():
        logger.error(f"❌ 基础结果目录不存在: {base_dir}")
        return False
    
    # 检查前置依赖文件
    required_files = [
        "product_type.json",
        "consumer_love.json", 
        "unmet_needs.json",
        "consumer_scenario.json",
        "customer_reviews_cleaned.csv"
    ]
    
    logger.info("📋 检查前置依赖文件...")
    for file_name in required_files:
        file_path = base_dir / file_name
        if not file_path.exists():
            logger.error(f"❌ 缺少依赖文件: {file_path}")
            return False
        logger.info(f"✅ {file_name} - 存在")
    
    # 创建分析器实例
    analyzer = ReviewAnalyzer()
    
    # 加载前置结果
    logger.info("📊 加载前置分析结果...")
    try:
        # 加载JSON结果
        with open(base_dir / "product_type.json", 'r', encoding='utf-8') as f:
            product_type_result = json.load(f)
        
        with open(base_dir / "consumer_love.json", 'r', encoding='utf-8') as f:
            consumer_love_result = json.load(f)
            
        with open(base_dir / "unmet_needs.json", 'r', encoding='utf-8') as f:
            unmet_needs_result = json.load(f)
            
        with open(base_dir / "consumer_scenario.json", 'r', encoding='utf-8') as f:
            consumer_scenario_result = json.load(f)
        
        # 加载清理后的数据
        import pandas as pd
        customer_reviews = pd.read_csv(base_dir / "customer_reviews_cleaned.csv")
        
        logger.info("✅ 所有前置结果加载成功")
        
    except Exception as e:
        logger.error(f"❌ 加载前置结果失败: {e}")
        return False
    
    # 准备上下文数据
    logger.info("🔧 准备opportunity分析的上下文数据...")
    context_data = {
        'product_type': product_type_result,
        'consumer_love': consumer_love_result,
        'unmet_needs': unmet_needs_result,
        'consumer_scenario': consumer_scenario_result,
        'customer_review_data': customer_reviews.to_json(orient='records', force_ascii=False)
    }
    
    # 显示上下文数据大小
    total_size = 0
    logger.info("📊 上下文数据组件分析:")
    for key, value in context_data.items():
        if isinstance(value, (dict, list)):
            size = len(json.dumps(value, ensure_ascii=False))
        else:
            size = len(str(value))
        total_size += size
        logger.info(f"  {key}: {size:,} 字符 ({type(value).__name__})")
    
    logger.info(f"📏 总上下文大小: {total_size:,} 字符 ({total_size/1024:.1f} KB)")
    
    # 执行opportunity分析
    logger.info("🚀 执行opportunity分析...")
    try:
        # 加载opportunity prompt
        prompt = analyzer.load_prompt('opportunity.md')
        
        # 处理prompt模板
        processed_prompt = analyzer.process_prompt_template(prompt, context_data)
        
        # 调用Q Chat进行分析
        result = analyzer.call_q_chat(processed_prompt, context_data)
        
        if result and isinstance(result, dict):
            logger.info("✅ opportunity分析成功完成")
            
            # 保存结果到测试目录
            test_output_dir = Path("test_opportunity_output")
            test_output_dir.mkdir(exist_ok=True)
            
            output_file = test_output_dir / "opportunity_test_result.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            
            logger.info(f"💾 结果已保存到: {output_file}")
            
            # 显示结果摘要
            logger.info("📋 结果摘要:")
            if isinstance(result, dict):
                for key, value in result.items():
                    if isinstance(value, (dict, list)):
                        logger.info(f"  {key}: {len(json.dumps(value, ensure_ascii=False))} 字符")
                    else:
                        logger.info(f"  {key}: {len(str(value))} 字符")
            
            return True
            
        else:
            logger.error(f"❌ opportunity分析返回无效结果: {type(result)}")
            return False
            
    except Exception as e:
        logger.error(f"❌ opportunity分析失败: {e}")
        import traceback
        logger.error(f"详细错误: {traceback.format_exc()}")
        return False

def main():
    """主函数"""
    logger.info("🧪 开始opportunity模块测试...")
    
    success = test_opportunity_module()
    
    if success:
        logger.info("🎉 opportunity模块测试成功!")
    else:
        logger.error("💥 opportunity模块测试失败!")
        sys.exit(1)

if __name__ == "__main__":
    main()
