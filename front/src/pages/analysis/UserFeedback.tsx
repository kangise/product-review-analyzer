import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, ChevronDown, ChevronRight, MessageSquare, Info, Tag, ThumbsUp, ThumbsDown, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

interface UserFeedbackProps {
  language: 'en' | 'zh'
  t: any
  analysisResult: any
}

export const UserFeedback: React.FC<UserFeedbackProps> = ({
  language,
  t,
  analysisResult
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['consumer-love']))
  const [selectedQuotes, setSelectedQuotes] = useState<{quotes: string[], title: string} | null>(null)

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const showQuotes = (quotes: string[], title: string) => {
    setSelectedQuotes({ quotes, title })
  }

  // 从analysisResult中获取数据，适配现有结构
  const consumerLoveData = analysisResult?.ownBrandAnalysis?.userFeedback?.consumerLove || {}
  const starRatingData = analysisResult?.ownBrandAnalysis?.userFeedback?.starRating || {}
  
  console.log('UserFeedback received data:', { consumerLoveData, starRatingData })

  // 处理评分分布数据
  const ratingDistributionRaw = starRatingData?.评分分布分析?.总体评分分布 || {}
  const ratingDistribution = Object.entries(ratingDistributionRaw).map(([rating, percentage]) => ({
    name: rating,
    value: parseFloat((percentage as string).replace('%', '')),
    color: rating === '5星' ? '#22c55e' : 
           rating === '4星' ? '#84cc16' : 
           rating === '3星' ? '#eab308' : 
           rating === '2星' ? '#f97316' : '#ef4444'
  }))

  // 处理按评分划分的反馈数据
  const ratingFeedback = starRatingData?.按评分划分的消费者反馈 || {}

  return (
    <motion.div 
      className="gap-system-xl flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Clean header with breadcrumb-style navigation */}
      <div className="border-b border-border pb-6">
        <div className="gap-system-sm flex items-center">
          <Heart className="h-5 w-5 text-primary" />
          <div>
            <h2 className="mb-1">{t.nav.ownBrandFeedback}</h2>
            <div className="gap-system-sm flex items-center text-sm text-muted-foreground">
              <span>{language === 'en' ? 'Analyze what customers love and rating patterns' : '分析用户喜爱点和评分模式'}</span>
              {analysisResult?.targetCategory && (
                <>
                  <Separator orientation="vertical" className="h-3" />
                  <div className="gap-1 flex items-center">
                    <Tag className="h-3 w-3" />
                    <span>{t.analysis.category} {analysisResult.targetCategory}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Consumer Love Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('consumer-love')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
              <div className="gap-system-sm flex items-center">
                <Heart className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'What Customers Love' : '消费者喜爱点分析'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('consumer-love') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('consumer-love') && (
            <CardContent className="spacing-system-lg">
              {/* Core Love Points Summary */}
              {consumerLoveData.消费者洞察总结 && (
                <div className="gap-system-lg flex flex-col mb-6">
                  <div className="gap-system-md grid md:grid-cols-3">
                    <motion.div 
                      className="spacing-system-md bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-medium mb-2 text-sm text-green-800 dark:text-green-200">
                        {language === 'en' ? 'Technical Excellence' : '技术规格'}
                      </h4>
                      <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                        {consumerLoveData.消费者洞察总结.技术规格}
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="spacing-system-md bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-medium mb-2 text-sm text-blue-800 dark:text-blue-200">
                        {language === 'en' ? 'Feature Attributes' : '功能属性'}
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        {consumerLoveData.消费者洞察总结.功能属性}
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="spacing-system-md bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-medium mb-2 text-sm text-purple-800 dark:text-purple-200">
                        {language === 'en' ? 'Usage Scenarios' : '使用场景'}
                      </h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                        {consumerLoveData.消费者洞察总结.使用场景}
                      </p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Love Points Analysis Table */}
              {consumerLoveData.核心赞美点分析 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    {language === 'en' ? 'Top Love Points Analysis' : '核心赞美点分析'}
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground">
                            {language === 'en' ? 'Love Point' : '赞美点'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground">
                            {language === 'en' ? 'Importance' : '重要性'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground">
                            {language === 'en' ? 'Description' : '消费者描述'}
                          </th>
                          <th className="text-center spacing-system-sm text-xs font-medium text-muted-foreground">
                            {language === 'en' ? 'Examples' : '示例'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumerLoveData.核心赞美点分析.map((lovePoint: any, index: number) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="spacing-system-sm">
                              <div className="font-medium text-sm text-green-700 dark:text-green-300">
                                {lovePoint.赞美点}
                              </div>
                            </td>
                            <td className="spacing-system-sm">
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={parseFloat(lovePoint.赞美点重要性)} 
                                  className="flex-1 h-2"
                                />
                                <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                  {lovePoint.赞美点重要性}
                                </Badge>
                              </div>
                            </td>
                            <td className="spacing-system-sm">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {lovePoint.消费者描述}
                              </p>
                            </td>
                            <td className="spacing-system-sm text-center">
                              {lovePoint.相关评论示例 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => showQuotes(lovePoint.相关评论示例, lovePoint.赞美点)}
                                  className="w-8 h-8 p-0"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Star Rating Root Cause Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('star-rating')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
              <div className="gap-system-sm flex items-center">
                <Star className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Star Rating Root Cause Analysis' : '评分根因分析'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('star-rating') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('star-rating') && (
            <CardContent className="spacing-system-lg">
              {/* Rating Distribution Overview */}
              <div className="gap-system-lg grid md:grid-cols-2 mb-6">
                {/* Pie Chart */}
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Rating Distribution' : '评分分布'}
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ratingDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {ratingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: any) => [`${value}%`, 'Percentage']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Key Insights' : '关键洞察'}
                  </h4>
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {starRatingData.评分分布分析?.关键洞察}
                    </p>
                  </motion.div>

                  {/* Rating Stats */}
                  <div className="gap-system-sm flex flex-col mt-4">
                    {ratingDistribution.map((rating, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: rating.color }}
                          />
                          <span className="text-sm">{rating.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {rating.value}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5-Star Feedback Analysis */}
              {starRatingData.按评分划分的消费者反馈?.['5星评价']?.主要满意点 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    {language === 'en' ? '5-Star Satisfaction Points' : '5星满意点分析'}
                  </h4>
                  
                  <div className="gap-system-md grid md:grid-cols-2">
                    {starRatingData.按评分划分的消费者反馈['5星评价'].主要满意点.map((point: any, index: number) => (
                      <motion.div
                        key={index}
                        className="spacing-system-md bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm text-green-800 dark:text-green-200">
                            {point.喜爱点}
                          </h5>
                          <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                            {point.频率}
                          </Badge>
                        </div>
                        {point.示例评论 && point.示例评论.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showQuotes(point.示例评论, point.喜爱点)}
                            className="text-xs h-6 px-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'View Examples' : '查看示例'}
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1-Star Issues Analysis */}
              {starRatingData.按评分划分的消费者反馈?.['1星评价']?.主要不满点 && (
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {language === 'en' ? '1-Star Critical Issues' : '1星关键问题分析'}
                  </h4>
                  
                  <div className="gap-system-md grid md:grid-cols-2">
                    {starRatingData.按评分划分的消费者反馈['1星评价'].主要不满点.map((issue: any, index: number) => (
                      <motion.div
                        key={index}
                        className="spacing-system-md bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm text-red-800 dark:text-red-200">
                            {issue.不满点}
                          </h5>
                          <Badge variant="outline" className="text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700">
                            {issue.频率}
                          </Badge>
                        </div>
                        {issue.示例评论 && issue.示例评论.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showQuotes(issue.示例评论, issue.不满点)}
                            className="text-xs h-6 px-2 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'View Examples' : '查看示例'}
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Quote Modal */}
      {selectedQuotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedQuotes(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[70vh] mx-4"
          >
            <Card className="border-clean shadow-clean-lg">
              <CardHeader className="spacing-system-md border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-system-sm">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    {language === 'en' ? 'Customer Reviews' : '客户评论'}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {selectedQuotes.quotes.length} {language === 'en' ? 'reviews' : '条评论'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{selectedQuotes.title}</p>
              </CardHeader>
              <CardContent className="spacing-system-md">
                <div className="max-h-80 overflow-y-auto">
                  <div className="gap-system-sm flex flex-col">
                    {selectedQuotes.quotes.map((quote, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-muted/30 rounded-lg spacing-system-sm border-l-2 border-primary/30"
                      >
                        <p className="text-sm leading-relaxed text-foreground">
                          "{quote}"
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <Button onClick={() => setSelectedQuotes(null)} variant="outline" size="sm">
                    {language === 'en' ? 'Close' : '关闭'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
