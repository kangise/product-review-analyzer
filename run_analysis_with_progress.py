#!/usr/bin/env python3
"""
运行完整的评论分析管道 - 带有实时进度跟踪
"""

import sys
import json
import logging
from pathlib import Path
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
        output_progress(1, "completed", "Product type analysis completed")
        
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
            output_progress(step_idx + 1, "completed", f"{step_desc} completed")
        
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
        output_progress(7, "completed", "Business opportunity analysis completed")
        
        # 5. 星级评分根因分析
        output_progress(7, "running", "Analyzing rating root causes...")
        logger.info("步骤4: 星级评分根因分析")
        star_rating_prompt = self.load_prompt('star_rating_root_cause.md')
        star_rating_context = {
            'product_type': clean_product_type if clean_product_type else product_type,
            'consumer_love': clean_consumer_love if clean_consumer_love else "[消费者喜爱点分析不可用]",
            'unmet_needs': clean_unmet_needs if clean_unmet_needs else "[未满足需求分析不可用]",
            'customer_review_data': self.cleaned_data['customer_review']
        }
        self.results['star_rating_root_cause'] = self.call_q_chat(star_rating_prompt, self.prepare_context_data(star_rating_context))
        # 保存星级评分分析结果
        step_file = self.output_dir / "star_rating_root_cause.json"
        with open(step_file, 'w', encoding='utf-8') as f:
            json.dump(self.results['star_rating_root_cause'], f, indent=2, ensure_ascii=False)
        logger.info(f"步骤4结果已保存: {step_file}")
        output_progress(8, "completed", "Rating root cause analysis completed")
        
        # 6. 竞争对手分析
        output_progress(8, "running", "Analyzing competitor data...")
        logger.info("步骤5: 竞争对手分析")
        competitor_prompt = self.load_prompt('competitor.md')
        
        # 提取干净的消费者动机结果
        clean_consumer_motivation = self.extract_clean_result(self.results['consumer_motivation'])
        
        competitor_context = {
            'product_type': clean_product_type if clean_product_type else product_type,
            'consumer_love': clean_consumer_love if clean_consumer_love else "[消费者喜爱点分析不可用]",
            'unmet_needs': clean_unmet_needs if clean_unmet_needs else "[未满足需求分析不可用]",
            'consumer_motivation': clean_consumer_motivation if clean_consumer_motivation else "[购买动机分析不可用]",
            'customer_review_data': self.cleaned_data['customer_review'],
            'competitor_review_data': self.cleaned_data['competitor_review']
        }
        self.results['competitor'] = self.call_q_chat(competitor_prompt, self.prepare_context_data(competitor_context))
        # 保存竞争对手分析结果
        step_file = self.output_dir / "competitor.json"
        with open(step_file, 'w', encoding='utf-8') as f:
            json.dump(self.results['competitor'], f, indent=2, ensure_ascii=False)
        logger.info(f"步骤5结果已保存: {step_file}")
        output_progress(9, "completed", "Competitor analysis completed")
        
        # 完成所有分析
        output_progress(9, "completed", "All analysis steps completed successfully")
        logger.info("分析管道完成!")
        
        return self.results

def main():
    """运行分析管道"""
    logger.info("🚀 开始运行评论分析管道...")
    
    # 使用上传的数据文件
    customer_review_path = "data/Customer ASIN Reviews.csv"
    competitor_review_path = "data/Competitor ASIN Reviews.csv"
    product_type = sys.argv[1] if len(sys.argv) > 1 else "webcams"
    
    # 输出初始进度
    output_progress(0, "starting", "Initializing analysis pipeline...")
    
    # 检查文件是否存在
    if not Path(customer_review_path).exists():
        logger.error(f"❌ 客户评论文件不存在: {customer_review_path}")
        output_progress(0, "failed", f"Customer review file not found: {customer_review_path}")
        sys.exit(1)
    
    try:
        # 创建带进度跟踪的分析器实例
        analyzer = ProgressTrackingAnalyzer()
        
        # 运行完整的分析管道
        logger.info("📊 开始执行分析管道...")
        results = analyzer.run_analysis_pipeline_with_progress(
            customer_review_path, 
            competitor_review_path, 
            product_type
        )
        
        # 保存最终结果
        output_file = analyzer.save_results()
        
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
