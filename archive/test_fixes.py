#!/usr/bin/env python3
"""
测试修复后的JSON解析功能
"""

import json
import subprocess
import sys
from pathlib import Path

def test_single_prompt():
    """测试单个prompt是否能产生干净的JSON输出"""
    
    # 创建一个简单的测试prompt
    test_prompt = """# 重要输出指令
**严格要求：只输出纯JSON，不使用任何工具，不提供任何解释或格式化文本**

请分析以下产品评论并输出JSON格式的结果：

评论："This camera is great! The picture quality is amazing."

输出要求：
**重要：请只输出纯JSON格式，不要包含任何解释、标题、格式化文本或其他内容。**
**不要使用任何工具，不要提供分析过程，不要添加任何说明文字。**
**直接输出JSON数据，不要包含markdown代码块标记。**

{
  "sentiment": "positive",
  "key_points": ["picture quality", "amazing"]
}
"""
    
    print("🧪 测试Q CLI是否能产生干净的JSON输出...")
    
    try:
        # 调用Q CLI（禁用所有工具和颜色输出）
        import os
        env = os.environ.copy()
        env['NO_COLOR'] = '1'
        env['TERM'] = 'dumb'
        env['FORCE_COLOR'] = '0'
        
        result = subprocess.run(
            ['q', 'chat', '--no-interactive', '--trust-tools='],
            input=test_prompt,
            capture_output=True,
            text=True,
            encoding='utf-8',
            env=env
        )
        
        if result.returncode != 0:
            print(f"❌ Q CLI调用失败: {result.stderr}")
            return False
        
        output = result.stdout.strip()
        print(f"📝 Q CLI输出长度: {len(output)} 字符")
        print(f"📝 输出前200字符: {repr(output[:200])}")
        
        # 检查是否包含ANSI代码
        import re
        ansi_pattern = r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])'
        if re.search(ansi_pattern, output):
            print("❌ 输出仍包含ANSI颜色代码")
            return False
        else:
            print("✅ 输出不包含ANSI颜色代码")
        
        # 尝试解析JSON
        try:
            # 清理输出并尝试提取JSON
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
            
            if json_lines:
                json_str = '\n'.join(json_lines)
                parsed = json.loads(json_str)
                print("✅ 成功解析JSON")
                print(f"📊 解析结果: {json.dumps(parsed, indent=2, ensure_ascii=False)}")
                return True
            else:
                print("❌ 未找到有效的JSON结构")
                return False
                
        except json.JSONDecodeError as e:
            print(f"❌ JSON解析失败: {e}")
            return False
            
    except Exception as e:
        print(f"❌ 测试异常: {e}")
        return False

def main():
    print("🔧 测试JSON解析修复效果")
    print("="*50)
    
    # 测试单个prompt
    success = test_single_prompt()
    
    print("\n" + "="*50)
    if success:
        print("✅ 测试通过！修复生效")
        print("🚀 可以运行完整的分析管道了")
    else:
        print("❌ 测试失败，需要进一步调试")
        print("🔍 建议检查Q CLI版本和配置")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
