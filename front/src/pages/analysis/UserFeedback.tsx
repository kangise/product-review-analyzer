import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, ChevronDown, ChevronRight, MessageSquare, Info, Tag, ThumbsUp, ThumbsDown, TrendingUp, AlertTriangle, BarChart3, Crown } from 'lucide-react'
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['consumer-love', 'star-rating'])
  )
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

  // 从analysisResult中获取数据 - 添加详细调试
  console.log('=== UserFeedback Debug Start ===');
  console.log('Raw analysisResult:', analysisResult);
  console.log('analysisResult type:', typeof analysisResult);
  console.log('analysisResult keys:', analysisResult ? Object.keys(analysisResult) : 'null');
  
  if (analysisResult?.ownBrandAnalysis) {
    console.log('ownBrandAnalysis keys:', Object.keys(analysisResult.ownBrandAnalysis));
    if (analysisResult.ownBrandAnalysis.userFeedback) {
      console.log('userFeedback keys:', Object.keys(analysisResult.ownBrandAnalysis.userFeedback));
    } else {
      console.log('❌ userFeedback is missing');
    }
  } else {
    console.log('❌ ownBrandAnalysis is missing');
  }
  
  const consumerLoveData = analysisResult?.ownBrandAnalysis?.userFeedback?.consumerLove || {}
  const starRatingData = analysisResult?.ownBrandAnalysis?.userFeedback?.starRating || {}
  
  console.log('Extracted consumerLoveData:', consumerLoveData);
  console.log('Extracted starRatingData:', starRatingData);
  console.log('=== UserFeedback Debug End ===');
  
  console.log('UserFeedback received data:', { 
    consumerLoveData, 
    starRatingData,
    hasConsumerLove: !!consumerLoveData?.核心赞美点分析,
    consumerLoveCount: consumerLoveData?.核心赞美点分析?.length || 0,
    hasStarRating: !!starRatingData,
    starRatingKeys: starRatingData ? Object.keys(starRatingData) : [],
    starRatingFeedback: starRatingData?.按评分划分的消费者反馈,
    starRatingDistribution: starRatingData?.评分分布分析
  })

  // 检查是否有核心赞美点分析数据
  const hasConsumerLoveData = consumerLoveData?.核心赞美点分析 && Array.isArray(consumerLoveData.核心赞美点分析) && consumerLoveData.核心赞美点分析.length > 0

  // 处理评分分布数据 - 使用正确的嵌套数据
  const ratingDistributionRaw = starRatingData?.评分分布分析?.总体评分分布 || {}
  const ratingDistribution = Object.entries(ratingDistributionRaw).map(([rating, percentage]) => ({
    name: rating,
    value: parseFloat((percentage as string).replace('%', '')),
    color: rating === '5星' ? '#22c55e' : 
           rating === '4星' ? '#84cc16' : 
           rating === '3星' ? '#eab308' : 
           rating === '2星' ? '#f97316' : '#ef4444'
  }))

  console.log('Rating Distribution Data:', { 
    ratingDistributionRaw, 
    ratingDistribution,
    hasStarRatingData: !!starRatingData,
    starRatingKeys: starRatingData ? Object.keys(starRatingData) : [],
    ratingFeedback: starRatingData?.按评分划分的消费者反馈
  })

  // 处理按评分划分的反馈数据 - 使用正确的嵌套数据
  const ratingFeedback = starRatingData?.按评分划分的消费者反馈 || {}

  // 创建散点图数据：横轴=分数，纵轴=频率，点=反馈类型
  const scatterData: any[] = []
  
  try {
    Object.entries(ratingFeedback).forEach(([rating, data]: [string, any]) => {
      // 安全地提取星级数字
      let starNumber = 1
      const ratingMatch = rating.match(/(\d+)星/)
      if (ratingMatch) {
        starNumber = parseInt(ratingMatch[1])
      }
      
      console.log(`Processing ${rating}:`, data)
      
      // 添加满意点 - 使用喜爱点字段
      if (data.主要满意点 && Array.isArray(data.主要满意点) && data.主要满意点.length > 0) {
        data.主要满意点.forEach((point: any, index: number) => {
          // 解析频率
          let freq = 5 // 默认频率
          if (point.频率) {
            const freqMatch = point.频率.match(/(\d+\.?\d*)%?/)
            freq = freqMatch ? parseFloat(freqMatch[1]) : 5
          }
          
          const pointName = point.喜爱点 || point.满意点 || `满意点${index + 1}`
          
          scatterData.push({
            x: starNumber,
            y: Math.max(0.1, freq),
            type: '满意点',
            name: pointName,
            color: '#22c55e',
            rating: rating,
            frequency: point.频率 || `${freq.toFixed(1)}%`
          })
          
          console.log(`Added positive point: ${pointName} at ${starNumber} stars with ${freq}% frequency`)
        })
      }
      
      // 添加不满意点 - 使用未满足的需求字段
      if (data.主要不满点 && Array.isArray(data.主要不满点) && data.主要不满点.length > 0) {
        data.主要不满点.forEach((point: any, index: number) => {
          // 解析频率
          let freq = 5 // 默认频率
          if (point.频率) {
            const freqMatch = point.频率.match(/(\d+\.?\d*)%?/)
            freq = freqMatch ? parseFloat(freqMatch[1]) : 5
          }
          
          const pointName = point.未满足的需求 || point.问题点 || point.不满意点 || `问题点${index + 1}`
          
          scatterData.push({
            x: starNumber,
            y: Math.max(0.1, freq),
            type: '不满意点',
            name: pointName,
            color: '#ef4444',
            rating: rating,
            frequency: point.频率 || `${freq.toFixed(1)}%`
          })
          
          console.log(`Added negative point: ${pointName} at ${starNumber} stars with ${freq}% frequency`)
        })
      }
    })
  } catch (error) {
    console.error('Error processing scatter data:', error)
  }

  console.log('Final scatterData:', scatterData)

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
              {consumerLoveData.消费者洞察总结 && (
                <div className="gap-system-lg flex flex-col">
                  {/* 消费者洞察总结 - 处理对象结构 */}
                  {typeof consumerLoveData.消费者洞察总结 === 'object' && (
                    <div className="gap-system-md flex flex-col">
                      {Object.entries(consumerLoveData.消费者洞察总结).map(([key, value]: [string, any]) => (
                        <motion.div 
                          key={key}
                          className="spacing-system-md bg-accent rounded-lg border-clean"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h4 className="font-medium mb-2 text-sm">{key}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* 核心赞美点分析 */}
                  {hasConsumerLoveData ? (
                    <div className="gap-system-md flex flex-col">
                      {/* Top 3 满意度概览 - 简化实现确保显示 */}
                      <div className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <Heart className="h-4 w-4 text-yellow-600" />
                            {language === 'en' ? 'Top 3 Customer Satisfaction' : 'Top 3 客户满意度'}
                          </h4>
                          <div className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                            {language === 'en' ? 'Most Loved Features' : '最受喜爱功能'}
                          </div>
                        </div>
                        
                        {/* Top 3 满意度项目 - 使用真实数据 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {consumerLoveData.核心赞美点分析
                            .sort((a: any, b: any) => {
                              const aImportance = parseFloat(a.赞美点重要性?.replace('%', '')) || 0;
                              const bImportance = parseFloat(b.赞美点重要性?.replace('%', '')) || 0;
                              return bImportance - aImportance;
                            })
                            .slice(0, 3)
                            .map((praise: any, index: number) => {
                              const percentage = parseFloat(praise.赞美点重要性?.replace('%', '')) || 0;
                              
                              return (
                                <div key={index} className="flex flex-col items-center text-center">
                                  <div className="relative w-20 h-20 mb-3">
                                    <svg width="80" height="80" className="transform -rotate-90" viewBox="0 0 80 80">
                                      <circle
                                        cx="40"
                                        cy="40"
                                        r="30"
                                        stroke="rgba(251, 191, 36, 0.2)"
                                        strokeWidth="6"
                                        fill="transparent"
                                      />
                                      <circle
                                        cx="40"
                                        cy="40"
                                        r="30"
                                        stroke="#f59e0b"
                                        strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 30}`}
                                        strokeDashoffset={`${2 * Math.PI * 30 * (1 - percentage / 100)}`}
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-lg font-bold text-yellow-700">
                                        {percentage.toFixed(0)}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-sm font-medium text-yellow-800 mb-1">
                                    {praise.赞美点}
                                  </div>
                                  <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                    #{index + 1} {language === 'en' ? 'Most Loved' : '最受喜爱'}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* 详细赞美点分析 - 使用实际数据 */}
                      <div className="gap-system-md grid md:grid-cols-2">
                        {consumerLoveData.核心赞美点分析.map((praise: any, index: number) => {
                          const importance = parseFloat(praise.赞美点重要性?.replace('%', '')) || 0;
                          const frequency = parseFloat(praise.频率?.replace('%', '')) || 0;
                          
                          return (
                            <motion.div
                              key={index}
                              className="spacing-system-md bg-muted rounded-lg border-clean"
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-sm pr-2">{praise.赞美点}</h5>
                              </div>
                              
                              {/* 重要性进度条 */}
                              {praise.赞美点重要性 && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3" />
                                      {language === 'en' ? 'Importance' : '重要性'}
                                    </span>
                                    <span className="text-xs font-medium">{praise.赞美点重要性}</span>
                                  </div>
                                  <Progress value={importance} className="h-2" />
                                </div>
                              )}
                              
                              {/* 频率进度条 */}
                              {praise.频率 && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <BarChart3 className="h-3 w-3" />
                                      {language === 'en' ? 'Frequency' : '提及频率'}
                                    </span>
                                    <span className="text-xs font-medium">{praise.频率}</span>
                                  </div>
                                  <Progress value={frequency} className="h-2" />
                                </div>
                              )}
                              
                              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                {praise.消费者描述}
                              </p>
                              
                              {praise.相关评论示例 && praise.相关评论示例.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => showQuotes(praise.相关评论示例, praise.赞美点)}
                                >
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  {language === 'en' ? 'View Examples' : '查看示例'} ({praise.相关评论示例.length})
                                </Button>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>{language === 'en' ? 'No customer satisfaction data available' : '暂无客户满意度数据'}</p>
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
              {/* 散点图测试 - 移到最前面 */}
              <div className="w-full h-40 bg-blue-500 text-white p-4 mb-4">
                <h3 className="text-lg font-bold mb-2">散点图测试区域</h3>
                <div className="relative w-full h-20 bg-white">
                  <div className="absolute top-2 left-2 w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="absolute top-2 left-8 w-4 h-4 bg-green-500 rounded-full"></div>
                  <div className="absolute top-2 left-14 w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div className="absolute top-8 left-2 w-4 h-4 bg-purple-500 rounded-full"></div>
                  <div className="absolute top-8 left-8 w-4 h-4 bg-pink-500 rounded-full"></div>
                </div>
                <p className="text-sm mt-2">应该看到5个彩色圆点</p>
              </div>
              
              {/* 强制显示测试 */}
              <div className="w-full h-20 bg-red-500 text-white text-center flex items-center justify-center text-xl font-bold mb-4">
                🔴 测试区域 - 如果看到这个红色区域说明star-rating已展开
              </div>
              
              {/* 关键洞察 */}
              {starRatingData?.评分分布分析?.关键洞察 && (
                <motion.div 
                  className="spacing-system-md bg-accent rounded-lg border-clean mb-6"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Key Insights' : '关键洞察'}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {typeof starRatingData.评分分布分析.关键洞察 === 'string' 
                      ? starRatingData.评分分布分析.关键洞察 
                      : JSON.stringify(starRatingData.评分分布分析.关键洞察)}
                  </p>
                </motion.div>
              )}

              {/* Rating Distribution Overview - 环形Progress组件 */}
              <div className="gap-system-md flex flex-col mb-6">
                {/* 评分分布 - 五个环形组件横向排列 */}
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Rating Distribution' : '评分分布'}
                  </h4>
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200">
                    <div className="flex justify-center items-center gap-8">
                      {['5星', '4星', '3星', '2星', '1星'].map((rating, index) => {
                        const percentage = parseFloat((ratingDistributionRaw[rating] || '0%').replace('%', ''));
                        const numericRating = 5 - index; // 5, 4, 3, 2, 1
                        
                        return (
                          <div key={rating} className="flex flex-col items-center text-center">
                            <div className="relative w-20 h-20 mb-3">
                              <svg width="80" height="80" className="transform -rotate-90" viewBox="0 0 80 80">
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="30"
                                  stroke="rgba(251, 191, 36, 0.2)"
                                  strokeWidth="6"
                                  fill="transparent"
                                />
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="30"
                                  stroke="#f59e0b"
                                  strokeWidth="6"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 30}`}
                                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - percentage / 100)}`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-yellow-700">
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              {Array.from({ length: numericRating }, (_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <div className="text-sm font-medium text-yellow-800">
                              {rating}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 评分主题频率分析 - 强制渲染调试 */}
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Rating Theme Analysis' : '评分主题分析'}
                  </h4>
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-lg border">
                    
                    {/* 调试信息 */}
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <p><strong>调试信息:</strong></p>
                      <p>scatterData.length: {scatterData.length}</p>
                      <p>正向主题: {scatterData.filter(d => d.type === '满意点').length}</p>
                      <p>负向主题: {scatterData.filter(d => d.type === '不满意点').length}</p>
                      {scatterData.length > 0 && (
                        <div className="mt-2">
                          <p><strong>前3个数据点:</strong></p>
                          {scatterData.slice(0, 3).map((point, i) => (
                            <p key={i}>• {point.name} ({point.type}) - {point.x}星, {point.y}%</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 简单表格显示数据 */}
                    {scatterData.length > 0 && (
                      <div className="mb-4 overflow-x-auto">
                        <table className="w-full text-xs border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 p-1">评分</th>
                              <th className="border border-gray-300 p-1">主题</th>
                              <th className="border border-gray-300 p-1">类型</th>
                              <th className="border border-gray-300 p-1">频率</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scatterData.map((point, i) => (
                              <tr key={i}>
                                <td className="border border-gray-300 p-1">{point.x}星</td>
                                <td className="border border-gray-300 p-1">{point.name}</td>
                                <td className="border border-gray-300 p-1 text-center">
                                  <span className={`inline-block w-3 h-3 rounded-full ${point.type === '满意点' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </td>
                                <td className="border border-gray-300 p-1">{point.y}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 最简单的测试散点图 */}
                    <div className="h-80 bg-gray-100 border-2 border-black p-4">
                      <h3 className="text-lg font-bold mb-4">散点图测试</h3>
                      
                      {/* 固定测试点 */}
                      <div className="relative w-full h-60 bg-white border">
                        <div className="absolute top-4 left-4 w-4 h-4 bg-red-500 rounded-full"></div>
                        <div className="absolute top-8 left-8 w-4 h-4 bg-green-500 rounded-full"></div>
                        <div className="absolute top-12 left-12 w-4 h-4 bg-blue-500 rounded-full"></div>
                        <p className="absolute bottom-2 left-2 text-xs">固定测试点 - 如果看到3个彩色圆点说明CSS正常</p>
                      </div>
                      
                      {/* 数据驱动的点 */}
                      <div className="relative w-full h-60 bg-yellow-50 border mt-4">
                        {scatterData.slice(0, 5).map((point, i) => (
                          <div
                            key={i}
                            className="absolute w-3 h-3 bg-purple-500 rounded-full"
                            style={{
                              left: `${10 + i * 50}px`,
                              top: `${10 + i * 20}px`
                            }}
                          />
                        ))}
                        <p className="absolute bottom-2 left-2 text-xs">数据驱动点 - 应该看到5个紫色点</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 按评分段详细分析 */}
              <div className="gap-system-md flex flex-col">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  {language === 'en' ? 'Detailed Analysis by Rating' : '按评分段详细分析'}
                </h4>
                
                {/* 按评分从高到低排序显示 */}
                {['5星评价', '4星评价', '3星评价', '2星评价', '1星评价'].map((ratingKey) => {
                  const data = ratingFeedback[ratingKey]
                  if (!data) return null
                  
                  const displayRating = ratingKey.replace('评价', '')
                  const ratingPercentage = ratingDistributionRaw[displayRating] || '0%'
                  
                  return (
                    <motion.div
                      key={ratingKey}
                      className="spacing-system-md bg-muted rounded-lg border-clean"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-sm flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          {displayRating}
                        </h5>
                        <Badge variant="outline" className="text-xs">
                          {ratingPercentage}
                        </Badge>
                      </div>
                      
                      {/* 主要满意点 - 优化可视化 */}
                      {data.主要满意点 && data.主要满意点.length > 0 && (
                        <div className="mb-4">
                          <h6 className="font-medium text-xs mb-3 text-green-600 flex items-center gap-2">
                            <ThumbsUp className="h-3 w-3" />
                            {language === 'en' ? 'Main Satisfaction Points' : '主要满意点'}
                          </h6>
                          <div className="gap-3 grid md:grid-cols-2">
                            {data.主要满意点.map((point: any, index: number) => {
                              const isTop3 = index < 3;
                              const frequency = parseFloat(point.频率?.replace('%', '')) || 0;
                              
                              return (
                                <div key={index} className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 relative">
                                  {isTop3 && (
                                    <div className="absolute -top-1 -right-1">
                                      <Crown className="h-4 w-4 text-yellow-500 bg-white rounded-full p-0.5 shadow-sm" />
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium flex items-center gap-1">
                                      {isTop3 && <span className="text-yellow-600 text-xs">#{index + 1}</span>}
                                      {point.喜爱点 || point.满意点 || `满意点 ${index + 1}`}
                                    </span>
                                  </div>
                                  
                                  {/* 使用Progress组件 */}
                                  {point.频率 && (
                                    <div className="mb-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">频率</span>
                                        <span className="text-xs font-medium text-green-600">{point.频率}</span>
                                      </div>
                                      <Progress value={frequency} className="h-2" />
                                    </div>
                                  )}
                                  
                                  {point.消费者描述 && (
                                    <p className="text-xs text-green-700 dark:text-green-300 mb-2 leading-relaxed">{point.消费者描述}</p>
                                  )}
                                  {point.示例评论 && point.示例评论.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => showQuotes(point.示例评论, point.喜爱点 || point.满意点 || '满意点')}
                                    >
                                      <MessageSquare className="mr-1 h-3 w-3" />
                                      {language === 'en' ? 'Examples' : '示例'} ({point.示例评论.length})
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 主要不满意点 - 优化可视化 */}
                      {data.主要不满点 && data.主要不满点.length > 0 && (
                        <div>
                          <h6 className="font-medium text-xs mb-3 text-red-600 flex items-center gap-2">
                            <ThumbsDown className="h-3 w-3" />
                            {language === 'en' ? 'Main Dissatisfaction Points' : '主要不满意点'}
                          </h6>
                          <div className="gap-3 grid md:grid-cols-2">
                            {data.主要不满点.map((point: any, index: number) => {
                              const isTop3 = index < 3;
                              const frequency = parseFloat(point.频率?.replace('%', '')) || 0;
                              
                              return (
                                <div key={index} className="spacing-system-sm bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 relative">
                                  {isTop3 && (
                                    <div className="absolute -top-1 -right-1">
                                      <Crown className="h-4 w-4 text-yellow-500 bg-white rounded-full p-0.5 shadow-sm" />
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium flex items-center gap-1">
                                      {isTop3 && <span className="text-yellow-600 text-xs">#{index + 1}</span>}
                                      {point.未满足的需求 || point.问题点 || point.不满意点 || `问题点 ${index + 1}`}
                                    </span>
                                  </div>
                                  
                                  {/* 使用Progress组件 */}
                                  {point.频率 && (
                                    <div className="mb-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">频率</span>
                                        <span className="text-xs font-medium text-red-600">{point.频率}</span>
                                      </div>
                                      <Progress value={frequency} className="h-2" />
                                    </div>
                                  )}
                                  
                                  {point.消费者描述 && (
                                    <p className="text-xs text-red-700 dark:text-red-300 mb-2 leading-relaxed">{point.消费者描述}</p>
                                  )}
                                  {point.示例评论 && point.示例评论.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => showQuotes(point.示例评论, point.未满足的需求 || point.问题点 || point.不满意点 || '问题点')}
                                    >
                                      <MessageSquare className="mr-1 h-3 w-3" />
                                      {language === 'en' ? 'Examples' : '示例'} ({point.示例评论.length})
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Quote Modal */}
      {selectedQuotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedQuotes(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[70vh] mx-auto"
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
