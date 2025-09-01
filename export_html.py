#!/usr/bin/env python3
"""
HTML Export Generator for Novochoice AI Analysis Reports
将analysis_results.json转换为完整的HTML报告
"""

import json
import sys
import os
from datetime import datetime
from typing import Dict, Any, List

def generate_consumer_profile_html(data: Dict[str, Any]) -> str:
    """生成UserInsights模块HTML"""
    if not data:
        return '<div class="module"><h2>👥 Consumer Profile Analysis</h2><p class="no-data">暂无数据</p></div>'
    
    html = '<div class="module">'
    html += '<h2 class="module-title">👥 Consumer Profile Analysis</h2>'
    
    # 关键用户画像洞察
    if '关键用户画像洞察' in data:
        insights = data['关键用户画像洞察']
        html += '<div class="insights-section">'
        
        if '核心用户画像' in insights:
            html += f'''
            <div class="insight-card primary">
                <h4>核心用户画像</h4>
                <p>{insights["核心用户画像"]}</p>
            </div>
            '''
        
        html += '<div class="insights-grid">'
        if '细分潜力用户类型' in insights:
            html += f'''
            <div class="insight-card">
                <h4>细分潜力用户类型</h4>
                <p>{insights["细分潜力用户类型"]}</p>
            </div>
            '''
        
        if '关键用户行为' in insights:
            html += f'''
            <div class="insight-card">
                <h4>关键用户行为</h4>
                <p>{insights["关键用户行为"]}</p>
            </div>
            '''
        html += '</div></div>'
    
    # 消费者画像分析表格
    if '消费者画像分析' in data:
        analysis = data['消费者画像分析']
        
        # 人群特征
        if '人群特征' in analysis and '细分人群' in analysis['人群特征']:
            groups = analysis['人群特征']['细分人群']
            html += '''
            <div class="table-section">
                <h4>👥 用户细分分析</h4>
                <table class="data-table">
                    <thead><tr><th>用户人群</th><th>比例</th><th>特征描述</th></tr></thead>
                    <tbody>
            '''
            for group in groups:
                percentage = group.get('比例', '0%').replace('%', '')
                html += f'''
                <tr>
                    <td class="group-name">{group.get('用户人群', '')}</td>
                    <td class="percentage-cell">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {percentage}%"></div>
                        </div>
                        <span class="percentage-text">{group.get('比例', '')}</span>
                    </td>
                    <td class="description">{group.get('特征描述', '')}</td>
                </tr>
                '''
            html += '</tbody></table></div>'
    
    html += '</div>'
    return html

def generate_consumer_love_html(data: Dict[str, Any]) -> str:
    """生成UserFeedback模块HTML"""
    if not data:
        return '<div class="module"><h2>❤️ Customer Satisfaction Analysis</h2><p class="no-data">暂无数据</p></div>'
    
    html = '<div class="module">'
    html += '<h2 class="module-title">❤️ Customer Satisfaction Analysis</h2>'
    
    # 消费者洞察总结
    if '消费者洞察总结' in data:
        insights = data['消费者洞察总结']
        html += '<div class="insights-section">'
        for key, value in insights.items():
            html += f'''
            <div class="insight-card">
                <h4>{key}</h4>
                <p>{value}</p>
            </div>
            '''
        html += '</div>'
    
    # 核心赞美点分析
    if '核心赞美点分析' in data:
        praise_data = data['核心赞美点分析']
        html += '''
        <div class="praise-section">
            <h4>🏆 核心赞美点分析</h4>
            <div class="praise-grid">
        '''
        
        for praise in praise_data:
            importance = praise.get('赞美点重要性', '0%')
            html += f'''
            <div class="praise-card">
                <div class="praise-header">
                    <h5>{praise.get('赞美点', '')}</h5>
                    <span class="importance-badge">{importance}</span>
                </div>
                <p class="praise-description">{praise.get('消费者描述', '')}</p>
            </div>
            '''
        
        html += '</div></div>'
    
    html += '</div>'
    return html

def generate_unmet_needs_html(data: Dict[str, Any]) -> str:
    """生成UnmetNeeds模块HTML"""
    if not data:
        return '<div class="module"><h2>🔍 Unmet Needs Analysis</h2><p class="no-data">暂无数据</p></div>'
    
    html = '<div class="module">'
    html += '<h2 class="module-title">🔍 Unmet Needs Analysis</h2>'
    
    # 消费者未满足需求洞察
    if '消费者未满足需求洞察' in data:
        insights = data['消费者未满足需求洞察']
        if isinstance(insights, dict):
            for key, value in insights.items():
                html += f'''
                <div class="insight-card primary">
                    <h4>{key}</h4>
                    <p>{value}</p>
                </div>
                '''
        elif isinstance(insights, str):
            html += f'''
            <div class="insight-card primary">
                <h4>消费者未满足需求洞察</h4>
                <p>{insights}</p>
            </div>
            '''
    
    # 未满足需求分析
    if '未满足需求分析' in data:
        needs = data['未满足需求分析']
        if isinstance(needs, list):
            html += '''
            <div class="needs-section">
                <h4>🎯 未满足需求详细分析</h4>
                <div class="needs-grid">
            '''
            
            for need in needs:
                if isinstance(need, dict):
                    need_title = need.get('痛点/未满足的需求', '')
                    description = need.get('消费者描述', '')
                    severity = need.get('问题严重性/频率', '')
                    
                    html += f'''
                    <div class="need-card">
                        <div class="need-header">
                            <h5>{need_title}</h5>
                            <span class="severity-badge">{severity}</span>
                        </div>
                        <p class="need-description">{description}</p>
                    </div>
                    '''
            
            html += '</div></div>'
    
    html += '</div>'
    return html

def generate_opportunities_html(data: Dict[str, Any]) -> str:
    """生成Opportunities模块HTML"""
    if not data:
        return '<div class="module"><h2>💡 Strategic Opportunities</h2><p class="no-data">暂无数据</p></div>'
    
    html = '<div class="module">'
    html += '<h2 class="module-title">💡 Strategic Opportunities</h2>'
    
    # 商业机会洞察
    if '商业机会洞察' in data:
        insights = data['商业机会洞察']
        html += '<div class="opportunities-section">'
        
        if isinstance(insights, dict):
            for category, items in insights.items():
                if isinstance(items, list):
                    html += f'''
                    <div class="opportunity-category">
                        <h4>🚀 {category}</h4>
                        <div class="opportunity-list">
                    '''
                    for item in items:
                        html += f'<div class="opportunity-item">{item}</div>'
                    html += '</div></div>'
                elif isinstance(items, str):
                    html += f'''
                    <div class="insight-card">
                        <h4>{category}</h4>
                        <p>{items}</p>
                    </div>
                    '''
        
        html += '</div>'
    
    html += '</div>'
    return html

def generate_competitor_html(data: Dict[str, Any]) -> str:
    """生成CompetitorAnalysis模块HTML"""
    if not data:
        return '<div class="module"><h2>🏆 Competitor Analysis</h2><p class="no-data">暂无数据</p></div>'
    
    html = '<div class="module">'
    html += '<h2 class="module-title">🏆 Competitor Analysis</h2>'
    
    # 产品竞争力对比分析
    if '产品竞争力对比分析' in data:
        analysis = data['产品竞争力对比分析']
        html += f'''
        <div class="competitor-section">
            <div class="insight-card">
                <h4>产品竞争力对比分析</h4>
                <p>{analysis}</p>
            </div>
        </div>
        '''
    
    html += '</div>'
    return html

def generate_css_styles() -> str:
    """生成CSS样式"""
    return """
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; color: #1e293b; line-height: 1.6; font-size: 15px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .report-header { background: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .report-header h1 { color: #1e293b; font-size: 32px; margin-bottom: 10px; font-weight: 700; }
        
        .module { background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .module-title { color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: 600; }
        
        .insights-section { margin-bottom: 24px; }
        .insight-card { padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0; background: #f8fafc; }
        .insight-card.primary { background: #f1f5f9; border-left: 4px solid #3b82f6; }
        .insight-card h4 { margin: 0 0 8px 0; font-weight: 600; font-size: 16px; color: #1e293b; }
        .insight-card p { margin: 0; color: #64748b; font-size: 14px; line-height: 1.5; }
        .insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
        
        .table-section { margin-bottom: 24px; }
        .table-section h4 { font-weight: 600; font-size: 18px; margin-bottom: 16px; color: #1e293b; }
        .data-table { width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .data-table th { background: #f8fafc; padding: 12px 16px; text-align: left; font-weight: 600; color: #475569; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
        .data-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
        .data-table tr:hover { background: #f8fafc; }
        
        .group-name { font-weight: 500; color: #1e293b; }
        .percentage-cell { display: flex; align-items: center; gap: 8px; }
        .progress-bar { flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #1d4ed8); border-radius: 4px; }
        .percentage-text { font-weight: 500; color: #1e293b; font-size: 12px; }
        .description { color: #64748b; font-size: 14px; }
        
        .praise-section { margin-bottom: 24px; }
        .praise-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
        .praise-card { padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; }
        .praise-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .praise-header h5 { margin: 0; font-weight: 600; color: #1e293b; }
        .importance-badge { background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .praise-description { margin: 0; color: #64748b; font-size: 14px; }
        
        .needs-section { margin-bottom: 24px; }
        .needs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 16px; }
        .need-card { padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; }
        .need-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .need-header h5 { margin: 0; font-weight: 600; color: #1e293b; font-size: 14px; }
        .severity-badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .need-description { margin: 0; color: #64748b; font-size: 14px; }
        .needs-category { margin-bottom: 20px; }
        .needs-category h4 { font-weight: 600; color: #1e293b; margin-bottom: 12px; }
        .needs-list { display: grid; gap: 8px; }
        .need-item { padding: 12px; background: #f1f5f9; border-radius: 6px; border-left: 3px solid #3b82f6; color: #64748b; }
        
        .opportunities-section { margin-bottom: 24px; }
        .opportunity-category { margin-bottom: 20px; }
        .opportunity-category h4 { font-weight: 600; color: #1e293b; margin-bottom: 12px; }
        .opportunity-list { display: grid; gap: 8px; }
        .opportunity-item { padding: 12px; background: #f8fafc; border-radius: 6px; border-left: 3px solid #22c55e; color: #64748b; }
        
        .competitor-section { margin-bottom: 24px; }
        
        .no-data { color: #94a3b8; font-style: italic; text-align: center; padding: 40px; }
        .report-footer { text-align: center; padding: 40px; color: #64748b; margin-top: 40px; }
    </style>
    """

def export_to_html(json_file_path: str, output_file_path: str = None) -> str:
    """将analysis_results.json导出为HTML"""
    
    # 读取JSON数据
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        raise Exception(f"Failed to read JSON file: {e}")
    
    # 生成HTML内容
    html_content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novochoice AI Complete Analysis Report</title>
    {generate_css_styles()}
</head>
<body>
    <div class="container">
        <div class="report-header">
            <h1>🤖 Novochoice AI Complete Analysis Report</h1>
            <p>AI-Powered Customer Intelligence Engine</p>
            <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
        
        {generate_consumer_profile_html(data.get('consumer_profile', {}))}
        {generate_consumer_love_html(data.get('consumer_love', {}))}
        {generate_unmet_needs_html(data.get('unmet_needs', {}))}
        {generate_opportunities_html(data.get('opportunity', {}))}
        {generate_competitor_html(data.get('competitor', {}))}
        
        <div class="report-footer">
            <h3>Generated by Novochoice AI</h3>
            <p>Complete analysis report with professional formatting</p>
            <p>© 2025 Novochoice AI - Customer Intelligence Engine</p>
        </div>
    </div>
</body>
</html>"""
    
    # 确定输出文件路径
    if not output_file_path:
        output_file_path = f"novochoice-analysis-{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
    
    # 写入HTML文件
    try:
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        return output_file_path
    except Exception as e:
        raise Exception(f"Failed to write HTML file: {e}")

def main():
    """命令行入口"""
    if len(sys.argv) < 2:
        print("Usage: python export_html.py <json_file_path> [output_file_path]")
        sys.exit(1)
    
    json_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        result_file = export_to_html(json_file, output_file)
        print(f"✅ HTML report generated successfully: {result_file}")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
