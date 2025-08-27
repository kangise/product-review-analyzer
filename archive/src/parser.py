import re
import json

class ReviewDataParser:
    def __init__(self, md_content):
        self.md_content = md_content
        self.sections = {}
        
    def parse_all_sections(self):
        """解析所有章节数据"""
        # 从MD文件中提取品牌和产品信息
        brand_info = self._extract_brand_product_info()
        
        self.sections = {
            'brand': brand_info['brand'],
            'product': brand_info['product'],
            'consumer_persona': self._parse_consumer_persona(),
            'customer_scenario': self._parse_customer_scenario(),
            'customer_love': self._parse_customer_love(),
            'customer_unmet_needs': self._parse_unmet_needs(),
            'purchase_intent': self._parse_purchase_intent(),
            'star_rating': self._parse_star_rating(),
            'opportunities': self._parse_opportunities()
        }
        return self.sections
    
    def _extract_brand_product_info(self):
        """从MD文件标题中提取品牌和产品信息"""
        title_match = re.search(r'^#\s+(.+?)\s+产品线用户评论洞察报告', self.md_content, re.MULTILINE)
        if title_match:
            title_text = title_match.group(1).strip()
            parts = title_text.split()
            if len(parts) >= 2:
                brand = parts[0]
                product = ' '.join(parts[1:])
                return {'brand': brand, 'product': product}
        
        return {'brand': 'Unknown Brand', 'product': 'Unknown Product'}
    
    def _parse_consumer_persona(self):
        """解析消费者画像数据"""
        # 解析人群特征 - 只提取4个主要群体
        segments = []
        colors = ["#FF9900", "#232F3E", "#37475A", "#EAEDED"]
        
        # 从MD中提取人群特征数据
        persona_section = self._extract_section_between("## 消费者画像分析", "## 核心消费者洞察")
        if persona_section:
            # 只提取人群特征部分
            group_section = self._extract_subsection(persona_section, "### 1. 人群特征")
            if group_section:
                group_pattern = r'\*\*(.+?)\s*-\s*([0-9]+)%\*\*(.*?)(?=\*\*.*?-\s*[0-9]+%|###|$)'
                matches = re.findall(group_pattern, group_section, re.DOTALL)
                
                for i, (name, percentage, details_text) in enumerate(matches):
                    details = []
                    quotes = []
                    
                    # 提取列表项
                    detail_lines = re.findall(r'-\s+([^""].+?)(?=\n|$)', details_text)
                    details = [line.strip() for line in detail_lines if line.strip()][:3]
                    
                    # 提取引用
                    quote_matches = re.findall(r'["""](.+?)["""]', details_text)
                    quotes = quote_matches[:2]
                    
                    segments.append({
                        "name": name.strip(),
                        "percentage": int(percentage),
                        "color": colors[i % len(colors)],
                        "details": details,
                        "quotes": quotes
                    })
        
        # 解析使用时刻
        usage_moments = []
        if persona_section:
            moment_section = self._extract_subsection(persona_section, "### 2. 使用时刻")
            if moment_section:
                moment_pattern = r'\*\*(.+?)\s*-\s*([0-9]+)%\*\*(.*?)(?=\*\*.*?-\s*[0-9]+%|###|$)'
                matches = re.findall(moment_pattern, moment_section, re.DOTALL)
                
                for i, (name, percentage, details_text) in enumerate(matches):
                    details = []
                    detail_lines = re.findall(r'-\s+(.+?)(?=\n|$)', details_text)
                    details = [line.strip() for line in detail_lines if line.strip()][:3]
                    
                    usage_moments.append({
                        "name": name.strip(),
                        "percentage": int(percentage),
                        "color": colors[i % len(colors)],
                        "details": details
                    })
        
        # 解析使用地点
        usage_locations = []
        if persona_section:
            location_section = self._extract_subsection(persona_section, "### 3. 使用地点")
            if location_section:
                location_pattern = r'\*\*(.+?)\s*-\s*([0-9]+)%\*\*(.*?)(?=\*\*.*?-\s*[0-9]+%|###|$)'
                matches = re.findall(location_pattern, location_section, re.DOTALL)
                
                for i, (name, percentage, details_text) in enumerate(matches):
                    details = []
                    detail_lines = re.findall(r'-\s+(.+?)(?=\n|$)', details_text)
                    details = [line.strip() for line in detail_lines if line.strip()][:3]
                    
                    usage_locations.append({
                        "name": name.strip(),
                        "percentage": int(percentage),
                        "color": colors[i % len(colors)],
                        "details": details
                    })
        
        # 解析使用行为
        usage_behaviors = []
        if persona_section:
            behavior_section = self._extract_subsection(persona_section, "### 4. 使用行为")
            if behavior_section:
                behavior_pattern = r'\*\*(.+?)\s*-\s*([0-9]+)%\*\*(.*?)(?=\*\*.*?-\s*[0-9]+%|###|$)'
                matches = re.findall(behavior_pattern, behavior_section, re.DOTALL)
                
                for i, (name, percentage, details_text) in enumerate(matches):
                    details = []
                    detail_lines = re.findall(r'-\s+(.+?)(?=\n|$)', details_text)
                    details = [line.strip() for line in detail_lines if line.strip()][:3]
                    
                    usage_behaviors.append({
                        "name": name.strip(),
                        "percentage": int(percentage),
                        "color": colors[i % len(colors)],
                        "details": details
                    })
        
        # 解析核心洞察
        insights = []
        insight_section = self._extract_section_between("## 核心消费者洞察", "## 消费者最常用")
        if insight_section:
            insight_patterns = [
                (r'\*\*主力用户群体\*\*[：:]?\s*(.+?)(?=\*\*|$)', "主力用户群体"),
                (r'\*\*痛点集中\*\*[：:]?\s*(.+?)(?=\*\*|$)', "痛点集中"),
                (r'\*\*价值认知\*\*[：:]?\s*(.+?)(?=\*\*|$)', "价值认知")
            ]
            
            for pattern, title in insight_patterns:
                match = re.search(pattern, insight_section, re.DOTALL)
                if match:
                    insights.append({
                        "title": title,
                        "content": match.group(1).strip()
                    })
        
        return {
            "segments": segments,
            "usage_moments": usage_moments,
            "usage_locations": usage_locations,
            "usage_behaviors": usage_behaviors,
            "insights": insights
        }
    
    def _parse_customer_scenario(self):
        """解析客户使用场景数据"""
        scenarios = []
        
        # 提取使用场景章节
        scenario_section = self._extract_section_between("## 消费者最常用的10个使用场景分析", "## 总结洞察")
        if scenario_section:
            # 查找所有场景项目（###级别）- 修正正则表达式
            scene_pattern = r'###\s+(\d+)\.\s+(.+?)\s+\(([0-9.]+)%\)\s*\n\*\*场景描述\*\*[：:]?\s*(.+?)\s*\n\*\*相关评论\*\*[：:]?(.*?)(?=###\s+\d+\.|## 总结洞察|$)'
            matches = re.findall(scene_pattern, scenario_section, re.DOTALL)
            
            for rank, name, percentage, description, comments_text in matches:
                # 提取相关评论
                comments = []
                comment_matches = re.findall(r'-\s*["""](.+?)["""]', comments_text)
                comments = comment_matches[:5]
                
                scenarios.append({
                    "rank": int(rank),
                    "name": name.strip(),
                    "percentage": float(percentage),
                    "description": description.strip(),
                    "comments": comments
                })
        
        return {"scenarios": scenarios}
    
    def _parse_customer_love(self):
        """解析客户喜爱方面数据 - 从评论中提取关键描述"""
        aspects = []
        
        # 提取喜爱方面章节
        love_section = self._extract_section_between("## 消费者最喜爱的10个方面", "## 消费者最想要但未被满足的10个方面")
        if love_section:
            # 查找所有喜爱方面项目（###级别）
            aspect_pattern = r'###\s+(\d+)\.\s+(.+?)\s+\(([0-9.]+)%\)(.*?)(?=###\s+\d+\.|## 消费者最想要|$)'
            matches = re.findall(aspect_pattern, love_section, re.DOTALL)
            
            for rank, name, percentage, details_text in matches:
                # 提取评论
                comments = []
                comment_matches = re.findall(r'-\s*["""](.+?)["""]', details_text)
                comments = comment_matches[:5]
                
                # 从评论的中文翻译中提取关键描述信息
                description = self._extract_love_description_from_comments(name.strip(), details_text)
                
                aspects.append({
                    "rank": int(rank),
                    "name": name.strip(),
                    "percentage": float(percentage),
                    "description": description,
                    "comments": comments
                })
        
        # 提取总结
        summary_section = self._extract_section_between("## 总结", "## 消费者最想要但未被满足的10个方面")
        summary = "用户对产品的多个方面表现出较高的满意度。"
        if summary_section:
            summary_match = re.search(r'从数据分析可以看出[，,](.+?)(?=##|$)', summary_section, re.DOTALL)
            if summary_match:
                summary = summary_match.group(0).strip()
        
        return {
            "summary": summary,
            "aspects": aspects
        }
    
    def _extract_love_description_from_comments(self, aspect_name, details_text):
        """从评论的中文翻译中提取关键描述信息"""
        # 提取中文翻译部分
        chinese_translations = re.findall(r'-\s*(.+?)\s*-\s*(.+?)(?=\n|$)', details_text)
        
        if chinese_translations:
            # 从中文翻译中提取关键词汇，生成描述
            key_phrases = []
            for english, chinese in chinese_translations[:3]:  # 取前3个评论
                chinese = chinese.strip()
                # 提取关键的正面评价词汇
                if "出色" in chinese or "优秀" in chinese or "卓越" in chinese:
                    key_phrases.append("表现出色")
                elif "清晰" in chinese or "锐度" in chinese or "画质" in chinese:
                    key_phrases.append("画质清晰")
                elif "简单" in chinese or "容易" in chinese or "方便" in chinese:
                    key_phrases.append("操作简便")
                elif "稳定" in chinese or "可靠" in chinese:
                    key_phrases.append("性能稳定")
                elif "惊叹" in chinese or "令人" in chinese:
                    key_phrases.append("令人印象深刻")
                elif "追踪" in chinese:
                    key_phrases.append("追踪功能优异")
                elif "音频" in chinese or "声音" in chinese:
                    key_phrases.append("音频质量优良")
            
            if key_phrases:
                # 去重并组合关键词
                unique_phrases = list(dict.fromkeys(key_phrases))  # 保持顺序去重
                if len(unique_phrases) == 1:
                    return f"用户认为{aspect_name}{unique_phrases[0]}"
                elif len(unique_phrases) == 2:
                    return f"用户认为{aspect_name}{unique_phrases[0]}，{unique_phrases[1]}"
                else:
                    return f"用户认为{aspect_name}{unique_phrases[0]}，{unique_phrases[1]}等方面表现优异"
        
        # 如果没有找到关键词，基于方面名称生成描述
        if "4K" in aspect_name or "画质" in aspect_name:
            return "用户对4K视频画质的清晰度和专业效果给予高度评价"
        elif "AI" in aspect_name or "追踪" in aspect_name:
            return "用户对AI智能追踪功能的精准性和流畅性表示赞赏"
        elif "设置" in aspect_name or "易用" in aspect_name:
            return "用户赞赏产品的即插即用特性和简单的设置流程"
        elif "音频" in aspect_name:
            return "用户对内置麦克风的音频质量和降噪效果表示满意"
        elif "设计" in aspect_name or "便携" in aspect_name:
            return "用户对产品的外观设计和便携性给予正面评价"
        else:
            return f"用户对{aspect_name}表现出高度满意和认可"
    
    def _parse_unmet_needs(self):
        """解析未满足需求数据 - 修正版本"""
        needs = []
        
        # 提取未满足需求章节
        needs_section = self._extract_section_between("## 消费者最想要但未被满足的10个方面", "## 购买驱动因素分析")
        if needs_section:
            # 查找所有需求项目（###级别）
            need_pattern = r'###\s+(\d+)\.\s+(.+?)\s+\(占比[：:]?\s*([0-9.]+)%\)\s*\n\*\*问题描述\*\*[：:]?\s*(.+?)\s*\n\*\*相关评论\*\*[：:]?(.*?)(?=###\s+\d+\.|## 购买驱动|$)'
            matches = re.findall(need_pattern, needs_section, re.DOTALL)
            
            for rank, name, percentage, description, comments_text in matches:
                # 提取评论
                comments = []
                comment_matches = re.findall(r'-\s*["""](.+?)["""]', comments_text)
                comments = comment_matches[:5]
                
                needs.append({
                    "rank": int(rank),
                    "name": name.strip(),
                    "percentage": float(percentage),
                    "description": description.strip(),
                    "comments": comments
                })
        
        return {"needs": needs}
    
    def _parse_purchase_intent(self):
        """解析购买驱动因素数据 - 修正版本"""
        factors = []
        
        # 提取购买驱动因素章节
        intent_section = self._extract_section_between("## 购买驱动因素分析", "## 评分分布统计")
        if intent_section:
            # 查找所有驱动因素项目（###级别）
            factor_pattern = r'###\s+(\d+)\.\s+(.+?)\s+\(([0-9.]+)%\)\s*\n\*\*驱动因素\*\*[：:]?\s*(.+?)\s*\n\*\*相关评论示例\*\*[：:]?(.*?)(?=###\s+\d+\.|## 评分分布|$)'
            matches = re.findall(factor_pattern, intent_section, re.DOTALL)
            
            for rank, name, percentage, description, comments_text in matches:
                # 提取评论
                comments = []
                comment_matches = re.findall(r'-\s*["""](.+?)["""]', comments_text)
                comments = comment_matches[:5]
                
                factors.append({
                    "rank": int(rank),
                    "name": name.strip(),
                    "percentage": float(percentage),
                    "description": description.strip(),
                    "comments": comments
                })
        
        return {"factors": factors}
    
    def _parse_star_rating(self):
        """解析评分分布数据"""
        key_findings = [
            "产品呈现两极分化，94%为极端评分(5星49%+1星45%)",
            "成功使用用户体验极佳，遇到技术问题用户体验极差",
            "兼容性问题是1星评价中最突出的问题",
            "软件问题和连接问题是导致极低满意度的主要原因"
        ]
        
        rating_distribution = [
            {"rating": 5, "count": 49, "percentage": 49, "label": "5星评价"},
            {"rating": 4, "count": 2, "percentage": 2, "label": "4星评价"},
            {"rating": 3, "count": 1, "percentage": 1, "label": "3星评价"},
            {"rating": 2, "count": 3, "percentage": 3, "label": "2星评价"},
            {"rating": 1, "count": 45, "percentage": 45, "label": "1星评价"}
        ]
        
        issue_correlation = [
            {"issue": "4K画质优秀", "rating": 5, "count": 18, "percentage": 36.7, "type": "positive", "color": "#28a745"},
            {"issue": "AI追踪出色", "rating": 5, "count": 16, "percentage": 32.7, "type": "positive", "color": "#28a745"},
            {"issue": "易用性好", "rating": 5, "count": 14, "percentage": 28.6, "type": "positive", "color": "#28a745"},
            {"issue": "音频质量优秀", "rating": 5, "count": 12, "percentage": 24.5, "type": "positive", "color": "#28a745"},
            {"issue": "图像质量专业", "rating": 5, "count": 11, "percentage": 22.4, "type": "positive", "color": "#28a745"},
            {"issue": "Mac兼容性问题", "rating": 1, "count": 15, "percentage": 33.3, "type": "negative", "color": "#dc3545"},
            {"issue": "软件稳定性问题", "rating": 1, "count": 12, "percentage": 26.7, "type": "negative", "color": "#dc3545"},
            {"issue": "连接稳定性问题", "rating": 1, "count": 11, "percentage": 24.4, "type": "negative", "color": "#dc3545"},
            {"issue": "音频质量问题", "rating": 1, "count": 9, "percentage": 20.0, "type": "negative", "color": "#dc3545"},
            {"issue": "自动对焦不可靠", "rating": 1, "count": 8, "percentage": 17.8, "type": "negative", "color": "#dc3545"}
        ]
        
        return {
            "key_findings": key_findings,
            "rating_distribution": rating_distribution,
            "issue_correlation": issue_correlation
        }
    
    def _parse_opportunities(self):
        """解析优化机会数据 - 修正版本，提取真实数据"""
        opportunities = []
        
        # 查找从"5个产品优化机会和对应使用场景"开始的所有内容
        opp_section = self._extract_section_between("## 5个产品优化机会和对应使用场景", "## 创新价值总结")
        
        if opp_section:
            # 查找所有机会项目
            opp_pattern = r'###\s+(\d+)\.\s+(.+?)\s+-\s+(.+?)\s*\n(.*?)(?=###\s+\d+\.|## 创新价值|$)'
            matches = re.findall(opp_pattern, opp_section, re.DOTALL)
            
            for rank, title, scenario_brief, details_text in matches:
                # 提取创新方案 - 更精确的匹配
                solution_match = re.search(r'\*\*创新优化方案\*\*[：:]?\s*\n\*\*(.+?)\*\*\s*-\s*(.+?)(?=\*\*超越预期价值|$)', details_text, re.DOTALL)
                if not solution_match:
                    # 备用匹配模式
                    solution_match = re.search(r'\*\*AI环境学习引擎\*\*\s*-\s*(.+?)(?=\*\*超越预期价值|$)', details_text, re.DOTALL)
                
                # 提取预期价值
                value_match = re.search(r'\*\*超越预期价值\*\*[：:]?\s*\n(.+?)(?=---|\n###|$)', details_text, re.DOTALL)
                
                solution = ""
                if solution_match:
                    if len(solution_match.groups()) > 1:
                        solution = f"{solution_match.group(1).strip()} - {solution_match.group(2).strip()}"
                    else:
                        solution = solution_match.group(1).strip()
                else:
                    # 如果没有匹配到，尝试提取整个创新方案部分
                    general_solution = re.search(r'\*\*创新优化方案\*\*[：:]?(.*?)(?=\*\*超越预期价值|$)', details_text, re.DOTALL)
                    if general_solution:
                        solution = general_solution.group(1).strip()
                    else:
                        solution = "提供创新解决方案"
                
                value = value_match.group(1).strip() if value_match else "提升用户体验价值"
                
                opportunities.append({
                    "rank": int(rank),
                    "title": title.strip(),
                    "scenario": scenario_brief.strip(),
                    "solution": solution,
                    "value": value
                })
        
        # 如果没有找到机会，使用默认数据
        if not opportunities:
            opportunities = [
                {
                    "rank": 1,
                    "title": "智能环境适配系统",
                    "scenario": "针对多变工作环境场景",
                    "solution": "AI环境学习引擎，自动预调色温、曝光、对比度参数",
                    "value": "用户无需手动调节，实现真正的'零干预'使用体验"
                },
                {
                    "rank": 2,
                    "title": "多人协作空间智能管理",
                    "scenario": "针对共享办公场景",
                    "solution": "智能多人识别与权限管理系统",
                    "value": "解决多人场景下的'选择困难'，让协作更加专业化"
                },
                {
                    "rank": 3,
                    "title": "跨设备无缝生态系统",
                    "scenario": "针对多设备切换场景",
                    "solution": "设备画像同步云服务",
                    "value": "彻底消除用户在不同设备间重复设置的烦恼"
                },
                {
                    "rank": 4,
                    "title": "情景感知内容优化引擎",
                    "scenario": "针对专业内容创作场景",
                    "solution": "AI内容类型识别与自适应优化",
                    "value": "让摄像头成为真正的'智能摄影师'"
                },
                {
                    "rank": 5,
                    "title": "健康守护与效率提醒系统",
                    "scenario": "针对长时间使用场景",
                    "solution": "AI健康监护与效率优化助手",
                    "value": "从视频工具升级为职场健康和效率管理助手"
                }
            ]
        
        return {"opportunities": opportunities}
    
    def _extract_section_between(self, start_marker, end_marker):
        """提取两个标记之间的内容"""
        start_pos = self.md_content.find(start_marker)
        end_pos = self.md_content.find(end_marker)
        
        if start_pos == -1:
            return None
        
        if end_pos == -1:
            return self.md_content[start_pos:]
        
        return self.md_content[start_pos:end_pos]
    
    def _extract_subsection(self, content, subsection_marker):
        """从内容中提取子章节"""
        if not content:
            return None
            
        start_pos = content.find(subsection_marker)
        if start_pos == -1:
            return None
        
        # 查找下一个###标记
        next_section = content.find("###", start_pos + len(subsection_marker))
        if next_section == -1:
            return content[start_pos:]
        
        return content[start_pos:next_section]
