#!/usr/bin/env python3
"""
Review Analyzer - AI Agent Pipeline (Fixed Version)
修复版本：解决前置依赖和输出路径统一问题
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
import shutil

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ReviewAnalyzerFixed:
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
        
        # 定义分析步骤的依赖关系
        self.analysis_steps = {
            # 第一层：无依赖
            'product_type': {
                'prompt_file': 'product_type.md',
                'dependencies': [],
                'context_params': ['product_type']
            },
            
            # 第二层：依赖product_type
            'consumer_profile': {
                'prompt_file': 'consumer_profile.md', 
                'dependencies': ['product_type'],
                'context_params': ['product_type', 'customer_review_data']
            },
            'consumer_scenario': {
                'prompt_file': 'consumer_scenario.md',
                'dependencies': ['product_type'], 
                'context_params': ['product_type', 'customer_review_data']
            },
            'consumer_motivation': {
                'prompt_file': 'consumer_motivation.md',
                'dependencies': ['product_type'],
                'context_params': ['product_type', 'customer_review_data']
            },
            'consumer_love': {
                'prompt_file': 'consumer_love.md',
                'dependencies': ['product_type'],
                'context_params': ['product_type', 'customer_review_data']
            },
            'unmet_needs': {
                'prompt_file': 'unmet_needs.md',
                'dependencies': ['product_type'],
                'context_params': ['product_type', 'customer_review_data']
            },
            
            # 第三层：依赖前面的消费者分析
            'opportunity': {
                'prompt_file': 'opportunity.md',
                'dependencies': ['product_type', 'consumer_love', 'unmet_needs', 'consumer_scenario'],
                'context_params': ['product_type', 'consumer_love', 'unmet_needs', 'consumer_scenario', 'customer_review_data']
            },
            
            # 第四层：独立分析
            'star_rating_root_cause': {
                'prompt_file': 'star_rating_root_cause.md',
                'dependencies': ['product_type'],
                'context_params': ['product_type', 'customer_review_data']
            },
            'competitor': {
                'prompt_file': 'competitor.md',
                'dependencies': ['product_type'],
                'context_params': ['product_type', 'customer_review_data', 'competitor_review_data']
            }
        }
        
    def load_and_clean_data(self, customer_review_path: str, competitor_review_path: str) -> Dict[str, pd.DataFrame]:
        """
        加载并清理CSV数据
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
        """
        prompt_path = self.prompts_dir / prompt_file
        if not prompt_path.exists():
            raise FileNotFoundError(f"Prompt文件不存在: {prompt_path}")
        
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()

    def prepare_context_data(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        准备上下文数据，处理None值和错误对象
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
        """
        if isinstance(result, dict):
            if 'error' in result:
                logger.warning(f"提取结果时发现错误: {result['error']}")
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
        """
        import re
        
        # 方法1: 寻找markdown代码块中的JSON
        json_block_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
        json_blocks = re.findall(json_block_pattern, output, re.DOTALL | re.IGNORECASE)
        
        if json_blocks:
            for block in reversed(json_blocks):
                try:
                    json.loads(block)
                    return block
                except json.JSONDecodeError:
                    continue
        
        # 方法2: 寻找最大的完整JSON对象
        json_start = -1
        for i, char in enumerate(output):
            if char == '{':
                json_start = i
                break
        
        if json_start == -1:
            return None
            
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
                json.loads(candidate)
                return candidate
            except json.JSONDecodeError:
                pass
        
        return None

    def check_dependencies(self, step_name: str) -> bool:
        """
        检查步骤的依赖是否已完成
        """
        step_config = self.analysis_steps[step_name]
        dependencies = step_config['dependencies']
        
        for dep in dependencies:
            if dep not in self.results:
                logger.warning(f"步骤 {step_name} 的依赖 {dep} 尚未完成")
                return False
                
            # 检查依赖结果是否有效
            dep_result = self.results[dep]
            if isinstance(dep_result, dict) and 'error' in dep_result:
                logger.warning(f"步骤 {step_name} 的依赖 {dep} 执行失败")
                # 继续执行，但会传递错误信息
        
        return True

    def build_context_for_step(self, step_name: str, base_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        为特定步骤构建上下文
        """
        step_config = self.analysis_steps[step_name]
        context_params = step_config['context_params']
        
        context = {}
        
        for param in context_params:
            if param in base_context:
                context[param] = base_context[param]
            elif param in self.results:
                # 从之前的结果中获取
                clean_result = self.extract_clean_result(self.results[param])
                context[param] = clean_result
            else:
                logger.warning(f"步骤 {step_name} 需要的参数 {param} 不可用")
                context[param] = None
        
        return context

    def save_step_result(self, step_name: str, result: Dict[str, Any]):
        """
        保存单个步骤的结果到文件
        """
        # 保存JSON结果
        result_file = self.output_dir / f"{step_name}.json"
        with open(result_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        logger.info(f"步骤 {step_name} 结果已保存到: {result_file}")

    def run_analysis_pipeline(self, customer_review_path: str, competitor_review_path: str, product_type: str) -> Dict[str, Any]:
        """
        运行完整的分析管道，按依赖顺序执行
        """
        logger.info("开始运行修复版分析管道...")
        
        # 1. 数据清理
        self.load_and_clean_data(customer_review_path, competitor_review_path)
        
        # 基础上下文
        base_context = {
            'product_type': product_type,
            'customer_review_data': self.cleaned_data['customer_review'],
            'competitor_review_data': self.cleaned_data['competitor_review']
        }
        
        # 按依赖顺序执行分析步骤
        execution_order = [
            'product_type',
            'consumer_profile', 'consumer_scenario', 'consumer_motivation', 'consumer_love', 'unmet_needs',
            'opportunity',
            'star_rating_root_cause', 'competitor'
        ]
        
        for step_name in execution_order:
            logger.info(f"执行步骤: {step_name}")
            
            # 检查依赖
            if not self.check_dependencies(step_name):
                logger.error(f"步骤 {step_name} 的依赖检查失败，跳过执行")
                continue
            
            # 构建上下文
            step_context = self.build_context_for_step(step_name, base_context)
            optimized_context = self.prepare_context_data(step_context)
            
            # 加载prompt并执行
            step_config = self.analysis_steps[step_name]
            prompt = self.load_prompt(step_config['prompt_file'])
            
            # 执行分析
            result = self.call_q_chat(prompt, optimized_context)
            self.results[step_name] = result
            
            # 保存结果
            self.save_step_result(step_name, result)
            
            logger.info(f"步骤 {step_name} 完成")
        
        # 保存完整结果
        self.save_complete_results()
        
        return self.results

    def save_complete_results(self):
        """
        保存完整的分析结果
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
            
            for step_name in self.analysis_steps.keys():
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
            f.write(f"- 客户评论数据: {self.cleaned_data.get('customer_review', 'N/A')}\n")
            f.write(f"- 竞争对手评论数据: {self.cleaned_data.get('competitor_review', 'N/A')}\n")

def main():
    """
    主函数
    """
    if len(sys.argv) != 4:
        print("使用方法: python review_analyzer_fixed.py <customer_reviews.csv> <competitor_reviews.csv> <product_type>")
        sys.exit(1)
    
    customer_review_path = sys.argv[1]
    competitor_review_path = sys.argv[2] 
    product_type = sys.argv[3]
    
    try:
        analyzer = ReviewAnalyzerFixed()
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
