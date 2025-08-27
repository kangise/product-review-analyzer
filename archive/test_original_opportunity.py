#!/usr/bin/env python3
"""
测试原始opportunity prompt是否能完整输出
"""

import subprocess
import json
import re
import os

def clean_ansi_codes(text):
    """清理ANSI颜色代码"""
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    text = ansi_escape.sub('', text)
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    return text

def extract_json_from_output(output):
    """从输出中提取JSON"""
    output = clean_ansi_codes(output)
    
    json_start = output.find('{')
    if json_start == -1:
        return None, "未找到JSON开始标记"
    
    brace_count = 0
    in_string = False
    escape_next = False
    
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
                    candidate = output[json_start:json_end]
                    try:
                        json.loads(candidate)
                        return candidate, "成功"
                    except json.JSONDecodeError as e:
                        return None, f"JSON解析错误: {e}"
    
    return None, f"JSON结构不完整，未匹配的括号数: {brace_count}"

def test_opportunity_prompt():
    """测试opportunity prompt"""
    
    # 创建一个简化的测试prompt
    test_prompt = """# 重要输出指令
**严格要求：只输出纯JSON，不使用任何工具，不提供任何解释或格式化文本**

请基于以下信息提出3个产品优化机会：

产品类型: webcams
消费者喜爱点: 4K画质, AI追踪
未满足需求: 连接稳定性, 软件兼容性

**重要：请只输出纯JSON格式，不要包含任何解释、标题、格式化文本或其他内容。**
**不要使用任何工具，不要提供分析过程，不要添加任何说明文字。**
**直接输出JSON数据，不要包含markdown代码块标记。**

{
  "产品创新机会洞察": {
    "核心洞察总结": "基于分析的主要创新方向",
    "优化机会列表": [
      {
        "机会名称": "机会名称",
        "使用场景": "具体使用场景描述", 
        "创新方案": "创新方案说明",
        "预期价值": "预期价值分析",
        "启发性评论原文": ["相关评论"]
      }
    ]
  }
}"""
    
    print("🧪 测试原始opportunity prompt的完整输出")
    print("="*60)
    
    try:
        # 设置环境变量禁用颜色输出
        env = os.environ.copy()
        env['NO_COLOR'] = '1'
        env['TERM'] = 'dumb'
        env['FORCE_COLOR'] = '0'
        
        # 调用Q CLI
        result = subprocess.run(
            ['q', 'chat', '--no-interactive', '--trust-tools='],
            input=test_prompt,
            capture_output=True,
            text=True,
            encoding='utf-8',
            env=env,
            timeout=300  # 5分钟超时
        )
        
        if result.returncode != 0:
            print(f"❌ Q CLI调用失败: {result.stderr}")
            return False
        
        output = result.stdout.strip()
        print(f"📝 Q CLI输出长度: {len(output)} 字符")
        print(f"📝 输出前200字符: {repr(output[:200])}")
        print(f"📝 输出后200字符: {repr(output[-200:])}")
        
        # 检查ANSI代码
        ansi_pattern = r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])'
        ansi_matches = re.findall(ansi_pattern, output)
        print(f"📝 发现ANSI代码: {len(ansi_matches)} 个")
        
        # 尝试提取JSON
        json_str, status = extract_json_from_output(output)
        print(f"📝 JSON提取状态: {status}")
        
        if json_str:
            print(f"📝 提取的JSON长度: {len(json_str)} 字符")
            try:
                parsed = json.loads(json_str)
                print("✅ JSON解析成功")
                
                # 检查结构完整性
                if '产品创新机会洞察' in parsed:
                    insight = parsed['产品创新机会洞察']
                    if '优化机会列表' in insight:
                        opportunities = insight['优化机会列表']
                        print(f"📊 机会数量: {len(opportunities)}")
                        
                        # 检查每个机会的完整性
                        complete_count = 0
                        for i, opp in enumerate(opportunities):
                            required_fields = ['机会名称', '使用场景', '创新方案', '预期价值']
                            missing_fields = [f for f in required_fields if f not in opp]
                            if not missing_fields:
                                complete_count += 1
                            else:
                                print(f"  机会{i+1}缺少字段: {missing_fields}")
                        
                        print(f"📊 完整机会数量: {complete_count}/{len(opportunities)}")
                        
                        if complete_count == len(opportunities):
                            print("✅ 所有机会结构完整")
                            return True
                        else:
                            print("⚠️ 部分机会结构不完整")
                            return False
                    else:
                        print("❌ 缺少优化机会列表")
                        return False
                else:
                    print("❌ 缺少产品创新机会洞察")
                    return False
                    
            except json.JSONDecodeError as e:
                print(f"❌ JSON解析失败: {e}")
                return False
        else:
            print("❌ 未能提取JSON")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Q CLI调用超时")
        return False
    except Exception as e:
        print(f"❌ 测试异常: {e}")
        return False

def main():
    success = test_opportunity_prompt()
    
    print("\n" + "="*60)
    if success:
        print("✅ 测试通过：原始prompt能够完整输出结果")
        print("🔧 ANSI清理功能正常工作")
        print("📋 建议：问题可能在于管道中的其他环节")
    else:
        print("❌ 测试失败：原始prompt输出不完整")
        print("🔍 需要进一步调试Q CLI输出问题")
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
