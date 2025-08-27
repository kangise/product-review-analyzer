#!/usr/bin/env python3
"""
调试Q CLI输出限制的root cause
"""

import subprocess
import os
import json
import logging
from pathlib import Path

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_q_cli_output_limits():
    """测试Q CLI的输出限制"""
    logger.info("🔍 调试Q CLI输出限制...")
    
    # 测试不同大小的prompt
    test_cases = [
        ("小prompt", "请生成一个简单的JSON: {\"test\": \"small\"}"),
        ("中等prompt", "请生成一个包含100个字段的JSON对象，每个字段都有详细描述" * 10),
        ("大prompt", "请分析以下数据并生成详细的JSON报告：" + "A" * 50000),  # 50KB
        ("超大prompt", "请分析以下数据并生成详细的JSON报告：" + "B" * 100000),  # 100KB
    ]
    
    results = {}
    
    for test_name, prompt in test_cases:
        logger.info(f"📊 测试 {test_name} (长度: {len(prompt):,} 字符)")
        
        try:
            # 设置环境变量
            env = os.environ.copy()
            env['NO_COLOR'] = '1'
            env['TERM'] = 'dumb'
            env['FORCE_COLOR'] = '0'
            
            # 调用Q CLI
            result = subprocess.run(
                ['q', 'chat', '--no-interactive', '--trust-tools='],
                input=prompt,
                capture_output=True,
                text=True,
                encoding='utf-8',
                env=env,
                timeout=60  # 60秒超时
            )
            
            output_length = len(result.stdout) if result.stdout else 0
            error_length = len(result.stderr) if result.stderr else 0
            
            results[test_name] = {
                'prompt_length': len(prompt),
                'output_length': output_length,
                'error_length': error_length,
                'return_code': result.returncode,
                'success': result.returncode == 0,
                'output_preview': result.stdout[:200] if result.stdout else "",
                'error_preview': result.stderr[:200] if result.stderr else ""
            }
            
            logger.info(f"  ✅ 返回码: {result.returncode}")
            logger.info(f"  📏 输出长度: {output_length:,} 字符")
            logger.info(f"  ⚠️  错误长度: {error_length:,} 字符")
            
            if result.stdout:
                logger.info(f"  📄 输出预览: {result.stdout[:100]}...")
            if result.stderr:
                logger.info(f"  ❌ 错误预览: {result.stderr[:100]}...")
                
        except subprocess.TimeoutExpired:
            logger.error(f"  ⏰ {test_name} 超时")
            results[test_name] = {
                'prompt_length': len(prompt),
                'error': 'timeout',
                'success': False
            }
        except Exception as e:
            logger.error(f"  💥 {test_name} 异常: {e}")
            results[test_name] = {
                'prompt_length': len(prompt),
                'error': str(e),
                'success': False
            }
    
    return results

def test_opportunity_specific():
    """测试opportunity特定的prompt"""
    logger.info("🎯 测试opportunity特定场景...")
    
    # 加载真实的opportunity prompt
    try:
        with open('Agent/opportunity.md', 'r', encoding='utf-8') as f:
            opportunity_prompt = f.read()
        
        # 加载真实的上下文数据
        base_dir = Path("analysis_results_20250827_102804")
        
        with open(base_dir / "product_type.json", 'r', encoding='utf-8') as f:
            product_type = json.load(f)
        
        with open(base_dir / "consumer_love.json", 'r', encoding='utf-8') as f:
            consumer_love = json.load(f)
            
        with open(base_dir / "unmet_needs.json", 'r', encoding='utf-8') as f:
            unmet_needs = json.load(f)
            
        with open(base_dir / "consumer_scenario.json", 'r', encoding='utf-8') as f:
            consumer_scenario = json.load(f)
        
        # 读取客户评论数据
        import pandas as pd
        customer_reviews = pd.read_csv(base_dir / "customer_reviews_cleaned.csv")
        customer_review_data = customer_reviews.to_json(orient='records', force_ascii=False)
        
        # 构建完整的prompt
        context_replacements = {
            '{{product_type}}': json.dumps(product_type, ensure_ascii=False, indent=2),
            '{{consumer_love}}': json.dumps(consumer_love, ensure_ascii=False, indent=2),
            '{{unmet_needs}}': json.dumps(unmet_needs, ensure_ascii=False, indent=2),
            '{{consumer_scenario}}': json.dumps(consumer_scenario, ensure_ascii=False, indent=2),
            '{{customer_review_data}}': customer_review_data
        }
        
        full_prompt = opportunity_prompt
        for placeholder, value in context_replacements.items():
            full_prompt = full_prompt.replace(placeholder, value)
        
        logger.info(f"📊 完整prompt长度: {len(full_prompt):,} 字符")
        
        # 分段测试
        segments = [
            ("仅prompt模板", opportunity_prompt),
            ("prompt + product_type", opportunity_prompt.replace('{{product_type}}', context_replacements['{{product_type}}'])),
            ("完整prompt", full_prompt)
        ]
        
        for segment_name, segment_prompt in segments:
            logger.info(f"🧪 测试 {segment_name} (长度: {len(segment_prompt):,} 字符)")
            
            try:
                env = os.environ.copy()
                env['NO_COLOR'] = '1'
                env['TERM'] = 'dumb'
                env['FORCE_COLOR'] = '0'
                
                result = subprocess.run(
                    ['q', 'chat', '--no-interactive', '--trust-tools='],
                    input=segment_prompt,
                    capture_output=True,
                    text=True,
                    encoding='utf-8',
                    env=env,
                    timeout=120  # 2分钟超时
                )
                
                logger.info(f"  ✅ 返回码: {result.returncode}")
                logger.info(f"  📏 输出长度: {len(result.stdout):,} 字符")
                
                if result.stdout:
                    # 检查输出是否被截断
                    output_lines = result.stdout.split('\n')
                    logger.info(f"  📄 输出行数: {len(output_lines)}")
                    logger.info(f"  🔚 最后一行: '{output_lines[-1]}'")
                    
                    # 检查JSON完整性
                    if '{' in result.stdout:
                        open_braces = result.stdout.count('{')
                        close_braces = result.stdout.count('}')
                        logger.info(f"  🔗 括号匹配: {open_braces} 开括号, {close_braces} 闭括号")
                        if open_braces != close_braces:
                            logger.warning(f"  ⚠️  括号不匹配，可能被截断!")
                
                if result.stderr:
                    logger.warning(f"  ⚠️  错误输出: {result.stderr[:200]}...")
                    
            except subprocess.TimeoutExpired:
                logger.error(f"  ⏰ {segment_name} 超时")
            except Exception as e:
                logger.error(f"  💥 {segment_name} 异常: {e}")
        
    except Exception as e:
        logger.error(f"❌ opportunity测试失败: {e}")

def main():
    """主函数"""
    logger.info("🚀 开始Q CLI输出限制调试...")
    
    # 测试1: 基本输出限制
    logger.info("\n" + "="*60)
    logger.info("测试1: 基本输出限制")
    logger.info("="*60)
    basic_results = test_q_cli_output_limits()
    
    # 测试2: opportunity特定场景
    logger.info("\n" + "="*60)
    logger.info("测试2: opportunity特定场景")
    logger.info("="*60)
    test_opportunity_specific()
    
    # 保存结果
    with open('debug_q_output_results.json', 'w', encoding='utf-8') as f:
        json.dump(basic_results, f, ensure_ascii=False, indent=2)
    
    logger.info("\n" + "="*60)
    logger.info("🎉 调试完成!")
    logger.info("📄 详细结果已保存到: debug_q_output_results.json")
    logger.info("="*60)

if __name__ == "__main__":
    main()
