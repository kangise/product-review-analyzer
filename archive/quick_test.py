#!/usr/bin/env python3
"""
快速测试管道的一个步骤
"""

from review_analyzer import ReviewAnalyzer
import json

def main():
    print("🧪 快速测试管道修复效果")
    print("="*50)
    
    try:
        # 创建分析器实例
        analyzer = ReviewAnalyzer()
        
        # 测试一个简单的prompt
        test_prompt = """# 重要输出指令
**严格要求：只输出纯JSON，不使用任何工具，不提供任何解释或格式化文本**

请分析以下产品评论：
"This camera is great! The picture quality is amazing."

**重要：请只输出纯JSON格式，不要包含任何解释、标题、格式化文本或其他内容。**
**不要使用任何工具，不要提供分析过程，不要添加任何说明文字。**
**直接输出JSON数据，不要包含markdown代码块标记。**

{
  "sentiment": "positive",
  "key_features": ["picture quality"],
  "rating": "high"
}"""
        
        print("📞 调用Q Chat...")
        result = analyzer.call_q_chat(test_prompt)
        
        print(f"📝 原始结果: {result}")
        
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
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
