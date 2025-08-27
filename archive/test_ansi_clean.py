#!/usr/bin/env python3
"""
测试ANSI字符清理和JSON提取
"""

import json
import re
import logging

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def clean_ansi_and_extract_json(text: str) -> str:
    """
    清理ANSI转义字符并提取JSON
    """
    # 移除ANSI转义序列
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    cleaned = ansi_escape.sub('', text)
    
    # 移除开头的提示符
    cleaned = re.sub(r'^[>\s]*', '', cleaned)
    
    # 查找JSON内容
    json_match = re.search(r'(\{.*\})', cleaned, re.DOTALL)
    if json_match:
        return json_match.group(1)
    
    return cleaned

def test_ansi_cleaning():
    """测试ANSI清理功能"""
    logger.info("🧪 测试ANSI字符清理...")
    
    # 从测试结果文件读取原始输出
    try:
        with open('test_opportunity_output/opportunity_test_result.json', 'r', encoding='utf-8') as f:
            test_result = json.load(f)
        
        raw_output = test_result.get('raw_output', '')
        logger.info(f"📊 原始输出长度: {len(raw_output)} 字符")
        
        # 清理ANSI字符
        cleaned_output = clean_ansi_and_extract_json(raw_output)
        logger.info(f"🧹 清理后长度: {len(cleaned_output)} 字符")
        
        # 显示完整的清理后内容
        logger.info("📄 清理后的完整内容:")
        logger.info(cleaned_output)
        
        # 尝试解析JSON
        try:
            parsed_json = json.loads(cleaned_output)
            logger.info("✅ JSON解析成功!")
            
            # 保存清理后的结果
            with open('test_opportunity_output/opportunity_cleaned.json', 'w', encoding='utf-8') as f:
                json.dump(parsed_json, f, ensure_ascii=False, indent=2)
            
            logger.info("💾 清理后的JSON已保存到: test_opportunity_output/opportunity_cleaned.json")
            
            # 显示结果摘要
            logger.info("📋 解析结果摘要:")
            if isinstance(parsed_json, dict):
                for key, value in parsed_json.items():
                    if isinstance(value, dict):
                        logger.info(f"  {key}: 字典，{len(value)} 个键")
                    elif isinstance(value, list):
                        logger.info(f"  {key}: 列表，{len(value)} 个项目")
                    else:
                        logger.info(f"  {key}: {type(value).__name__}")
            
            return True
            
        except json.JSONDecodeError as e:
            logger.error(f"❌ JSON解析失败: {e}")
            logger.error(f"清理后的前500字符: {cleaned_output[:500]}")
            return False
            
    except Exception as e:
        logger.error(f"❌ 读取测试结果失败: {e}")
        return False

def main():
    """主函数"""
    success = test_ansi_cleaning()
    
    if success:
        logger.info("🎉 ANSI清理测试成功!")
    else:
        logger.error("💥 ANSI清理测试失败!")

if __name__ == "__main__":
    main()
