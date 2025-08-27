#!/usr/bin/env python3
"""
简单的API测试脚本
"""

import requests
import json
import time

API_BASE = "http://localhost:8000"

def test_health():
    """测试健康检查"""
    response = requests.get(f"{API_BASE}/health")
    print(f"Health check: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_upload():
    """测试文件上传"""
    # 使用现有的测试文件
    test_file_path = "data/Customer ASIN Reviews.csv"
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'file': f}
            data = {'type': 'own'}
            response = requests.post(f"{API_BASE}/upload", files=files, data=data)
            
        print(f"Upload test: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Uploaded file: {result['fileName']}")
            return result['fileName']
        else:
            print(f"Upload failed: {response.text}")
            return None
    except Exception as e:
        print(f"Upload error: {e}")
        return None

def test_analysis(filename):
    """测试分析启动"""
    if not filename:
        print("No file to analyze")
        return None
        
    data = {
        'ownBrandFile': filename,
        'competitorFile': None,
        'targetCategory': 'webcams',
        'language': 'en'
    }
    
    response = requests.post(f"{API_BASE}/analyze", json=data)
    print(f"Analysis start: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        analysis_id = result['analysis_id']
        print(f"Analysis started: {analysis_id}")
        return analysis_id
    else:
        print(f"Analysis failed: {response.text}")
        return None

def test_status(analysis_id):
    """测试状态查询"""
    if not analysis_id:
        return
        
    for i in range(5):  # 检查5次
        response = requests.get(f"{API_BASE}/analysis/{analysis_id}/status")
        if response.status_code == 200:
            status = response.json()
            print(f"Status check {i+1}: {status['status']} - {status['progress']}%")
            if status['status'] in ['completed', 'failed']:
                break
        else:
            print(f"Status check failed: {response.status_code}")
        time.sleep(2)

if __name__ == "__main__":
    print("🧪 Testing ReviewMind AI API...")
    
    # 测试健康检查
    test_health()
    print()
    
    # 测试文件上传
    filename = test_upload()
    print()
    
    # 测试分析启动
    analysis_id = test_analysis(filename)
    print()
    
    # 测试状态查询
    test_status(analysis_id)
