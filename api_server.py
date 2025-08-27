#!/usr/bin/env python3
"""
ReviewMind AI - Local API Server
简单的Flask服务器，连接前端和Python分析引擎
"""

import os
import json
import uuid
import subprocess
import threading
import time
from datetime import datetime
from flask import Flask, request, jsonify, send_file
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
        'message': 'ReviewMind AI API Server is running',
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
                                args=(analysis_id, own_brand_path, competitor_path, target_category))
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

def run_analysis_background(analysis_id, own_brand_path, competitor_path, target_category):
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
            ['python3', 'run_analysis_with_progress.py', target_category], 
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

@app.route('/analysis/<analysis_id>/status', methods=['GET'])
def get_analysis_status(analysis_id):
    """获取分析状态"""
    if analysis_id not in analysis_status:
        return jsonify({'error': 'Analysis not found'}), 404
    
    return jsonify(analysis_status[analysis_id])

@app.route('/analysis/<analysis_id>/result', methods=['GET'])
def get_analysis_result(analysis_id):
    """获取分析结果"""
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
    try:
        # 读取各个分析结果文件
        results = {}
        
        # 读取主要分析结果
        result_files = [
            'consumer_profile.json',
            'consumer_motivation.json', 
            'consumer_scenario.json',
            'consumer_love.json',
            'star_rating_root_cause.json',
            'unmet_needs.json',
            'opportunity.json'
        ]
        
        for filename in result_files:
            filepath = os.path.join(RESULTS_FOLDER, filename)
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    key = filename.replace('.json', '')
                    results[key] = json.load(f)
        
        # 格式化为前端期望的结构
        formatted_result = {
            'id': analysis_id,
            'timestamp': datetime.now().isoformat(),
            'hasCompetitorData': has_competitor_data,
            'targetCategory': target_category,
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
            }
        }
        
        return formatted_result
        
    except Exception as e:
        print(f"Error loading results: {str(e)}")
        return {
            'id': analysis_id,
            'timestamp': datetime.now().isoformat(),
            'hasCompetitorData': has_competitor_data,
            'targetCategory': target_category,
            'error': str(e)
        }

@app.route('/reports', methods=['GET'])
def get_reports():
    """获取历史报告列表"""
    # 简单实现：返回空列表
    return jsonify([])

@app.route('/report/<report_id>', methods=['GET'])
def get_report(report_id):
    """获取特定报告"""
    return jsonify({'error': 'Report not found'}), 404

if __name__ == '__main__':
    print("🚀 Starting ReviewMind AI API Server...")
    print("📊 Server will run at: http://localhost:8000")
    print("🔗 Frontend should connect to: http://localhost:8000")
    print("💡 Real-time analysis progress tracking enabled!")
    
    app.run(host='0.0.0.0', port=8000, debug=True)
