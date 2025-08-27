#!/usr/bin/env python3
"""
数据预处理脚本
- 基于Review Text去重
- 删除不需要的列
"""

import pandas as pd
import sys
import os
from pathlib import Path
import logging

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def preprocess_review_data(input_file: str, output_file: str = None) -> str:
    """
    预处理评论数据
    
    Args:
        input_file: 输入CSV文件路径
        output_file: 输出CSV文件路径（可选，默认为原文件名_cleaned.csv）
        
    Returns:
        输出文件路径
    """
    
    # 确定输出文件路径
    if output_file is None:
        input_path = Path(input_file)
        output_file = input_path.parent / f"{input_path.stem}_cleaned{input_path.suffix}"
    
    logger.info(f"开始处理文件: {input_file}")
    
    try:
        # 读取数据
        df = pd.read_csv(input_file)
        logger.info(f"原始数据: {len(df)} 行, {len(df.columns)} 列")
        
        # 显示原始数据的基本信息
        logger.info("原始数据列名:")
        for i, col in enumerate(df.columns, 1):
            logger.info(f"  {i:2d}. {col}")
        
        # 检查Review Text列是否存在
        if 'Review Text' not in df.columns:
            raise ValueError("未找到'Review Text'列，请检查数据格式")
        
        # 1. 基于Review Text去重
        logger.info("开始去重...")
        original_count = len(df)
        df_dedup = df.drop_duplicates(subset=['Review Text'], keep='first')
        dedup_count = len(df_dedup)
        removed_count = original_count - dedup_count
        
        logger.info(f"去重结果: 删除了 {removed_count} 条重复记录 ({removed_count/original_count*100:.1f}%)")
        logger.info(f"去重后数据: {dedup_count} 行")
        
        # 2. 删除不需要的列
        columns_to_remove = [
            'Verbatim',
            'Verbatim Score', 
            'Topic Id',
            'L1 Topic',
            'L2 Topic', 
            'L3 Topic',
            'l4_defect',
            'Polarity'
        ]
        
        logger.info("开始删除不需要的列...")
        existing_columns_to_remove = [col for col in columns_to_remove if col in df_dedup.columns]
        missing_columns = [col for col in columns_to_remove if col not in df_dedup.columns]
        
        if existing_columns_to_remove:
            df_cleaned = df_dedup.drop(columns=existing_columns_to_remove)
            logger.info(f"删除的列: {existing_columns_to_remove}")
        else:
            df_cleaned = df_dedup
            logger.info("没有找到需要删除的列")
        
        if missing_columns:
            logger.warning(f"以下列在数据中不存在: {missing_columns}")
        
        # 3. 保存清理后的数据
        df_cleaned.to_csv(output_file, index=False)
        logger.info(f"清理后数据已保存到: {output_file}")
        logger.info(f"最终数据: {len(df_cleaned)} 行, {len(df_cleaned.columns)} 列")
        
        # 显示清理后的列名
        logger.info("清理后数据列名:")
        for i, col in enumerate(df_cleaned.columns, 1):
            logger.info(f"  {i:2d}. {col}")
        
        # 显示评分分布
        if 'Review Rating' in df_cleaned.columns:
            logger.info("评分分布:")
            rating_dist = df_cleaned['Review Rating'].value_counts().sort_index()
            for rating, count in rating_dist.items():
                logger.info(f"  {rating}星: {count} 条 ({count/len(df_cleaned)*100:.1f}%)")
        
        return str(output_file)
        
    except Exception as e:
        logger.error(f"处理失败: {str(e)}")
        raise

def preprocess_both_files(customer_file: str, competitor_file: str, output_dir: str = "data/cleaned"):
    """
    同时处理客户和竞争对手评论文件
    
    Args:
        customer_file: 客户评论文件路径
        competitor_file: 竞争对手评论文件路径
        output_dir: 输出目录
    """
    
    # 创建输出目录
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    logger.info("=" * 60)
    logger.info("开始批量数据预处理")
    logger.info("=" * 60)
    
    # 处理客户评论
    logger.info("\n📊 处理客户评论数据...")
    customer_output = output_path / "customer_reviews_cleaned.csv"
    preprocess_review_data(customer_file, str(customer_output))
    
    # 处理竞争对手评论
    logger.info("\n📊 处理竞争对手评论数据...")
    competitor_output = output_path / "competitor_reviews_cleaned.csv"
    preprocess_review_data(competitor_file, str(competitor_output))
    
    logger.info("\n" + "=" * 60)
    logger.info("✅ 批量预处理完成!")
    logger.info(f"📁 清理后的文件保存在: {output_path}")
    logger.info(f"   - 客户评论: {customer_output}")
    logger.info(f"   - 竞争对手评论: {competitor_output}")
    logger.info("=" * 60)
    
    return str(customer_output), str(competitor_output)

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("❌ 使用方法错误!")
        print("📖 用法:")
        print("   单文件处理: python3 preprocess_data.py <input_file.csv> [output_file.csv]")
        print("   批量处理:   python3 preprocess_data.py <customer_file.csv> <competitor_file.csv>")
        print("\n📝 示例:")
        print("   python3 preprocess_data.py data/Customer\\ ASIN\\ Reviews.csv")
        print("   python3 preprocess_data.py data/Customer\\ ASIN\\ Reviews.csv data/Competitor\\ ASIN\\ Reviews.csv")
        sys.exit(1)
    
    try:
        if len(sys.argv) == 2:
            # 单文件处理
            input_file = sys.argv[1]
            output_file = preprocess_review_data(input_file)
            print(f"\n✅ 处理完成! 输出文件: {output_file}")
            
        elif len(sys.argv) == 3:
            if sys.argv[2].endswith('.csv'):
                # 单文件处理，指定输出文件
                input_file = sys.argv[1]
                output_file = sys.argv[2]
                preprocess_review_data(input_file, output_file)
                print(f"\n✅ 处理完成! 输出文件: {output_file}")
            else:
                print("❌ 第二个参数应该是CSV文件路径")
                sys.exit(1)
                
        elif len(sys.argv) == 4:
            # 批量处理
            customer_file = sys.argv[1]
            competitor_file = sys.argv[2]
            output_dir = sys.argv[3]
            customer_output, competitor_output = preprocess_both_files(customer_file, competitor_file, output_dir)
            print(f"\n✅ 批量处理完成!")
            print(f"   客户评论: {customer_output}")
            print(f"   竞争对手评论: {competitor_output}")
        else:
            # 批量处理（使用默认输出目录）
            customer_file = sys.argv[1]
            competitor_file = sys.argv[2]
            customer_output, competitor_output = preprocess_both_files(customer_file, competitor_file)
            print(f"\n✅ 批量处理完成!")
            print(f"   客户评论: {customer_output}")
            print(f"   竞争对手评论: {competitor_output}")
            
    except Exception as e:
        print(f"\n❌ 处理失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
