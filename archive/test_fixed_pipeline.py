#!/usr/bin/env python3
"""
测试修复版分析管道
验证前置依赖和输出路径修复
"""

import unittest
import tempfile
import shutil
from pathlib import Path
import json
import pandas as pd
from review_analyzer_fixed import ReviewAnalyzerFixed

class TestFixedPipeline(unittest.TestCase):
    
    def setUp(self):
        """设置测试环境"""
        self.test_dir = Path(tempfile.mkdtemp())
        
        # 创建测试数据
        self.customer_data = pd.DataFrame({
            'review_text': [
                'Great webcam with 4K quality',
                'AI tracking works perfectly',
                'Love the whiteboard feature'
            ],
            'rating': [5, 4, 5]
        })
        
        self.competitor_data = pd.DataFrame({
            'review_text': [
                'Competitor camera is okay',
                'Not as good as others'
            ],
            'rating': [3, 2]
        })
        
        # 保存测试数据
        self.customer_file = self.test_dir / 'customer.csv'
        self.competitor_file = self.test_dir / 'competitor.csv'
        
        self.customer_data.to_csv(self.customer_file, index=False)
        self.competitor_data.to_csv(self.competitor_file, index=False)
    
    def tearDown(self):
        """清理测试环境"""
        shutil.rmtree(self.test_dir)
    
    def test_dependency_order(self):
        """测试依赖顺序是否正确"""
        analyzer = ReviewAnalyzerFixed()
        
        # 检查依赖关系定义
        steps = analyzer.analysis_steps
        
        # product_type应该没有依赖
        self.assertEqual(steps['product_type']['dependencies'], [])
        
        # consumer_*步骤应该依赖product_type
        consumer_steps = ['consumer_profile', 'consumer_scenario', 'consumer_motivation', 'consumer_love', 'unmet_needs']
        for step in consumer_steps:
            self.assertIn('product_type', steps[step]['dependencies'])
        
        # opportunity应该依赖多个consumer步骤
        opportunity_deps = steps['opportunity']['dependencies']
        self.assertIn('consumer_love', opportunity_deps)
        self.assertIn('unmet_needs', opportunity_deps)
        self.assertIn('consumer_scenario', opportunity_deps)
    
    def test_output_directory_creation(self):
        """测试输出目录创建"""
        analyzer = ReviewAnalyzerFixed()
        
        # 检查输出目录是否创建
        self.assertTrue(analyzer.output_dir.exists())
        self.assertTrue(analyzer.output_dir.is_dir())
        
        # 检查目录名是否包含时间戳
        dir_name = analyzer.output_dir.name
        self.assertTrue(dir_name.startswith('analysis_results_'))
        self.assertTrue(len(dir_name) > len('analysis_results_'))
    
    def test_context_building(self):
        """测试上下文构建"""
        analyzer = ReviewAnalyzerFixed()
        
        # 模拟一些结果
        analyzer.results = {
            'product_type': {'json_result': {'category': 'webcams'}},
            'consumer_love': {'json_result': {'top_features': ['4K', 'AI tracking']}}
        }
        
        base_context = {
            'product_type': 'webcams',
            'customer_review_data': '[]'
        }
        
        # 测试opportunity步骤的上下文构建
        context = analyzer.build_context_for_step('opportunity', base_context)
        
        # 应该包含所需的参数
        expected_params = ['product_type', 'consumer_love', 'unmet_needs', 'consumer_scenario', 'customer_review_data']
        for param in expected_params:
            self.assertIn(param, context)
    
    def test_clean_result_extraction(self):
        """测试结果清理"""
        analyzer = ReviewAnalyzerFixed()
        
        # 测试正常JSON结果
        normal_result = {'json_result': {'data': 'test'}}
        cleaned = analyzer.extract_clean_result(normal_result)
        self.assertEqual(cleaned, {'data': 'test'})
        
        # 测试错误结果
        error_result = {'error': 'Test error', 'raw_output': 'some output'}
        cleaned = analyzer.extract_clean_result(error_result)
        self.assertIsNone(cleaned)
        
        # 测试原始输出
        raw_result = {'raw_output': '{"data": "test"}'}
        cleaned = analyzer.extract_clean_result(raw_result)
        self.assertEqual(cleaned, {"data": "test"})
    
    def test_data_loading_and_cleaning(self):
        """测试数据加载和清理"""
        analyzer = ReviewAnalyzerFixed()
        
        # 加载测试数据
        data = analyzer.load_and_clean_data(str(self.customer_file), str(self.competitor_file))
        
        # 检查数据是否正确加载
        self.assertIn('customer', data)
        self.assertIn('competitor', data)
        
        # 检查清理后的数据
        self.assertIn('customer_review', analyzer.cleaned_data)
        self.assertIn('competitor_review', analyzer.cleaned_data)
        
        # 检查输出文件是否创建
        self.assertTrue((analyzer.output_dir / 'customer_reviews_cleaned.csv').exists())
        self.assertTrue((analyzer.output_dir / 'competitor_reviews_cleaned.csv').exists())

def run_dependency_validation():
    """运行依赖关系验证"""
    print("🔍 验证分析步骤依赖关系...")
    
    analyzer = ReviewAnalyzerFixed()
    steps = analyzer.analysis_steps
    
    print("\n📋 分析步骤依赖关系:")
    for step_name, config in steps.items():
        deps = config['dependencies']
        if deps:
            print(f"  {step_name} → 依赖: {', '.join(deps)}")
        else:
            print(f"  {step_name} → 无依赖")
    
    # 验证依赖的有效性
    all_steps = set(steps.keys())
    invalid_deps = []
    
    for step_name, config in steps.items():
        for dep in config['dependencies']:
            if dep not in all_steps:
                invalid_deps.append(f"{step_name} → {dep}")
    
    if invalid_deps:
        print(f"\n❌ 发现无效依赖:")
        for invalid in invalid_deps:
            print(f"  {invalid}")
        return False
    else:
        print(f"\n✅ 所有依赖关系有效")
        return True

def run_prompt_validation():
    """验证prompt文件中的参数占位符"""
    print("\n🔍 验证prompt文件参数...")
    
    analyzer = ReviewAnalyzerFixed()
    prompts_dir = analyzer.prompts_dir
    
    issues = []
    
    for step_name, config in analyzer.analysis_steps.items():
        prompt_file = prompts_dir / config['prompt_file']
        if not prompt_file.exists():
            issues.append(f"Prompt文件不存在: {prompt_file}")
            continue
        
        # 读取prompt内容
        with open(prompt_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查必需的参数
        required_params = config['context_params']
        for param in required_params:
            placeholder = f"{{{param}}}"
            if placeholder not in content:
                issues.append(f"{step_name}: 缺少参数占位符 {placeholder}")
    
    if issues:
        print("❌ 发现问题:")
        for issue in issues:
            print(f"  {issue}")
        return False
    else:
        print("✅ 所有prompt文件参数验证通过")
        return True

def main():
    """运行所有测试"""
    print("🧪 运行修复版分析管道测试...")
    print("=" * 50)
    
    # 运行单元测试
    print("1. 运行单元测试...")
    unittest.main(argv=[''], exit=False, verbosity=2)
    
    # 运行依赖验证
    print("\n2. 验证依赖关系...")
    dep_valid = run_dependency_validation()
    
    # 运行prompt验证
    print("\n3. 验证prompt文件...")
    prompt_valid = run_prompt_validation()
    
    print("\n" + "=" * 50)
    if dep_valid and prompt_valid:
        print("✅ 所有测试通过！修复版分析管道准备就绪。")
        return True
    else:
        print("❌ 测试发现问题，请检查上述错误。")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
