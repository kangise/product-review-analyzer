#!/usr/bin/env python3
"""
运行完整的评论分析管道
"""

import sys
import logging
from pathlib import Path
from review_analyzer import ReviewAnalyzer

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """运行分析管道"""
    logger.info("🚀 开始运行评论分析管道...")
    
    # 使用预处理后的数据文件
    customer_review_path = "data/cleaned/customer_reviews_cleaned.csv"
    competitor_review_path = "data/cleaned/competitor_reviews_cleaned.csv"
    product_type = "webcams"  # 基于对话摘要中的信息
    
    # 检查文件是否存在
    if not Path(customer_review_path).exists():
        logger.error(f"❌ 客户评论文件不存在: {customer_review_path}")
        sys.exit(1)
    
    if not Path(competitor_review_path).exists():
        logger.error(f"❌ 竞争对手评论文件不存在: {competitor_review_path}")
        sys.exit(1)
    
    try:
        # 创建分析器实例
        analyzer = ReviewAnalyzer()
        
        # 运行完整的分析管道
        logger.info("📊 开始执行分析管道...")
        results = analyzer.run_analysis_pipeline(
            customer_review_path, 
            competitor_review_path, 
            product_type
        )
        
        # 保存结果
        output_file = analyzer.save_results()
        
        # 显示结果摘要
        logger.info("\n" + "="*60)
        logger.info("🎉 分析完成!")
        logger.info(f"📁 结果已保存到: {output_file}")
        logger.info("\n📋 完成的分析步骤:")
        
        for i, step in enumerate(results.keys(), 1):
            logger.info(f"  {i}. ✅ {step}")
        
        logger.info("\n📊 结果文件:")
        results_dir = Path("results")
        if results_dir.exists():
            for file in results_dir.glob("*.json"):
                logger.info(f"  📄 {file.name}")
        
        logger.info("="*60)
        
    except KeyboardInterrupt:
        logger.info("\n⏹️  分析被用户中断")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ 分析失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
