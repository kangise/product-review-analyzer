import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Target, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { InsightTable } from '../../../components/analysis/InsightTable';
import { ProgressBar } from '../../../components/analysis/ProgressBar';
import { ConsumerProfileResult, TableColumn } from '../../../types/analysis';

interface ConsumerProfileProps {
  language: 'en' | 'zh';
  data?: ConsumerProfileResult;
}

const translations = {
  en: {
    title: "Consumer Profile Analysis",
    subtitle: "Deep insights into your customer personas and behavior patterns",
    primaryPersonas: "Primary Customer Personas",
    demographics: "Demographics Breakdown",
    behaviorPatterns: "Behavior Patterns",
    keyInsights: "Key Insights",
    noData: "No analysis data available",
    startAnalysis: "Please upload review data to see consumer profile insights",
    personas: {
      name: "Persona",
      description: "Description", 
      percentage: "Market Share",
      characteristics: "Key Characteristics",
      painPoints: "Pain Points"
    },
    demo: {
      ageGroups: "Age Groups",
      usageFrequency: "Usage Frequency",
      experienceLevel: "Experience Level"
    },
    behavior: {
      pattern: "Pattern",
      description: "Description",
      frequency: "Frequency",
      impact: "Impact"
    }
  },
  zh: {
    title: "消费者画像分析",
    subtitle: "深入洞察您的客户人群和行为模式",
    primaryPersonas: "主要客户画像",
    demographics: "人口统计分析",
    behaviorPatterns: "行为模式",
    keyInsights: "关键洞察",
    noData: "暂无分析数据",
    startAnalysis: "请上传评论数据以查看消费者画像洞察",
    personas: {
      name: "画像",
      description: "描述",
      percentage: "市场份额",
      characteristics: "关键特征",
      painPoints: "痛点"
    },
    demo: {
      ageGroups: "年龄群体",
      usageFrequency: "使用频率",
      experienceLevel: "经验水平"
    },
    behavior: {
      pattern: "模式",
      description: "描述",
      frequency: "频率",
      impact: "影响"
    }
  }
};

// Mock data for demonstration
const mockData: ConsumerProfileResult = {
  primary_personas: [
    {
      name: "Professional Content Creator",
      description: "Tech-savvy professionals creating content for business or personal brand",
      percentage: 35,
      characteristics: ["High technical knowledge", "Quality-focused", "Brand conscious"],
      pain_points: ["Complex setup processes", "Inconsistent quality", "Limited advanced features"]
    },
    {
      name: "Casual Family User",
      description: "Families capturing memories and special moments",
      percentage: 28,
      characteristics: ["Ease of use priority", "Value-conscious", "Occasional usage"],
      pain_points: ["Complicated interfaces", "High learning curve", "Expensive accessories"]
    },
    {
      name: "Adventure Enthusiast",
      description: "Active users documenting outdoor activities and sports",
      percentage: 22,
      characteristics: ["Durability focused", "Feature-rich needs", "Active lifestyle"],
      pain_points: ["Battery life limitations", "Weather resistance", "Mounting stability"]
    },
    {
      name: "Tech Early Adopter",
      description: "Technology enthusiasts exploring latest innovations",
      percentage: 15,
      characteristics: ["Innovation seeking", "Feature exploration", "Community engagement"],
      pain_points: ["Missing cutting-edge features", "Limited customization", "Slow updates"]
    }
  ],
  demographics: {
    age_groups: [
      { range: "18-25", percentage: 22 },
      { range: "26-35", percentage: 38 },
      { range: "36-45", percentage: 25 },
      { range: "46+", percentage: 15 }
    ],
    usage_frequency: [
      { type: "Daily", percentage: 18 },
      { type: "Weekly", percentage: 35 },
      { type: "Monthly", percentage: 32 },
      { type: "Occasionally", percentage: 15 }
    ],
    experience_level: [
      { level: "Beginner", percentage: 28 },
      { level: "Intermediate", percentage: 45 },
      { level: "Advanced", percentage: 27 }
    ]
  },
  behavior_patterns: [
    {
      pattern: "Research-Heavy Purchase",
      description: "Extensive research before purchase decision",
      frequency: 78,
      impact: "high"
    },
    {
      pattern: "Feature Comparison",
      description: "Detailed comparison with competitor products",
      frequency: 65,
      impact: "high"
    },
    {
      pattern: "Community Validation",
      description: "Seeking validation from user communities",
      frequency: 52,
      impact: "medium"
    },
    {
      pattern: "Price Sensitivity",
      description: "Strong consideration of price-to-value ratio",
      frequency: 71,
      impact: "high"
    }
  ]
};

export const ConsumerProfile: React.FC<ConsumerProfileProps> = ({
  language,
  data = mockData,
}) => {
  const t = translations[language];

  if (!data) {
    return (
      <div className="text-center spacing-system-xl">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t.noData}</h2>
        <p className="text-muted-foreground">{t.startAnalysis}</p>
      </div>
    );
  }

  const personaColumns: TableColumn[] = [
    { key: 'name', label: t.personas.name, type: 'text' },
    { key: 'description', label: t.personas.description, type: 'text' },
    { key: 'percentage', label: t.personas.percentage, type: 'percentage' },
  ];

  const behaviorColumns: TableColumn[] = [
    { key: 'pattern', label: t.behavior.pattern, type: 'text' },
    { key: 'description', label: t.behavior.description, type: 'text' },
    { key: 'frequency', label: t.behavior.frequency, type: 'percentage' },
    { key: 'impact', label: t.behavior.impact, type: 'badge' },
  ];

  return (
    <div className="gap-system-xl flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center spacing-system-lg"
      >
        <div className="flex items-center justify-center gap-system-sm mb-4">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">{t.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </motion.div>

      {/* Primary Personas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <InsightTable
          title={t.primaryPersonas}
          data={data.primary_personas}
          columns={personaColumns}
          expandable={true}
          quotable={false}
        />
      </motion.div>

      {/* Demographics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader>
            <CardTitle className="flex items-center gap-system-sm">
              <TrendingUp className="w-5 h-5" />
              {t.demographics}
            </CardTitle>
          </CardHeader>
          <CardContent className="spacing-system-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-system-lg">
              {/* Age Groups */}
              <div>
                <h4 className="font-semibold mb-3">{t.demo.ageGroups}</h4>
                <div className="gap-system-sm flex flex-col">
                  {data.demographics.age_groups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{group.range}</span>
                      <div className="flex items-center gap-system-sm flex-1 ml-4">
                        <ProgressBar 
                          value={group.percentage} 
                          size="sm" 
                          color="blue"
                          showLabel={false}
                        />
                        <span className="text-sm font-medium min-w-[3rem]">
                          {group.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Frequency */}
              <div>
                <h4 className="font-semibold mb-3">{t.demo.usageFrequency}</h4>
                <div className="gap-system-sm flex flex-col">
                  {data.demographics.usage_frequency.map((freq, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{freq.type}</span>
                      <div className="flex items-center gap-system-sm flex-1 ml-4">
                        <ProgressBar 
                          value={freq.percentage} 
                          size="sm" 
                          color="green"
                          showLabel={false}
                        />
                        <span className="text-sm font-medium min-w-[3rem]">
                          {freq.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h4 className="font-semibold mb-3">{t.demo.experienceLevel}</h4>
                <div className="gap-system-sm flex flex-col">
                  {data.demographics.experience_level.map((level, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{level.level}</span>
                      <div className="flex items-center gap-system-sm flex-1 ml-4">
                        <ProgressBar 
                          value={level.percentage} 
                          size="sm" 
                          color="orange"
                          showLabel={false}
                        />
                        <span className="text-sm font-medium min-w-[3rem]">
                          {level.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Behavior Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <InsightTable
          title={t.behaviorPatterns}
          data={data.behavior_patterns}
          columns={behaviorColumns}
          expandable={false}
          quotable={false}
        />
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-clean shadow-clean bg-gradient-to-r from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-system-sm">
              <Info className="w-5 h-5" />
              {t.keyInsights}
            </CardTitle>
          </CardHeader>
          <CardContent className="spacing-system-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-system-md">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {language === 'en' ? 'Primary Segment' : '主要细分'}
                </Badge>
                <p className="text-sm">
                  {language === 'en' 
                    ? 'Professional Content Creators represent 35% of your market, focusing on quality and advanced features.'
                    : '专业内容创作者占市场35%，注重质量和高级功能。'
                  }
                </p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  {language === 'en' ? 'Key Behavior' : '关键行为'}
                </Badge>
                <p className="text-sm">
                  {language === 'en'
                    ? '78% conduct extensive research before purchase, indicating high consideration decision-making.'
                    : '78%的用户在购买前进行广泛研究，表明决策过程深思熟虑。'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
