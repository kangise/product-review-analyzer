import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { moduleContents } from './moduleContents';

// 每个模块对应的AI说话方式的说明
const moduleScripts = {
  "Product Classification": {
    zh: `# 产品分类分析

你好！我正在为你分析产品的基本属性和市场定位。通过深度学习算法和自然语言处理技术，我会从数千条用户评论中提取关键信息，为你构建完整的产品画像。

## 你将看到什么信息

我会告诉你：
- **产品属于什么类别** - 比如是电子产品、家居用品还是其他类型。我会从用户的使用描述、功能提及、比较对象等多个维度来准确判断产品的核心类别，确保分类的精准性
- **具体的细分类型** - 在大类下的更精确分类。不仅仅是大的品类，还会细分到具体的子类别，比如智能家居中的安防设备、娱乐设备或者生活辅助设备
- **主要功能特点** - 这个产品的核心功能是什么。通过分析用户最常提及的功能点、使用场景和满意度反馈，识别出产品的核心价值主张
- **目标用户群体** - 主要是哪些人在使用这个产品。从评论者的语言风格、使用场景描述、需求表达等方面推断出主要的用户画像和人群特征

## 为什么这些信息很重要

产品分类是所有分析的基础。就像医生看病要先确诊一样，我需要先准确识别你的产品类型，才能：
- 找到合适的竞争对手进行对比 - 只有准确的分类才能确保我们比较的是真正的同类产品，避免苹果和橘子的无效对比
- 了解这个品类的用户特点 - 不同品类的用户有着截然不同的需求模式、购买习惯和使用行为
- 给出针对性的改进建议 - 基于准确的产品定位，我才能提供真正有价值的优化方向

## 这些信息如何帮助你

**如果你是产品经理**：可以确认产品定位是否准确，是否需要调整功能重点。通过用户的真实反馈了解产品在市场中的实际位置，发现定位偏差

**如果你是营销人员**：可以明确目标用户群体，选择合适的推广渠道和营销语言。了解用户如何描述和理解你的产品，优化营销信息的表达方式

**如果你是创业者**：可以了解你进入的是什么市场，竞争激烈程度如何。通过分类分析把握市场机会和挑战，制定更精准的商业策略

记住，准确的产品分类是后续所有洞察的基础！这就像建房子的地基，只有地基牢固，上面的分析才会有价值。`,
    en: `# Product Classification Analysis

Hello! I'm analyzing your product's fundamental attributes and market positioning. Using deep learning algorithms and natural language processing, I'll extract key insights from thousands of user reviews to build a comprehensive product profile.

## What You'll See

I will identify:
- **Product Category** - Whether it's electronics, home goods, or other types. I analyze user descriptions, feature mentions, and comparison objects across multiple dimensions to accurately determine the core category, ensuring classification precision
- **Specific Sub-categories** - Precise classification within the main category. Beyond broad categories, I'll identify specific subcategories like security devices, entertainment systems, or lifestyle assistants within smart home products
- **Core Functional Features** - What the product's main functions are. By analyzing the most frequently mentioned features, usage scenarios, and satisfaction feedback, I identify the core value proposition
- **Target User Groups** - Who primarily uses this product. From reviewers' language styles, usage scenario descriptions, and need expressions, I infer the main user personas and demographic characteristics

## Why This Information Matters

Product classification is the foundation of all analysis. Like a doctor needs accurate diagnosis, I must precisely identify your product type to:
- Find appropriate competitors for comparison - Only accurate classification ensures we're comparing truly similar products, avoiding apples-to-oranges comparisons
- Understand category user characteristics - Different categories have distinctly different need patterns, purchasing habits, and usage behaviors
- Provide targeted improvement suggestions - Based on accurate product positioning, I can offer truly valuable optimization directions

## How This Helps You

**If you're a Product Manager**: Confirm whether product positioning is accurate and if functional focus needs adjustment. Understand your product's actual market position through real user feedback and identify positioning gaps

**If you're a Marketing Professional**: Clarify target user groups and choose appropriate promotion channels and marketing language. Understand how users describe and perceive your product to optimize marketing messaging

**If you're an Entrepreneur**: Understand what market you're entering and the competitive intensity. Grasp market opportunities and challenges through classification analysis to develop more precise business strategies

Remember, accurate product classification is the foundation for all subsequent insights! It's like building a house - only with a solid foundation can the analysis above be valuable.`
  },
  ...moduleContents
};

interface StreamingJsonGeneratorProps {
  language?: 'en' | 'zh';
  currentStep?: string;
  analysisId?: string;
  isDarkMode?: boolean;
}

export function StreamingJsonGenerator({ language = 'en', currentStep, analysisId, isDarkMode = false }: StreamingJsonGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentContent, setCurrentContent] = useState('');
  const intervalRef = useRef<NodeJS.Timeout>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 根据模式设置样式
  const getStyles = () => {
    if (isDarkMode) {
      return {
        cardBg: '#2a2a2a',
        cardBorder: '#404040',
        containerBg: '#1a1a1a',
        textColor: '#f0f6fc',
        titleColor: '#58a6ff',
        subtitleColor: '#56d364',
        subheadColor: '#f2cc60',
        boldColor: '#ff7b72',
        bulletColor: '#58a6ff',
        placeholderColor: '#7d8590'
      };
    } else {
      return {
        cardBg: '#ffffff',
        cardBorder: '#e5e7eb',
        containerBg: '#fafafa',
        textColor: '#374151',
        titleColor: '#1e40af',
        subtitleColor: '#059669',
        subheadColor: '#d97706',
        boldColor: '#be185d',
        bulletColor: '#1e40af',
        placeholderColor: '#9ca3af'
      };
    }
  };

  const styles = getStyles();

  const startGeneration = () => {
    const moduleData = moduleScripts[currentStep as keyof typeof moduleScripts] || moduleScripts["Product Classification"];
    const script = typeof moduleData === 'string' ? moduleData : moduleData[language] || moduleData.zh;
    const totalLength = script.length;

    setIsGenerating(true);
    setCurrentContent('');
    
    let currentIndex = 0;
    intervalRef.current = setInterval(() => {
      if (currentIndex < totalLength) {
        const charsToAdd = Math.min(Math.floor(Math.random() * 4) + 1, totalLength - currentIndex);
        const newContent = script.slice(0, currentIndex + charsToAdd);
        setCurrentContent(newContent);
        currentIndex += charsToAdd;
      } else {
        setIsGenerating(false);
        clearInterval(intervalRef.current!);
      }
    }, 20 + Math.random() * 60);
  };

  useEffect(() => {
    if (currentContent && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [currentContent]);

  useEffect(() => {
    startGeneration();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStep, language]);

  return (
    <Card className="bg-muted/30" style={{ backgroundColor: styles.cardBg, border: `1px solid ${styles.cardBorder}` }}>
      <CardContent className="p-0">
        <div 
          ref={scrollContainerRef}
          className="h-96 overflow-y-auto overflow-x-hidden"
          style={{ 
            height: '384px',
            backgroundColor: 'transparent'
          }}
        >
          <div className="p-4">
            {currentContent ? (
              <div 
                className="whitespace-pre-wrap font-mono"
                style={{
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: styles.textColor
                }}
                dangerouslySetInnerHTML={{
                  __html: currentContent
                    .replace(/^# (.*$)/gm, `<div style="font-size: 13px; font-weight: bold; color: ${styles.titleColor}; margin: 16px 0 12px 0; border-left: 3px solid ${styles.titleColor}; padding-left: 12px; background: ${isDarkMode ? 'rgba(88, 166, 255, 0.1)' : 'rgba(30, 64, 175, 0.1)'}; padding: 8px 12px; border-radius: 4px;">$1</div>`)
                    .replace(/^## (.*$)/gm, `<div style="font-size: 13px; font-weight: 600; color: ${styles.subtitleColor}; margin: 12px 0 8px 0; padding: 4px 0;">$1</div>`)
                    .replace(/^### (.*$)/gm, `<div style="font-size: 13px; font-weight: 500; color: ${styles.subheadColor}; margin: 8px 0 6px 0;">$1</div>`)
                    .replace(/^\- (.*$)/gm, `<div style="font-size: 13px; color: ${styles.textColor}; margin: 4px 0; padding-left: 16px; position: relative;"><span style="position: absolute; left: 0; color: ${styles.bulletColor}; font-weight: bold;">•</span>$1</div>`)
                    .replace(/^\*\*(.*?)\*\*/gm, `<span style="font-size: 13px; font-weight: 600; color: ${styles.boldColor}; background: ${isDarkMode ? 'rgba(255, 123, 114, 0.1)' : 'rgba(190, 24, 93, 0.1)'}; padding: 2px 4px; border-radius: 3px;">$1</span>`)
                    .replace(/\n\n/g, '<div style="height: 12px;"></div>')
                    .replace(/^(?!<[ds])/gm, `<div style="font-size: 13px; color: ${styles.textColor}; margin: 6px 0; line-height: 1.6;">`)
                    .replace(/$/gm, '</div>')
                }}
              />
            ) : (
              <div className="text-center py-8" style={{ color: styles.placeholderColor }}>
                {language === 'en' 
                  ? 'Initializing analysis stream...'
                  : '正在初始化分析流...'
                }
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
