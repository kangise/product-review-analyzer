import React, { useState, useEffect } from 'react'
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

  const showQuotes = (quotes: string | string[], title: string) => {
    let quotesArray: string[] = []
    if (typeof quotes === 'string') {
      // 如果是字符串，按常见分隔符分割
      quotesArray = quotes.split(/\n|；|;|\|/).filter(q => q.trim().length > 0)
    } else if (Array.isArray(quotes)) {
      quotesArray = quotes
    }
    setSelectedQuotes({ quotes: quotesArray, title })
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

  // 检测系统主题
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const checkTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(isDark)
    }
    
    checkTheme()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkTheme)
    
    return () => mediaQuery.removeEventListener('change', checkTheme)
  }, [])

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
                      {Object.entries(consumerLoveData.消费者洞察总结).map(([key, value]: [string, any]) => {
                        // 翻译中文键名
                        const translatedKey = key === '技术规格' ? t.analysis.technicalSpecs :
                                            key === '功能属性' ? t.analysis.functionalAttributes :
                                            key === '使用场景' ? t.analysis.usageScenarios : key;
                        
                        return (
                          <motion.div 
                            key={key}
                            className="spacing-system-md bg-accent rounded-lg border-clean"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h4 className="font-medium mb-2 text-sm">{translatedKey}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {typeof value === 'string' ? value : JSON.stringify(value)}
                            </p>
                          </motion.div>
                        );
                      })}
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
                            {t.analysis.mostLovedFeatures}
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
                              
                              {/* 进度条 */}
                              {praise.赞美点重要性 && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-end mb-2">
                                    <span className="text-xs font-medium">{praise.赞美点重要性}</span>
                                  </div>
                                  <Progress value={importance} className="h-2" />
                                </div>
                              )}
                              
                              {/* 频率进度条 */}
                              {praise.频率 && (
                                <div className="mb-3">
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px' }}>
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
                    {t.analysis.ratingThemeAnalysis}
                  </h4>
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-lg border">
                    {/* 完整散点图 - 内联样式版本 */}
                    <div style={{
                      width: '100%',
                      marginBottom: '24px'
                    }}>
                      <div style={{
                        background: isDarkMode 
                          ? 'linear-gradient(to bottom right, #000000, #333333)'
                          : 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
                        padding: '24px',
                        borderRadius: '8px',
                        border: isDarkMode ? '1px solid #666666' : '1px solid #e2e8f0'
                      }}>
                        {/* 散点图容器 */}
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '400px',
                          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                          border: isDarkMode ? '1px solid #666666' : '1px solid #d1d5db',
                          borderRadius: '4px'
                        }}>
                          {/* 网格线 */}
                          <svg style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%'
                          }}>
                            {[1,2,3,4,5].map(i => (
                              <line 
                                key={`v${i}`}
                                x1={`${i*18 + 10}%`} 
                                y1="5%" 
                                x2={`${i*18 + 10}%`} 
                                y2="85%" 
                                stroke={isDarkMode ? "#666666" : "#e5e7eb"} 
                                strokeDasharray="2,2"
                              />
                            ))}
                            {[0,20,40,60,80].map(i => (
                              <line 
                                key={`h${i}`}
                                x1="10%" 
                                y1={`${85-i*0.8}%`} 
                                x2="90%" 
                                y2={`${85-i*0.8}%`} 
                                stroke={isDarkMode ? "#666666" : "#e5e7eb"} 
                                strokeDasharray="2,2"
                              />
                            ))}
                          </svg>
                          
                          {/* 数据点 */}
                          {scatterData.map((point, i) => (
                            <div
                              key={i}
                              style={{
                                position: 'absolute',
                                left: `${10 + (point.x - 1) * 18}%`,
                                bottom: `${15 + (point.y / 60) * 70}%`,
                                width: '10px',
                                height: '10px',
                                backgroundColor: point.type === '满意点' ? '#10b981' : '#ef4444',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                transform: 'translate(-50%, 50%)',
                                border: isDarkMode ? '2px solid #ffffff' : '2px solid #000000',
                                transition: 'all 0.2s ease',
                                zIndex: 10
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translate(-50%, 50%) scale(1.5)';
                                e.target.style.boxShadow = point.type === '满意点' ? '0 0 15px rgba(16, 185, 129, 0.8)' : '0 0 15px rgba(239, 68, 68, 0.8)';
                                setHoveredPoint(point);
                                const rect = e.target.getBoundingClientRect();
                                setMousePosition({ x: rect.left + rect.width / 2, y: rect.top });
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translate(-50%, 50%) scale(1)';
                                e.target.style.boxShadow = 'none';
                                setHoveredPoint(null);
                              }}
                            />
                          ))}
                          
                          {/* Tooltip */}
                          {hoveredPoint && (
                            <div
                              style={{
                                position: 'fixed',
                                left: mousePosition.x,
                                top: mousePosition.y - 10,
                                transform: 'translate(-50%, -100%)',
                                backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                                border: isDarkMode ? '1px solid #666666' : '1px solid #d1d5db',
                                borderRadius: '8px',
                                padding: '12px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                zIndex: 1000,
                                minWidth: '200px',
                                color: isDarkMode ? '#ffffff' : '#111827'
                              }}
                            >
                              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                                {language === 'en' ? 'Theme Details' : '主题详情'}
                              </div>
                              <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                <div><strong>{language === 'en' ? 'Theme' : '主题'}:</strong> {hoveredPoint.name}</div>
                                <div><strong>{language === 'en' ? 'Rating' : '评分'}:</strong> {hoveredPoint.x}{language === 'en' ? ' stars' : '星'}</div>
                                <div><strong>{language === 'en' ? 'Mention Rate' : '提及率'}:</strong> {hoveredPoint.y}%</div>
                                <div><strong>{language === 'en' ? 'Type' : '类型'}:</strong> 
                                  <span style={{ 
                                    color: hoveredPoint.type === '满意点' ? '#10b981' : '#ef4444',
                                    fontWeight: 'bold',
                                    marginLeft: '4px'
                                  }}>
                                    {hoveredPoint.type === '满意点' ? t.analysis.positiveThemes.slice(0, -1) : t.analysis.negativeThemes.slice(0, -1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 坐标轴标签 */}
                          <div style={{
                            position: 'absolute',
                            bottom: '5px',
                            left: '10%',
                            right: '10%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            color: isDarkMode ? '#9ca3af' : '#6b7280'
                          }}>
                            <span>1星</span><span>2星</span><span>3星</span><span>4星</span><span>5星</span>
                          </div>
                          <div style={{
                            position: 'absolute',
                            left: '5px',
                            top: '5%',
                            bottom: '15%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            color: isDarkMode ? '#9ca3af' : '#6b7280'
                          }}>
                            <span>60%</span><span>40%</span><span>20%</span><span>0%</span>
                          </div>
                        </div>
                        
                        {/* 图例 */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '24px',
                          marginTop: '16px'
                        }}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#10b981',
                              borderRadius: '50%',
                              border: isDarkMode ? '2px solid #ffffff' : '2px solid #000000'
                            }}></div>
                            <span style={{fontSize: '14px', color: isDarkMode ? '#d1d5db' : '#374151'}}>
                              {t.analysis.positiveThemes} ({scatterData.filter(d => d.type === '满意点').length})
                            </span>
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#ef4444',
                              borderRadius: '50%',
                              border: isDarkMode ? '2px solid #ffffff' : '2px solid #000000'
                            }}></div>
                            <span style={{fontSize: '14px', color: isDarkMode ? '#d1d5db' : '#374151'}}>
                              {t.analysis.negativeThemes} ({scatterData.filter(d => d.type === '不满意点').length})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 按评分段详细分析 */}
              <div className="gap-system-md flex flex-col">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  {t.analysis.detailedAnalysisByRating}
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
                            {t.analysis.mainSatisfactionPoints}
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
                            {t.analysis.mainDissatisfactionPoints}
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
