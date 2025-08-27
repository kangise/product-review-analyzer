import React from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, TrendingUp, Users, Target, Star, BarChart3,
  ArrowRight, CheckCircle, Clock, FileText, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

interface DashboardProps {
  language: 'en' | 'zh';
  onPageChange: (page: string) => void;
  recentAnalyses?: any[];
}

const translations = {
  en: {
    title: "Amazon Review Intelligence Dashboard",
    subtitle: "Transform customer reviews into strategic business insights",
    startAnalysis: "Start New Analysis",
    viewFeatures: "View All Features",
    quickStats: "Quick Statistics",
    recentAnalyses: "Recent Analyses",
    coreFeatures: "Core Analysis Features",
    readyToStart: "Ready to Start Analyzing?",
    readyDescription: "Upload your Amazon review data to get deep user insights and market opportunity analysis",
    noRecentAnalyses: "No recent analyses found",
    startFirstAnalysis: "Start your first analysis",
    features: {
      userInsights: {
        title: "User Insights Analysis",
        description: "Deep consumer profiling, scenarios, and motivations"
      },
      userFeedback: {
        title: "User Feedback Analysis", 
        description: "What customers love and rating root cause analysis"
      },
      unmetNeeds: {
        title: "Unmet Needs Discovery",
        description: "Identify gaps and improvement opportunities"
      },
      opportunities: {
        title: "3D Opportunity Mining",
        description: "Product improvement, innovation, and marketing positioning"
      },
      competitive: {
        title: "Competitive Intelligence",
        description: "Benchmark against competitors and market positioning"
      }
    },
    stats: {
      totalAnalyses: "Total Analyses",
      reviewsProcessed: "Reviews Processed", 
      insightsGenerated: "Insights Generated",
      avgProcessingTime: "Avg Processing Time"
    }
  },
  zh: {
    title: "亚马逊评论智能分析仪表板",
    subtitle: "将客户评论转化为战略商业洞察",
    startAnalysis: "开始新分析",
    viewFeatures: "查看所有功能",
    quickStats: "快速统计",
    recentAnalyses: "最近分析",
    coreFeatures: "核心分析功能",
    readyToStart: "准备开始分析？",
    readyDescription: "上传您的亚马逊评论数据，获得深度用户洞察和市场机会分析",
    noRecentAnalyses: "未找到最近的分析",
    startFirstAnalysis: "开始您的第一次分析",
    features: {
      userInsights: {
        title: "用户洞察分析",
        description: "深度消费者画像、场景和动机分析"
      },
      userFeedback: {
        title: "用户反馈分析",
        description: "用户喜爱点和评分根因分析"
      },
      unmetNeeds: {
        title: "未满足需求发现",
        description: "识别差距和改进机会"
      },
      opportunities: {
        title: "三维机会挖掘",
        description: "产品改进、创新和营销定位"
      },
      competitive: {
        title: "竞争情报",
        description: "竞争对手基准测试和市场定位"
      }
    },
    stats: {
      totalAnalyses: "总分析数",
      reviewsProcessed: "已处理评论",
      insightsGenerated: "生成洞察",
      avgProcessingTime: "平均处理时间"
    }
  }
};

export const Dashboard: React.FC<DashboardProps> = ({
  language,
  onPageChange,
  recentAnalyses = [],
}) => {
  const t = translations[language];

  const mockStats = {
    totalAnalyses: 156,
    reviewsProcessed: 45280,
    insightsGenerated: 1247,
    avgProcessingTime: "3.2 min"
  };

  const features = [
    {
      id: 'user-insights',
      icon: <Users className="w-6 h-6" />,
      title: t.features.userInsights.title,
      description: t.features.userInsights.description,
      color: 'bg-blue-500',
    },
    {
      id: 'user-feedback',
      icon: <Star className="w-6 h-6" />,
      title: t.features.userFeedback.title,
      description: t.features.userFeedback.description,
      color: 'bg-green-500',
    },
    {
      id: 'unmet-needs',
      icon: <Target className="w-6 h-6" />,
      title: t.features.unmetNeeds.title,
      description: t.features.unmetNeeds.description,
      color: 'bg-orange-500',
    },
    {
      id: 'opportunities',
      icon: <TrendingUp className="w-6 h-6" />,
      title: t.features.opportunities.title,
      description: t.features.opportunities.description,
      color: 'bg-purple-500',
    },
    {
      id: 'competitive',
      icon: <BarChart3 className="w-6 h-6" />,
      title: t.features.competitive.title,
      description: t.features.competitive.description,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="gap-system-xl flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center spacing-system-xl"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
        <div className="flex items-center justify-center gap-system-md mt-6">
          <Button 
            size="lg" 
            onClick={() => onPageChange('upload')}
            className="gap-system-sm"
          >
            <Upload className="w-4 h-4" />
            {t.startAnalysis}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="gap-system-sm"
          >
            <FileText className="w-4 h-4" />
            {t.viewFeatures}
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4">{t.quickStats}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-system-md">
          <Card className="border-clean shadow-clean">
            <CardContent className="spacing-system-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.totalAnalyses}</p>
                  <p className="text-2xl font-bold">{mockStats.totalAnalyses}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-clean shadow-clean">
            <CardContent className="spacing-system-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.reviewsProcessed}</p>
                  <p className="text-2xl font-bold">{mockStats.reviewsProcessed.toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-clean shadow-clean">
            <CardContent className="spacing-system-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.insightsGenerated}</p>
                  <p className="text-2xl font-bold">{mockStats.insightsGenerated}</p>
                </div>
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-clean shadow-clean">
            <CardContent className="spacing-system-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.stats.avgProcessingTime}</p>
                  <p className="text-2xl font-bold">{mockStats.avgProcessingTime}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Core Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">{t.coreFeatures}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-system-md">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card 
                className="border-clean shadow-clean hover:shadow-clean-md transition-shadow cursor-pointer"
                onClick={() => onPageChange(feature.id)}
              >
                <CardContent className="spacing-system-lg">
                  <div className="flex items-start gap-system-md">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      <Button variant="ghost" size="sm" className="gap-system-xs p-0">
                        {language === 'en' ? 'Explore' : '探索'}
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t.recentAnalyses}</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onPageChange('history')}
          >
            {language === 'en' ? 'View All' : '查看全部'}
          </Button>
        </div>
        
        {recentAnalyses.length === 0 ? (
          <Card className="border-clean shadow-clean">
            <CardContent className="spacing-system-xl text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t.noRecentAnalyses}</h3>
              <p className="text-muted-foreground mb-4">{t.readyDescription}</p>
              <Button onClick={() => onPageChange('upload')}>
                {t.startFirstAnalysis}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="gap-system-md flex flex-col">
            {recentAnalyses.slice(0, 3).map((analysis, index) => (
              <Card key={analysis.id} className="border-clean shadow-clean">
                <CardContent className="spacing-system-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-system-md">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">{analysis.fileName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {analysis.reviewCount} reviews • {analysis.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {language === 'en' ? 'View Results' : '查看结果'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-clean shadow-clean bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="spacing-system-xl text-center">
            <h3 className="text-xl font-semibold mb-2">{t.readyToStart}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t.readyDescription}
            </p>
            <Button 
              size="lg" 
              onClick={() => onPageChange('upload')}
              className="gap-system-sm"
            >
              <Upload className="w-4 h-4" />
              {t.startAnalysis}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
