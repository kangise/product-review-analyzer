#!/usr/bin/env python3
"""
测试ANSI代码清理功能
"""

import re
import json

def clean_ansi_codes(text):
    """清理ANSI颜色代码"""
    # 清理ANSI颜色代码和控制字符
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    text = ansi_escape.sub('', text)
    
    # 清理其他控制字符
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    
    return text

def extract_json_from_output(output):
    """从输出中提取JSON"""
    # 首先清理ANSI代码
    output = clean_ansi_codes(output)
    
    # 寻找第一个{字符的位置
    json_start = output.find('{')
    if json_start == -1:
        return None
    
    # 从{开始寻找完整的JSON结构
    brace_count = 0
    json_end = json_start
    
    for i in range(json_start, len(output)):
        char = output[i]
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

def main():
    # 模拟包含ANSI代码的输出
    test_output = '\x1b[38;5;10m> \x1b[39m{\x1b[0m\x1b[0m\n "sentiment": "positive",\x1b[0m\x1b[0m\n "key_points": ["great camera", "amazing picture quality"],\x1b[0m\x1b[0m\n "rating_inference": "high"\x1b[0m\x1b[0m\n}\x1b[0m\x1b[0m'
    
    print("🧪 测试ANSI代码清理功能")
    print("="*50)
    print(f"原始输出: {repr(test_output)}")
    
    # 清理ANSI代码
    cleaned = clean_ansi_codes(test_output)
    print(f"清理后: {repr(cleaned)}")
    
    # 提取JSON
    json_str = extract_json_from_output(test_output)
    if json_str:
        print("✅ 成功提取JSON:")
        try:
            parsed = json.loads(json_str)
            print(json.dumps(parsed, indent=2, ensure_ascii=False))
            return True
        except json.JSONDecodeError as e:
            print(f"❌ JSON解析失败: {e}")
            return False
    else:
        print("❌ 未能提取JSON")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
