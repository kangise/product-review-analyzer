#!/usr/bin/env python3
"""
ReviewMind AI - Local API Server
简单的Flask服务器，连接前端和Python分析引擎
"""

import os
import json
import uuid
import subprocess
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
        
        # 准备文件路径
        own_brand_path = os.path.join(UPLOAD_FOLDER, own_brand_file)
        competitor_path = os.path.join(UPLOAD_FOLDER, competitor_file) if competitor_file else None
        
        if not os.path.exists(own_brand_path):
            return jsonify({'error': 'Own brand file not found'}), 404
        
        if competitor_file and not os.path.exists(competitor_path):
            return jsonify({'error': 'Competitor file not found'}), 404
        
        # 复制文件到data目录（Python脚本期望的位置）
        shutil.copy2(own_brand_path, 'data/Customer ASIN Reviews.csv')
        if competitor_path:
            shutil.copy2(competitor_path, 'data/Competitor ASIN Reviews.csv')
        
        # 运行Python分析脚本
        print(f"Starting analysis for category: {target_category}")
        result = subprocess.run(['python3', 'run_analysis.py'], 
                              capture_output=True, text=True, cwd='.')
        
        if result.returncode != 0:
            print(f"Analysis failed: {result.stderr}")
            return jsonify({'error': f'Analysis failed: {result.stderr}'}), 500
        
        # 读取分析结果
        analysis_result = load_analysis_results(analysis_id, target_category, bool(competitor_file))
        
        return jsonify(analysis_result)
        
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        return jsonify({'error': str(e)}), 500

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
    print("💡 Make sure to update frontend API configuration!")
    
    app.run(host='0.0.0.0', port=8000, debug=True)
