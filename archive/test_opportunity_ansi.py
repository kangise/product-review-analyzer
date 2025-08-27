#!/usr/bin/env python3
"""
测试opportunity步骤的ANSI清理问题
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
        except json.JSONDecodeError as e:
            print(f"JSON解析错误: {e}")
            print(f"候选JSON长度: {len(candidate)}")
            print(f"候选JSON结尾: {repr(candidate[-100:])}")
            return None
    else:
        print(f"括号不匹配，brace_count: {brace_count}")
        return None

def main():
    # 从opportunity.json读取原始输出
    with open('/Users/kangise/Documents/Customer Reports/Insta360/Share/Review-converter/analysis_results_20250827_102804/opportunity.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    raw_output = data.get('raw_output', '')
    
    print("🧪 测试opportunity步骤的ANSI清理")
    print("="*60)
    print(f"原始输出长度: {len(raw_output)} 字符")
    print(f"原始输出前200字符: {repr(raw_output[:200])}")
    print(f"原始输出后200字符: {repr(raw_output[-200:])}")
    
    # 检查是否包含ANSI代码
    ansi_pattern = r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])'
    ansi_matches = re.findall(ansi_pattern, raw_output)
    print(f"\n发现ANSI代码: {len(ansi_matches)} 个")
    if ansi_matches:
        print(f"ANSI代码示例: {ansi_matches[:5]}")
    
    # 清理ANSI代码
    cleaned = clean_ansi_codes(raw_output)
    print(f"\n清理后长度: {len(cleaned)} 字符")
    print(f"清理后前200字符: {repr(cleaned[:200])}")
    print(f"清理后后200字符: {repr(cleaned[-200:])}")
    
    # 尝试提取JSON
    json_str = extract_json_from_output(raw_output)
    if json_str:
        print("\n✅ 成功提取JSON")
        try:
            parsed = json.loads(json_str)
            print(f"JSON结构键: {list(parsed.keys())}")
            if '产品创新机会洞察' in parsed:
                insight = parsed['产品创新机会洞察']
                if '优化机会列表' in insight:
                    opportunities = insight['优化机会列表']
                    print(f"机会数量: {len(opportunities)}")
                    for i, opp in enumerate(opportunities):
                        print(f"  {i+1}. {opp.get('机会名称', 'N/A')}")
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
