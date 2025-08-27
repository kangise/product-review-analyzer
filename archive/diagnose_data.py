#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
sys.path.append('./src')

from src.parser import ReviewDataParser

def diagnose_parser():
    """详细诊断解析器的数据完整性"""
    md_path = '../Review Analysis/Review.md'
    
    if not os.path.exists(md_path):
        print(f"❌ MD文件不存在: {md_path}")
        return
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("🔍 详细数据完整性诊断")
    print("=" * 60)
    
    # 创建解析器实例
    parser = ReviewDataParser(content)
    data = parser.parse_all_sections()
    
    # 1. 检查消费者画像数据
    print("\n1. 消费者画像数据:")
    persona = data['consumer_persona']
    print(f"   人群特征: {len(persona['segments'])} 个")
    for segment in persona['segments']:
        print(f"     - {segment['name']}: {segment['percentage']}%")
        print(f"       详细信息: {len(segment['details'])} 条")
        print(f"       引用: {len(segment['quotes'])} 条")
    
    print(f"   使用时刻: {len(persona['usage_moments'])} 个")
    for moment in persona['usage_moments']:
        print(f"     - {moment['name']}: {moment['percentage']}%")
    
    print(f"   使用地点: {len(persona['usage_locations'])} 个")
    for location in persona['usage_locations']:
        print(f"     - {location['name']}: {location['percentage']}%")
    
    print(f"   使用行为: {len(persona['usage_behaviors'])} 个")
    for behavior in persona['usage_behaviors']:
        print(f"     - {behavior['name']}: {behavior['percentage']}%")
    
    print(f"   核心洞察: {len(persona['insights'])} 条")
    for insight in persona['insights']:
        print(f"     - {insight['title']}: {len(insight['content'])} 字符")
    
    # 2. 检查使用场景数据
    print(f"\n2. 使用场景数据: {len(data['customer_scenario']['scenarios'])} 个")
    for scenario in data['customer_scenario']['scenarios'][:3]:
        print(f"   {scenario['rank']}. {scenario['name']}: {scenario['percentage']}%")
        print(f"      描述: {len(scenario['description'])} 字符")
        print(f"      评论: {len(scenario['comments'])} 条")
    
    # 3. 检查喜爱方面数据
    print(f"\n3. 喜爱方面数据: {len(data['customer_love']['aspects'])} 个")
    print(f"   总结: {len(data['customer_love']['summary'])} 字符")
    for aspect in data['customer_love']['aspects'][:3]:
        print(f"   {aspect['rank']}. {aspect['name']}: {aspect['percentage']}%")
        print(f"      评论: {len(aspect['comments'])} 条")
    
    # 4. 检查未满足需求数据
    print(f"\n4. 未满足需求数据: {len(data['customer_unmet_needs']['needs'])} 个")
    for need in data['customer_unmet_needs']['needs'][:3]:
        print(f"   {need['rank']}. {need['name']}: {need['percentage']}%")
        print(f"      评论: {len(need['comments'])} 条")
    
    # 5. 检查购买驱动因素数据
    print(f"\n5. 购买驱动因素数据: {len(data['purchase_intent']['factors'])} 个")
    for factor in data['purchase_intent']['factors'][:3]:
        print(f"   {factor['rank']}. {factor['name']}: {factor['percentage']}%")
        print(f"      描述: {len(factor['description'])} 字符")
        print(f"      评论: {len(factor['comments'])} 条")
    
    # 6. 检查评分数据
    print(f"\n6. 评分数据:")
    rating = data['star_rating']
    print(f"   关键发现: {len(rating['key_findings'])} 条")
    print(f"   评分分布: {len(rating['rating_distribution'])} 个等级")
    print(f"   问题关联: {len(rating['issue_correlation'])} 个问题")
    
    # 7. 检查优化机会数据
    print(f"\n7. 优化机会数据: {len(data['opportunities']['opportunities'])} 个")
    for opp in data['opportunities']['opportunities']:
        print(f"   {opp['rank']}. {opp['title']}")
        print(f"      场景: {len(opp['scenario'])} 字符")
        print(f"      方案: {len(opp['solution'])} 字符")
        print(f"      价值: {len(opp['value'])} 字符")

if __name__ == "__main__":
    diagnose_parser()
