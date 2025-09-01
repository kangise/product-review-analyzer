import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, Users, MessageSquare, ChevronRight, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'

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
    new Set(['core-insights', 'preference-comparison', 'unmet-needs-comparison', 'purchase-motivation', 'competitive-assessment'])
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

  // 从analysisResult中获取竞品分析数据
  const competitorData = analysisResult?.competitorAnalysis?.产品竞争力对比分析 || {}
  
  console.log('CompetitorAnalysis received analysisResult:', analysisResult)
  console.log('CompetitorAnalysis competitorData:', competitorData)
  console.log('核心洞察总结:', competitorData.核心洞察总结)

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
          <BarChart3 className="h-5 w-5 text-primary" />
          <div>
            <h2 className="mb-1">{t.nav.competitive}</h2>
            <div className="gap-system-sm flex items-center text-sm text-muted-foreground">
              <span>{language === 'en' ? 'Competitive positioning analysis and market comparison insights' : '竞争定位分析和市场对比洞察'}</span>
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

      {/* Core Insights Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('core-insights')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
              <div className="gap-system-sm flex items-center">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Core Competitive Insights' : '核心竞争洞察'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('core-insights') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('core-insights') && (
            <CardContent className="spacing-system-lg">
              {competitorData.核心洞察总结 && (
                <div className="gap-system-lg flex flex-col">
                  {/* 我方核心优势 */}
                  <motion.div 
                    className="spacing-system-md bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <h4 className="font-medium text-sm text-green-700 dark:text-green-300">
                        {language === 'en' ? 'Our Core Advantages' : '我方核心优势'}
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                      {competitorData.核心洞察总结?.我方核心优势}
                    </p>
                  </motion.div>

                  {/* 我方核心劣势 */}
                  <motion.div 
                    className="spacing-system-md bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <h4 className="font-medium text-sm text-red-700 dark:text-red-300">
                        {language === 'en' ? 'Our Core Weaknesses' : '我方核心劣势'}
                      </h4>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                      {competitorData.核心洞察总结?.我方核心劣势}
                    </p>
                  </motion.div>

                  {/* 品类共性关键 */}
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">
                        {language === 'en' ? 'Category Common Factors' : '品类共性关键'}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {competitorData.核心洞察总结?.品类共性关键}
                    </p>
                  </motion.div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>



      {/* Customer Preference Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('preference-comparison')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
              <div className="gap-system-sm flex items-center">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Customer Preference Comparison' : '客户喜爱点对比'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('preference-comparison') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('preference-comparison') && (
            <CardContent className="spacing-system-lg">
              {competitorData.客户喜爱点对比 && (
                <div>
                  {/* 四象限分类 */}
                  {(() => {
                    const quadrants = {
                      bothHigh: competitorData.客户喜爱点对比.filter((item: any) => item.我方频率 === '高' && item.竞品频率 === '高'),
                      ourAdvantage: competitorData.客户喜爱点对比.filter((item: any) => item.我方频率 === '高' && (item.竞品频率 === '中' || item.竞品频率 === '低' || item.竞品频率 === '几乎不提及')),
                      competitorAdvantage: competitorData.客户喜爱点对比.filter((item: any) => (item.我方频率 === '中' || item.我方频率 === '低' || item.我方频率 === '几乎不提及') && item.竞品频率 === '高'),
                      bothLow: competitorData.客户喜爱点对比.filter((item: any) => (item.我方频率 === '中' || item.我方频率 === '低' || item.我方频率 === '几乎不提及') && (item.竞品频率 === '中' || item.竞品频率 === '低' || item.竞品频率 === '几乎不提及'))
                    }

                    return (
                      <div className="grid grid-cols-2 gap-6">
                        {/* 双高象限 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            {language === 'en' ? 'Both High (Competitive Battlefield)' : '双高（竞争战场）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.bothHigh.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.bothHigh.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-green-700 dark:text-green-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="default" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="default" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 我方优势象限 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            {language === 'en' ? 'Our Advantage (Leverage Strengths)' : '我方优势（发挥强项）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.ourAdvantage.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.ourAdvantage.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-blue-700 dark:text-blue-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="default" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="outline" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 竞品优势象限 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            {language === 'en' ? 'Competitor Advantage (Catch Up)' : '竞品优势（追赶改进）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.competitorAdvantage.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.competitorAdvantage.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-red-700 dark:text-red-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="destructive" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 双低象限 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            {language === 'en' ? 'Both Low (Innovation Opportunity)' : '双低（创新机会）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.bothLow.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.bothLow.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-gray-700 dark:text-gray-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="outline" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {comparison.对比洞察}
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
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* 未满足需求对比 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('unmet-needs-comparison')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
              <div className="gap-system-sm flex items-center">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span>{language === 'en' ? 'Unmet Needs Comparison' : '未满足需求对比'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('unmet-needs-comparison') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('unmet-needs-comparison') && (
            <CardContent className="spacing-system-lg">
              {competitorData.未满足需求对比 && (
                <div>
                  {/* 四象限分类 */}
                  {(() => {
                    const quadrants = {
                      bothHigh: competitorData.未满足需求对比.filter((item: any) => item.我方频率 === '高' && item.竞品频率 === '高'),
                      ourAdvantage: competitorData.未满足需求对比.filter((item: any) => item.我方频率 === '高' && (item.竞品频率 === '中' || item.竞品频率 === '低' || item.竞品频率 === '几乎不提及')),
                      competitorAdvantage: competitorData.未满足需求对比.filter((item: any) => (item.我方频率 === '中' || item.我方频率 === '低' || item.我方频率 === '几乎不提及') && item.竞品频率 === '高'),
                      bothLow: competitorData.未满足需求对比.filter((item: any) => (item.我方频率 === '中' || item.我方频率 === '低' || item.我方频率 === '几乎不提及') && (item.竞品频率 === '中' || item.竞品频率 === '低' || item.竞品频率 === '几乎不提及'))
                    }

                    return (
                      <div className="grid grid-cols-2 gap-6">
                        {/* 双高象限 - 对于问题来说是最糟糕的情况 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                            {language === 'en' ? 'Both High (Critical Issues)' : '双高（严重问题）'}
                            <Badge variant="destructive" className="text-xs">{quadrants.bothHigh.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.bothHigh.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-red-800 dark:text-red-200">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="destructive" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="destructive" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 我方劣势象限 - 我们问题多，竞品问题少 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            {language === 'en' ? 'Our Weakness (Priority Fix)' : '我方劣势（优先修复）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.ourAdvantage.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.ourAdvantage.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-orange-700 dark:text-orange-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="destructive" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="outline" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-orange-600 dark:text-orange-400 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 竞品劣势象限 - 竞品问题多，我们问题少 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            {language === 'en' ? 'Competitor Weakness (Our Advantage)' : '竞品劣势（我方优势）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.competitorAdvantage.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.competitorAdvantage.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-green-700 dark:text-green-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="destructive" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 双低象限 - 都没什么问题，好现象 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            {language === 'en' ? 'Both Low (Good Performance)' : '双低（表现良好）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.bothLow.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.bothLow.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-blue-700 dark:text-blue-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="outline" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                  {comparison.对比洞察}
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
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* 购买动机对比 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('purchase-motivation')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
              <div className="gap-system-sm flex items-center">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{language === 'en' ? 'Purchase Motivation Comparison' : '购买动机对比'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('purchase-motivation') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('purchase-motivation') && (
            <CardContent className="spacing-system-lg">
              {competitorData.购买动机对比 && (
                <div>
                  {/* 四象限分类 */}
                  {(() => {
                    const quadrants = {
                      bothHigh: competitorData.购买动机对比.filter((item: any) => item.我方频率 === '高' && item.竞品频率 === '高'),
                      ourAdvantage: competitorData.购买动机对比.filter((item: any) => item.我方频率 === '高' && (item.竞品频率 === '中' || item.竞品频率 === '低' || item.竞品频率 === '几乎不提及')),
                      competitorAdvantage: competitorData.购买动机对比.filter((item: any) => (item.我方频率 === '中' || item.我方频率 === '低' || item.我方频率 === '几乎不提及') && item.竞品频率 === '高'),
                      bothLow: competitorData.购买动机对比.filter((item: any) => (item.我方频率 === '中' || item.我方频率 === '低' || item.我方频率 === '几乎不提及') && (item.竞品频率 === '中' || item.竞品频率 === '低' || item.竞品频率 === '几乎不提及'))
                    }

                    return (
                      <div className="grid grid-cols-2 gap-6">
                        {/* 双高象限 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            {language === 'en' ? 'Both High (Core Market)' : '双高（核心市场）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.bothHigh.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.bothHigh.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-purple-700 dark:text-purple-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="default" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="default" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 我方优势象限 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            {language === 'en' ? 'Our Advantage (Unique Appeal)' : '我方优势（独特吸引力）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.ourAdvantage.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.ourAdvantage.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-green-700 dark:text-green-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="default" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="outline" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 竞品优势象限 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            {language === 'en' ? 'Competitor Advantage (Learn & Improve)' : '竞品优势（学习改进）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.competitorAdvantage.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.competitorAdvantage.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-orange-700 dark:text-orange-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="default" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-orange-600 dark:text-orange-400 leading-relaxed">
                                  {comparison.对比洞察}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* 双低象限 */}
                        <div>
                          <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            {language === 'en' ? 'Both Low (Untapped Market)' : '双低（未开发市场）'}
                            <Badge variant="secondary" className="text-xs">{quadrants.bothLow.length}</Badge>
                          </h5>
                          <div className="gap-3 flex flex-col">
                            {quadrants.bothLow.map((comparison: any, index: number) => (
                              <motion.div
                                key={index}
                                className="spacing-system-sm bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-xs text-gray-700 dark:text-gray-300">{comparison.主题}</h6>
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">我方: {comparison.我方频率}</Badge>
                                    <Badge variant="outline" className="text-xs">竞品: {comparison.竞品频率}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {comparison.对比洞察}
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
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* 综合竞争力评估 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('competitive-assessment')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
              <div className="gap-system-sm flex items-center">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span>{language === 'en' ? 'Comprehensive Competitive Assessment' : '综合竞争力评估'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('competitive-assessment') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('competitive-assessment') && (
            <CardContent className="spacing-system-lg">
              {competitorData.综合竞争力评估 && (
                <div className="gap-system-lg flex flex-col">
                  {/* 核心竞争优势 */}
                  {competitorData.综合竞争力评估.核心竞争优势 && (
                    <motion.div 
                      className="spacing-system-md bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium text-sm text-green-700 dark:text-green-300">
                          {language === 'en' ? 'Core Competitive Advantages' : '核心竞争优势'}
                        </h4>
                      </div>
                      <div className="gap-2 flex flex-col">
                        {competitorData.综合竞争力评估.核心竞争优势.map((advantage: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                              {advantage}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 亟需改进短板 */}
                  {competitorData.综合竞争力评估.亟需改进短板 && (
                    <motion.div 
                      className="spacing-system-md bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <h4 className="font-medium text-sm text-red-700 dark:text-red-300">
                          {language === 'en' ? 'Critical Areas for Improvement' : '亟需改进短板'}
                        </h4>
                      </div>
                      <div className="gap-2 flex flex-col">
                        {competitorData.综合竞争力评估.亟需改进短板.map((weakness: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                              {weakness}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 战略建议 */}
                  {competitorData.综合竞争力评估.战略建议 && (
                    <motion.div 
                      className="spacing-system-md bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300">
                          {language === 'en' ? 'Strategic Recommendations' : '战略建议'}
                        </h4>
                      </div>
                      <div className="gap-3 flex flex-col">
                        {Object.entries(competitorData.综合竞争力评估.战略建议).map(([key, value]: [string, any], index: number) => (
                          <div key={index}>
                            <h5 className="font-medium text-xs text-purple-700 dark:text-purple-300 mb-1">
                              {key === '产品改进' ? (language === 'en' ? 'Product Improvement' : '产品改进') :
                               key === '市场定位' ? (language === 'en' ? 'Market Positioning' : '市场定位') :
                               key === '营销策略' ? (language === 'en' ? 'Marketing Strategy' : '营销策略') : key}
                            </h5>
                            <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
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
            className="relative w-full max-w-2xl max-h-[70vh] mx-auto"
          >
            <Card className="border-clean shadow-clean-lg">
              <CardHeader className="spacing-system-sm border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-system-sm">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    {t.ui.examples}
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
                    {t.ui.close}
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
