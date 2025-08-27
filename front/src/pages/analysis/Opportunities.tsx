import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Lightbulb, Zap, Target, ChevronDown, ChevronRight, MessageSquare, Info, Tag, ArrowRight, CheckCircle, DollarSign, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

interface OpportunitiesProps {
  language: 'en' | 'zh'
  t: any
  analysisResult: any
  activeTab?: string
}

export const Opportunities: React.FC<OpportunitiesProps> = ({
  language,
  t,
  analysisResult,
  activeTab = 'improvement'
}) => {
  const [selectedQuotes, setSelectedQuotes] = useState<{quotes: string[], title: string} | null>(null)

  const showQuotes = (quotes: string[], title: string) => {
    setSelectedQuotes({ quotes, title })
  }

  // 从analysisResult中获取数据，适配现有结构
  const opportunityData = analysisResult?.ownBrandAnalysis?.opportunities || {}

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
      case '高':
        return 'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
      case 'medium':
      case '中':
        return 'bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
      case 'low':
      case '低':
        return 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
      default:
        return 'bg-gray-100 dark:bg-gray-950/20 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
    }
  }

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
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <h2 className="mb-1">{t.nav.opportunities}</h2>
            <div className="gap-system-sm flex items-center text-sm text-muted-foreground">
              <span>{language === 'en' ? 'Three-dimensional opportunity analysis and strategic recommendations' : '三维机会分析和战略建议'}</span>
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

      {/* Core Insights Summary */}
      {opportunityData.商业机会洞察?.核心洞察总结 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-clean shadow-clean bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="spacing-system-lg">
              <div className="gap-system-sm flex items-start">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{language === 'en' ? 'Core Business Opportunity Insights' : '核心商业机会洞察'}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {opportunityData.商业机会洞察.核心洞察总结}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Opportunity Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="improvement" className="gap-system-xs">
              <Lightbulb className="h-4 w-4" />
              {language === 'en' ? 'Product Improvement' : '产品改进'}
            </TabsTrigger>
            <TabsTrigger value="innovation" className="gap-system-xs">
              <Zap className="h-4 w-4" />
              {language === 'en' ? 'Product Innovation' : '产品创新'}
            </TabsTrigger>
            <TabsTrigger value="marketing" className="gap-system-xs">
              <Target className="h-4 w-4" />
              {language === 'en' ? 'Marketing Positioning' : '营销定位'}
            </TabsTrigger>
          </TabsList>

          {/* Product Improvement Tab */}
          <TabsContent value="improvement" className="mt-6">
            <Card className="border-clean shadow-clean">
              <CardHeader className="spacing-system-lg border-b border-border">
                <CardTitle className="gap-system-sm flex items-center text-base">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span>{language === 'en' ? 'Product Improvement Opportunities' : '产品改进机会'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="spacing-system-lg">
                {opportunityData.商业机会洞察?.产品改进机会 && (
                  <div className="gap-system-lg flex flex-col">
                    {opportunityData.商业机会洞察.产品改进机会.map((opportunity: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-border rounded-lg spacing-system-lg hover:shadow-clean-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2 text-primary">
                              {opportunity.机会名称}
                            </h4>
                            <div className="gap-system-sm flex items-center mb-3">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {language === 'en' ? 'Target Users: ' : '目标用户: '}{opportunity.目标用户}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                            {language === 'en' ? 'Improvement' : '改进机会'}
                          </Badge>
                        </div>

                        <div className="gap-system-md grid md:grid-cols-2 mb-4">
                          <div>
                            <h5 className="font-medium text-sm mb-2">{language === 'en' ? 'Core Solution' : '核心方案'}</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {opportunity.核心方案}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-2">{language === 'en' ? 'Implementation Path' : '实施路径'}</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {opportunity.实施路径}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            {language === 'en' ? 'Expected Value' : '预期价值'}
                          </h5>
                          <p className="text-sm text-muted-foreground leading-relaxed bg-green-50 dark:bg-green-950/20 rounded-lg spacing-system-sm border border-green-200 dark:border-green-800">
                            {opportunity.预期价值}
                          </p>
                        </div>

                        {opportunity.启发性评论原文 && (
                          <div className="pt-4 border-t border-border">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => showQuotes(opportunity.启发性评论原文, opportunity.机会名称)}
                              className="gap-system-xs text-sm"
                            >
                              <MessageSquare className="h-4 w-4" />
                              {language === 'en' ? 'View Supporting Quotes' : '查看支撑性评论'}
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Innovation Tab */}
          <TabsContent value="innovation" className="mt-6">
            <Card className="border-clean shadow-clean">
              <CardHeader className="spacing-system-lg border-b border-border">
                <CardTitle className="gap-system-sm flex items-center text-base">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>{language === 'en' ? 'Product Innovation Opportunities' : '产品创新机会'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="spacing-system-lg">
                {opportunityData.商业机会洞察?.产品创新机会 && (
                  <div className="gap-system-lg flex flex-col">
                    {opportunityData.商业机会洞察.产品创新机会.map((innovation: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-border rounded-lg spacing-system-lg hover:shadow-clean-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2 text-primary">
                              {innovation.机会名称}
                            </h4>
                            <div className="gap-system-sm flex items-center mb-3">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {language === 'en' ? 'Target Users: ' : '目标用户: '}{innovation.目标用户}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                            {language === 'en' ? 'Innovation' : '创新机会'}
                          </Badge>
                        </div>

                        <div className="gap-system-md grid md:grid-cols-2 mb-4">
                          <div>
                            <h5 className="font-medium text-sm mb-2">{language === 'en' ? 'Core Solution' : '核心方案'}</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {innovation.核心方案}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-2">{language === 'en' ? 'Implementation Path' : '实施路径'}</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {innovation.实施路径}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            {language === 'en' ? 'Expected Value' : '预期价值'}
                          </h5>
                          <p className="text-sm text-muted-foreground leading-relaxed bg-green-50 dark:bg-green-950/20 rounded-lg spacing-system-sm border border-green-200 dark:border-green-800">
                            {innovation.预期价值}
                          </p>
                        </div>

                        {innovation.启发性评论原文 && (
                          <div className="pt-4 border-t border-border">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => showQuotes(innovation.启发性评论原文, innovation.机会名称)}
                              className="gap-system-xs text-sm"
                            >
                              <MessageSquare className="h-4 w-4" />
                              {language === 'en' ? 'View Supporting Quotes' : '查看支撑性评论'}
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Positioning Tab */}
          <TabsContent value="marketing" className="mt-6">
            <Card className="border-clean shadow-clean">
              <CardHeader className="spacing-system-lg border-b border-border">
                <CardTitle className="gap-system-sm flex items-center text-base">
                  <Target className="h-4 w-4 text-primary" />
                  <span>{language === 'en' ? 'Marketing Positioning Opportunities' : '营销定位机会'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="spacing-system-lg">
                {opportunityData.商业机会洞察?.营销定位机会 && (
                  <div className="gap-system-lg flex flex-col">
                    {opportunityData.商业机会洞察.营销定位机会.map((positioning: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-border rounded-lg spacing-system-lg hover:shadow-clean-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2 text-primary">
                              {positioning.机会名称}
                            </h4>
                            <div className="gap-system-sm flex items-center mb-3">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {language === 'en' ? 'Target Users: ' : '目标用户: '}{positioning.目标用户}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700">
                            {language === 'en' ? 'Marketing' : '营销定位'}
                          </Badge>
                        </div>

                        <div className="gap-system-md grid md:grid-cols-2 mb-4">
                          <div>
                            <h5 className="font-medium text-sm mb-2">{language === 'en' ? 'Core Solution' : '核心方案'}</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {positioning.核心方案}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-2">{language === 'en' ? 'Implementation Path' : '实施路径'}</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {positioning.实施路径}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            {language === 'en' ? 'Expected Value' : '预期价值'}
                          </h5>
                          <p className="text-sm text-muted-foreground leading-relaxed bg-green-50 dark:bg-green-950/20 rounded-lg spacing-system-sm border border-green-200 dark:border-green-800">
                            {positioning.预期价值}
                          </p>
                        </div>

                        {positioning.启发性评论原文 && (
                          <div className="pt-4 border-t border-border">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => showQuotes(positioning.启发性评论原文, positioning.机会名称)}
                              className="gap-system-xs text-sm"
                            >
                              <MessageSquare className="h-4 w-4" />
                              {language === 'en' ? 'View Supporting Quotes' : '查看支撑性评论'}
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
            className="relative w-full max-w-4xl max-h-[80vh] mx-4"
          >
            <Card className="border-clean shadow-clean-lg">
              <CardHeader className="spacing-system-lg border-b border-border">
                <CardTitle className="text-lg font-semibold flex items-center gap-system-sm">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  {language === 'en' ? 'Supporting Evidence' : '支撑性证据'}: {selectedQuotes.title}
                </CardTitle>
                <Badge variant="secondary">
                  {selectedQuotes.quotes.length} {language === 'en' ? 'quotes' : '条引用'}
                </Badge>
              </CardHeader>
              <CardContent className="spacing-system-lg">
                <div className="max-h-96 overflow-y-auto">
                  <div className="gap-system-md flex flex-col">
                    {selectedQuotes.quotes.map((quote, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-muted/30 rounded-lg spacing-system-md border-l-4 border-primary/30"
                      >
                        <p className="text-sm leading-relaxed text-foreground italic">
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
