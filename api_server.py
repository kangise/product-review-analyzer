#!/usr/bin/env python3
"""
Novochoice AI - Local API Server
简单的Flask服务器，连接前端和Python分析引擎
"""

import os
import json
import uuid
import subprocess
import threading
import time
from datetime import datetime
from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
import tempfile
import shutil

app = Flask(__name__)
CORS(app)  # 允许前端跨域访问

# 配置
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# 全局变量存储分析状态
analysis_status = {}

# 分析步骤定义（与Python脚本中的9个步骤对应）
ANALYSIS_STEPS = [
    {"id": "product_type", "name": "Product Classification", "name_zh": "产品分类分析"},
    {"id": "consumer_profile", "name": "Consumer Profile Analysis", "name_zh": "消费者画像分析"},
    {"id": "consumer_scenario", "name": "Usage Scenario Analysis", "name_zh": "使用场景分析"},
    {"id": "consumer_motivation", "name": "Purchase Motivation Analysis", "name_zh": "购买动机分析"},
    {"id": "consumer_love", "name": "Customer Satisfaction Analysis", "name_zh": "客户满意度分析"},
    {"id": "unmet_needs", "name": "Unmet Needs Analysis", "name_zh": "未满足需求分析"},
    {"id": "opportunity", "name": "Business Opportunity Analysis", "name_zh": "商业机会分析"},
    {"id": "star_rating_root_cause", "name": "Rating Root Cause Analysis", "name_zh": "评分根因分析"},
    {"id": "competitor", "name": "Competitive Analysis", "name_zh": "竞争分析"}
]

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({
        'status': 'healthy',
        'message': 'Novochoice AI API Server is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/upload', methods=['POST'])
def upload_file():
    """文件上传端点"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        file_type = request.form.get('type', 'own')  # 'own' or 'competitor'
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # 生成唯一文件名
        file_id = str(uuid.uuid4())
        filename = f"{file_type}_{file_id}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # 保存文件
        file.save(filepath)
        
        return jsonify({
            'success': True,
            'fileName': filename,
            'originalName': file.filename,
            'size': os.path.getsize(filepath),
            'type': file_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['POST'])
def start_analysis():
    """启动分析端点"""
    try:
        data = request.get_json()
        own_brand_file = data.get('ownBrandFile')
        competitor_file = data.get('competitorFile')
        target_category = data.get('targetCategory', '')
        language = data.get('language', 'en')
        output_language = data.get('outputLanguage', 'en')
        
        if not own_brand_file:
            return jsonify({'error': 'Own brand file is required'}), 400
        
        # 生成分析ID
        analysis_id = str(uuid.uuid4())
        
        # 初始化分析状态
        analysis_status[analysis_id] = {
            'status': 'starting',
            'progress': 0,
            'current_step': 0,
            'total_steps': len(ANALYSIS_STEPS),
            'steps': [{'id': step['id'], 'name': step['name'], 'name_zh': step['name_zh'], 'status': 'pending'} for step in ANALYSIS_STEPS],
            'start_time': datetime.now().isoformat(),
            'target_category': target_category,
            'has_competitor_data': bool(competitor_file)
        }
        
        # 准备文件路径
        own_brand_path = os.path.join(UPLOAD_FOLDER, own_brand_file)
        competitor_path = os.path.join(UPLOAD_FOLDER, competitor_file) if competitor_file else None
        
        if not os.path.exists(own_brand_path):
            return jsonify({'error': 'Own brand file not found'}), 404
        
        if competitor_file and not os.path.exists(competitor_path):
            return jsonify({'error': 'Competitor file not found'}), 404
        
        # 在后台线程中运行分析
        thread = threading.Thread(target=run_analysis_background, 
                                args=(analysis_id, own_brand_path, competitor_path, target_category, output_language))
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'analysis_id': analysis_id,
            'status': 'started',
            'message': 'Analysis started successfully'
        })
        
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def run_analysis_background(analysis_id, own_brand_path, competitor_path, target_category, output_language):
    """在后台运行分析的函数"""
    try:
        # 更新状态为运行中
        analysis_status[analysis_id]['status'] = 'running'
        analysis_status[analysis_id]['progress'] = 5
        
        # 复制文件到data目录（Python脚本期望的位置）
        shutil.copy2(own_brand_path, 'data/Customer ASIN Reviews.csv')
        if competitor_path:
            shutil.copy2(competitor_path, 'data/Competitor ASIN Reviews.csv')
        
        print(f"Starting real-time analysis for category: {target_category}")
        
        # 运行带有进度跟踪的Python分析脚本
        process = subprocess.Popen(
            ['python3', 'run_analysis_with_progress.py', target_category, output_language], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True, 
            cwd='.',
            bufsize=1,
            universal_newlines=True
        )
        
        # 实时读取Python脚本的输出
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            
            if output:
                line = output.strip()
                print(f"Python output: {line}")
                
                # 解析进度信息
                if line.startswith('PROGRESS:'):
                    try:
                        progress_json = line[9:]  # 移除 'PROGRESS:' 前缀
                        progress_data = json.loads(progress_json)
                        
                        # 更新分析状态
                        analysis_status[analysis_id]['progress'] = progress_data['progress']
                        analysis_status[analysis_id]['current_step'] = progress_data['step_index']
                        
                        # 更新步骤状态
                        step_index = progress_data['step_index']
                        if step_index < len(analysis_status[analysis_id]['steps']):
                            # 标记当前步骤为运行中
                            analysis_status[analysis_id]['steps'][step_index]['status'] = 'running'
                            
                            # 标记之前的步骤为完成
                            for i in range(step_index):
                                analysis_status[analysis_id]['steps'][i]['status'] = 'completed'
                        
                        # 如果步骤完成，标记为完成状态
                        if progress_data['status'] == 'completed' and step_index > 0:
                            if step_index - 1 < len(analysis_status[analysis_id]['steps']):
                                analysis_status[analysis_id]['steps'][step_index - 1]['status'] = 'completed'
                        
                        print(f"Progress updated: {progress_data['progress']}% - Step {step_index}")
                        
                    except json.JSONDecodeError as e:
                        print(f"Failed to parse progress JSON: {e}")
        
        # 等待进程完成
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            print(f"Analysis failed: {stderr}")
            analysis_status[analysis_id]['status'] = 'failed'
            analysis_status[analysis_id]['error'] = stderr
            return
        
        # 分析完成，标记所有步骤为完成
        analysis_status[analysis_id]['status'] = 'completed'
        analysis_status[analysis_id]['progress'] = 100
        analysis_status[analysis_id]['end_time'] = datetime.now().isoformat()
        
        for step in analysis_status[analysis_id]['steps']:
            step['status'] = 'completed'
        
        print(f"Analysis {analysis_id} completed successfully")
        
    except Exception as e:
        print(f"Background analysis error: {str(e)}")
        analysis_status[analysis_id]['status'] = 'failed'
        analysis_status[analysis_id]['error'] = str(e)

@app.route('/analysis/<analysis_id>/stream', methods=['GET'])
def stream_analysis_output(analysis_id):
    """实时流式输出分析内容"""
    def generate():
        if analysis_id not in analysis_status:
            yield f"data: {json.dumps({'error': 'Analysis not found'})}\n\n"
            return
        
        # 模拟实时输出正在生成的内容
        status = analysis_status[analysis_id]
        if status['status'] == 'running':
            # 根据当前步骤返回相应的实时内容
            current_step = status.get('current_step', 0)
            steps = status.get('steps', [])
            
            if current_step < len(steps):
                step_name = steps[current_step]['name']
                # 这里应该返回真实的AI生成内容
                # 暂时返回模拟的实时内容
                content = {
                    "current_analysis": step_name,
                    "progress": status['progress'],
                    "partial_result": f"正在分析{step_name}...",
                    "timestamp": datetime.now().isoformat()
                }
                yield f"data: {json.dumps(content)}\n\n"
        
        yield f"data: {json.dumps({'status': 'complete'})}\n\n"
    
    return Response(generate(), mimetype='text/plain')

@app.route('/analysis/<analysis_id>/latest-output', methods=['GET'])
def get_latest_output(analysis_id):
    """获取最新的分析输出内容"""
    if analysis_id not in analysis_status:
        return jsonify({'error': 'Analysis not found'}), 404
    
    status = analysis_status[analysis_id]
    
    # 如果分析完成，返回完整结果
    if status['status'] == 'completed':
        try:
            result = load_analysis_results(analysis_id, '', False)
            return jsonify({'content': json.dumps(result, ensure_ascii=False, indent=2)})
        except:
            pass
    
    # 如果分析进行中，返回当前步骤的实时内容
    if status['status'] == 'running':
        current_step = status.get('current_step', 0)
        steps = status.get('steps', [])
        
        if current_step < len(steps):
            step_name = steps[current_step]['name']
            # 这里应该返回真实的AI正在生成的内容
            # 暂时返回模拟内容
            content = {
                "🔄 实时分析状态": "正在进行中",
                "📊 当前步骤": f"{current_step + 1}/9 - {step_name}",
                "📈 完成进度": f"{status['progress']}%",
                "🤖 AI引擎": "Amazon Q Developer",
                "⏰ 分析时间": status.get('start_time', ''),
                "🔍 实时洞察": f"正在深度分析{step_name}，AI正在处理数据并生成洞察..."
            }
            return jsonify({'content': json.dumps(content, ensure_ascii=False, indent=2)})
    
    return jsonify({'content': '{"status": "等待分析开始..."}'})

@app.route('/analysis/<analysis_id>/status', methods=['GET'])
def get_analysis_status(analysis_id):
    """获取分析状态"""
    if analysis_id not in analysis_status:
        return jsonify({'error': 'Analysis not found'}), 404
    
    return jsonify(analysis_status[analysis_id])

@app.route('/analysis/<analysis_id>/result', methods=['GET'])
def get_analysis_result(analysis_id):
    """获取分析结果"""
    if analysis_id == 'latest':
        # 特殊处理：加载最新的分析结果或demo数据
        try:
            result = load_analysis_results('latest', '', False)
            if 'error' in result:
                return jsonify({'error': 'No analysis results found'}), 404
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    if analysis_id not in analysis_status:
        return jsonify({'error': 'Analysis not found'}), 404
    
    if analysis_status[analysis_id]['status'] != 'completed':
        return jsonify({'error': 'Analysis not completed yet'}), 400
    
    # 加载并返回分析结果
    result = load_analysis_results(
        analysis_id, 
        analysis_status[analysis_id]['target_category'],
        analysis_status[analysis_id]['has_competitor_data']
    )
    
    return jsonify(result)

def load_analysis_results(analysis_id, target_category, has_competitor_data):
    """加载分析结果并格式化为前端期望的结构"""
    
    def format_competitor_analysis(competitor_data):
        """格式化新的competitor数据结构为前端期望的格式"""
        if not competitor_data or 'error' in competitor_data:
            return {}
        
        # 新的数据结构包含三个部分
        base_analysis = competitor_data.get('竞品基础分析', {})
        comparison_analysis = competitor_data.get('竞品对比分析', {})
        unique_insights = competitor_data.get('竞品独有洞察', {})
        
        # 转换为前端期望的格式
        formatted_result = {}
        
        # 处理综合竞争力评估
        if comparison_analysis and '综合竞争力评估' in comparison_analysis:
            formatted_result['综合竞争力评估'] = comparison_analysis['综合竞争力评估']
        
        # 处理四象限分析 - 转换为前端期望的格式
        if comparison_analysis and '四象限对比分析' in comparison_analysis:
            quadrant_data = comparison_analysis['四象限对比分析']
            
            # 创建前端期望的对比数据结构
            # 从四象限数据重构为三个对比类别
            love_comparison = []
            unmet_comparison = []
            motivation_comparison = []
            
            # 处理每个象限的数据
            for quadrant_name, items in quadrant_data.items():
                if quadrant_name == '说明':
                    continue
                    
                for item in items:
                    if isinstance(item, dict) and '对比主题' in item:
                        comparison_item = {
                            '对比主题': item['对比主题'],
                            '我方频率': '高' if float(item.get('我方频率', '0%').replace('%', '')) >= 15 else '低',
                            '竞品频率': '高' if float(item.get('竞品频率', '0%').replace('%', '')) >= 15 else '低',
                            '对比洞察': item.get('对比洞察', ''),
                            '象限特征': item.get('象限特征', '')
                        }
                        
                        # 根据主题分类到不同的对比类别（这里需要根据实际数据结构调整）
                        # 暂时都放到客户喜爱点对比中，实际应该根据数据来源分类
                        love_comparison.append(comparison_item)
            
            formatted_result['客户喜爱点对比'] = love_comparison
            formatted_result['未满足需求对比'] = unmet_comparison  # 需要类似的处理
            formatted_result['购买动机对比'] = motivation_comparison  # 需要类似的处理
        
        # 添加基础分析数据
        if base_analysis:
            formatted_result['竞品基础数据'] = base_analysis
        
        # 添加独有洞察
        if unique_insights:
            formatted_result['竞品独有洞察'] = unique_insights
        
        return formatted_result
    
    try:
        # 查找包含完整结果的result/analysis_results_TIMESTAMP目录
        import glob
        result_dirs = glob.glob('result/analysis_results_*')
        if not result_dirs:
            print("No analysis results found, loading demo data from result/demoresult folder...")
            return load_demo_results()
        
        # 按时间排序，从最新开始查找
        result_dirs.sort(reverse=True)
        
        # 必需的结果文件
        required_files = [
            'consumer_profile.json',
            'consumer_motivation.json', 
            'consumer_scenario.json',
            'consumer_love.json',
            'star_rating_root_cause.json',
            'unmet_needs.json',
            'opportunity.json',
            'competitor.json'
        ]
        
        results_dir = None
        actual_category = target_category
        for dir_path in result_dirs:
            # 检查这个目录是否包含所有必需文件
            has_all_files = True
            for filename in required_files:
                filepath = os.path.join(dir_path, filename)
                if not os.path.exists(filepath):
                    has_all_files = False
                    break
            
            if has_all_files:
                results_dir = dir_path
                # 读取metadata获取实际的category
                metadata_file = os.path.join(dir_path, 'metadata.json')
                if os.path.exists(metadata_file):
                    try:
                        with open(metadata_file, 'r', encoding='utf-8') as f:
                            metadata = json.load(f)
                            actual_category = metadata.get('target_category', target_category)
                    except:
                        pass
                break
        
        if not results_dir:
            print("No complete analysis results found, loading demo data from result/demoresult folder...")
            return load_demo_results()
        
        print(f"Loading results from: {results_dir}")
        
        # 读取各个分析结果文件
        results = {}
        
        for filename in required_files:
            filepath = os.path.join(results_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    key = filename.replace('.json', '')
                    results[key] = json.load(f)
                    print(f"✅ Loaded {filename}: {len(str(results[key]))} characters")
            except Exception as e:
                print(f"❌ Error loading {filename}: {e}")
                results[key] = {}
        
        # 从目录名提取实际的分析时间
        actual_timestamp = datetime.now().isoformat()
        if results_dir:
            try:
                # 从目录名提取时间戳 (格式: result/analysis_results_YYYYMMDD_HHMMSS)
                timestamp_str = results_dir.replace('result/analysis_results_', '')
                dt = datetime.strptime(timestamp_str, '%Y%m%d_%H%M%S')
                actual_timestamp = dt.isoformat()
                print(f"📅 使用实际分析时间: {actual_timestamp} (从目录 {results_dir})")
            except Exception as e:
                print(f"⚠️ 无法解析时间戳，使用当前时间: {e}")
        
        # 格式化为前端期望的结构
        formatted_result = {
            'id': analysis_id,
            'timestamp': actual_timestamp,
            'hasCompetitorData': bool(results.get('competitor', {})),  # 根据实际数据设置
            'targetCategory': actual_category,
            'ownBrandAnalysis': {
                'userInsights': results.get('consumer_profile', {}),
                'userMotivation': results.get('consumer_motivation', {}),
                'userScenario': results.get('consumer_scenario', {}),
                'userFeedback': {
                    'consumerLove': results.get('consumer_love', {}),
                    'starRating': results.get('star_rating_root_cause', {})
                },
                'unmetNeeds': results.get('unmet_needs', {}),
                'opportunities': results.get('opportunity', {})
            },
            'competitorAnalysis': format_competitor_analysis(results.get('competitor', {})),
            'competitor': results.get('competitor', {})  # 直接添加新的竞品数据结构
        }
        
        # 保存metadata到分析结果目录
        if results_dir:
            metadata = {
                'id': analysis_id,
                'timestamp': datetime.now().isoformat(),
                'targetCategory': target_category if target_category and target_category.strip() else 'Webcams',
                'hasCompetitorData': bool(results.get('competitor', {}))
            }
            metadata_path = os.path.join(results_dir, 'metadata.json')
            try:
                with open(metadata_path, 'w', encoding='utf-8') as f:
                    json.dump(metadata, f, ensure_ascii=False, indent=2)
                print(f"✅ Saved metadata to {metadata_path}")
            except Exception as e:
                print(f"❌ Error saving metadata: {e}")
        
        print(f"✅ Formatted result with {len([k for k, v in results.items() if v])} non-empty analysis modules")
        return formatted_result
        
    except Exception as e:
        print(f"❌ Error loading results: {str(e)}")
        print("Loading demo data as fallback...")
        return load_demo_results()

@app.route('/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    """删除指定的历史报告"""
    try:
        import shutil
        
        # 验证报告ID格式
        if not report_id.startswith('analysis_results_'):
            return jsonify({'error': 'Invalid report ID format'}), 400
        
        # 检查目录是否存在
        if not os.path.exists(report_id):
            return jsonify({'error': 'Report not found'}), 404
        
        # 删除整个报告目录
        shutil.rmtree(report_id)
        print(f"✅ Deleted report directory: {report_id}")
        
        return jsonify({'message': 'Report deleted successfully'})
        
    except Exception as e:
        print(f"❌ Error deleting report {report_id}: {e}")
        return jsonify({'error': f'Failed to delete report: {str(e)}'}), 500

@app.route('/reports/<report_id>/export-html', methods=['GET'])
def export_report_html(report_id):
    """导出指定报告为HTML格式"""
    try:
        # 查找报告文件
        report_data = None
        json_file_path = None
        
        for root, dirs, files in os.walk('.'):
            if report_id in root:
                for file in files:
                    if file.endswith('.json') and 'analysis_results' in file:
                        json_file_path = os.path.join(root, file)
                        try:
                            with open(json_file_path, 'r', encoding='utf-8') as f:
                                report_data = json.load(f)
                            break
                        except:
                            continue
                if report_data:
                    break
        
        if not report_data or not json_file_path:
            return jsonify({'error': 'Report not found'}), 404
        
        # 创建临时HTML文件
        temp_html = tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False)
        temp_html.close()
        
        # 调用Python导出脚本
        script_path = os.path.join(os.path.dirname(__file__), 'export_html.py')
        result = subprocess.run([
            'python3', script_path, 
            json_file_path, 
            temp_html.name
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            return jsonify({'error': f'Export failed: {result.stderr}'}), 500
        
        # 返回HTML文件
        response = make_response(send_file(
            temp_html.name,
            as_attachment=True,
            download_name=f'novochoice-analysis-{report_id}.html',
            mimetype='text/html'
        ))
        
        return response
        
    except Exception as e:
        return jsonify({'error': f'Failed to export HTML: {str(e)}'}), 500

@app.route('/reports/<report_id>/export', methods=['GET'])
def export_report(report_id):
    """导出指定报告的完整数据"""
    try:
        # 验证报告ID格式
        if not report_id.startswith('analysis_results_'):
            return jsonify({'error': 'Invalid report ID format'}), 400
        
        # 检查目录是否存在
        if not os.path.exists(report_id):
            return jsonify({'error': 'Report not found'}), 404
        
        # 收集所有JSON文件的数据
        export_data = {
            'reportId': report_id,
            'exportTime': datetime.now().isoformat(),
            'analysisResults': {}
        }
        
        # 读取所有分析结果文件
        analysis_files = [
            'product_type.json',
            'consumer_profile.json',
            'consumer_motivation.json', 
            'consumer_scenario.json',
            'consumer_love.json',
            'star_rating_root_cause.json',
            'unmet_needs.json',
            'opportunity.json',
            'competitor.json'
        ]
        
        for filename in analysis_files:
            filepath = os.path.join(report_id, filename)
            if os.path.exists(filepath):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        file_data = json.load(f)
                    
                    # 检查是否包含错误
                    if 'error' not in file_data:
                        module_name = filename.replace('.json', '')
                        export_data['analysisResults'][module_name] = file_data
                        
                except Exception as e:
                    print(f"Warning: Failed to read {filename}: {e}")
        
        # 添加元数据
        if os.path.exists(os.path.join(report_id, 'metadata.json')):
            try:
                with open(os.path.join(report_id, 'metadata.json'), 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                export_data['metadata'] = metadata
            except:
                pass
        
        # 返回JSON文件下载
        response = make_response(json.dumps(export_data, ensure_ascii=False, indent=2))
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        response.headers['Content-Disposition'] = f'attachment; filename="{report_id}_export.json"'
        
        print(f"✅ Exported report: {report_id}")
        return response
        
    except Exception as e:
        print(f"❌ Error exporting report {report_id}: {e}")
        return jsonify({'error': f'Failed to export report: {str(e)}'}), 500

@app.route('/reports', methods=['GET'])
def get_reports():
    """获取历史报告列表"""
    try:
        import glob
        import os
        from datetime import datetime
        
        # 获取所有分析结果目录
        result_dirs = glob.glob('result/analysis_results_*')
        result_dirs.sort(reverse=True)  # 按时间倒序
        
        reports = []
        
        for dir_name in result_dirs:
            try:
                # 从目录名提取时间戳
                timestamp_str = dir_name.replace('result/analysis_results_', '')
                
                # 解析时间戳
                try:
                    dt = datetime.strptime(timestamp_str, '%Y%m%d_%H%M%S')
                    timestamp = dt.isoformat() + 'Z'
                except:
                    timestamp = datetime.now().isoformat() + 'Z'
                
                # 检查目录中的文件
                required_files = [
                    'consumer_profile.json',
                    'consumer_motivation.json', 
                    'consumer_scenario.json',
                    'consumer_love.json',
                    'star_rating_root_cause.json',
                    'unmet_needs.json',
                    'opportunity.json'
                ]
                
                # 检查文件完整性
                complete_files = 0
                has_competitor = False
                
                for filename in required_files:
                    filepath = os.path.join(dir_name, filename)
                    if os.path.exists(filepath):
                        try:
                            with open(filepath, 'r', encoding='utf-8') as f:
                                data = json.load(f)
                            if 'error' not in data:
                                complete_files += 1
                        except:
                            pass
                
                # 检查竞品数据
                competitor_file = os.path.join(dir_name, 'competitor.json')
                if os.path.exists(competitor_file):
                    try:
                        with open(competitor_file, 'r', encoding='utf-8') as f:
                            competitor_data = json.load(f)
                        if 'error' not in competitor_data and competitor_data:
                            has_competitor = True
                    except:
                        pass
                
                # 确定状态
                if complete_files >= 6:  # 至少6个核心文件完整
                    status = 'completed'
                elif complete_files > 0:
                    status = 'partial'
                else:
                    status = 'failed'
                
                report = {
                    'id': dir_name,
                    'timestamp': timestamp,
                    'category': 'Webcams',  # 默认类别，可以从文件中读取
                    'status': status,
                    'hasCompetitorData': has_competitor,
                    'completedModules': complete_files,
                    'totalModules': len(required_files),
                    'fileInfo': {
                        'ownBrandFile': 'Customer ASIN Reviews.csv',
                        'competitorFile': 'Competitor ASIN Reviews.csv' if has_competitor else None
                    }
                }
                
                reports.append(report)
                
            except Exception as e:
                print(f"Error processing directory {dir_name}: {e}")
                continue
        
        return jsonify({'reports': reports})
        
    except Exception as e:
        print(f"Error getting reports: {e}")
        return jsonify({'reports': []})

@app.route('/report/<path:report_id>', methods=['GET'])
def get_report(report_id):
    """获取特定报告"""
    try:
        print(f"Loading report: {report_id}")
        
        # 确保report_id是安全的路径
        if not report_id.startswith('result/analysis_results_'):
            return jsonify({'error': 'Invalid report ID'}), 400
        
        # 检查目录是否存在
        if not os.path.exists(report_id):
            return jsonify({'error': 'Report not found'}), 404
        
        # 加载分析结果
        raw_results = {}
        
        # 定义需要加载的文件
        required_files = [
            'consumer_profile.json', 'consumer_motivation.json', 'consumer_scenario.json',
            'consumer_love.json', 'unmet_needs.json', 'opportunity.json',
            'star_rating_root_cause.json', 'product_type.json'
        ]
        
        # 加载每个文件
        for filename in required_files:
            file_path = os.path.join(report_id, filename)
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = json.load(f)
                        # 移除.json后缀作为key
                        key = filename.replace('.json', '')
                        raw_results[key] = content
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
                    raw_results[filename.replace('.json', '')] = {'error': f'Failed to load: {str(e)}'}
        
        # 检查是否有竞品数据
        competitor_file = os.path.join(report_id, 'competitor.json')
        has_competitor = False
        if os.path.exists(competitor_file):
            try:
                with open(competitor_file, 'r', encoding='utf-8') as f:
                    raw_results['competitor'] = json.load(f)
                    has_competitor = True
            except Exception as e:
                print(f"Error loading competitor data: {e}")
                raw_results['competitor'] = {'error': f'Failed to load: {str(e)}'}
        
        # 转换为前端期望的格式
        formatted_results = {
            'id': report_id,
            'timestamp': os.path.basename(report_id).replace('analysis_results_', '').replace('_', 'T') + 'Z',
            'targetCategory': raw_results.get('product_type', {}).get('product_category_profile', {}).get('category_name', 'Unknown'),
            'hasCompetitorData': has_competitor,
            'ownBrandAnalysis': {
                'userInsights': raw_results.get('consumer_profile', {}),
                'userMotivation': raw_results.get('consumer_motivation', {}),
                'userScenario': raw_results.get('consumer_scenario', {}),
                'userFeedback': {
                    'consumerLove': raw_results.get('consumer_love', {}),
                    'starRating': raw_results.get('star_rating_root_cause', {})
                },
                'unmetNeeds': raw_results.get('unmet_needs', {}),
                'opportunities': raw_results.get('opportunity', {}),
                'productType': raw_results.get('product_type', {})
            }
        }
        
        # 如果有竞品数据，添加到结果中
        if has_competitor:
            formatted_results['competitor'] = raw_results.get('competitor', {})
        
        print(f"Successfully loaded report with formatted structure")
        return jsonify(formatted_results)
        
    except Exception as e:
        print(f"Error loading report {report_id}: {e}")
        return jsonify({'error': f'Failed to load report: {str(e)}'}), 500

def load_demo_results():
    """从result/demoresult文件夹加载demo数据"""
    try:
        demo_dir = 'result/demoresult'
        if not os.path.exists(demo_dir):
            raise Exception("Demo results directory not found")
        
        print(f"Loading demo results from: {demo_dir}")
        
        # 读取demo文件
        results = {}
        
        required_files = [
            'consumer_profile.json', 'consumer_motivation.json', 'consumer_scenario.json',
            'consumer_love.json', 'star_rating_root_cause.json', 'unmet_needs.json',
            'opportunity.json', 'competitor.json', 'product_type.json'
        ]
        
        file_mapping = {
            'consumer_profile.json': 'consumer_profile',
            'consumer_motivation.json': 'consumer_motivation', 
            'consumer_scenario.json': 'consumer_scenario',
            'consumer_love.json': 'consumer_love',
            'star_rating_root_cause.json': 'star_rating_root_cause',
            'unmet_needs.json': 'unmet_needs',
            'opportunity.json': 'opportunity',
            'competitor.json': 'competitor',
            'product_type.json': 'product_type'
        }
        
        for filename in required_files:
            filepath = os.path.join(demo_dir, filename)
            key = file_mapping[filename]
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    results[key] = json.load(f)
                    print(f"✅ Loaded demo {filename}: {len(str(results[key]))} characters")
            except Exception as e:
                print(f"❌ Error loading demo {filename}: {e}")
                results[key] = {}
        
        # 读取demo metadata
        demo_metadata = {}
        metadata_path = os.path.join(demo_dir, 'metadata.json')
        if os.path.exists(metadata_path):
            try:
                with open(metadata_path, 'r', encoding='utf-8') as f:
                    demo_metadata = json.load(f)
                print(f"✅ Loaded demo metadata")
            except Exception as e:
                print(f"❌ Error loading demo metadata: {e}")
        
        # 格式化为前端期望的结构
        formatted_result = {
            'id': demo_metadata.get('id', 'demo-analysis'),
            'timestamp': demo_metadata.get('timestamp', datetime.now().isoformat()),
            'hasCompetitorData': demo_metadata.get('hasCompetitorData', bool(results.get('competitor', {}))),
            'targetCategory': demo_metadata.get('targetCategory', 'Webcams'),
            'ownBrandAnalysis': {
                'userInsights': results.get('consumer_profile', {}),
                'userMotivation': results.get('consumer_motivation', {}),
                'userScenario': results.get('consumer_scenario', {}),
                'userFeedback': {
                    'consumerLove': results.get('consumer_love', {}),
                    'starRating': results.get('star_rating_root_cause', {})
                },
                'unmetNeeds': results.get('unmet_needs', {}),
                'opportunities': results.get('opportunity', {})
            },
            'competitorAnalysis': format_competitor_analysis(results.get('competitor', {}))
        }
        
        print(f"✅ Demo results loaded with {len([k for k, v in results.items() if v])} modules")
        return formatted_result
        
    except Exception as e:
        print(f"❌ Error loading demo results: {str(e)}")
        # 如果连demo数据都加载失败，返回基本错误结构
        return {
            'id': 'demo-analysis',
            'timestamp': datetime.now().isoformat(),
            'hasCompetitorData': False,
            'targetCategory': 'Webcams',
            'error': f'Failed to load demo data: {str(e)}'
        }

if __name__ == '__main__':
    print("🚀 Starting Novochoice AI API Server...")
    print("📊 Server will run at: http://localhost:8000")
    print("🔗 Frontend should connect to: http://localhost:8000")
    print("💡 Real-time analysis progress tracking enabled!")
    
    app.run(host='0.0.0.0', port=8000, debug=True)
