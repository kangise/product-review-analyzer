#!/usr/bin/env python3
"""
运行修复版分析管道
解决前置依赖和输出路径统一问题
"""

import sys
import os
from pathlib import Path
from review_analyzer_fixed import ReviewAnalyzerFixed
import logging

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """
    运行修复版分析管道
    """
    print("🚀 启动修复版Review分析管道...")
    print("=" * 50)
    
    # 设置文件路径
    base_dir = Path(__file__).parent
    customer_review_path = base_dir / "data" / "cleaned" / "customer_reviews_cleaned.csv"
    competitor_review_path = base_dir / "data" / "cleaned" / "competitor_reviews_cleaned.csv"
    product_type = "webcams"
    
    # 检查文件是否存在
    if not customer_review_path.exists():
        logger.error(f"客户评论文件不存在: {customer_review_path}")
        print("❌ 请先运行数据预处理脚本")
        return False
    
    if not competitor_review_path.exists():
        logger.error(f"竞争对手评论文件不存在: {competitor_review_path}")
        print("❌ 请先运行数据预处理脚本")
        return False
    
    try:
        # 创建分析器实例
        analyzer = ReviewAnalyzerFixed()
        
        print(f"📊 数据文件:")
        print(f"  - 客户评论: {customer_review_path}")
        print(f"  - 竞争对手评论: {competitor_review_path}")
        print(f"  - 产品类型: {product_type}")
        print(f"📁 输出目录: {analyzer.output_dir}")
        print()
        
        # 运行分析管道
        results = analyzer.run_analysis_pipeline(
            str(customer_review_path),
            str(competitor_review_path), 
            product_type
        )
        
        print("\n" + "=" * 50)
        print("✅ 分析管道执行完成！")
        print(f"📁 结果保存在: {analyzer.output_dir}")
        print(f"📊 共完成 {len(results)} 个分析步骤")
        
        # 显示执行摘要
        success_count = 0
        failed_steps = []
        
        for step_name, result in results.items():
            if isinstance(result, dict) and 'error' in result:
                failed_steps.append(step_name)
            else:
                success_count += 1
        
        print(f"✅ 成功: {success_count}/{len(results)} 个步骤")
        
        if failed_steps:
            print(f"❌ 失败步骤: {', '.join(failed_steps)}")
        
        print(f"\n📋 查看详细报告: {analyzer.output_dir}/analysis_report.md")
        
        return True
        
    except Exception as e:
        logger.error(f"分析管道执行失败: {str(e)}")
        print(f"❌ 执行失败: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
