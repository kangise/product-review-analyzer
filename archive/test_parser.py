#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import sys
import os

def test_md_structure():
    """测试MD文档结构"""
    md_path = '../Review Analysis/Review.md'
    
    if not os.path.exists(md_path):
        print(f"❌ MD文件不存在: {md_path}")
        return
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("📊 MD文档结构分析")
    print("=" * 50)
    
    # 1. 测试品牌提取
    print("\n1. 品牌信息提取:")
    title_match = re.search(r'^#\s+(.+?)\s+产品线用户评论洞察报告', content, re.MULTILINE)
    if title_match:
        title_text = title_match.group(1).strip()
        parts = title_text.split()
        brand = parts[0] if parts else "Unknown"
        product = ' '.join(parts[1:]) if len(parts) > 1 else "Unknown"
        print(f"   品牌: {brand}")
        print(f"   产品: {product}")
    else:
        print("   ❌ 无法提取品牌信息")
    
    # 2. 测试章节识别
    print("\n2. 主要章节识别:")
    main_sections = [
        "消费者画像分析",
        "消费者最常用的10个使用场景分析", 
        "消费者最喜爱的10个方面",
        "消费者最想要但未被满足的10个方面",
        "购买驱动因素分析"
    ]
    
    for section in main_sections:
        pattern = rf'##\s+{re.escape(section)}'
        match = re.search(pattern, content)
        status = "✅" if match else "❌"
        print(f"   {status} {section}")
    
    # 3. 测试场景解析
    print("\n3. 使用场景解析测试:")
    scenario_start = content.find('## 消费者最常用的10个使用场景分析')
    scenario_end = content.find('## 总结洞察')
    
    if scenario_start != -1 and scenario_end != -1:
        scenario_section = content[scenario_start:scenario_end]
        # 查找场景项目
        scene_pattern = r'###\s+(\d+)\.\s+(.+?)\s+\(([0-9.]+)%\)'
        matches = re.findall(scene_pattern, scenario_section)
        print(f"   找到 {len(matches)} 个使用场景")
        for i, (rank, name, percentage) in enumerate(matches[:3]):
            print(f"   {rank}. {name} ({percentage}%)")
    else:
        print("   ❌ 无法找到使用场景章节")
    
    # 4. 测试喜爱方面解析
    print("\n4. 喜爱方面解析测试:")
    love_start = content.find('## 消费者最喜爱的10个方面')
    love_end = content.find('## 消费者最想要但未被满足的10个方面')
    
    if love_start != -1 and love_end != -1:
        love_section = content[love_start:love_end]
        print(f"   章节长度: {len(love_section)}")
        # 查找喜爱方面项目 - 使用##级别标题
        aspect_pattern = r'##\s+(\d+)\.\s+(.+?)\s+\(([0-9.]+)%\)'
        matches = re.findall(aspect_pattern, love_section)
        print(f"   找到 {len(matches)} 个喜爱方面")
        for i, (rank, name, percentage) in enumerate(matches[:3]):
            print(f"   {rank}. {name} ({percentage}%)")
    else:
        print("   ❌ 无法找到喜爱方面章节")
    
    # 5. 测试未满足需求解析
    print("\n5. 未满足需求解析测试:")
    needs_start = content.find('## 消费者最想要但未被满足的10个方面')
    needs_end = content.find('## 购买驱动因素分析')
    
    if needs_start != -1 and needs_end != -1:
        needs_section = content[needs_start:needs_end]
        # 查找需求项目
        need_pattern = r'###\s+(\d+)\.\s+(.+?)\s+\(占比[：:]?\s*([0-9.]+)%\)'
        matches = re.findall(need_pattern, needs_section)
        print(f"   找到 {len(matches)} 个未满足需求")
        for i, (rank, name, percentage) in enumerate(matches[:3]):
            print(f"   {rank}. {name} ({percentage}%)")
    else:
        print("   ❌ 无法找到未满足需求章节")
    
    # 6. 测试购买驱动因素解析
    print("\n6. 购买驱动因素解析测试:")
    intent_start = content.find('## 购买驱动因素分析')
    intent_end = content.find('## 评分分布统计')
    
    if intent_start != -1 and intent_end != -1:
        intent_section = content[intent_start:intent_end]
        # 查找驱动因素项目
        factor_pattern = r'###\s+(\d+)\.\s+(.+?)\s+\(([0-9.]+)%\)'
        matches = re.findall(factor_pattern, intent_section)
        print(f"   找到 {len(matches)} 个购买驱动因素")
        for i, (rank, name, percentage) in enumerate(matches[:3]):
            print(f"   {rank}. {name} ({percentage}%)")
    else:
        print("   ❌ 无法找到购买驱动因素章节")

if __name__ == "__main__":
    test_md_structure()
