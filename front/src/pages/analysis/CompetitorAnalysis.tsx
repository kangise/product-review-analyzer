import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, Users, MessageSquare, ChevronRight, Tag, Target, Lightbulb, Zap, Info, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'

interface CompetitorAnalysisProps {
  language: 'en' | 'zh'
  t: any
  analysisResult: any
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
  language,
  t,
  analysisResult
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['competitor-base', 'competitor-comparison', 'competitor-unique'])  // 竞品基础分析默认展开
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
      quotesArray = quotes.split(/\n|；|;|\|/).filter(q => q.trim().length > 0)
    } else if (Array.isArray(quotes)) {
      quotesArray = quotes
    }
    setSelectedQuotes({ quotes: quotesArray, title })
  }

  // 从analysisResult中获取新的竞品分析数据结构
  const competitorData = analysisResult?.competitor || {}
  const competitorBase = competitorData?.竞品基础分析 || {}
  const competitorComparison = competitorData?.竞品对比分析 || {}
  const competitorUnique = competitorData?.竞品独有洞察 || {}
  
  console.log('=== CompetitorAnalysis Debug ===')
  console.log('CompetitorAnalysis received analysisResult:', analysisResult)
  console.log('CompetitorAnalysis competitorData:', competitorData)
  console.log('Has competitor data:', !!competitorData)
  console.log('Competitor keys:', Object.keys(competitorData))
  console.log('Has comparison:', !!competitorComparison)
  console.log('Comparison keys:', Object.keys(competitorComparison))
  console.log('Has evaluation:', !!competitorComparison?.综合竞争力评估)
  console.log('Has advantages:', !!competitorComparison?.综合竞争力评估?.竞争优势分析)
  console.log('Advantages length:', competitorComparison?.综合竞争力评估?.竞争优势分析?.length)
  console.log('=== End Debug ===')

  // 如果没有竞品数据，显示提示
  if (!competitorData || Object.keys(competitorData).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {language === 'en' ? 'No competitor data available' : '暂无竞品分析数据'}
        </p>
      </div>
    )
  }

  return (
    <motion.div 
      className="gap-system-xl flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="gap-system-sm flex items-center">
          <BarChart3 className="h-5 w-5 text-primary" />
          <div>
            <h2 className="mb-1 text-foreground">{t.nav.competitive}</h2>
            <div className="gap-system-sm flex items-center text-sm text-muted-foreground">
              <span>{language === 'en' ? 'Comprehensive competitor analysis across three dimensions' : '三维度竞品全面分析'}</span>
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

      {/* 竞品对比分析模块 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('competitor-comparison')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base text-foreground">
              <div className="gap-system-sm flex items-center">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Competitor Comparison Analysis' : '竞品对比分析'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('competitor-comparison') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('competitor-comparison') && (
            <CardContent className="spacing-system-lg">
              <div className="gap-system-lg flex flex-col">
                
                {/* 综合竞争力评估 - 放在最顶上 */}
                {competitorComparison?.综合竞争力评估 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      {language === 'en' ? 'Comprehensive Competitiveness Assessment' : '综合竞争力评估'}
                    </h4>
                    
                    {/* 核心洞察 */}
                    <div className="spacing-system-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <h5 className="font-medium text-sm text-blue-700 dark:text-blue-300">
                          {language === 'en' ? 'Core Insights' : '核心洞察'}
                        </h5>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                        {competitorComparison.综合竞争力评估.核心洞察}
                      </p>
                    </div>
                    
                    <div className="grid gap-4">
                      {/* 竞争优势分析 */}
                      {competitorComparison.综合竞争力评估.竞争优势分析 && competitorComparison.综合竞争力评估.竞争优势分析.length > 0 && (
                        <div>
                          <h5 className="font-medium text-base text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            {language === 'en' ? 'Competitive Advantages' : '竞争优势分析'}
                          </h5>
                          <div className="grid gap-3 md:grid-cols-2">
                            {competitorComparison.综合竞争力评估.竞争优势分析.map((item: any, idx: number) => (
                              <div key={idx} className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-sm">{item.优势领域}</span>
                                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">{item.优势程度}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                                  <span>我方: {item.我方表现}</span>
                                  <span>竞品: {item.竞品表现}</span>
                                </div>
                                <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">{item.洞察说明}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 竞争劣势分析 */}
                      {competitorComparison.综合竞争力评估.竞争劣势分析 && competitorComparison.综合竞争力评估.竞争劣势分析.length > 0 && (
                        <div>
                          <h5 className="font-medium text-base text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                            <ThumbsDown className="h-4 w-4" />
                            {language === 'en' ? 'Competitive Disadvantages' : '竞争劣势分析'}
                          </h5>
                          <div className="grid gap-3 md:grid-cols-2">
                            {competitorComparison.综合竞争力评估.竞争劣势分析.map((item: any, idx: number) => (
                              <div key={idx} className="spacing-system-sm bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-sm">{item.劣势领域}</span>
                                  <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300">{item.劣势程度}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                                  <span>我方: {item.我方表现}</span>
                                  <span>竞品: {item.竞品表现}</span>
                                </div>
                                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">{item.改进建议}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 战略建议 */}
                      {competitorComparison.综合竞争力评估.战略建议 && (
                        <div>
                          <h5 className="font-medium text-base text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            {language === 'en' ? 'Strategic Recommendations' : '战略建议'}
                          </h5>
                          <div className="grid gap-3 md:grid-cols-2">
                            {Object.entries(competitorComparison.综合竞争力评估.战略建议).map(([key, value]: [string, any], idx: number) => (
                              <div key={idx} className="spacing-system-sm bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                <div className="font-medium text-sm mb-2 text-purple-700 dark:text-purple-300">{key}</div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 leading-relaxed">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 消费者喜爱点对比 */}
                {competitorComparison?.消费者喜爱点对比 && (
                  <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 p-6 mb-8">
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-3 text-blue-700 dark:text-blue-300">
                      <TrendingUp className="h-5 w-5" />
                      {language === 'en' ? 'Consumer Love Points Comparison' : '消费者喜爱点对比'}
                    </h3>
                    <div className="border-b border-blue-200 dark:border-blue-700 mb-6"></div>
                    {(() => {
                      const items = competitorComparison.消费者喜爱点对比.对比项目 || []
                      const quadrants = {
                        bothHigh: items.filter((item: any) => item.象限分类 === '双高'),
                        ourAdvantage: items.filter((item: any) => item.象限分类 === '我方优势'),
                        competitorAdvantage: items.filter((item: any) => item.象限分类 === '竞品优势'),
                        bothLow: items.filter((item: any) => item.象限分类 === '双低')
                      }

                      return (
                        <div className="grid grid-cols-2 gap-6">
                          {/* 双高象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                {language === 'en' ? 'Both High' : '双高'}
                                <Badge variant="secondary" className="text-xs">{quadrants.bothHigh.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#fecaca', color: '#991b1b', borderRadius: '4px', fontSize: '12px'}}>Competitive Battlefield</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#fecaca', color: '#991b1b', borderRadius: '4px', fontSize: '12px'}}>竞争战场</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.bothHigh.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-green-700 dark:text-green-300">{item.喜爱点}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="default" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="default" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 我方优势象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                {language === 'en' ? 'Our Advantage' : '我方优势'}
                                <Badge variant="secondary" className="text-xs">{quadrants.ourAdvantage.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px'}}>Leverage Strengths</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px'}}>发挥强项</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.ourAdvantage.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-blue-700 dark:text-blue-300">{item.喜爱点}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="default" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="outline" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 竞品优势象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                {language === 'en' ? 'Competitor Advantage' : '竞品优势'}
                                <Badge variant="secondary" className="text-xs">{quadrants.competitorAdvantage.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#dc2626', color: 'white', borderRadius: '4px', fontSize: '12px'}}>Catch Up</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#dc2626', color: 'white', borderRadius: '4px', fontSize: '12px'}}>追赶改进</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.competitorAdvantage.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-red-700 dark:text-red-300">{item.喜爱点}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="outline" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="destructive" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 双低象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                {language === 'en' ? 'Both Low' : '双低'}
                                <Badge variant="secondary" className="text-xs">{quadrants.bothLow.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#22c55e', color: 'white', borderRadius: '4px', fontSize: '12px'}}>Innovation Opportunity</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#22c55e', color: 'white', borderRadius: '4px', fontSize: '12px'}}>创新机会</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.bothLow.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-gray-700 dark:text-gray-300">{item.喜爱点}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="outline" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="outline" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* 未满足需求对比 */}
                {competitorComparison?.未满足需求对比 && (
                  <div className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg border border-red-200/50 dark:border-red-800/50 p-6 mb-8">
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-3 text-red-700 dark:text-red-300">
                      <TrendingDown className="h-5 w-5" />
                      {language === 'en' ? 'Unmet Needs Comparison' : '未满足需求对比'}
                      <span className="text-sm font-normal text-muted-foreground">({language === 'en' ? 'Lower is better' : '频率越低越好'})</span>
                    </h3>
                    <div className="border-b border-red-200 dark:border-red-700 mb-6"></div>
                    {(() => {
                      const items = competitorComparison.未满足需求对比.对比项目 || []
                      const quadrants = {
                        bothHigh: items.filter((item: any) => item.象限分类 === '双高问题'),
                        ourAdvantage: items.filter((item: any) => item.象限分类 === '竞品问题更多'),
                        competitorAdvantage: items.filter((item: any) => item.象限分类 === '我方问题更多'),
                        bothLow: items.filter((item: any) => item.象限分类 === '双低问题')
                      }

                      return (
                        <div className="grid grid-cols-2 gap-6">
                          {/* 双高问题象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                {language === 'en' ? 'Both High Issues' : '双高问题'}
                                <Badge variant="secondary" className="text-xs">{quadrants.bothHigh.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#dc2626', color: 'white', borderRadius: '4px', fontSize: '12px'}}>Critical Issues</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#dc2626', color: 'white', borderRadius: '4px', fontSize: '12px'}}>关键问题</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.bothHigh.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-red-700 dark:text-red-300">{item.未满足需求}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="destructive" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="destructive" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 我方表现更好象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                {language === 'en' ? 'We Perform Better' : '我方表现更好'}
                                <Badge variant="secondary" className="text-xs">{quadrants.ourAdvantage.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px'}}>Maintain Advantage</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px'}}>保持优势</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.ourAdvantage.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-green-700 dark:text-green-300">{item.未满足需求}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="outline" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="destructive" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 我方需要改进象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                {language === 'en' ? 'We Need Improvement' : '我方需要改进'}
                                <Badge variant="secondary" className="text-xs">{quadrants.competitorAdvantage.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#fed7aa', color: '#c2410c', borderRadius: '4px', fontSize: '12px'}}>Priority Fix</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#fed7aa', color: '#c2410c', borderRadius: '4px', fontSize: '12px'}}>优先修复</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.competitorAdvantage.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-orange-700 dark:text-orange-300">{item.未满足需求}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="destructive" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="outline" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-orange-600 dark:text-orange-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 双低问题象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                {language === 'en' ? 'Both Perform Well' : '双方表现良好'}
                                <Badge variant="secondary" className="text-xs">{quadrants.bothLow.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '12px'}}>Stable Areas</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '12px'}}>稳定领域</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.bothLow.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-blue-700 dark:text-blue-300">{item.未满足需求}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="outline" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="outline" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* 购买动机对比 */}
                {competitorComparison?.购买动机对比 && (
                  <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50 p-6 mb-8">
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-3 text-purple-700 dark:text-purple-300">
                      <Users className="h-5 w-5" />
                      {language === 'en' ? 'Purchase Motivation Comparison' : '购买动机对比'}
                    </h3>
                    <div className="border-b border-purple-200 dark:border-purple-700 mb-6"></div>
                    {(() => {
                      const items = competitorComparison.购买动机对比.对比项目 || []
                      const quadrants = {
                        bothHigh: items.filter((item: any) => item.象限分类 === '双高'),
                        ourAdvantage: items.filter((item: any) => item.象限分类 === '我方优势'),
                        competitorAdvantage: items.filter((item: any) => item.象限分类 === '竞品优势'),
                        bothLow: items.filter((item: any) => item.象限分类 === '双低')
                      }

                      return (
                        <div className="grid grid-cols-2 gap-6">
                          {/* 双高象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                {language === 'en' ? 'Both High' : '双高'}
                                <Badge variant="secondary" className="text-xs">{quadrants.bothHigh.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#e9d5ff', color: '#7c3aed', borderRadius: '4px', fontSize: '12px'}}>Core Motivations</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#e9d5ff', color: '#7c3aed', borderRadius: '4px', fontSize: '12px'}}>核心动机</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.bothHigh.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-purple-700 dark:text-purple-300">{item.购买动机}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="default" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="default" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-purple-600 dark:text-purple-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 我方优势象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                {language === 'en' ? 'Our Advantage' : '我方优势'}
                                <Badge variant="secondary" className="text-xs">{quadrants.ourAdvantage.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '12px'}}>Unique Appeal</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '12px'}}>独特吸引力</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.ourAdvantage.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-indigo-700 dark:text-indigo-300">{item.购买动机}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="default" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="outline" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 竞品优势象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                {language === 'en' ? 'Competitor Advantage' : '竞品优势'}
                                <Badge variant="secondary" className="text-xs">{quadrants.competitorAdvantage.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#fed7aa', color: '#c2410c', borderRadius: '4px', fontSize: '12px'}}>Learn & Adapt</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#fed7aa', color: '#c2410c', borderRadius: '4px', fontSize: '12px'}}>学习适应</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.competitorAdvantage.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-orange-700 dark:text-orange-300">{item.购买动机}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="outline" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="default" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-orange-600 dark:text-orange-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* 双低象限 */}
                          <div>
                            <h5 className="font-medium text-sm mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                {language === 'en' ? 'Both Low' : '双低'}
                                <Badge variant="secondary" className="text-xs">{quadrants.bothLow.length}</Badge>
                              </div>
                              {language === 'en' ? (
                                <span style={{padding: '4px 8px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '4px', fontSize: '12px'}}>Potential Market</span>
                              ) : (
                                <span style={{padding: '4px 8px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '4px', fontSize: '12px'}}>潜在市场</span>
                              )}
                            </h5>
                            <div className="gap-3 flex flex-col">
                              {quadrants.bothLow.map((item: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className="spacing-system-sm bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-xs text-gray-700 dark:text-gray-300">{item.购买动机}</h6>
                                    <div className="flex gap-1">
                                      <Badge variant="outline" className="text-xs">我方: {item.我方频率}</Badge>
                                      <Badge variant="outline" className="text-xs">竞品: {item.竞品频率}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {item.对比洞察}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* 竞品独有洞察模块 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('competitor-unique')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base text-foreground">
              <div className="gap-system-sm flex items-center">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Competitor Unique Insights' : '竞品独有洞察'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('competitor-unique') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('competitor-unique') && (
            <CardContent className="spacing-system-lg">
              <div className="gap-system-lg flex flex-col">
                
                {/* 竞品独有优势 */}
                {competitorUnique?.竞品独有优势 && competitorUnique.竞品独有优势.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      {language === 'en' ? 'Competitor Unique Advantages' : '竞品独有优势'}
                    </h4>
                    <div className="gap-system-md grid grid-cols-1">
                      {competitorUnique.竞品独有优势.map((item: any, index: number) => {
                        const frequency = parseFloat(item.频率?.replace('%', '') || '0')
                        return (
                          <motion.div
                            key={index}
                            className="spacing-system-sm bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-sm text-yellow-700 dark:text-yellow-300">
                                {item.优势点}
                              </h5>
                              <Badge variant="secondary" className="text-xs">
                                {item.频率}
                              </Badge>
                            </div>
                            {frequency > 0 && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-yellow-600 dark:text-yellow-400 mb-1">
                                  <span>频率</span>
                                  <span>{item.频率}</span>
                                </div>
                                <Progress value={frequency} className="h-2" />
                              </div>
                            )}
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
                              {item.消费者描述}
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2 font-medium">
                              {language === 'en' ? 'Inspiration: ' : '对我方启发: '}{item.对我方启发}
                            </p>
                            {item.相关评论示例 && item.相关评论示例.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => showQuotes(item.相关评论示例, item.优势点)}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {language === 'en' ? 'View Examples' : '查看示例'}
                              </Button>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 总结洞察 */}
                {competitorUnique?.总结洞察 && (
                  <div>
                    <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-indigo-600" />
                      {language === 'en' ? 'Summary Insights' : '总结洞察'}
                    </h4>
                    <motion.div
                      className="spacing-system-md bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      {competitorUnique.总结洞察.关键发现 && (
                        <div className="mb-3">
                          <h5 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-1">
                            {language === 'en' ? 'Key Findings' : '关键发现'}
                          </h5>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            {competitorUnique.总结洞察.关键发现}
                          </p>
                        </div>
                      )}
                      {competitorUnique.总结洞察.战略意义 && (
                        <div className="mb-3">
                          <h5 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-1">
                            {language === 'en' ? 'Strategic Significance' : '战略意义'}
                          </h5>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            {competitorUnique.总结洞察.战略意义}
                          </p>
                        </div>
                      )}
                      {competitorUnique.总结洞察.行动建议 && (
                        <div>
                          <h5 className="font-medium text-sm text-indigo-700 dark:text-indigo-300 mb-1">
                            {language === 'en' ? 'Action Recommendations' : '行动建议'}
                          </h5>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            {competitorUnique.总结洞察.行动建议}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* 竞品基础分析模块 - 放在最下方，默认收起 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('competitor-base')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base text-foreground">
              <div className="gap-system-sm flex items-center">
                <Target className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Competitor Base Analysis' : '竞品基础分析'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('competitor-base') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('competitor-base') && (
            <CardContent className="spacing-system-lg">
              <div className="gap-system-lg flex flex-col">
                
                {/* 竞品消费者喜爱点 */}
                {competitorBase?.竞品消费者喜爱点 && (
                  <div>
                    <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      {language === 'en' ? 'Competitor Consumer Love Points' : '竞品消费者喜爱点'}
                    </h4>
                    <div className="gap-system-md grid grid-cols-1 md:grid-cols-2">
                      {competitorBase.竞品消费者喜爱点.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm text-green-700 dark:text-green-300">
                              {item.赞美点}
                            </h5>
                            <Badge variant="secondary" className="text-xs">
                              {item.频率}
                            </Badge>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                            {item.消费者描述}
                          </p>
                          {item.相关评论示例 && item.相关评论示例.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => showQuotes(item.相关评论示例, item.赞美点)}
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {language === 'en' ? 'View Examples' : '查看示例'}
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 竞品未满足需求 */}
                {competitorBase?.竞品未满足需求 && (
                  <div>
                    <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      {language === 'en' ? 'Competitor Unmet Needs' : '竞品未满足需求'}
                    </h4>
                    <div className="gap-system-md grid grid-cols-1 md:grid-cols-2">
                      {competitorBase.竞品未满足需求.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          className="spacing-system-sm bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm text-red-700 dark:text-red-300">
                              {item['痛点/未满足的需求'] || item.未满足需求}
                            </h5>
                            <Badge variant="destructive" className="text-xs">
                              {item.重要性 || item.频率}
                            </Badge>
                          </div>
                          <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                            {item.消费者描述}
                          </p>
                          {item.相关评论示例 && item.相关评论示例.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => showQuotes(item.相关评论示例, item['痛点/未满足的需求'] || item.未满足需求)}
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {language === 'en' ? 'View Examples' : '查看示例'}
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 竞品购买动机 */}
                {competitorBase?.竞品购买动机 && (
                  <div>
                    <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      {language === 'en' ? 'Competitor Purchase Motivations' : '竞品购买动机'}
                    </h4>
                    <div className="gap-system-md grid grid-cols-1 md:grid-cols-2">
                      {competitorBase.竞品购买动机.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          className="spacing-system-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm text-blue-700 dark:text-blue-300">
                              {item.动机}
                            </h5>
                            <Badge variant="outline" className="text-xs">
                              {item.动机重要性 || item.频率}
                            </Badge>
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                            {item.消费者描述}
                          </p>
                          {item.相关评论示例 && item.相关评论示例.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => showQuotes(item.相关评论示例, item.动机)}
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {language === 'en' ? 'View Examples' : '查看示例'}
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Quote Modal */}
      {selectedQuotes && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedQuotes(null)}
        >
          <motion.div
            className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">{selectedQuotes.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedQuotes(null)}
              >
                ×
              </Button>
            </div>
            <div className="gap-system-sm flex flex-col">
              {selectedQuotes.quotes.map((quote, index) => (
                <div
                  key={index}
                  className="spacing-system-sm bg-accent rounded-lg border-clean"
                >
                  <p className="text-sm text-muted-foreground">"{quote}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
