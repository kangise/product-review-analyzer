import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { JsonHighlight } from './JsonHighlight';

// 模拟分析结果的JSON数据结构
const sampleAnalysisJson = {
  "产品分类": {
    "主要类别": "智能摄像头",
    "细分类别": "4K网络摄像头",
    "技术特征": ["AI追踪", "4K分辨率", "低光增强"],
    "目标市场": "专业视频会议和内容创作"
  },
  "用户画像分析": {
    "核心用户群体": {
      "职业": "远程工作者、内容创作者、教育工作者",
      "年龄段": "25-45岁",
      "技术水平": "中高级用户",
      "购买动机": "提升视频质量和专业形象"
    },
    "使用场景": [
      {
        "场景": "远程会议",
        "频率": "85%",
        "满意度": "4.6/5"
      },
      {
        "场景": "内容创作",
        "频率": "65%", 
        "满意度": "4.8/5"
      },
      {
        "场景": "在线教育",
        "频率": "45%",
        "满意度": "4.7/5"
      }
    ]
  },
  "客户满意度分析": {
    "整体评分": "4.5/5",
    "核心优势": [
      {
        "功能": "4K视频质量",
        "满意度": "92%",
        "提及频率": "高"
      },
      {
        "功能": "AI人脸追踪",
        "满意度": "89%",
        "提及频率": "高"
      },
      {
        "功能": "低光性能",
        "满意度": "87%",
        "提及频率": "中"
      }
    ],
    "改进机会": [
      {
        "问题": "软件兼容性",
        "影响用户": "15%",
        "严重程度": "中等"
      },
      {
        "问题": "价格敏感度",
        "影响用户": "23%",
        "严重程度": "低"
      }
    ]
  },
  "竞争分析": {
    "市场地位": "领先",
    "核心竞争优势": ["AI技术", "图像质量", "易用性"],
    "竞争劣势": ["价格较高", "软件生态"],
    "市场机会": "教育市场扩展、企业级功能增强"
  },
  "商业机会洞察": {
    "产品改进机会": [
      {
        "机会": "软件兼容性优化",
        "优先级": "高",
        "预期影响": "提升15%用户满意度"
      },
      {
        "机会": "企业级管理功能",
        "优先级": "中",
        "预期影响": "开拓B2B市场"
      }
    ],
    "创新机会": [
      {
        "方向": "AI背景替换",
        "市场需求": "高",
        "技术可行性": "中"
      },
      {
        "方向": "多设备协同",
        "市场需求": "中",
        "技术可行性": "高"
      }
    ],
    "营销定位机会": [
      {
        "定位": "专业创作者首选",
        "目标群体": "内容创作者",
        "差异化优势": "AI追踪技术"
      }
    ]
  },
  "分析元数据": {
    "分析时间": "2025-08-31T07:30:00Z",
    "数据来源": "客户评论分析",
    "样本数量": 1247,
    "置信度": "95%",
    "AI模型": "Amazon Q Developer"
  }
};

interface StreamingJsonGeneratorProps {
  language?: 'en' | 'zh';
}

export function StreamingJsonGenerator({ language = 'en' }: StreamingJsonGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentJson, setCurrentJson] = useState('');
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const jsonString = JSON.stringify(sampleAnalysisJson, null, 2);
  const totalLength = jsonString.length;

  const startGeneration = () => {
    setIsGenerating(true);
    setCurrentJson('');
    setProgress(0);
    
    let currentIndex = 0;
    intervalRef.current = setInterval(() => {
      if (currentIndex < totalLength) {
        // 每次添加1-3个字符，模拟不规律的流式输出
        const charsToAdd = Math.min(Math.floor(Math.random() * 3) + 1, totalLength - currentIndex);
        const newContent = jsonString.slice(0, currentIndex + charsToAdd);
        setCurrentJson(newContent);
        setProgress(Math.round((currentIndex + charsToAdd) / totalLength * 100));
        currentIndex += charsToAdd;
      } else {
        setIsGenerating(false);
        clearInterval(intervalRef.current!);
      }
    }, 25 + Math.random() * 50); // 随机延迟25-75ms (原来是50-150ms)
  };

  // 监听内容变化，自动滚动到底部
  useEffect(() => {
    if (currentJson && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [currentJson]);

  // 组件挂载时自动开始生成
  useEffect(() => {
    startGeneration();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
          <Card className="bg-muted/30">
            <CardContent className="p-0">
              <div 
                ref={scrollContainerRef}
                className="h-96 overflow-y-auto overflow-x-hidden"
                style={{ height: '384px' }}
              >
                <div className="p-4 font-mono">
                  {currentJson ? (
                    <JsonHighlight json={currentJson} />
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      {language === 'en' 
                        ? 'Initializing AI streaming output...'
                        : '正在初始化AI流式输出...'
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
