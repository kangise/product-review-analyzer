#!/usr/bin/env python3
"""
Review Analyzer - AI Agent Pipeline
分析客户评论和竞争对手评论的AI处理管道
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
    def __init__(self, prompts_dir: str = "agent", output_language: str = "en"):
        """
        初始化评论分析器
        
        Args:
            prompts_dir: 存放MD prompt文件的目录
        """
        self.prompts_dir = Path(prompts_dir)
        self.output_language = output_language
        self.results = {}  # 存储每个步骤的JSON结果
        self.cleaned_data = {}  # 存储清理后的数据
        
        # 创建带时间戳的输出目录
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_dir = Path(f"result/analysis_results_{timestamp}")
        self.output_dir.mkdir(exist_ok=True)
        
        logger.info(f"输出目录创建: {self.output_dir}")
        
        # 确保prompts目录存在
        if not self.prompts_dir.exists():
            raise FileNotFoundError(f"agent目录不存在: {self.prompts_dir}")
        
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
            
            logger.info(f"客户评论原始数据: {len(customer_df)} 条")
            logger.info(f"竞争对手评论原始数据: {len(competitor_df)} 条")
            
            # 检查并标准化列名
            if 'Review Text' in customer_df.columns:
                customer_df = customer_df.rename(columns={'Review Text': 'review_text'})
            if 'Review Text' in competitor_df.columns:
                competitor_df = competitor_df.rename(columns={'Review Text': 'review_text'})
            if 'Review Rating' in customer_df.columns:
                customer_df = customer_df.rename(columns={'Review Rating': 'rating'})
            if 'Review Rating' in competitor_df.columns:
                competitor_df = competitor_df.rename(columns={'Review Rating': 'rating'})
            
            # 只保留必要的列，大幅减少数据量
            required_columns = ['MP ID', 'ASIN', 'Submission Date', 'review_text', 'rating']
            
            # 过滤客户评论数据
            available_customer_cols = [col for col in required_columns if col in customer_df.columns]
            customer_df = customer_df[available_customer_cols]
            logger.info(f"客户评论保留列: {available_customer_cols}")
            
            # 过滤竞争对手评论数据  
            available_competitor_cols = [col for col in required_columns if col in competitor_df.columns]
            competitor_df = competitor_df[available_competitor_cols]
            logger.info(f"竞争对手评论保留列: {available_competitor_cols}")
            
            # 基于review_text字段去重和清理
            if 'review_text' in customer_df.columns:
                customer_df_clean = customer_df.dropna(subset=['review_text']).drop_duplicates(subset=['review_text'], keep='first')
                logger.info(f"客户评论清理后: {len(customer_df_clean)} 条")
            else:
                logger.warning("客户评论数据中未找到'review_text'字段")
                customer_df_clean = customer_df
                
            if 'review_text' in competitor_df.columns:
                competitor_df_clean = competitor_df.dropna(subset=['review_text']).drop_duplicates(subset=['review_text'], keep='first')
                logger.info(f"竞争对手评论清理后: {len(competitor_df_clean)} 条")
            else:
                logger.warning("竞争对手评论数据中未找到'review_text'字段")
                competitor_df_clean = competitor_df
            
            # 转换为JSON格式用于prompt
            self.cleaned_data = {
                'customer_review': customer_df_clean.to_json(orient='records', force_ascii=False),
                'competitor_review': competitor_df_clean.to_json(orient='records', force_ascii=False)
            }
            
            # 保存清理后的数据到输出目录
            customer_df_clean.to_csv(self.output_dir / 'customer_reviews_cleaned.csv', index=False)
            competitor_df_clean.to_csv(self.output_dir / 'competitor_reviews_cleaned.csv', index=False)
            
            return {'customer': customer_df_clean, 'competitor': competitor_df_clean}
            
        except Exception as e:
            logger.error(f"数据加载和清理失败: {str(e)}")
            raise
    
    def load_prompt(self, prompt_file: str) -> str:
        """
        从MD文件加载prompt
        
        Args:
            prompt_file: prompt文件名 (如 'product_type.md')
            
        Returns:
            prompt内容
        """
        prompt_path = self.prompts_dir / prompt_file
        
        if not prompt_path.exists():
            raise FileNotFoundError(f"Prompt文件不存在: {prompt_path}")
            
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def process_prompt_template(self, prompt: str, context_data: Dict) -> str:
        """
        处理prompt模板，替换其中的变量
        
        Args:
            prompt: 原始prompt内容
            context_data: 上下文数据
            
        Returns:
            处理后的prompt
        """
        processed_prompt = prompt
        
        # 替换prompt中的变量占位符
        for key, value in context_data.items():
            placeholder = f"{{{key}}}"
            if placeholder in processed_prompt:
                if isinstance(value, (dict, list)):
                    # 对于复杂数据类型，转换为JSON字符串
                    value_str = json.dumps(value, indent=2, ensure_ascii=False)
                else:
                    value_str = str(value)
                processed_prompt = processed_prompt.replace(placeholder, value_str)
        
        return processed_prompt

    def call_q_chat(self, prompt: str, context_data: Optional[Dict] = None) -> Dict[str, Any]:
        """
        调用Q Chat并返回JSON结果
        
        Args:
            prompt: 要发送给Q的prompt
            context_data: 上下文数据，会被注入到prompt中
            
        Returns:
            Q返回的JSON结果
        """
        try:
            # 处理prompt模板
            if context_data:
                full_prompt = self.process_prompt_template(prompt, context_data)
            else:
                full_prompt = prompt
            
            # 添加语言指令
            if self.output_language == 'zh':
                language_instruction = "\n\n**重要：请用中文输出所有分析结果。所有字段名保持英文，但字段值和描述内容必须用中文。**"
            else:
                language_instruction = "\n\n**Important: Please output all analysis results in English.**"
            
            full_prompt += language_instruction
            
            logger.info("正在调用Q Chat...")
            logger.info(f"Prompt长度: {len(full_prompt)} 字符")
            
            # 记录上下文数据的结构（用于调试）
            if context_data:
                for key, value in context_data.items():
                    if isinstance(value, list):
                        logger.info(f"上下文参数 {key}: 列表，{len(value)} 项")
                    elif isinstance(value, dict):
                        logger.info(f"上下文参数 {key}: 字典，{len(value)} 键")
                    elif isinstance(value, str):
                        logger.info(f"上下文参数 {key}: 字符串，{len(value)} 字符")
                    else:
                        logger.info(f"上下文参数 {key}: {type(value)}")
            
            # 使用管道强制去除ANSI颜色代码
            env = os.environ.copy()
            env['NO_COLOR'] = '1'
            env['TERM'] = 'dumb'
            env['FORCE_COLOR'] = '0'
            
            # 通过管道和sed去除所有ANSI转义序列，完全禁用工具
            cmd = "echo '" + full_prompt.replace("'", "'\"'\"'") + "' | q chat --no-interactive | sed 's/\x1b\[[0-9;]*[mK]//g'"
            
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                encoding='utf-8',
                env=env
            )
            
            if result.returncode != 0:
                logger.error(f"Q Chat调用失败: {result.stderr}")
                return {"error": f"Q Chat调用失败: {result.stderr}", "raw_output": ""}
            
            # 尝试解析JSON输出
            output = result.stdout.strip()
            logger.info(f"Q Chat输出长度: {len(output)} 字符")
            
            # 记录输出的前几行用于调试
            output_lines = output.split('\n')[:5]
            logger.info(f"Q Chat输出前5行: {output_lines}")
            
            # 更智能的JSON提取
            json_str = self.extract_json_from_output(output)
            
            if json_str:
                logger.info(f"成功提取JSON，长度: {len(json_str)} 字符")
                try:
                    parsed_json = json.loads(json_str)
                    logger.info("JSON解析成功")
                    return parsed_json
                except json.JSONDecodeError as e:
                    logger.error(f"JSON解析失败: {str(e)}")
                    logger.error(f"尝试解析的JSON前500字符: {json_str[:500]}")
                    return {"error": f"JSON解析失败: {str(e)}", "raw_output": output, "extracted_json": json_str}
            else:
                logger.warning("未找到有效的JSON输出")
                logger.warning(f"原始输出前1000字符: {output[:1000]}")
                return {"error": "未找到有效的JSON输出", "raw_output": output}
                
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
        
        # 更强的ANSI清理：处理所有可能的ANSI转义序列
        # 1. 清理Unicode转义的ANSI序列 (\u001b[...)
        output = re.sub(r'\\u001b\[[0-9;]*[a-zA-Z]?', '', output)
        
        # 2. 清理连续的ANSI重置序列
        output = re.sub(r'(\\u001b\[0m)+', '', output)
        output = re.sub(r'(\\u001b\[m)+', '', output)
        
        # 3. 清理实际的ANSI转义序列 (\x1B[...)
        ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
        output = ansi_escape.sub('', output)
        
        # 4. 清理其他控制字符和Unicode控制字符
        output = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', output)
        
        # 5. 清理可能残留的ANSI相关字符和提示符
        output = re.sub(r'\[0m|\[m|> ', '', output)
        
        # 6. 清理开头的提示符和空白
        output = re.sub(r'^[>\s]*', '', output.strip())
        
        # 7. 额外清理：处理特殊的ANSI模式
        output = re.sub(r'\\u001b\[[0-9;]*m', '', output)  # 处理所有m结尾的序列
        output = re.sub(r'\\u001b\[', '', output)  # 清理残留的开始标记
        
        print(f"🧹 ANSI清理后的输出长度: {len(output)}")
        
        # 方法1: 寻找markdown代码块中的JSON (改进的正则表达式)
        json_block_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
        json_blocks = re.findall(json_block_pattern, output, re.DOTALL | re.IGNORECASE)
        
        if json_blocks:
            print(f"📦 找到 {len(json_blocks)} 个JSON代码块")
            # 尝试解析每个找到的JSON块，返回第一个有效的
            for i, block in enumerate(reversed(json_blocks)):  # 从最后一个开始尝试
                try:
                    json.loads(block)  # 验证JSON有效性
                    print(f"✅ JSON代码块 {len(json_blocks)-i} 验证成功")
                    return block
                except json.JSONDecodeError as e:
                    print(f"❌ JSON代码块 {len(json_blocks)-i} 验证失败: {e}")
                    continue
        
        # 方法2: 寻找最大的完整JSON对象 (改进的括号匹配)
        json_start = output.find('{')
        if json_start == -1:
            print("❌ 未找到JSON起始标记")
            return None
            
        print(f"🔍 找到JSON起始位置: {json_start}")
        
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
        
        # 方法3: 寻找多行JSON结构 (处理格式化的JSON)
        lines = output.split('\n')
        json_lines = []
        in_json = False
        brace_count = 0
        
        for line in lines:
            stripped = line.strip()
            if not in_json and stripped.startswith('{'):
                in_json = True
                json_lines = [line]
                brace_count = stripped.count('{') - stripped.count('}')
            elif in_json:
                json_lines.append(line)
                brace_count += stripped.count('{') - stripped.count('}')
                if brace_count <= 0:
                    break
        
        if json_lines and brace_count <= 0:
            candidate = '\n'.join(json_lines)
            try:
                json.loads(candidate)  # 验证JSON有效性
                return candidate
            except json.JSONDecodeError:
                pass
        
        return None

    def extract_clean_result(self, result: Dict[str, Any]) -> Any:
        """
        从Q Chat结果中提取干净的分析数据
        
        Args:
            result: Q Chat返回的结果对象
            
        Returns:
            提取的干净数据，如果提取失败则返回None
        """
        if not isinstance(result, dict):
            return result
        
        # 如果有错误，返回None
        if 'error' in result:
            logger.warning(f"结果包含错误: {result.get('error')}")
            return None
        
        # 如果有raw_output但没有其他结构化数据，尝试从raw_output中提取JSON
        if 'raw_output' in result and len(result) == 1:
            raw_output = result['raw_output']
            json_str = self.extract_json_from_output(raw_output)
            if json_str:
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError:
                    logger.warning("无法从raw_output中解析JSON")
                    return None
            return None
        
        # 如果结果中有raw_output但还有其他字段，移除raw_output返回其他字段
        if 'raw_output' in result:
            clean_result = {k: v for k, v in result.items() if k != 'raw_output'}
            if clean_result:
                return clean_result
        
        # 直接返回结果
        return result

    def prepare_context_data(self, context_data: Dict) -> Dict:
        """
        准备上下文数据，优化JSON序列化
        
        Args:
            context_data: 原始上下文数据
            
        Returns:
            优化后的上下文数据
        """
        optimized_data = {}
        
        for key, value in context_data.items():
            if value is None:
                # 对于None值，提供一个说明性的占位符
                optimized_data[key] = f"[{key}分析结果未能成功提取，请检查前序步骤]"
                logger.warning(f"参数 {key} 为None，使用占位符")
            elif isinstance(value, pd.DataFrame):
                # DataFrame转换为紧凑的字典列表
                optimized_data[key] = value.to_dict('records')
            elif isinstance(value, list) and len(value) > 0:
                # 保持列表数据完整
                optimized_data[key] = value
            elif isinstance(value, dict):
                # 递归处理嵌套字典，但要检查是否包含错误信息
                if 'error' in value:
                    optimized_data[key] = f"[{key}分析失败: {value.get('error')}]"
                    logger.warning(f"参数 {key} 包含错误信息")
                else:
                    optimized_data[key] = self.prepare_context_data(value) if any(isinstance(v, (pd.DataFrame, dict)) for v in value.values()) else value
            else:
                optimized_data[key] = value
        
        return optimized_data
    
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
        # 保存第一步结果
        step_file = self.output_dir / "product_type.json"
        with open(step_file, 'w', encoding='utf-8') as f:
            json.dump(self.results['product_type'], f, indent=2, ensure_ascii=False)
        logger.info(f"步骤1结果已保存: {step_file}")
        
        # 提取第一步的干净结果用于后续步骤
        clean_product_type = self.extract_clean_result(self.results['product_type'])
        
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
            
            # 为每个消费者分析提供相应的上下文 - 使用第一步的JSON结果
            context = {
                'product_type': clean_product_type if clean_product_type else product_type,  # 优先使用JSON结果，fallback到字符串
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
        
        # 4. 机会分析 (修复依赖问题)
        logger.info("步骤3: 机会分析")
        opportunity_prompt = self.load_prompt('opportunity.md')
        
        # 提取干净的分析结果用于参数传递
        clean_consumer_love = self.extract_clean_result(self.results['consumer_love'])
        clean_unmet_needs = self.extract_clean_result(self.results['unmet_needs'])
        clean_consumer_scenario = self.extract_clean_result(self.results['consumer_scenario'])
        
        opportunity_context = {
            'product_type': clean_product_type if clean_product_type else product_type,  # 使用第一步JSON结果
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
        
        # 5. 星级评分根因分析 (修复依赖问题)
        logger.info("步骤4: 星级评分根因分析")
        star_rating_prompt = self.load_prompt('star_rating_root_cause.md')
        star_rating_context = {
            'product_type': clean_product_type if clean_product_type else product_type,  # 使用第一步JSON结果
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
        
        # 6. 竞争对手分析 (新的三阶段流程)
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
                our_unmet_dimensions = [item["需求类型"] for item in clean_unmet_needs.get("未满足需求分析", [])]
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
        
        logger.info("分析管道完成!")
        return self.results
    
    def save_results(self) -> str:
        """
        保存所有分析结果到时间戳输出目录
        
        Returns:
            输出目录路径
        """
        # 保存完整结果
        results_file = self.output_dir / "analysis_results.json"
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        # 保存每个步骤的单独文件
        for step_name, result in self.results.items():
            step_file = self.output_dir / f"{step_name}.json"
            with open(step_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
        
        logger.info(f"所有结果已保存到: {self.output_dir}")
        return str(self.output_dir)

def main():
    """主函数 - 命令行接口"""
    if len(sys.argv) != 4:
        print("使用方法: python review_analyzer.py <customer_review.csv> <competitor_review.csv> <product_type>")
        sys.exit(1)
    
    customer_review_path = sys.argv[1]
    competitor_review_path = sys.argv[2]
    product_type = sys.argv[3]
    
    try:
        analyzer = ReviewAnalyzer()
        results = analyzer.run_analysis_pipeline(customer_review_path, competitor_review_path, product_type)
        output_dir = analyzer.save_results()
        
        print(f"\n✅ 分析完成! 结果已保存到: {output_dir}")
        print(f"📊 共完成 {len(results)} 个分析步骤")
        
        # 显示执行摘要
        success_count = sum(1 for r in results.values() if not (isinstance(r, dict) and 'error' in r))
        print(f"✅ 成功: {success_count}/{len(results)} 个步骤")
        
        print("\n📋 分析步骤:")
        for step in results.keys():
            result = results[step]
            if isinstance(result, dict) and 'error' in result:
                print(f"  ❌ {step}")
            else:
                print(f"  ✅ {step}")
            
    except Exception as e:
        logger.error(f"分析失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
