import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// 每个模块对应的AI说话方式的说明
const moduleScripts = {
  "Product Classification": `# 产品分类分析

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

  "Consumer Profile Analysis": `# 消费者画像分析

我正在分析谁在买你的产品，以及他们的特征。

## 你将看到什么信息

我会从评论中提取出：
- **用户的大致年龄段** - 通过语言风格和提及的使用场景推断
- **职业背景** - 从他们描述的使用环境判断
- **技术水平** - 看他们对产品功能的理解程度
- **消费习惯** - 他们关注价格还是更看重功能

## 为什么要分析用户画像

了解用户是谁，就能知道：
- 他们真正在意什么
- 用什么方式和他们沟通最有效
- 还有哪些类似的人群可以开发

这就像开店要知道顾客是谁一样重要。

## 这些信息如何帮助你

**精准营销**：知道用户特征后，你就知道在哪里找到更多这样的客户

**产品优化**：了解用户的技术水平，就能决定产品功能要做得多复杂

**定价策略**：知道用户的消费能力，就能制定合适的价格

**客户服务**：了解用户背景，就能提供更贴心的服务

用户画像越清晰，你的决策就越精准！`,

  "Consumer Scenario Analysis": `# 消费场景分析

我在分析用户在什么情况下使用你的产品。

## 你将看到什么信息

我会识别出：
- **主要使用场景** - 用户最常在什么情况下使用产品
- **使用频率** - 每个场景下的使用频繁程度
- **满意度表现** - 在不同场景下用户的满意程度
- **具体需求** - 每个场景下用户最关心什么

## 为什么场景分析很重要

同一个产品在不同场景下，用户的需求完全不同。比如：
- 在家使用 vs 在办公室使用
- 个人使用 vs 多人使用
- 日常使用 vs 特殊场合使用

了解这些差异，你就能针对性地优化产品。

## 这些信息如何帮助你

**功能优先级**：知道哪个场景最重要，就知道先优化哪些功能

**营销内容**：可以制作针对不同场景的宣传材料

**产品设计**：可以为高频场景设计专门的功能模式

**市场拓展**：发现新的使用场景，就找到了新的市场机会

场景越清楚，产品就越好用！`,

  "Consumer Motivation Analysis": `# 购买动机分析

我在分析用户为什么要买你的产品。

## 你将看到什么信息

我会发现：
- **功能性需求** - 用户希望产品解决什么实际问题
- **情感性需求** - 产品给用户带来什么感受（比如专业感、安全感）
- **社交性需求** - 产品如何影响用户的社交形象
- **触发因素** - 什么事情让用户决定要买这个产品

## 为什么要分析购买动机

人们买东西不只是因为功能，更多时候是因为感受。了解真正的购买动机，你就能：
- 找到产品的真正价值点
- 设计打动人心的营销信息
- 预测用户的购买行为

## 这些信息如何帮助你

**产品定位**：知道用户真正想要什么，就能突出最重要的卖点

**营销策略**：了解用户的情感需求，就能写出打动人的文案

**销售话术**：知道用户的顾虑和期待，就能更好地说服客户

**产品开发**：理解深层需求，就能开发出用户真正想要的功能

动机比功能更重要，因为动机决定购买！`
};

interface StreamingJsonGeneratorProps {
  language?: 'en' | 'zh';
  currentStep?: string;
  analysisId?: string;
}

export function StreamingJsonGenerator({ language = 'en', currentStep, analysisId }: StreamingJsonGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentContent, setCurrentContent] = useState('');
  const intervalRef = useRef<NodeJS.Timeout>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const startGeneration = () => {
    const script = moduleScripts[currentStep as keyof typeof moduleScripts] || moduleScripts["Product Classification"];
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
    }, 20 + Math.random() * 60); // 慢20%：20-80ms (原来17-53ms)
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
  }, [currentStep]);

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {language === 'en' ? 'AI Analysis Stream' : 'AI 分析流式输出'}
            <Badge variant={isGenerating ? "default" : "secondary"}>
              {isGenerating 
                ? (language === 'en' ? 'Generating' : '生成中')
                : (language === 'en' ? 'Complete' : '完成')
              }
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="bg-muted/30" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
            <CardContent className="p-0">
              <div 
                ref={scrollContainerRef}
                className="h-96 overflow-y-auto overflow-x-hidden"
                style={{ 
                  height: '384px',
                  backgroundColor: '#0d1117'
                }}
              >
                <div className="p-4">
                  {currentContent ? (
                    <div 
                      className="whitespace-pre-wrap font-mono"
                      style={{
                        fontSize: '13px',
                        lineHeight: '1.6',
                        color: '#f0f6fc'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: currentContent
                          .replace(/^# (.*$)/gm, '<div style="font-size: 13px; font-weight: bold; color: #58a6ff; margin: 16px 0 12px 0; border-left: 3px solid #58a6ff; padding-left: 12px; background: rgba(88, 166, 255, 0.1); padding: 8px 12px; border-radius: 4px;">$1</div>')
                          .replace(/^## (.*$)/gm, '<div style="font-size: 13px; font-weight: 600; color: #56d364; margin: 12px 0 8px 0; padding: 4px 0;">$1</div>')
                          .replace(/^### (.*$)/gm, '<div style="font-size: 13px; font-weight: 500; color: #f2cc60; margin: 8px 0 6px 0;">$1</div>')
                          .replace(/^\- (.*$)/gm, '<div style="font-size: 13px; color: #e6edf3; margin: 4px 0; padding-left: 16px; position: relative;"><span style="position: absolute; left: 0; color: #58a6ff; font-weight: bold;">•</span>$1</div>')
                          .replace(/^\*\*(.*?)\*\*/gm, '<span style="font-size: 13px; font-weight: 600; color: #ff7b72; background: rgba(255, 123, 114, 0.1); padding: 2px 4px; border-radius: 3px;">$1</span>')
                          .replace(/\n\n/g, '<div style="height: 12px;"></div>')
                          .replace(/^(?!<[ds])/gm, '<div style="font-size: 13px; color: #e6edf3; margin: 6px 0; line-height: 1.6;">')
                          .replace(/$/gm, '</div>')
                      }}
                    />
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
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
        </CardContent>
      </Card>
    </div>
  );
}
