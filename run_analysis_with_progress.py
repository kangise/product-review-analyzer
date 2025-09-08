#!/usr/bin/env python3
"""
运行完整的评论分析管道 - 带有实时进度跟踪
"""

import sys
import os
import json
import logging
import re
import subprocess
from pathlib import Path
from typing import Dict, Any
from review_analyzer import ReviewAnalyzer
import time

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 分析步骤定义 - 与实际的分析流程对应
ANALYSIS_STEPS = [
    {"id": "product_type", "name": "Product Classification", "name_zh": "产品分类分析"},
    {"id": "consumer_profile", "name": "Consumer Profile Analysis", "name_zh": "消费者画像分析"},
    {"id": "consumer_scenario", "name": "Usage Scenario Analysis", "name_zh": "使用场景分析"},
    {"id": "consumer_motivation", "name": "Purchase Motivation Analysis", "name_zh": "购买动机分析"},
    {"id": "consumer_love", "name": "Customer Satisfaction Analysis", "name_zh": "客户满意度分析"},
    {"id": "unmet_needs", "name": "Unmet Needs Analysis", "name_zh": "未满足需求分析"},
    {"id": "opportunity", "name": "Business Opportunity Analysis", "name_zh": "商业机会分析"},
    {"id": "star_rating_root_cause", "name": "Rating Root Cause Analysis", "name_zh": "评分根因分析"},
    {"id": "competitor", "name": "Competitive Analysis", "name_zh": "竞争分析"}
]

def output_progress(step_index, status, message=""):
    """输出进度信息到stdout，供API服务器解析"""
    progress_data = {
        "step_index": step_index,
        "total_steps": len(ANALYSIS_STEPS),
        "progress": int((step_index / len(ANALYSIS_STEPS)) * 90) + 5,  # 5-95%
        "status": status,
        "current_step": ANALYSIS_STEPS[step_index] if step_index < len(ANALYSIS_STEPS) else None,
        "message": message,
        "timestamp": time.time()
    }
    
    # 输出JSON格式的进度信息，前缀PROGRESS:便于API服务器解析
    print(f"PROGRESS:{json.dumps(progress_data)}", flush=True)

class ProgressTrackingAnalyzer(ReviewAnalyzer):
    """带有进度跟踪的分析器"""
    
    def run_analysis_pipeline_with_progress(self, customer_review_path: str, competitor_review_path: str, product_type: str):
        """运行带有进度跟踪的分析管道"""
        
        output_progress(0, "starting", "Initializing analysis pipeline...")
        logger.info("开始运行分析管道...")
        
        # 1. 数据清理
        output_progress(0, "running", "Loading and cleaning data...")
        self.load_and_clean_data(customer_review_path, competitor_review_path)
        
        # 2. 产品类型分析
        output_progress(0, "running", "Analyzing product type...")
        logger.info("步骤1: 产品类型分析")
        product_type_prompt = self.load_prompt('product_type.md')
        self.results['product_type'] = self.call_q_chat(
            product_type_prompt, 
            {'product_type': product_type}
        )
        # 保存第一步结果
        step_file = self.output_dir / "product_type.json"
        with open(step_file, 'w', encoding='utf-8') as f:
            json.dump(self.results['product_type'], f, indent=2, ensure_ascii=False)
        logger.info(f"步骤1结果已保存: {step_file}")
        output_progress(0, "completed", "Product type analysis completed")
        
        # 提取第一步的干净结果用于后续步骤
        clean_product_type = self.extract_clean_result(self.results['product_type'])
        
        # 3. 消费者分析 (5个步骤)
        consumer_prompts = [
            ('consumer_profile.md', 1, "Consumer profile analysis"),
            ('consumer_scenario.md', 2, "Usage scenario analysis"), 
            ('consumer_motivation.md', 3, "Purchase motivation analysis"),
            ('consumer_love.md', 4, "Customer satisfaction analysis"),
            ('unmet_needs.md', 5, "Unmet needs analysis")
        ]
        
        logger.info("步骤2: 消费者分析")
        for prompt_file, step_idx, step_desc in consumer_prompts:
            output_progress(step_idx, "running", f"Executing {step_desc}...")
            
            prompt_name = prompt_file.replace('.md', '')
            logger.info(f"  执行: {prompt_name}")
            
            prompt = self.load_prompt(prompt_file)
            
            # 为每个消费者分析提供相应的上下文
            context = {
                'product_type': clean_product_type if clean_product_type else product_type,
                'customer_review_data': self.cleaned_data['customer_review']
            }
            
            # 优化上下文数据
            optimized_context = self.prepare_context_data(context)
            self.results[prompt_name] = self.call_q_chat(prompt, optimized_context)
            
            # 保存每个消费者分析步骤的结果
            step_file = self.output_dir / f"{prompt_name}.json"
            with open(step_file, 'w', encoding='utf-8') as f:
                json.dump(self.results[prompt_name], f, indent=2, ensure_ascii=False)
            logger.info(f"步骤2.{prompt_name}结果已保存: {step_file}")
            output_progress(step_idx, "completed", f"{step_desc} completed")
        
        # 4. 机会分析
        output_progress(6, "running", "Analyzing business opportunities...")
        logger.info("步骤3: 机会分析")
        opportunity_prompt = self.load_prompt('opportunity.md')
        
        # 提取干净的分析结果用于参数传递
        clean_consumer_love = self.extract_clean_result(self.results['consumer_love'])
        clean_unmet_needs = self.extract_clean_result(self.results['unmet_needs'])
        clean_consumer_scenario = self.extract_clean_result(self.results['consumer_scenario'])
        
        opportunity_context = {
            'product_type': clean_product_type if clean_product_type else product_type,
            'consumer_love': clean_consumer_love if clean_consumer_love else "[消费者喜爱点分析不可用]",
            'unmet_needs': clean_unmet_needs if clean_unmet_needs else "[未满足需求分析不可用]",
            'consumer_scenario': clean_consumer_scenario if clean_consumer_scenario else "[使用场景分析不可用]",
            'customer_review_data': self.cleaned_data['customer_review']
        }
        self.results['opportunity'] = self.call_q_chat(opportunity_prompt, self.prepare_context_data(opportunity_context))
        # 保存机会分析结果
        step_file = self.output_dir / "opportunity.json"
        with open(step_file, 'w', encoding='utf-8') as f:
            json.dump(self.results['opportunity'], f, indent=2, ensure_ascii=False)
        logger.info(f"步骤3结果已保存: {step_file}")
        output_progress(6, "completed", "Business opportunity analysis completed")
        
        # 5. 星级评分根因分析
        output_progress(7, "running", "Analyzing rating root causes...")
        logger.info("步骤4: 星级评分根因分析")
        star_rating_prompt = self.load_prompt('star_rating_root_cause.md')
        # 提取具体的喜爱点和未满足需求列表
        love_points = []
        unmet_needs_list = []
        
        if clean_consumer_love:
            love_points = [item["赞美点"] for item in clean_consumer_love.get("核心赞美点分析", [])]
        
        if clean_unmet_needs:
            unmet_needs_list = [item["痛点/未满足的需求"] for item in clean_unmet_needs.get("未满足需求分析", [])]
        
        star_rating_context = {
            'product_type': clean_product_type if clean_product_type else product_type,
            'consumer_love_points': love_points,
            'unmet_needs_list': unmet_needs_list,
            'customer_review_data': self.cleaned_data['customer_review']
        }
        self.results['star_rating_root_cause'] = self.call_q_chat(star_rating_prompt, self.prepare_context_data(star_rating_context))
        # 保存星级评分分析结果
        step_file = self.output_dir / "star_rating_root_cause.json"
        with open(step_file, 'w', encoding='utf-8') as f:
            json.dump(self.results['star_rating_root_cause'], f, indent=2, ensure_ascii=False)
        logger.info(f"步骤4结果已保存: {step_file}")
        output_progress(8, "completed", "Rating root cause analysis completed")
        
        # 6. 竞争对手分析 (新的三阶段流程)
        output_progress(8, "running", "Analyzing competitor data...")
        logger.info("步骤5: 竞争对手分析")
        
        # 提取我方维度清单
        clean_consumer_love = self.extract_clean_result(self.results['consumer_love'])
        clean_unmet_needs = self.extract_clean_result(self.results['unmet_needs'])
        clean_consumer_motivation = self.extract_clean_result(self.results['consumer_motivation'])
        
        if clean_consumer_love or clean_unmet_needs or clean_consumer_motivation:
            # 提取维度列表（只从成功的模块中提取）
            our_love_dimensions = []
            our_unmet_dimensions = []
            our_motivation_dimensions = []
            
            if clean_consumer_love:
                our_love_dimensions = [item["赞美点"] for item in clean_consumer_love.get("核心赞美点分析", [])]
            if clean_unmet_needs:
                our_unmet_dimensions = [item["痛点/未满足的需求"] for item in clean_unmet_needs.get("未满足需求分析", [])]
            if clean_consumer_motivation:
                our_motivation_dimensions = [item["动机"] for item in clean_consumer_motivation.get("具体购买动机", [])]
            
            logger.info(f"  提取维度: 喜爱点{len(our_love_dimensions)}个, 未满足需求{len(our_unmet_dimensions)}个, 购买动机{len(our_motivation_dimensions)}个")
            
            # 阶段1: 竞品基础分析
            logger.info("  阶段1: 竞品基础分析")
            competitor_base_prompt = self.load_prompt('competitor_analysis_base.md')
            
            competitor_base_context = {
                'our_love_dimensions': our_love_dimensions,
                'our_unmet_dimensions': our_unmet_dimensions,
                'our_motivation_dimensions': our_motivation_dimensions,
                'competitor_review_data': self.cleaned_data['competitor_review']
            }
            self.results['competitor_base'] = self.call_q_chat(competitor_base_prompt, self.prepare_context_data(competitor_base_context))
            
            # 保存竞品基础分析结果
            step_file = self.output_dir / "competitor_base.json"
            with open(step_file, 'w', encoding='utf-8') as f:
                json.dump(self.results['competitor_base'], f, indent=2, ensure_ascii=False)
            logger.info(f"  阶段1结果已保存: {step_file}")
            
            # 阶段2: 竞品对比分析
            logger.info("  阶段2: 竞品对比分析")
            clean_competitor_base = self.extract_clean_result(self.results['competitor_base'])
            
            if clean_competitor_base:
                competitor_comparison_prompt = self.load_prompt('competitor_comparison.md')
                competitor_comparison_context = {
                    'our_consumer_love': clean_consumer_love or {"核心赞美点分析": []},
                    'our_unmet_needs': clean_unmet_needs or {"未满足需求分析": []},
                    'our_consumer_motivation': clean_consumer_motivation or {"具体购买动机": []},
                    'competitor_consumer_love': clean_competitor_base.get('竞品消费者喜爱点', []),
                    'competitor_unmet_needs': clean_competitor_base.get('竞品未满足需求', []),
                    'competitor_consumer_motivation': clean_competitor_base.get('竞品购买动机', [])
                }
                self.results['competitor_comparison'] = self.call_q_chat(competitor_comparison_prompt, self.prepare_context_data(competitor_comparison_context))
                
                # 保存竞品对比分析结果
                step_file = self.output_dir / "competitor_comparison.json"
                with open(step_file, 'w', encoding='utf-8') as f:
                    json.dump(self.results['competitor_comparison'], f, indent=2, ensure_ascii=False)
                logger.info(f"  阶段2结果已保存: {step_file}")
            else:
                logger.warning("  竞品基础分析失败，跳过对比分析")
                self.results['competitor_comparison'] = {"error": "竞品基础分析失败"}
            
            # 阶段3: 竞品独有洞察
            logger.info("  阶段3: 竞品独有洞察")
            competitor_unique_prompt = self.load_prompt('competitor_unique_insights.md')
            all_our_dimensions = our_love_dimensions + our_unmet_dimensions + our_motivation_dimensions
            competitor_unique_context = {
                'competitor_review_data': self.cleaned_data['competitor_review'],
                'our_analyzed_dimensions': all_our_dimensions
            }
            self.results['competitor_unique'] = self.call_q_chat(competitor_unique_prompt, self.prepare_context_data(competitor_unique_context))
            
            # 保存竞品独有洞察结果
            step_file = self.output_dir / "competitor_unique.json"
            with open(step_file, 'w', encoding='utf-8') as f:
                json.dump(self.results['competitor_unique'], f, indent=2, ensure_ascii=False)
            logger.info(f"  阶段3结果已保存: {step_file}")
            
            # 合并最终竞品分析结果
            final_competitor_result = {
                "竞品基础分析": clean_competitor_base if clean_competitor_base else {"error": "分析失败"},
                "竞品对比分析": self.extract_clean_result(self.results['competitor_comparison']) or {"error": "分析失败"},
                "竞品独有洞察": self.extract_clean_result(self.results['competitor_unique']) or {"error": "分析失败"}
            }
            self.results['competitor'] = final_competitor_result
            
        else:
            logger.warning("我方基础分析全部失败，跳过竞品分析")
            self.results['competitor'] = {"error": "我方基础分析全部失败，无法进行竞品对比"}
        
        # 保存最终竞品分析结果
        step_file = self.output_dir / "competitor.json"
        with open(step_file, 'w', encoding='utf-8') as f:
            json.dump(self.results['competitor'], f, indent=2, ensure_ascii=False)
        logger.info(f"步骤5结果已保存: {step_file}")
        output_progress(8, "completed", "Competitor analysis completed")
        
        # 完成所有分析
        output_progress(len(ANALYSIS_STEPS), "completed", "All analysis steps completed successfully")
        logger.info("分析管道完成!")
        
        return self.results

def main():
    """运行分析管道"""
    logger.info("🚀 开始运行评论分析管道...")
    
    # 使用上传的数据文件
    customer_review_path = "data/Customer ASIN Reviews.csv"
    competitor_review_path = "data/Competitor ASIN Reviews.csv"
    product_type = sys.argv[1] if len(sys.argv) > 1 else "webcams"
    output_language = sys.argv[2] if len(sys.argv) > 2 else "en"
    
    # 输出初始进度
    output_progress(0, "starting", "Initializing analysis pipeline...")
    
    # 检查文件是否存在
    if not Path(customer_review_path).exists():
        logger.error(f"❌ 客户评论文件不存在: {customer_review_path}")
        output_progress(0, "failed", f"Customer review file not found: {customer_review_path}")
        sys.exit(1)
    
    try:
        # 创建带进度跟踪的分析器实例
        analyzer = ProgressTrackingAnalyzer(output_language=output_language)
        
        # 运行完整的分析管道
        logger.info("📊 开始执行分析管道...")
        results = analyzer.run_analysis_pipeline_with_progress(
            customer_review_path, 
            competitor_review_path, 
            product_type
        )
        
        # 保存最终结果
        output_file = analyzer.save_results()
        
        # 保存分析元数据
        import json
        from datetime import datetime
        metadata = {
            'target_category': product_type,
            'timestamp': datetime.now().isoformat(),
            'has_competitor_data': os.path.exists(competitor_review_path)
        }
        
        metadata_file = analyzer.output_dir / "metadata.json"
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        # 显示结果摘要
        logger.info("\n" + "="*60)
        logger.info("🎉 分析完成!")
        logger.info(f"📁 结果已保存到: {output_file}")
        logger.info("="*60)
        
    except KeyboardInterrupt:
        logger.info("\n⏹️  分析被用户中断")
        output_progress(0, "failed", "Analysis interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ 分析失败: {str(e)}")
        output_progress(0, "failed", f"Analysis failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
