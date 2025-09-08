import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Target, MessageSquare, Info, Tag, TrendingDown, AlertCircle, Zap, Settings, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'
import { Alert, AlertDescription } from '../../components/ui/alert'

interface UnmetNeedsProps {
  language: 'en' | 'zh'
  t: any
  analysisResult: any
}

export const UnmetNeeds: React.FC<UnmetNeedsProps> = ({
  language,
  t,
  analysisResult
}) => {
  const [selectedQuotes, setSelectedQuotes] = useState<{quotes: string[], title: string} | null>(null)

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

  // 从analysisResult中获取数据，适配现有结构
  const unmetNeedsData = analysisResult?.ownBrandAnalysis?.unmetNeeds || {}

  const getSeverityColor = (severity: string) => {
    const severityValue = parseFloat(severity)
    if (severityValue >= 10) {
      return 'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
    } else if (severityValue >= 7) {
      return 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
    } else {
      return 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
    }
  }

  const getSeverityIcon = (severity: string) => {
    const severityValue = parseFloat(severity)
    if (severityValue >= 10) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    } else if (severityValue >= 7) {
      return <AlertCircle className="h-4 w-4 text-green-500" />
    } else {
      return <Info className="h-4 w-4 text-green-500" />
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
          <Target className="h-5 w-5 text-primary" />
          <div>
            <h2 className="mb-1 text-foreground">{t.nav.ownBrandUnmet}</h2>
            <div className="gap-system-sm flex items-center text-sm text-muted-foreground">
              <span>{language === 'en' ? 'Identify critical gaps and improvement opportunities' : '识别关键缺陷和改进机会'}</span>
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

      {/* Critical Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>{language === 'en' ? 'Critical Issues Identified:' : '发现关键问题：'}</strong>
            {unmetNeedsData.消费者未满足需求洞察?.总结}
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Insights Summary */}
      {unmetNeedsData.消费者未满足需求洞察 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-clean shadow-clean">
            <CardHeader className="spacing-system-lg border-b border-border">
              <CardTitle className="gap-system-sm flex items-center text-base">
                <Info className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Unmet Needs Analysis Summary' : '未满足需求分析总结'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="spacing-system-lg">
              <div className="gap-system-md grid md:grid-cols-3">
                <motion.div 
                  className="spacing-system-md bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-red-600" />
                    <h4 className="font-medium text-sm text-red-800 dark:text-red-200">
                      {language === 'en' ? 'Technical Issues' : '技术角度'}
                    </h4>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                    {unmetNeedsData.消费者未满足需求洞察.技术角度}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="spacing-system-md bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-sm text-green-800 dark:text-green-200">
                      {language === 'en' ? 'Functional Issues' : '功能角度'}
                    </h4>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                    {unmetNeedsData.消费者未满足需求洞察.功能角度}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="spacing-system-md bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-sm text-green-800 dark:text-green-200">
                      {language === 'en' ? 'Usage Scenarios' : '场景角度'}
                    </h4>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                    {unmetNeedsData.消费者未满足需求洞察.场景角度}
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detailed Unmet Needs Analysis */}
      {unmetNeedsData.未满足需求分析 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-clean shadow-clean">
            <CardHeader className="spacing-system-lg border-b border-border">
              <CardTitle className="gap-system-sm flex items-center text-base">
                <TrendingDown className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Critical Pain Points Analysis' : '关键痛点分析'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="spacing-system-lg">
              <div className="gap-system-lg flex flex-col">
                {unmetNeedsData.未满足需求分析.map((need: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="spacing-system-sm bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 relative hover:shadow-clean-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSeverityIcon(need['问题严重性/频率'])}
                          <h4 className="font-semibold text-lg">
                            {need['痛点/未满足的需求']}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {need.消费者描述}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {/* Removed Badge to match satisfaction analysis style */}
                      </div>
                    </div>

                    {/* Severity Progress Bar */}
                    {need['问题严重性/频率'] && (
                      <div className="mb-2">
                        <div className="flex items-center justify-end mb-1">
                          <span className="text-xs font-medium text-red-600">{need['问题严重性/频率']}</span>
                        </div>
                        <Progress 
                          value={parseFloat(need['问题严重性/频率'])} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {/* Supporting Evidence */}
                    {need.相关评论示例 && need.相关评论示例.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {language === 'en' ? 'Supporting Evidence:' : '支撑证据：'}
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {need.相关评论示例.length} {language === 'en' ? 'reviews' : '条评论'}
                            </Badge>
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showQuotes(need.相关评论示例, need['痛点/未满足的需求'])}
                            className="gap-system-xs text-sm"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {language === 'en' ? 'View Examples' : '查看示例'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Improvement Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-clean shadow-clean bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="spacing-system-lg">
            <div className="gap-system-sm flex items-start">
              <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                  {language === 'en' ? 'Priority Improvement Areas' : '优先改进领域'}
                </h3>
                <div className="gap-system-sm flex flex-wrap">
                  <Badge variant="outline" className="bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700">
                    {language === 'en' ? 'Hardware Reliability' : '硬件可靠性'}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                    {language === 'en' ? 'Software Compatibility' : '软件兼容性'}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                    {language === 'en' ? 'Customer Support' : '客户服务'}
                  </Badge>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-3 leading-relaxed">
                  {language === 'en' 
                    ? 'Addressing these critical pain points could significantly improve customer satisfaction and reduce negative reviews by an estimated 60-80%.'
                    : '解决这些关键痛点可以显著提升客户满意度，预计可减少60-80%的负面评价。'
                  }
                </p>
              </div>
            </div>
          </CardContent>
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
            className="relative w-full max-w-2xl max-h-[80vh] mx-4"
          >
            <Card className="border-clean shadow-clean-lg">
              <CardHeader className="spacing-system-lg border-b border-border">
                <CardTitle className="text-lg font-semibold flex items-center gap-system-sm">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  {language === 'en' ? 'Customer Pain Points' : '客户痛点'}: {selectedQuotes.title}
                </CardTitle>
                <Badge variant="destructive">
                  {selectedQuotes.quotes.length} {language === 'en' ? 'critical reviews' : '条关键评论'}
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
                        className="bg-red-50 dark:bg-red-950/20 rounded-lg spacing-system-md border-l-4 border-red-400 dark:border-red-600"
                      >
                        <p className="text-sm leading-relaxed text-red-800 dark:text-red-200 italic">
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
