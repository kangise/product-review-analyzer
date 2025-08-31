import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { JsonHighlight } from './JsonHighlight';

// 模拟AI生成的JSON数据结构
const sampleJsonStructure = {
  "user_profile": {
    "id": 12345,
    "username": "ai_user_2024",
    "email": "user@example.com",
    "created_at": "2024-08-29T10:30:00Z",
    "preferences": {
      "theme": "dark",
      "language": "zh-CN",
      "notifications": {
        "email": true,
        "push": false,
        "sms": true
      }
    },
    "statistics": {
      "login_count": 42,
      "last_active": "2024-08-29T08:15:00Z",
      "total_time_spent": 15670
    }
  },
  "generated_content": [
    {
      "type": "article",
      "title": "AI技术的发展趋势",
      "content": "人工智能技术在近年来取得了显著进展...",
      "tags": ["AI", "技术", "未来"],
      "word_count": 1250,
      "created_at": "2024-08-29T09:45:00Z"
    },
    {
      "type": "summary",
      "title": "市场分析报告",
      "content": "根据最新的市场数据显示...",
      "tags": ["市场", "分析", "报告"],
      "word_count": 800,
      "created_at": "2024-08-29T10:20:00Z"
    }
  ],
  "metadata": {
    "generation_id": "gen_789xyz",
    "model_version": "gpt-4o-2024",
    "processing_time_ms": 2340,
    "token_count": {
      "input": 150,
      "output": 890
    }
  }
};

export function StreamingJsonGenerator() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentJson, setCurrentJson] = useState('');
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const jsonString = JSON.stringify(sampleJsonStructure, null, 2);
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
    }, 50 + Math.random() * 100); // 随机延迟50-150ms
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            AI JSON 流式生成器
            <Badge variant={isGenerating ? "default" : "secondary"}>
              {isGenerating ? "生成中" : "完成"}
            </Badge>
          </CardTitle>
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>生成进度</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Card className="bg-muted/30">
            <CardContent className="p-0">
              <div 
                ref={scrollContainerRef}
                className="h-96 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
              >
                <div className="p-4 font-mono">
                  {currentJson ? (
                    <JsonHighlight json={currentJson} />
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      正在初始化AI流式输出...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>功能说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>流式输出：</strong>模拟AI实时生成JSON数据的过程</p>
          <p>• <strong>语法高亮：</strong>自动为JSON内容添加颜色标识</p>
          <p>• <strong>进度显示：</strong>实时显示生成进度百分比</p>
          <p>• <strong>自动滚动：</strong>内容生成时自动滚动到最新位置</p>
        </CardContent>
      </Card>
    </div>
  );
}