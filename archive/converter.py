#!/usr/bin/env python3
"""
Insta360 Review.MD to HTML Converter
将Review.MD文件转换为交互式HTML报告
"""

import os
import sys
import shutil
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from src.parser import ReviewDataParser

class ReviewConverter:
    def __init__(self, input_file=None, output_dir=None):
        self.base_dir = Path(__file__).parent
        self.input_file = input_file or self.find_review_file()
        self.output_dir = Path(output_dir) if output_dir else self.base_dir / 'output'
        self.templates_dir = self.base_dir / 'templates'
        self.static_dir = self.base_dir / 'static'
        
        # 确保输出目录存在
        self.output_dir.mkdir(exist_ok=True)
        
    def find_review_file(self):
        """查找Review.md文件"""
        possible_paths = [
            Path.cwd() / 'Review Analysis' / 'Review.md',
            Path.cwd() / 'Review.md',
            self.base_dir.parent / 'Review Analysis' / 'Review.md',
            self.base_dir.parent / 'Review.md'
        ]
        
        for path in possible_paths:
            if path.exists():
                return path
                
        raise FileNotFoundError("找不到Review.md文件，请确保文件存在于以下位置之一：\n" + 
                              "\n".join(str(p) for p in possible_paths))
    
    def load_markdown_content(self):
        """加载Markdown文件内容"""
        try:
            with open(self.input_file, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            raise Exception(f"读取文件失败: {e}")
    
    def copy_static_files(self):
        """复制静态文件到输出目录"""
        output_static = self.output_dir / 'static'
        
        # 如果目标目录存在，先删除
        if output_static.exists():
            shutil.rmtree(output_static)
            
        # 复制静态文件
        shutil.copytree(self.static_dir, output_static)
        print(f"✓ 静态文件已复制到: {output_static}")
    
    def generate_html(self, data):
        """生成HTML文件"""
        # 设置Jinja2环境
        env = Environment(
            loader=FileSystemLoader(self.templates_dir),
            autoescape=True
        )
        
        # 加载模板
        template = env.get_template('report.html')
        
        # 渲染HTML
        html_content = template.render(**data)
        
        # 写入文件
        output_file = self.output_dir / 'review-insight.html'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
            
        return output_file
    
    def convert(self):
        """执行转换过程"""
        print("🚀 开始转换Review.MD文件...")
        print(f"📁 输入文件: {self.input_file}")
        print(f"📁 输出目录: {self.output_dir}")
        
        try:
            # 1. 加载Markdown内容
            print("\n📖 正在读取Markdown文件...")
            md_content = self.load_markdown_content()
            print(f"✓ 文件读取成功，内容长度: {len(md_content)} 字符")
            
            # 2. 解析数据
            print("\n🔍 正在解析数据...")
            parser = ReviewDataParser(md_content)
            data = parser.parse_all_sections()
            print("✓ 数据解析完成")
            
            # 打印解析结果摘要
            print(f"  - 消费者画像: {len(data['consumer_persona']['segments'])} 个用户群体")
            print(f"  - 使用场景: {len(data['customer_scenario']['scenarios'])} 个场景")
            print(f"  - 喜爱方面: {len(data['customer_love']['aspects'])} 个方面")
            print(f"  - 未满足需求: {len(data['customer_unmet_needs']['needs'])} 个问题")
            print(f"  - 购买驱动: {len(data['purchase_intent']['factors'])} 个因素")
            print(f"  - 评分分布: {len(data['star_rating']['rating_distribution'])} 个评分等级")
            print(f"  - 优化机会: {len(data['opportunities']['opportunities'])} 个机会")
            
            # 3. 复制静态文件
            print("\n📋 正在复制静态文件...")
            self.copy_static_files()
            
            # 4. 生成HTML
            print("\n🎨 正在生成HTML文件...")
            output_file = self.generate_html(data)
            print(f"✓ HTML文件生成成功: {output_file}")
            
            # 5. 完成
            print(f"\n🎉 转换完成！")
            print(f"📄 输出文件: {output_file}")
            print(f"🌐 在浏览器中打开: file://{output_file.absolute()}")
            
            return output_file
            
        except Exception as e:
            print(f"\n❌ 转换失败: {e}")
            sys.exit(1)

def main():
    """主函数"""
    print("=" * 60)
    print("🎯 Insta360 Review.MD to HTML Converter")
    print("=" * 60)
    
    # 创建转换器实例
    converter = ReviewConverter()
    
    # 执行转换
    output_file = converter.convert()
    
    # 询问是否打开文件
    try:
        response = input("\n是否在浏览器中打开生成的报告？(y/n): ").lower().strip()
        if response in ['y', 'yes', '是', '']:
            import webbrowser
            webbrowser.open(f'file://{output_file.absolute()}')
            print("✓ 已在浏览器中打开报告")
    except KeyboardInterrupt:
        print("\n👋 再见！")
    except Exception as e:
        print(f"⚠️  无法自动打开浏览器: {e}")
        print(f"请手动在浏览器中打开: file://{output_file.absolute()}")

if __name__ == "__main__":
    main()
