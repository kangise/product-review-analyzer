import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Star, ChevronDown, ChevronRight, MessageSquare, Info, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'

interface UserInsightsProps {
  language: 'en' | 'zh'
  t: any
  analysisResult: any
}

export const UserInsights: React.FC<UserInsightsProps> = ({
  language,
  t,
  analysisResult
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['consumer-profile', 'consumer-motivation', 'consumer-scenario'])
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

  // 从analysisResult中获取数据，适配现有结构
  console.log('UserInsights received analysisResult:', analysisResult)
  const consumerProfileData = analysisResult?.ownBrandAnalysis?.userInsights || {}
  const consumerMotivationData = analysisResult?.ownBrandAnalysis?.userMotivation || {}
  const consumerScenarioData = analysisResult?.ownBrandAnalysis?.userScenario || {}
  
  console.log('Extracted data:', {
    consumerProfileData,
    consumerMotivationData, 
    consumerScenarioData
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
          <Users className="h-5 w-5 text-primary" />
          <div>
            <h2 className="mb-1 text-foreground">{t.nav.ownBrandInsights}</h2>
            <div className="gap-system-sm flex items-center text-sm text-muted-foreground">
              <span>{language === 'en' ? 'Deep insights into your target user groups' : '深度了解您的目标用户群体'}</span>
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

      {/* Consumer Profile Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('consumer-profile')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base text-foreground">
              <div className="gap-system-sm flex items-center">
                <Users className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Consumer Profile Analysis' : '消费者画像分析'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('consumer-profile') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('consumer-profile') && (
            <CardContent className="spacing-system-lg">
              {/* Key User Persona Insights */}
              {consumerProfileData.关键用户画像洞察 && (
                <div className="gap-system-lg flex flex-col mb-6">
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Core User Persona' : '核心用户画像'}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {consumerProfileData.关键用户画像洞察.核心用户画像}
                    </p>
                  </motion.div>
                  
                  <div className="gap-system-md grid md:grid-cols-2">
                    <motion.div 
                      className="spacing-system-md bg-muted rounded-lg border-clean"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Segmented User Types' : '细分潜力用户类型'}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {consumerProfileData.关键用户画像洞察.细分潜力用户类型}
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="spacing-system-md bg-muted rounded-lg border-clean"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Key User Behavior' : '关键用户行为'}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {consumerProfileData.关键用户画像洞察.关键用户行为}
                      </p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Demographic Analysis Table */}
              {consumerProfileData.消费者画像分析?.人群特征?.细分人群 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'User Segmentation Analysis' : '用户细分分析'}
                  </h4>
                  
                  <div>
                    <table className="w-full border-collapse" style={{tableLayout: 'fixed'}}>
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '15%'}}>
                            {language === 'en' ? 'User Group' : '用户人群'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '10%'}}>
                            {language === 'en' ? 'Percentage' : '比例'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '70%'}}>
                            {language === 'en' ? 'Description' : '特征描述'}
                          </th>
                          <th className="text-center spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '5%'}}>
                            {language === 'en' ? 'Quotes' : '原声'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumerProfileData.消费者画像分析.人群特征.细分人群.map((group: any, index: number) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="spacing-system-sm w-1/4">
                              <div className="font-medium text-sm">{group.用户人群}</div>
                            </td>
                            <td className="spacing-system-sm w-[10%]">
                              <div className="flex items-center gap-2">
                          <Progress value={parseFloat(group.比例.replace('%', ''))} className="flex-1 h-2" />
                                <Badge variant="outline" className="text-xs">
                                  {group.比例}
                                </Badge>
                              </div>
                            </td>
                            <td className="spacing-system-sm w-[60%]">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {group.特征描述}
                              </p>
                            </td>
                            <td className="spacing-system-sm text-center w-[5%]">
                              {group.关键review信息 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => showQuotes(group.关键review信息, group.用户人群)}
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

              {/* Usage Timing Analysis */}
              {consumerProfileData.消费者画像分析?.使用时刻?.细分场景 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Usage Timing Analysis' : '使用时刻分析'}
                  </h4>
                  <div>
                    <table className="w-full border-collapse" style={{tableLayout: 'fixed'}}>
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '15%'}}>
                            {language === 'en' ? 'Usage Time' : '使用时刻'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '10%'}}>
                            {language === 'en' ? 'Percentage' : '比例'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '70%'}}>
                            {language === 'en' ? 'Description' : '特征描述'}
                          </th>
                          <th className="text-center spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '5%'}}>
                            {language === 'en' ? 'Quotes' : '原声'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumerProfileData.消费者画像分析.使用时刻.细分场景.map((timing: any, index: number) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="spacing-system-sm w-1/4">
                              <div className="font-medium text-sm">{timing.使用时刻 || timing.用户人群}</div>
                            </td>
                            <td className="spacing-system-sm w-[10%]">
                              <div className="flex items-center gap-2">
                                <Progress value={parseFloat(timing.比例.replace('%', ''))} className="flex-1 h-2" />
                                <Badge variant="outline" className="text-xs">
                                  {timing.比例}
                                </Badge>
                              </div>
                            </td>
                            <td className="spacing-system-sm w-[60%]">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {timing.特征描述}
                              </p>
                            </td>
                            <td className="spacing-system-sm text-center w-[5%]">
                              {timing.关键review信息 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => showQuotes(timing.关键review信息, timing.使用时刻 || timing.用户人群)}
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

              {/* Usage Location Analysis */}
              {consumerProfileData.消费者画像分析?.使用地点?.细分场景 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Usage Location Analysis' : '使用地点分析'}
                  </h4>
                  <div>
                    <table className="w-full border-collapse" style={{tableLayout: 'fixed'}}>
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '15%'}}>
                            {language === 'en' ? 'Usage Location' : '使用地点'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '10%'}}>
                            {language === 'en' ? 'Percentage' : '比例'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '70%'}}>
                            {language === 'en' ? 'Description' : '特征描述'}
                          </th>
                          <th className="text-center spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '5%'}}>
                            {language === 'en' ? 'Quotes' : '原声'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumerProfileData.消费者画像分析.使用地点.细分场景.map((location: any, index: number) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="spacing-system-sm w-1/4">
                              <div className="font-medium text-sm">{location.使用地点}</div>
                            </td>
                            <td className="spacing-system-sm w-[10%]">
                              <div className="flex items-center gap-2">
                                <Progress value={parseFloat(location.比例.replace('%', ''))} className="flex-1 h-2" />
                                <Badge variant="outline" className="text-xs">
                                  {location.比例}
                                </Badge>
                              </div>
                            </td>
                            <td className="spacing-system-sm w-[60%]">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {location.特征描述}
                              </p>
                            </td>
                            <td className="spacing-system-sm text-center w-[5%]">
                              {location.关键review信息 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => showQuotes(location.关键review信息, location.使用地点)}
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

              {/* Usage Behavior Analysis */}
              {consumerProfileData.消费者画像分析?.使用行为?.细分行为 && (
                <div>
                  <h4 className="font-medium mb-4 text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    {language === 'en' ? 'Usage Behavior Analysis' : '使用行为分析'}
                  </h4>
                  <div>
                    <table className="w-full border-collapse" style={{tableLayout: 'fixed'}}>
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '15%'}}>
                            {language === 'en' ? 'Usage Behavior' : '使用行为'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '10%'}}>
                            {language === 'en' ? 'Percentage' : '比例'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '70%'}}>
                            {language === 'en' ? 'Description' : '特征描述'}
                          </th>
                          <th className="text-center spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '5%'}}>
                            {language === 'en' ? 'Quotes' : '原声'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumerProfileData.消费者画像分析.使用行为.细分行为.map((behavior: any, index: number) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="spacing-system-sm w-1/4">
                              <div className="font-medium text-sm">{behavior.使用行为}</div>
                            </td>
                            <td className="spacing-system-sm w-[10%]">
                              <div className="flex items-center gap-2">
                                <Progress value={parseFloat(behavior.比例.replace('%', ''))} className="flex-1 h-2" />
                                <Badge variant="outline" className="text-xs">
                                  {behavior.比例}
                                </Badge>
                              </div>
                            </td>
                            <td className="spacing-system-sm w-[60%]">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {behavior.特征描述}
                              </p>
                            </td>
                            <td className="spacing-system-sm text-center w-[5%]">
                              {behavior.关键review信息 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => showQuotes(behavior.关键review信息, behavior.使用行为)}
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

      {/* Consumer Motivation Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('consumer-motivation')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base text-foreground">
              <div className="gap-system-sm flex items-center">
                <Star className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Purchase Motivation Analysis' : '购买动机分析'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('consumer-motivation') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('consumer-motivation') && (
            <CardContent className="spacing-system-lg">
              {consumerMotivationData.购买动机洞察总结 && (
                <div className="gap-system-lg flex flex-col">
                  {/* 技术指标维度 */}
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Technical Specifications' : '技术指标维度'}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {typeof consumerMotivationData.购买动机洞察总结?.技术指标维度 === 'string' 
                        ? consumerMotivationData.购买动机洞察总结.技术指标维度 
                        : JSON.stringify(consumerMotivationData.购买动机洞察总结?.技术指标维度 || '')}
                    </p>
                  </motion.div>

                  {/* 功能属性维度 */}
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Feature Attributes' : '功能属性维度'}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {typeof consumerMotivationData.购买动机洞察总结?.功能属性维度 === 'string' 
                        ? consumerMotivationData.购买动机洞察总结.功能属性维度 
                        : JSON.stringify(consumerMotivationData.购买动机洞察总结?.功能属性维度 || '')}
                    </p>
                  </motion.div>

                  {/* 使用场景维度 */}
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Usage Scenarios' : '使用场景维度'}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {typeof consumerMotivationData.购买动机洞察总结?.使用场景维度 === 'string' 
                        ? consumerMotivationData.购买动机洞察总结.使用场景维度 
                        : JSON.stringify(consumerMotivationData.购买动机洞察总结?.使用场景维度 || '')}
                    </p>
                  </motion.div>

                  {/* 具体购买动机 */}
                  {consumerMotivationData.具体购买动机 && (
                    <div>
                      <table className="w-full border-collapse" style={{tableLayout: 'fixed'}}>
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '15%'}}>
                              {language === 'en' ? 'Motivation' : '动机'}
                            </th>
                            <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '10%'}}>
                              {language === 'en' ? 'Importance' : '重要性'}
                            </th>
                            <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '70%'}}>
                              {language === 'en' ? 'Description' : '消费者描述'}
                            </th>
                            <th className="text-center spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '5%'}}>
                              {language === 'en' ? 'Examples' : '示例'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {consumerMotivationData.具体购买动机.map((motivation: any, index: number) => (
                            <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="spacing-system-sm w-1/4">
                                <div className="font-medium text-sm">{motivation.动机}</div>
                              </td>
                            <td className="spacing-system-sm w-[10%]">
                              <div className="flex items-center gap-2">
                          <Progress value={parseFloat(motivation.动机重要性.replace('%', ''))} className="flex-1 h-2" />
                                <Badge variant="outline" className="text-xs">
                                  {motivation.动机重要性}
                                </Badge>
                              </div>
                            </td>
                              <td className="spacing-system-sm w-[60%]">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {motivation.消费者描述}
                                </p>
                              </td>
                              <td className="spacing-system-sm text-center w-[5%]">
                                {motivation.相关评论示例 && motivation.相关评论示例.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => showQuotes(motivation.相关评论示例, motivation.动机)}
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
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Consumer Scenario Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-clean shadow-clean">
          <CardHeader 
            className="spacing-system-lg border-b border-border cursor-pointer"
            onClick={() => toggleSection('consumer-scenario')}
          >
            <CardTitle className="gap-system-sm flex items-center justify-between text-base text-foreground">
              <div className="gap-system-sm flex items-center">
                <Target className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Usage Scenario Analysis' : '使用场景分析'}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('consumer-scenario') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has('consumer-scenario') && (
            <CardContent className="spacing-system-lg">
              {consumerScenarioData.洞察总结 && (
                <div className="gap-system-lg flex flex-col">
                  {/* 重要度最高的消费场景 */}
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'High Priority Scenarios' : '重要度最高的消费场景'}</h4>
                    <div className="gap-2 flex flex-col">
                      {consumerScenarioData.洞察总结?.重要度最高的消费场景?.map((scenario: string, index: number) => (
                        <p key={index} className="text-sm text-muted-foreground leading-relaxed">
                          • {scenario}
                        </p>
                      ))}
                    </div>
                  </motion.div>

                  {/* 小众但被忽视的消费场景 */}
                  {consumerScenarioData.洞察总结?.小众但被忽视的消费场景 && (
                    <motion.div 
                      className="spacing-system-md bg-accent rounded-lg border-clean"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Niche Opportunities' : '小众但被忽视的消费场景'}</h4>
                      <div className="gap-2 flex flex-col">
                        {consumerScenarioData.洞察总结.小众但被忽视的消费场景.map((scenario: string, index: number) => (
                          <p key={index} className="text-sm text-muted-foreground leading-relaxed">
                            • {scenario}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 产品使用场景分析 */}
                  {consumerScenarioData.产品使用场景分析 && (
                    <div>
                      <table className="w-full border-collapse" style={{tableLayout: 'fixed'}}>
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '15%'}}>
                              {language === 'en' ? 'Scenario' : '场景名称'}
                            </th>
                            <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '10%'}}>
                              {language === 'en' ? 'Importance' : '重要性'}
                            </th>
                            <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '70%'}}>
                              {language === 'en' ? 'Description' : '场景描述'}
                            </th>
                            <th className="text-center spacing-system-sm text-xs font-medium text-muted-foreground" style={{width: '5%'}}>
                              {language === 'en' ? 'Examples' : '示例'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {consumerScenarioData.产品使用场景分析.map((scenario: any, index: number) => (
                            <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="spacing-system-sm w-1/4">
                                <div className="font-medium text-sm">{scenario.场景名称}</div>
                              </td>
                            <td className="spacing-system-sm w-[10%]">
                              <div className="flex items-center gap-2">
                          <Progress value={parseFloat(scenario.场景重要性.replace('%', ''))} className="flex-1 h-2" />
                                <Badge variant="outline" className="text-xs">
                                  {scenario.场景重要性}
                                </Badge>
                              </div>
                            </td>
                              <td className="spacing-system-sm w-[60%]">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {scenario.场景描述}
                                </p>
                              </td>
                              <td className="spacing-system-sm text-center w-[5%]">
                                {scenario.相关评论 && scenario.相关评论.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => showQuotes(scenario.相关评论, scenario.场景名称)}
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
                  )}
                </div>
              )}
              {consumerScenarioData.使用场景洞察?.细分场景类型 && (
                <div className="gap-system-md grid md:grid-cols-3">
                  {consumerScenarioData.使用场景洞察.细分场景类型.map((scenario: any, index: number) => (
                    <motion.div
                      key={index}
                      className="spacing-system-md bg-muted rounded-lg border-clean"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{scenario.场景类型}</h5>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Progress value={parseFloat(scenario.比例.replace('%', ''))} className="flex-1 h-2" />
                          <Badge variant="secondary" className="text-xs">
                            {scenario.比例}
                          </Badge>
                        </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        {scenario.特征描述}
                      </p>
                      {scenario.关键review信息 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showQuotes(scenario.关键review信息, scenario.场景类型)}
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
            className="relative w-full max-w-2xl max-h-[80vh] mx-4"
          >
            <Card className="border-clean shadow-clean-lg">
              <CardHeader className="spacing-system-lg border-b border-border">
                <CardTitle className="text-lg font-semibold flex items-center gap-system-sm">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  {language === 'en' ? 'Customer Quote' : '客户原声'}: {selectedQuotes.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="spacing-system-lg">
                <div className="gap-system-md flex flex-col max-h-96 overflow-y-auto">
                  {selectedQuotes.quotes.map((quote, index) => (
                    <div key={index} className="spacing-system-sm bg-accent rounded-lg border-clean">
                      <p className="text-sm text-muted-foreground">
                        "{quote}"
                      </p>
                    </div>
                  ))}
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
