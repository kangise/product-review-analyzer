#!/usr/bin/env python3
import pandas as pd
import json
from collections import Counter
import re

def analyze_usage_scenarios():
    # Read the customer review data
    df = pd.read_csv('/Users/kangise/Documents/Customer Reports/Insta360/Share/Review-converter/data/Customer ASIN Reviews.csv')
    
    # Extract unique reviews (remove duplicates based on Review Id and Review Text)
    unique_reviews = df.drop_duplicates(subset=['Review Id', 'Review Text'])
    
    print(f"Total reviews analyzed: {len(unique_reviews)}")
    
    # Define usage scenarios based on keywords and context
    scenarios = {
        "视频会议通话": {
            "keywords": ["zoom", "teams", "skype", "meeting", "conference call", "video call", "call", "webinar"],
            "description": "用户在家庭或办公环境中进行视频会议、在线通话时使用相机，追求清晰的画质和稳定的连接",
            "reviews": []
        },
        "内容创作录制": {
            "keywords": ["youtube", "video", "streaming", "content", "recording", "podcast", "social", "creator"],
            "description": "内容创作者在录制YouTube视频、播客或其他社交媒体内容时使用，需要高质量画面和专业功能",
            "reviews": []
        },
        "在线教育培训": {
            "keywords": ["lesson", "tutor", "teaching", "student", "education", "whiteboard", "presentation", "ged"],
            "description": "教师或培训师在进行在线教学、辅导时使用，特别需要白板模式和清晰的演示效果",
            "reviews": []
        },
        "桌面办公使用": {
            "keywords": ["desktop", "webcam", "laptop", "computer", "monitor", "office", "work"],
            "description": "日常办公环境中作为桌面摄像头使用，替代笔记本内置摄像头，提升视频质量",
            "reviews": []
        },
        "技术测试评估": {
            "keywords": ["test", "compare", "logitech", "panasonic", "brio", "quality", "tech", "setup"],
            "description": "技术爱好者或专业用户对相机进行测试、对比其他品牌产品，评估技术规格和性能",
            "reviews": []
        }
    }
    
    # Analyze each review and categorize
    for _, review in unique_reviews.iterrows():
        review_text = str(review['Review Text']).lower()
        review_title = str(review['Review Title']).lower()
        full_text = review_text + " " + review_title
        
        # Check which scenarios this review belongs to
        for scenario_name, scenario_data in scenarios.items():
            for keyword in scenario_data["keywords"]:
                if keyword in full_text:
                    scenarios[scenario_name]["reviews"].append({
                        "text": review['Review Text'],
                        "title": review['Review Title'],
                        "rating": review['Review Rating']
                    })
                    break
    
    # Calculate importance and select top reviews for each scenario
    total_reviews = len(unique_reviews)
    result = {
        "洞察总结": {
            "重要度最高的消费场景": [],
            "小众但被忽视的消费场景": []
        },
        "产品使用场景分析": []
    }
    
    # Sort scenarios by number of reviews
    scenario_counts = [(name, len(data["reviews"])) for name, data in scenarios.items()]
    scenario_counts.sort(key=lambda x: x[1], reverse=True)
    
    for scenario_name, scenario_data in scenarios.items():
        review_count = len(scenario_data["reviews"])
        if review_count == 0:
            continue
            
        importance = round((review_count / total_reviews) * 100, 1)
        
        # Select top 5 most relevant reviews
        top_reviews = scenario_data["reviews"][:5]
        
        scenario_analysis = {
            "场景名称": scenario_name,
            "场景描述": scenario_data["description"],
            "场景重要性": f"{importance}%",
            "相关评论": [review["text"] for review in top_reviews]
        }
        
        result["产品使用场景分析"].append(scenario_analysis)
    
    # Identify high and low importance scenarios
    for name, count in scenario_counts:
        importance = round((count / total_reviews) * 100, 1)
        if importance >= 15:  # High importance threshold
            result["洞察总结"]["重要度最高的消费场景"].append(
                f"{name}: 被{importance}%的用户提及，是产品的核心使用情境"
            )
        elif 5 <= importance < 15:  # Niche but notable
            result["洞察总结"]["小众但被忽视的消费场景"].append(
                f"{name}: 虽然仅有{importance}%的用户提及，但在此场景下用户对产品功能有特定需求，存在优化机会"
            )
    
    return result

if __name__ == "__main__":
    analysis_result = analyze_usage_scenarios()
    
    # Save to JSON file
    with open('/Users/kangise/Documents/Customer Reports/Insta360/Share/Review-converter/使用场景分析报告.json', 'w', encoding='utf-8') as f:
        json.dump(analysis_result, f, ensure_ascii=False, indent=2)
    
    # Print formatted result
    print(json.dumps(analysis_result, ensure_ascii=False, indent=2))
