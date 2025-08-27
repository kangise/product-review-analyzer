#!/usr/bin/env python3
"""
Review Analyzer - AI Agent Pipeline (Patched Version)
基于原版修复依赖问题和输出路径统一
"""

import pandas as pd
import json
import subprocess
import os
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ReviewAnalyzer:
    def __init__(self, prompts_dir: str = "Agent"):
        """
        初始化评论分析器
        
        Args:
            prompts_dir: 存放MD prompt文件的目录
        """
        self.prompts_dir = Path(prompts_dir)
        self.results = {}  # 存储每个步骤的JSON结果
        self.cleaned_data = {}  # 存储清理后的数据
        
        # 创建带时间戳的输出目录
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_dir = Path(f"analysis_results_{timestamp}")
        self.output_dir.mkdir(exist_ok=True)
        
        logger.info(f"输出目录创建: {self.output_dir}")
        
        # 确保prompts目录存在
        if not self.prompts_dir.exists():
            raise FileNotFoundError(f"Agent目录不存在: {self.prompts_dir}")
        
    def load_and_clean_data(self, customer_review_path: str, competitor_review_path: str) -> Dict[str, pd.DataFrame]:
        """
        加载并清理CSV数据
        
        Args:
            customer_review_path: 客户评论CSV文件路径
            competitor_review_path: 竞争对手评论CSV文件路径
            
        Returns:
            清理后的数据字典
        """
        logger.info("开始加载和清理数据...")
        
        try:
            # 加载数据
            customer_df = pd.read_csv(customer_review_path)
            competitor_df = pd.read_csv(competitor_review_path)
            
            logger.info(f"客户评论数据: {len(customer_df)} 条")
            logger.info(f"竞争对手评论数据: {len(competitor_df)} 条")
            
            # 检查并标准化列名
            if 'Review Text' in customer_df.columns:
                customer_df = customer_df.rename(columns={'Review Text': 'review_text'})
            if 'Review Text' in competitor_df.columns:
                competitor_df = competitor_df.rename(columns={'Review Text': 'review_text'})
            if 'Review Rating' in customer_df.columns:
                customer_df = customer_df.rename(columns={'Review Rating': 'rating'})
            if 'Review Rating' in competitor_df.columns:
                competitor_df = competitor_df.rename(columns={'Review Rating': 'rating'})
            
            # 数据清理
            customer_df = customer_df.dropna(subset=['review_text'])
            competitor_df = competitor_df.dropna(subset=['review_text'])
            
            # 去重
            customer_df = customer_df.drop_duplicates(subset=['review_text'])
            competitor_df = competitor_df.drop_duplicates(subset=['review_text'])
            
            logger.info(f"清理后客户评论: {len(customer_df)} 条")
            logger.info(f"清理后竞争对手评论: {len(competitor_df)} 条")
            
            # 转换为JSON格式用于prompt
            self.cleaned_data = {
                'customer_review': customer_df.to_json(orient='records', force_ascii=False),
                'competitor_review': competitor_df.to_json(orient='records', force_ascii=False)
            }
            
            # 保存清理后的数据到输出目录
            customer_df.to_csv(self.output_dir / 'customer_reviews_cleaned.csv', index=False)
            competitor_df.to_csv(self.output_dir / 'competitor_reviews_cleaned.csv', index=False)
            
            return {'customer': customer_df, 'competitor': competitor_df}
            
        except Exception as e:
            logger.error(f"数据加载失败: {str(e)}")
            raise

    def load_prompt(self, prompt_file: str) -> str:
        """
        加载prompt模板文件
        
        Args:
            prompt_file: prompt文件名
            
        Returns:
            prompt内容字符串
        """
        prompt_path = self.prompts_dir / prompt_file
        if not prompt_path.exists():
            raise FileNotFoundError(f"Prompt文件不存在: {prompt_path}")
        
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()

    def prepare_context_data(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        准备上下文数据，处理None值和错误对象
        
        Args:
            context: 原始上下文数据
            
        Returns:
            优化后的上下文数据
        """
        prepared_context = {}
        
        for key, value in context.items():
            if value is None:
                prepared_context[key] = f"[{key}数据不可用]"
            elif isinstance(value, dict) and 'error' in value:
                # 如果是错误对象，提供描述性占位符
                prepared_context[key] = f"[{key}分析出现错误: {value.get('error', '未知错误')}]"
            elif isinstance(value, str) and len(value) > 50000:
                # 截断过长的字符串
                prepared_context[key] = value[:50000] + "...[数据已截断]"
            else:
                prepared_context[key] = value
                
        return prepared_context

    def extract_clean_result(self, result: Dict[str, Any]) -> Any:
        """
        从Q Chat结果中提取干净的数据用于后续步骤
        
        Args:
            result: Q Chat返回的结果
            
        Returns:
            清理后的结果数据
        """
        if isinstance(result, dict):
            if 'error' in result:
                logger.warning(f"提取结果时发现错误: {result['error']}")
                # 尝试从raw_output中提取有用信息
                if 'raw_output' in result:
                    json_content = self.extract_json_from_output(result['raw_output'])
                    if json_content:
                        try:
                            return json.loads(json_content)
                        except json.JSONDecodeError:
                            pass
                    # 如果无法提取JSON，返回原始输出的摘要
                    raw_output = result['raw_output']
                    if len(raw_output) > 1000:
                        return raw_output[:1000] + "...[输出已截断]"
                    return raw_output
                return None
            elif 'json_result' in result:
                return result['json_result']
            elif 'raw_output' in result:
                # 尝试从raw_output中提取JSON
                json_content = self.extract_json_from_output(result['raw_output'])
                if json_content:
                    try:
                        return json.loads(json_content)
                    except json.JSONDecodeError:
                        pass
                return result['raw_output']
        
        return result

    def call_q_chat(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        调用Q Chat进行分析
        
        Args:
            prompt: 格式化的prompt
            context: 上下文数据
            
        Returns:
            分析结果字典
        """
        try:
            # 格式化prompt
            formatted_prompt = prompt.format(**context)
            
            logger.info("调用Q Chat...")
            logger.info(f"上下文参数: {list(context.keys())}")
            
            # 调用q chat命令
            result = subprocess.run(
                ['q', 'chat', '--trust-all-tools', formatted_prompt],
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode != 0:
                error_msg = f"Q Chat执行失败: {result.stderr}"
                logger.error(error_msg)
                return {"error": error_msg, "raw_output": result.stdout}
            
            output = result.stdout
            logger.info(f"Q Chat输出长度: {len(output)} 字符")
            
            # 尝试提取JSON
            json_content = self.extract_json_from_output(output)
            if json_content:
                try:
                    parsed_json = json.loads(json_content)
                    logger.info("成功提取并解析JSON")
                    return {"json_result": parsed_json, "raw_output": output}
                except json.JSONDecodeError as e:
                    logger.warning(f"JSON解析失败: {str(e)}")
            
            logger.info("未找到有效JSON，返回原始输出")
            return {"error": "未找到有效的JSON输出", "raw_output": output}
            
        except subprocess.TimeoutExpired:
            logger.error("Q Chat调用超时")
            return {"error": "Q Chat调用超时", "raw_output": ""}
        except Exception as e:
            logger.error(f"Q Chat调用异常: {str(e)}")
            return {"error": f"Q Chat调用异常: {str(e)}", "raw_output": ""}

    def extract_json_from_output(self, output: str) -> Optional[str]:
        """
        从输出中提取JSON内容，支持多种格式
        
        Args:
            output: Q Chat的原始输出
            
        Returns:
            提取的JSON字符串，如果没找到则返回None
        """
        import re
        
        # 方法1: 寻找markdown代码块中的JSON (改进的正则表达式)
        json_block_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
        json_blocks = re.findall(json_block_pattern, output, re.DOTALL | re.IGNORECASE)
        
        if json_blocks:
            # 尝试解析每个找到的JSON块，返回第一个有效的
            for block in reversed(json_blocks):  # 从最后一个开始尝试
                try:
                    json.loads(block)  # 验证JSON有效性
                    return block
                except json.JSONDecodeError:
                    continue
        
        # 方法2: 寻找最大的完整JSON对象 (改进的括号匹配)
        json_start = -1
        for i, char in enumerate(output):
            if char == '{':
                json_start = i
                break
        
        if json_start == -1:
            return None
            
        # 找到匹配的结束括号，处理字符串中的括号
        brace_count = 0
        in_string = False
        escape_next = False
        json_end = json_start
        
        for i in range(json_start, len(output)):
            char = output[i]
            
            if escape_next:
                escape_next = False
                continue
                
            if char == '\\':
                escape_next = True
                continue
                
            if char == '"' and not escape_next:
                in_string = not in_string
                continue
                
            if not in_string:
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        json_end = i + 1
                        break
        
        if brace_count == 0:
            candidate = output[json_start:json_end]
            try:
                json.loads(candidate)  # 验证JSON有效性
                return candidate
            except json.JSONDecodeError:
                pass
        
        return None

    def save_step_result(self, step_name: str, result: Dict[str, Any]):
        """
        保存单个步骤的结果到输出目录
        
        Args:
            step_name: 步骤名称
            result: 步骤结果
        """
        result_file = self.output_dir / f"{step_name}.json"
        with open(result_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        logger.info(f"步骤 {step_name} 结果已保存到: {result_file}")

    def run_analysis_pipeline(self, customer_review_path: str, competitor_review_path: str, product_type: str) -> Dict[str, Any]:
        """
        运行完整的分析管道
        
        Args:
            customer_review_path: 客户评论CSV文件路径
            competitor_review_path: 竞争对手评论CSV文件路径
            product_type: 产品类型信息
            
        Returns:
            所有分析结果的字典
        """
        logger.info("开始运行分析管道...")
        
        # 1. 数据清理
        self.load_and_clean_data(customer_review_path, competitor_review_path)
        
        # 2. 产品类型分析
        logger.info("步骤1: 产品类型分析")
        product_type_prompt = self.load_prompt('product_type.md')
        self.results['product_type'] = self.call_q_chat(
            product_type_prompt, 
            {'product_type': product_type}
        )
        self.save_step_result('product_type', self.results['product_type'])
        
        # 3. 消费者分析 (5个并行步骤)
        consumer_prompts = [
            'consumer_profile.md',
            'consumer_scenario.md', 
            'consumer_motivation.md',
            'consumer_love.md',
            'unmet_needs.md'
        ]
        
        logger.info("步骤2: 消费者分析")
        for prompt_file in consumer_prompts:
            prompt_name = prompt_file.replace('.md', '')
            logger.info(f"  执行: {prompt_name}")
            
            prompt = self.load_prompt(prompt_file)
            
            # 为每个消费者分析提供相应的上下文
            context = {
                'product_type': product_type,
                'customer_review_data': self.cleaned_data['customer_review']
            }
            
            # 优化上下文数据
            optimized_context = self.prepare_context_data(context)
            self.results[prompt_name] = self.call_q_chat(prompt, optimized_context)
            self.save_step_result(prompt_name, self.results[prompt_name])
        
        # 4. 机会分析 (修复依赖问题)
        logger.info("步骤3: 机会分析")
        opportunity_prompt = self.load_prompt('opportunity.md')
        
        # 提取干净的分析结果用于参数传递
        clean_consumer_love = self.extract_clean_result(self.results['consumer_love'])
        clean_unmet_needs = self.extract_clean_result(self.results['unmet_needs'])
        clean_consumer_scenario = self.extract_clean_result(self.results['consumer_scenario'])
        
        opportunity_context = {
            'product_type': product_type,
            'consumer_love': clean_consumer_love if clean_consumer_love else "[消费者喜爱点分析不可用]",
            'unmet_needs': clean_unmet_needs if clean_unmet_needs else "[未满足需求分析不可用]",
            'consumer_scenario': clean_consumer_scenario if clean_consumer_scenario else "[使用场景分析不可用]",
            'customer_review_data': self.cleaned_data['customer_review']
        }
        self.results['opportunity'] = self.call_q_chat(opportunity_prompt, self.prepare_context_data(opportunity_context))
        self.save_step_result('opportunity', self.results['opportunity'])
        
        # 5. 星级评分根因分析 (修复依赖问题)
        logger.info("步骤4: 星级评分根因分析")
        star_rating_prompt = self.load_prompt('star_rating_root_cause.md')
        star_rating_context = {
            'product_type': product_type,
            'consumer_love': clean_consumer_love if clean_consumer_love else "[消费者喜爱点分析不可用]",
            'unmet_needs': clean_unmet_needs if clean_unmet_needs else "[未满足需求分析不可用]",
            'customer_review_data': self.cleaned_data['customer_review']
        }
        self.results['star_rating_root_cause'] = self.call_q_chat(star_rating_prompt, self.prepare_context_data(star_rating_context))
        self.save_step_result('star_rating_root_cause', self.results['star_rating_root_cause'])
        
        # 6. 竞争对手分析 (修复依赖问题)
        logger.info("步骤5: 竞争对手分析")
        competitor_prompt = self.load_prompt('competitor.md')
        
        # 提取干净的消费者动机结果
        clean_consumer_motivation = self.extract_clean_result(self.results['consumer_motivation'])
        
        competitor_context = {
            'product_type': product_type,
            'consumer_love': clean_consumer_love if clean_consumer_love else "[消费者喜爱点分析不可用]",
            'unmet_needs': clean_unmet_needs if clean_unmet_needs else "[未满足需求分析不可用]",
            'consumer_motivation': clean_consumer_motivation if clean_consumer_motivation else "[购买动机分析不可用]",
            'customer_review_data': self.cleaned_data['customer_review'],
            'competitor_review_data': self.cleaned_data['competitor_review']
        }
        self.results['competitor'] = self.call_q_chat(competitor_prompt, self.prepare_context_data(competitor_context))
        self.save_step_result('competitor', self.results['competitor'])
        
        logger.info("分析管道完成!")
        
        # 保存完整结果
        self.save_complete_results()
        
        return self.results
    
    def save_complete_results(self):
        """
        保存完整的分析结果和报告
        """
        # 保存完整结果
        complete_results_file = self.output_dir / "analysis_results_complete.json"
        with open(complete_results_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)
        
        # 创建分析报告
        self.create_analysis_report()
        
        logger.info(f"完整分析结果已保存到: {self.output_dir}")

    def create_analysis_report(self):
        """
        创建分析报告摘要
        """
        report_file = self.output_dir / "analysis_report.md"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(f"# 分析报告\n\n")
            f.write(f"**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"**输出目录**: {self.output_dir}\n\n")
            
            f.write("## 分析步骤执行状态\n\n")
            
            step_names = ['product_type', 'consumer_profile', 'consumer_scenario', 'consumer_motivation', 
                         'consumer_love', 'unmet_needs', 'opportunity', 'star_rating_root_cause', 'competitor']
            
            for step_name in step_names:
                if step_name in self.results:
                    result = self.results[step_name]
                    if isinstance(result, dict) and 'error' in result:
                        status = "❌ 失败"
                        detail = result['error']
                    else:
                        status = "✅ 成功"
                        detail = "分析完成"
                else:
                    status = "⏸️ 未执行"
                    detail = "步骤未执行"
                
                f.write(f"- **{step_name}**: {status} - {detail}\n")
            
            f.write(f"\n## 输出文件\n\n")
            for file in sorted(self.output_dir.glob("*.json")):
                f.write(f"- `{file.name}`\n")
            
            f.write(f"\n## 数据统计\n\n")
            f.write(f"- 客户评论数据: 已处理\n")
            f.write(f"- 竞争对手评论数据: 已处理\n")

def main():
    """
    主函数
    """
    if len(sys.argv) != 4:
        print("使用方法: python review_analyzer_patched.py <customer_reviews.csv> <competitor_reviews.csv> <product_type>")
        sys.exit(1)
    
    customer_review_path = sys.argv[1]
    competitor_review_path = sys.argv[2] 
    product_type = sys.argv[3]
    
    try:
        analyzer = ReviewAnalyzer()
        results = analyzer.run_analysis_pipeline(customer_review_path, competitor_review_path, product_type)
        
        print(f"\n✅ 分析完成！")
        print(f"📁 结果保存在: {analyzer.output_dir}")
        print(f"📊 共完成 {len(results)} 个分析步骤")
        
        # 显示执行摘要
        success_count = sum(1 for r in results.values() if not (isinstance(r, dict) and 'error' in r))
        print(f"✅ 成功: {success_count}/{len(results)} 个步骤")
        
    except Exception as e:
        logger.error(f"分析管道执行失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
