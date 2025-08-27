#!/usr/bin/env python3
"""
检查opportunity步骤的上下文数据大小
"""

from review_analyzer import ReviewAnalyzer
import json

def main():
    print("🔍 检查opportunity步骤的上下文数据大小")
    print("="*60)
    
    try:
        # 创建分析器实例
        analyzer = ReviewAnalyzer()
        
        # 加载数据
        analyzer.load_and_clean_data(
            'data/Customer ASIN Reviews.csv',
            'data/Competitor ASIN Reviews.csv'
        )
        
        # 模拟前面步骤的结果
        mock_results = {
            'product_type': {'category': 'webcams', 'features': ['4K', 'AI tracking']},
            'consumer_love': {'key_points': ['画质优秀', 'AI追踪好用']},
            'unmet_needs': {'main_issues': ['连接稳定性', '软件兼容性']},
            'consumer_scenario': {'primary_use': '视频会议'}
        }
        
        # 构建opportunity上下文
        opportunity_context = {
            'product_type': mock_results['product_type'],
            'consumer_love': mock_results['consumer_love'],
            'unmet_needs': mock_results['unmet_needs'],
            'consumer_scenario': mock_results['consumer_scenario'],
            'customer_review_data': analyzer.cleaned_data['customer_review']
        }
        
        # 分析各个组件的大小
        print("📊 上下文数据组件分析:")
        total_size = 0
        
        for key, value in opportunity_context.items():
            if isinstance(value, str):
                size = len(value)
                print(f"  {key}: {size:,} 字符 (字符串)")
            elif isinstance(value, list):
                json_str = json.dumps(value, ensure_ascii=False)
                size = len(json_str)
                print(f"  {key}: {size:,} 字符 ({len(value)} 项列表)")
            elif isinstance(value, dict):
                json_str = json.dumps(value, ensure_ascii=False)
                size = len(json_str)
                print(f"  {key}: {size:,} 字符 (字典)")
            else:
                json_str = json.dumps(value, ensure_ascii=False)
                size = len(json_str)
                print(f"  {key}: {size:,} 字符 ({type(value).__name__})")
            
            total_size += size
        
        print(f"\n📏 总上下文大小: {total_size:,} 字符 ({total_size/1024:.1f} KB)")
        
        # 准备上下文数据
        prepared_context = analyzer.prepare_context_data(opportunity_context)
        
        # 加载prompt模板
        opportunity_prompt = analyzer.load_prompt('opportunity.md')
        
        # 处理prompt模板
        full_prompt = analyzer.process_prompt_template(opportunity_prompt, prepared_context)
        
        print(f"📝 完整prompt大小: {len(full_prompt):,} 字符 ({len(full_prompt)/1024:.1f} KB)")
        
        # 分析customer_review_data的详细信息
        customer_data = analyzer.cleaned_data['customer_review']
        if isinstance(customer_data, list):
            print(f"\n📋 客户评论数据详情:")
            print(f"  评论数量: {len(customer_data)}")
            if customer_data:
                sample_review = customer_data[0]
                print(f"  单条评论示例字段: {list(sample_review.keys()) if isinstance(sample_review, dict) else 'N/A'}")
                
                # 计算平均评论长度
                if isinstance(sample_review, dict) and 'review_text' in sample_review:
                    avg_length = sum(len(str(review.get('review_text', ''))) for review in customer_data) / len(customer_data)
                    print(f"  平均评论长度: {avg_length:.0f} 字符")
        
        # 建议优化方案
        print(f"\n💡 优化建议:")
        if total_size > 100000:  # 100KB
            print("  ⚠️  上下文数据过大，可能导致Q CLI输出截断")
            print("  🔧 建议：")
            print("     1. 限制customer_review_data的数量（如只取前50条）")
            print("     2. 简化评论数据结构（只保留必要字段）")
            print("     3. 对长评论进行截断")
        else:
            print("  ✅ 上下文数据大小合理")
        
        return True
        
    except Exception as e:
        print(f"❌ 检查异常: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
