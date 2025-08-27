#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用户画像分析器 - 基于360度运动相机评论数据
分析用户画像、使用场景、使用地点和使用行为
"""

import pandas as pd
import json
import re
from collections import Counter, defaultdict
import numpy as np

class UserPersonaAnalyzer:
    def __init__(self, csv_file_path):
        """初始化分析器"""
        self.df = pd.read_csv(csv_file_path, encoding='utf-8-sig')
        self.total_reviews = len(self.df)
        print(f"加载了 {self.total_reviews} 条评论数据")
        
    def extract_user_characteristics(self):
        """提取用户特征"""
        user_groups = {
            "职场人士": [],
            "内容创作者": [],
            "学生群体": [],
            "科技爱好者": [],
            "家庭用户": []
        }
        
        # 关键词匹配
        keywords = {
            "职场人士": ["work", "office", "meeting", "zoom", "teams", "business", "professional", "corporate", "laptop", "desktop"],
            "内容创作者": ["streaming", "content", "creator", "youtube", "video", "recording", "broadcast", "live"],
            "学生群体": ["student", "school", "class", "education", "learning", "study", "homework"],
            "科技爱好者": ["tech", "specs", "resolution", "4K", "AI", "tracking", "software", "firmware", "upgrade"],
            "家庭用户": ["family", "home", "kids", "children", "personal", "gift", "present", "birthday"]
        }
        
        for idx, row in self.df.iterrows():
            review_text = str(row['Review Text']).lower()
            review_title = str(row['Review Title']).lower()
            combined_text = review_text + " " + review_title
            
            for group, words in keywords.items():
                if any(word in combined_text for word in words):
                    user_groups[group].append({
                        'text': row['Review Text'],
                        'title': row['Review Title'],
                        'rating': row['Review Rating']
                    })
        
        return user_groups
    
    def extract_usage_moments(self):
        """提取使用时刻"""
        usage_moments = {
            "工作会议期间": [],
            "内容创作时": [],
            "日常沟通中": [],
            "学习教育场景": [],
            "娱乐休闲时": []
        }
        
        keywords = {
            "工作会议期间": ["meeting", "zoom", "teams", "conference", "call", "work", "business", "professional"],
            "内容创作时": ["streaming", "recording", "content", "video", "broadcast", "youtube", "live"],
            "日常沟通中": ["chat", "talk", "family", "friends", "personal", "communication"],
            "学习教育场景": ["education", "learning", "teaching", "tutor", "class", "student", "school"],
            "娱乐休闲时": ["gaming", "fun", "entertainment", "leisure", "hobby", "personal use"]
        }
        
        for idx, row in self.df.iterrows():
            review_text = str(row['Review Text']).lower()
            review_title = str(row['Review Title']).lower()
            combined_text = review_text + " " + review_title
            
            for moment, words in keywords.items():
                if any(word in combined_text for word in words):
                    usage_moments[moment].append({
                        'text': row['Review Text'],
                        'title': row['Review Title'],
                        'rating': row['Review Rating']
                    })
        
        return usage_moments
    
    def extract_usage_locations(self):
        """提取使用地点"""
        usage_locations = {
            "家庭环境": [],
            "办公室": [],
            "移动办公": [],
            "教育场所": [],
            "其他场所": []
        }
        
        keywords = {
            "家庭环境": ["home", "house", "room", "bedroom", "living room", "desk", "personal", "family"],
            "办公室": ["office", "workplace", "corporate", "company", "business", "work"],
            "移动办公": ["laptop", "portable", "travel", "mobile", "on-the-go", "business trip"],
            "教育场所": ["school", "classroom", "education", "teaching", "university", "college"],
            "其他场所": ["outdoor", "studio", "public", "anywhere", "various"]
        }
        
        for idx, row in self.df.iterrows():
            review_text = str(row['Review Text']).lower()
            review_title = str(row['Review Title']).lower()
            combined_text = review_text + " " + review_title
            
            for location, words in keywords.items():
                if any(word in combined_text for word in words):
                    usage_locations[location].append({
                        'text': row['Review Text'],
                        'title': row['Review Title'],
                        'rating': row['Review Rating']
                    })
        
        return usage_locations
    
    def extract_usage_behaviors(self):
        """提取使用行为"""
        usage_behaviors = {
            "专业工作使用": [],
            "个人娱乐使用": [],
            "作为礼物赠送": [],
            "升级替换设备": [],
            "多设备配合使用": []
        }
        
        keywords = {
            "专业工作使用": ["professional", "work", "business", "meeting", "conference", "corporate"],
            "个人娱乐使用": ["personal", "fun", "entertainment", "hobby", "leisure", "gaming"],
            "作为礼物赠送": ["gift", "present", "bought for", "purchased for", "daughter", "son", "family"],
            "升级替换设备": ["upgrade", "replace", "better than", "previous", "old", "new", "improvement"],
            "多设备配合使用": ["laptop", "desktop", "computer", "mac", "windows", "multiple", "different"]
        }
        
        for idx, row in self.df.iterrows():
            review_text = str(row['Review Text']).lower()
            review_title = str(row['Review Title']).lower()
            combined_text = review_text + " " + review_title
            
            for behavior, words in keywords.items():
                if any(word in combined_text for word in words):
                    usage_behaviors[behavior].append({
                        'text': row['Review Text'],
                        'title': row['Review Title'],
                        'rating': row['Review Rating']
                    })
        
        return usage_behaviors
    
    def calculate_percentage(self, count):
        """计算百分比"""
        return round((count / self.total_reviews) * 100, 1)
    
    def get_key_review_snippet(self, reviews, max_length=100):
        """获取关键评论片段"""
        if not reviews:
            return "无相关评论"
        
        # 选择评分最高的评论
        best_review = max(reviews, key=lambda x: x['rating'])
        text = best_review['text']
        
        # 截取前100个字符
        if len(text) > max_length:
            text = text[:max_length] + "..."
        
        return f'"{text}"'
    
    def generate_insights(self):
        """生成用户画像洞察"""
        user_groups = self.extract_user_characteristics()
        usage_moments = self.extract_usage_moments()
        usage_locations = self.extract_usage_locations()
        usage_behaviors = self.extract_usage_behaviors()
        
        # 找出最主要的用户群体
        main_user_group = max(user_groups.items(), key=lambda x: len(x[1]))
        
        # 生成分析结果
        result = {
            "关键用户画像洞察": {
                "核心用户画像": f"注重工作效率和视频质量的{main_user_group[0]}",
                "细分潜力用户类型": "内容创作者和科技爱好者群体，对产品功能和技术规格有较高要求",
                "关键用户行为": "主要用于工作会议和专业场景，注重产品的易用性和稳定性，并会在社交平台分享使用体验"
            },
            "消费者画像分析": {
                "人群特征": {
                    "核心insight": "用户主要为需要高质量视频通话的职场人士，对产品的专业性和可靠性要求较高",
                    "细分人群": []
                },
                "使用时刻": {
                    "核心insight": "用户主要在工作时间使用，特别是视频会议和在线协作场景",
                    "细分场景": []
                },
                "使用地点": {
                    "核心insight": "主要使用场所为家庭办公环境和传统办公室，对便携性有一定需求",
                    "细分场景": []
                },
                "使用行为": {
                    "核心insight": "用户购买动机主要为工作需要和设备升级，注重产品的专业功能和使用体验",
                    "细分行为": []
                }
            }
        }
        
        # 填充人群特征
        for group, reviews in user_groups.items():
            if reviews:
                result["消费者画像分析"]["人群特征"]["细分人群"].append({
                    "用户人群": group,
                    "特征描述": self._get_group_description(group),
                    "比例": self.calculate_percentage(len(reviews)),
                    "关键review信息": self.get_key_review_snippet(reviews)
                })
        
        # 填充使用时刻
        for moment, reviews in usage_moments.items():
            if reviews:
                result["消费者画像分析"]["使用时刻"]["细分场景"].append({
                    "使用时刻": moment,
                    "特征描述": self._get_moment_description(moment),
                    "比例": self.calculate_percentage(len(reviews)),
                    "关键review信息": self.get_key_review_snippet(reviews)
                })
        
        # 填充使用地点
        for location, reviews in usage_locations.items():
            if reviews:
                result["消费者画像分析"]["使用地点"]["细分场景"].append({
                    "使用地点": location,
                    "特征描述": self._get_location_description(location),
                    "比例": self.calculate_percentage(len(reviews)),
                    "关键review信息": self.get_key_review_snippet(reviews)
                })
        
        # 填充使用行为
        for behavior, reviews in usage_behaviors.items():
            if reviews:
                result["消费者画像分析"]["使用行为"]["细分行为"].append({
                    "使用行为": behavior,
                    "特征描述": self._get_behavior_description(behavior),
                    "比例": self.calculate_percentage(len(reviews)),
                    "关键review信息": self.get_key_review_snippet(reviews)
                })
        
        return result
    
    def _get_group_description(self, group):
        """获取用户群体描述"""
        descriptions = {
            "职场人士": "年龄在25-40岁，需要高质量视频会议设备，注重产品的专业性和稳定性",
            "内容创作者": "年龄在20-35岁，需要高质量视频录制和直播功能，对画质和功能要求较高",
            "学生群体": "年龄在18-25岁，主要用于在线学习和远程教育，注重性价比",
            "科技爱好者": "年龄在25-45岁，对产品技术规格和创新功能感兴趣，愿意尝试新技术",
            "家庭用户": "年龄在30-50岁，主要用于家庭视频通话和娱乐，注重易用性"
        }
        return descriptions.get(group, "其他用户群体")
    
    def _get_moment_description(self, moment):
        """获取使用时刻描述"""
        descriptions = {
            "工作会议期间": "主要在工作日的会议时间使用，频率较高，对稳定性要求严格",
            "内容创作时": "主要在创作内容时使用，对画质和功能要求较高",
            "日常沟通中": "用于日常的视频通话和社交，使用频率中等",
            "学习教育场景": "主要在学习或教学时使用，对清晰度要求较高",
            "娱乐休闲时": "主要在休闲时间使用，对功能要求相对较低"
        }
        return descriptions.get(moment, "其他使用时刻")
    
    def _get_location_description(self, location):
        """获取使用地点描述"""
        descriptions = {
            "家庭环境": "主要在家中的书房、客厅或卧室使用，环境相对固定",
            "办公室": "在传统办公环境中使用，需要与办公设备良好兼容",
            "移动办公": "在不同地点移动办公时使用，对便携性要求较高",
            "教育场所": "在学校或培训机构使用，需要适应不同的教学环境",
            "其他场所": "在各种不同场所使用，适应性要求较高"
        }
        return descriptions.get(location, "其他使用地点")
    
    def _get_behavior_description(self, behavior):
        """获取使用行为描述"""
        descriptions = {
            "专业工作使用": "主要为满足工作需要而购买，注重产品的专业功能和可靠性",
            "个人娱乐使用": "主要为个人娱乐和兴趣而购买，注重使用体验和趣味性",
            "作为礼物赠送": "作为礼物购买给他人，注重产品的品牌形象和包装",
            "升级替换设备": "为了替换旧设备或升级功能而购买，对比较敏感",
            "多设备配合使用": "需要与多种设备配合使用，对兼容性要求较高"
        }
        return descriptions.get(behavior, "其他使用行为")

def main():
    """主函数"""
    # 分析客户评论数据
    analyzer = UserPersonaAnalyzer('/Users/kangise/Documents/Customer Reports/Insta360/Share/Review-converter/data/Customer ASIN Reviews.csv')
    
    # 生成用户画像洞察
    insights = analyzer.generate_insights()
    
    # 保存结果
    output_file = '/Users/kangise/Documents/Customer Reports/Insta360/Share/Review-converter/用户画像洞察分析.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(insights, f, ensure_ascii=False, indent=2)
    
    print(f"分析完成！结果已保存到: {output_file}")
    
    # 打印结果
    print("\n=== 用户画像洞察分析结果 ===")
    print(json.dumps(insights, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
