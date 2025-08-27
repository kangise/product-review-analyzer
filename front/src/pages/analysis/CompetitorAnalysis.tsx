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
    new Set(['core-insights', 'preference-comparison'])
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

  // 从analysisResult中获取竞品分析数据
  const competitorData = analysisResult?.competitorAnalysis?.产品竞争力对比分析 || {}
  
  console.log('CompetitorAnalysis received data:', competitorData)

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
                <div className="gap-system-md grid md:grid-cols-2">
                  {competitorData.客户喜爱点对比.map((comparison: any, index: number) => (
                    <motion.div
                      key={index}
                      className="spacing-system-md bg-muted rounded-lg border-clean"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-sm">{comparison.主题}</h5>
                        <div className="flex gap-2">
                          <Badge 
                            variant={comparison.我方频率 === '高' ? 'default' : comparison.我方频率 === '中' ? 'secondary' : 'outline'} 
                            className="text-xs"
                          >
                            {language === 'en' ? 'Us' : '我方'}: {comparison.我方频率}
                          </Badge>
                          <Badge 
                            variant={comparison.竞品频率 === '高' ? 'default' : comparison.竞品频率 === '中' ? 'secondary' : 'outline'} 
                            className="text-xs"
                          >
                            {language === 'en' ? 'Competitor' : '竞品'}: {comparison.竞品频率}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {comparison.对比洞察}
                      </p>
                    </motion.div>
                  ))}
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
