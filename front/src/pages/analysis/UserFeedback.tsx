import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, ChevronDown, ChevronRight, MessageSquare, Info, Tag, ThumbsUp, ThumbsDown, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from 'recharts'

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

  // 创建散点图数据：横轴=分数，纵轴=频率，点=反馈类型
  const scatterData = []
  Object.entries(ratingFeedback).forEach(([rating, data]: [string, any]) => {
    const starNumber = parseInt(rating.replace('星', '').replace('评价', ''))
    const percentage = parseFloat((ratingDistributionRaw[rating] || '0%').replace('%', ''))
    
    // 添加满意点
    if (data.主要满意点) {
      data.主要满意点.forEach((point: any, index: number) => {
        const freq = parseFloat((point.频率 || '0%').replace('%', ''))
        scatterData.push({
          x: starNumber,
          y: freq,
          type: '满意点',
          name: point.喜爱点,
          color: '#22c55e'
        })
      })
    }
    
    // 添加不满意点
    if (data.主要不满意点) {
      data.主要不满意点.forEach((point: any, index: number) => {
        const freq = parseFloat((point.频率 || '0%').replace('%', ''))
        scatterData.push({
          x: starNumber,
          y: freq,
          type: '不满意点',
          name: point.问题点,
          color: '#ef4444'
        })
      })
    }
  })

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
              <span>{language === 'en' ? 'Customer satisfaction analysis and rating insights' : '客户满意度分析和评分洞察'}</span>
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
                <span>{language === 'en' ? 'Customer Satisfaction Analysis' : '客户满意度分析'}</span>
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
              {consumerLoveData.客户满意度洞察 && (
                <div className="gap-system-lg flex flex-col">
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Core Satisfaction Insights' : '核心满意度洞察'}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {consumerLoveData.客户满意度洞察?.核心满意度洞察}
                    </p>
                  </motion.div>

                  {consumerLoveData.客户满意度洞察?.细分满意度类型 && (
                    <div className="gap-system-md grid md:grid-cols-2">
                      {consumerLoveData.客户满意度洞察.细分满意度类型.map((satisfaction: any, index: number) => (
                        <motion.div
                          key={index}
                          className="spacing-system-md bg-muted rounded-lg border-clean"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{satisfaction.满意度类型}</h5>
                            <Badge variant="outline" className="text-xs">
                              {satisfaction.比例}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                            {satisfaction.特征描述}
                          </p>
                          {satisfaction.关键review信息 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => showQuotes([satisfaction.关键review信息], satisfaction.满意度类型)}
                              className="text-xs h-6 px-2"
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {language === 'en' ? 'View Quote' : '查看原声'}
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
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
              {/* 关键洞察 */}
              {starRatingData?.评分分布分析?.关键洞察 && (
                <motion.div 
                  className="spacing-system-md bg-accent rounded-lg border-clean mb-6"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Key Insights' : '关键洞察'}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {starRatingData.评分分布分析.关键洞察}
                  </p>
                </motion.div>
              )}

              {/* Rating Distribution Overview */}
              <div className="gap-system-lg grid md:grid-cols-3 mb-6">
                {/* Bar Chart for Rating Distribution */}
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Rating Distribution' : '评分分布'}
                  </h4>
                  <div className="gap-3 flex flex-col">
                    {Object.entries(ratingDistributionRaw).map(([rating, percentage]) => (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="w-12 text-sm font-medium">{rating}</div>
                        <div className="flex-1">
                          <Progress 
                            value={parseFloat((percentage as string).replace('%', ''))} 
                            className="h-2"
                          />
                        </div>
                        <div className="w-12 text-sm text-muted-foreground text-right">{percentage}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart */}
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Visual Distribution' : '可视化分布'}
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ratingDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {ratingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: any) => [`${value}%`, language === 'en' ? 'Percentage' : '百分比']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Scatter Chart - 横轴=分数，纵轴=频率，点=反馈类型 */}
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Feedback Distribution' : '反馈分布图'}
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          domain={[0.5, 5.5]}
                          ticks={[1, 2, 3, 4, 5]}
                          label={{ value: language === 'en' ? 'Rating (Stars)' : '评分 (星)', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y"
                          label={{ value: language === 'en' ? 'Frequency (%)' : '频率 (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <RechartsTooltip 
                          formatter={(value: any, name: string, props: any) => [
                            `${value}%`, 
                            props.payload.name
                          ]}
                          labelFormatter={(value: any) => `${value}星`}
                        />
                        <Scatter 
                          data={scatterData.filter(d => d.type === '满意点')} 
                          fill="#22c55e"
                          name="满意点"
                        />
                        <Scatter 
                          data={scatterData.filter(d => d.type === '不满意点')} 
                          fill="#ef4444"
                          name="不满意点"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 按评分段详细分析 */}
              <div className="gap-system-md flex flex-col">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  {language === 'en' ? 'Detailed Analysis by Rating' : '按评分段详细分析'}
                </h4>
                
                {Object.entries(ratingFeedback).map(([rating, data]: [string, any]) => (
                  <motion.div
                    key={rating}
                    className="spacing-system-md bg-muted rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-sm flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        {rating}
                      </h5>
                      <Badge variant="outline" className="text-xs">
                        {ratingDistributionRaw[rating] || '0%'}
                      </Badge>
                    </div>
                    
                    {/* 主要满意点/不满意点 */}
                    {data.主要满意点 && (
                      <div className="mb-4">
                        <h6 className="font-medium text-xs mb-2 text-green-600">
                          {language === 'en' ? 'Main Satisfaction Points' : '主要满意点'}
                        </h6>
                        <div className="gap-2 flex flex-col">
                          {data.主要满意点.map((point: any, index: number) => (
                            <div key={index} className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded border-l-2 border-green-500">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{point.喜爱点}</span>
                                <Badge variant="secondary" className="text-xs">{point.频率}</Badge>
                              </div>
                              {point.示例评论 && point.示例评论.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => showQuotes(point.示例评论, point.喜爱点)}
                                >
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  {language === 'en' ? 'Examples' : '示例'} ({point.示例评论.length})
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 主要不满意点 */}
                    {data.主要不满意点 && (
                      <div>
                        <h6 className="font-medium text-xs mb-2 text-red-600">
                          {language === 'en' ? 'Main Dissatisfaction Points' : '主要不满意点'}
                        </h6>
                        <div className="gap-2 flex flex-col">
                          {data.主要不满意点.map((point: any, index: number) => (
                            <div key={index} className="spacing-system-sm bg-red-50 dark:bg-red-900/20 rounded border-l-2 border-red-500">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{point.问题点}</span>
                                <Badge variant="destructive" className="text-xs">{point.频率}</Badge>
                              </div>
                              {point.示例评论 && point.示例评论.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => showQuotes(point.示例评论, point.问题点)}
                                >
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  {language === 'en' ? 'Examples' : '示例'} ({point.示例评论.length})
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
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
            className="relative w-full max-w-lg max-h-[60vh] mx-4"
          >
            <Card className="border-clean shadow-clean-lg">
              <CardHeader className="spacing-system-sm border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-system-sm">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    {language === 'en' ? 'Examples' : '示例'}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {selectedQuotes.quotes.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selectedQuotes.title}</p>
              </CardHeader>
              <CardContent className="spacing-system-sm">
                <div className="max-h-60 overflow-y-auto">
                  <div className="gap-system-xs flex flex-col">
                    {selectedQuotes.quotes.map((quote, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-muted/30 rounded spacing-system-xs border-l-2 border-primary/30"
                      >
                        <p className="text-xs leading-relaxed text-foreground">
                          "{quote}"
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <Button onClick={() => setSelectedQuotes(null)} variant="outline" size="sm" className="text-xs h-7">
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
