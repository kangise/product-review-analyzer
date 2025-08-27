#!/usr/bin/env python3
"""
单独测试opportunity步骤
"""

from review_analyzer import ReviewAnalyzer
import json

def main():
    print("🧪 单独测试opportunity步骤")
    print("="*50)
    
    try:
        # 创建分析器实例
        analyzer = ReviewAnalyzer()
        
        # 加载opportunity prompt
        opportunity_prompt = analyzer.load_prompt('opportunity.md')
        
        # 创建简化的测试上下文
        test_context = {
            'product_type': {'category': 'webcams'},
            'consumer_love': {'key_points': ['4K quality', 'AI tracking']},
            'unmet_needs': {'main_issues': ['reliability', 'software stability']},
            'consumer_scenario': {'primary_use': 'video meetings'},
            'customer_review_data': 'Sample review: Great camera but sometimes fails to connect.'
        }
        
        print("📞 调用Q Chat进行opportunity分析...")
        result = analyzer.call_q_chat(opportunity_prompt, analyzer.prepare_context_data(test_context))
        
        print(f"📝 原始结果类型: {type(result)}")
        print(f"📝 原始结果键: {list(result.keys()) if isinstance(result, dict) else 'N/A'}")
        
        if 'raw_output' in result:
            raw_output = result['raw_output']
            print(f"📝 原始输出长度: {len(raw_output)} 字符")
            print(f"📝 原始输出前200字符: {repr(raw_output[:200])}")
            print(f"📝 原始输出后200字符: {repr(raw_output[-200:])}")
        
        # 尝试提取干净的结果
        clean_result = analyzer.extract_clean_result(result)
        
        if clean_result:
            print("✅ 成功提取干净的JSON:")
            print(json.dumps(clean_result, indent=2, ensure_ascii=False))
            return True
        else:
            print("❌ 未能提取干净的JSON")
            return False
            
    except Exception as e:
        print(f"❌ 测试异常: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
