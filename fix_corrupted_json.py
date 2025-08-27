#!/usr/bin/env python3
"""
修复损坏的JSON文件工具
用于修复包含ANSI转义字符的JSON文件
"""

import json
import re
import os
import sys
from pathlib import Path

def clean_ansi_from_text(text):
    """清理文本中的ANSI转义字符"""
    import re
    
    # 1. 清理实际的ANSI转义序列 (\x1B[...)
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    text = ansi_escape.sub('', text)
    
    # 2. 清理Unicode转义的ANSI序列 (\u001b[...)
    text = re.sub(r'\\u001b\[[0-9;]*[mK]?', '', text)
    
    # 3. 清理其他控制字符
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    
    # 4. 清理可能残留的ANSI相关字符
    text = re.sub(r'\[0m|\[m', '', text)
    
    # 5. 清理换行符和多余空格
    text = re.sub(r'\n\s*', '\n', text)
    text = re.sub(r'\s+', ' ', text)
    
    return text

def extract_json_from_raw_output(raw_output):
    """从raw_output中提取并清理JSON"""
    # 清理ANSI字符
    cleaned_output = clean_ansi_from_text(raw_output)
    print(f"🧹 清理后长度: {len(cleaned_output)}")
    
    # 寻找JSON起始位置
    json_start = cleaned_output.find('{')
    if json_start == -1:
        print("❌ 未找到JSON起始标记")
        return None
    
    print(f"🔍 JSON起始位置: {json_start}")
    
    # 找到匹配的结束括号
    brace_count = 0
    in_string = False
    escape_next = False
    
    for i in range(json_start, len(cleaned_output)):
        char = cleaned_output[i]
        
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
                    json_str = cleaned_output[json_start:json_end]
                    print(f"📦 提取JSON长度: {len(json_str)}")
                    
                    try:
                        # 验证JSON有效性
                        parsed = json.loads(json_str)
                        print(f"✅ JSON验证成功，包含键: {list(parsed.keys())}")
                        return json_str
                    except json.JSONDecodeError as e:
                        print(f"❌ JSON验证失败: {e}")
                        # 打印问题区域
                        error_pos = getattr(e, 'pos', 0)
                        start_pos = max(0, error_pos - 50)
                        end_pos = min(len(json_str), error_pos + 50)
                        print(f"错误位置附近: {repr(json_str[start_pos:end_pos])}")
                        return None
    
    print(f"❌ 未找到匹配的结束括号，brace_count: {brace_count}")
    return None

def fix_json_file(file_path):
    """修复单个JSON文件"""
    print(f"🔧 修复文件: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 检查是否是错误格式的JSON（包含error和raw_output字段）
        if 'error' in data and 'raw_output' in data:
            print(f"📋 发现错误格式的JSON，尝试从raw_output提取...")
            
            raw_output = data['raw_output']
            extracted_json = extract_json_from_raw_output(raw_output)
            
            if extracted_json:
                # 解析提取的JSON
                try:
                    fixed_data = json.loads(extracted_json)
                    
                    # 备份原文件
                    backup_path = f"{file_path}.backup"
                    with open(backup_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                    print(f"📦 原文件已备份到: {backup_path}")
                    
                    # 写入修复后的数据
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(fixed_data, f, ensure_ascii=False, indent=2)
                    
                    print(f"✅ 文件修复成功: {file_path}")
                    return True
                    
                except json.JSONDecodeError as e:
                    print(f"❌ 提取的JSON仍然无效: {e}")
                    return False
            else:
                print(f"❌ 无法从raw_output提取有效JSON")
                return False
        else:
            print(f"✅ 文件格式正常，无需修复")
            return True
            
    except Exception as e:
        print(f"❌ 处理文件时出错: {e}")
        return False

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python3 fix_corrupted_json.py <文件路径或目录路径>")
        sys.exit(1)
    
    target_path = sys.argv[1]
    
    if os.path.isfile(target_path):
        # 修复单个文件
        fix_json_file(target_path)
    elif os.path.isdir(target_path):
        # 修复目录中的所有JSON文件
        print(f"🔍 扫描目录: {target_path}")
        json_files = list(Path(target_path).glob("*.json"))
        
        if not json_files:
            print("❌ 目录中没有找到JSON文件")
            return
        
        print(f"📁 找到 {len(json_files)} 个JSON文件")
        
        success_count = 0
        for json_file in json_files:
            if fix_json_file(str(json_file)):
                success_count += 1
        
        print(f"\n🎯 修复完成: {success_count}/{len(json_files)} 个文件成功修复")
    else:
        print(f"❌ 路径不存在: {target_path}")
        sys.exit(1)

if __name__ == "__main__":
    main()
