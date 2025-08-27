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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['consumer-profile']))
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
  const consumerProfileData = analysisResult?.ownBrandAnalysis?.userInsights || {}
  const consumerMotivationData = analysisResult?.ownBrandAnalysis?.userMotivation || {}
  const consumerScenarioData = analysisResult?.ownBrandAnalysis?.userScenario || {}

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
            <h2 className="mb-1">{t.nav.ownBrandInsights}</h2>
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
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
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
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground">
                            {language === 'en' ? 'User Group' : '用户人群'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground">
                            {language === 'en' ? 'Percentage' : '比例'}
                          </th>
                          <th className="text-left spacing-system-sm text-xs font-medium text-muted-foreground">
                            {language === 'en' ? 'Description' : '特征描述'}
                          </th>
                          <th className="text-center spacing-system-sm text-xs font-medium text-muted-foreground">
                            {language === 'en' ? 'Quotes' : '原声'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumerProfileData.消费者画像分析.人群特征.细分人群.map((group: any, index: number) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="spacing-system-sm">
                              <div className="font-medium text-sm">{group.用户人群}</div>
                            </td>
                            <td className="spacing-system-sm">
                              <div className="flex items-center gap-2">
                                <Progress value={parseFloat(group.比例)} className="flex-1 h-2" />
                                <Badge variant="outline" className="text-xs">
                                  {group.比例}
                                </Badge>
                              </div>
                            </td>
                            <td className="spacing-system-sm">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {group.特征描述}
                              </p>
                            </td>
                            <td className="spacing-system-sm text-center">
                              {group.关键review信息 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => showQuotes([group.关键review信息], group.用户人群)}
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
                  
                  <div className="gap-system-md grid md:grid-cols-3">
                    {consumerProfileData.消费者画像分析.使用时刻.细分场景.map((timing: any, index: number) => (
                      <motion.div
                        key={index}
                        className="spacing-system-md bg-accent/30 rounded-lg border-clean"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{timing.使用时刻}</h5>
                          <Badge variant="secondary" className="text-xs">
                            {timing.比例}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                          {timing.特征描述}
                        </p>
                        {timing.关键review信息 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showQuotes([timing.关键review信息], timing.使用时刻)}
                            className="text-xs h-6 px-2"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'View Quote' : '查看原声'}
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
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
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
              {consumerMotivationData.购买动机洞察 && (
                <div className="gap-system-lg flex flex-col">
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Core Purchase Motivation' : '核心购买动机'}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {consumerMotivationData.购买动机洞察?.核心购买动机}
                    </p>
                  </motion.div>

                  {consumerMotivationData.购买动机洞察?.细分动机类型 && (
                    <div className="gap-system-md grid md:grid-cols-2">
                      {consumerMotivationData.购买动机洞察.细分动机类型.map((motivation: any, index: number) => (
                        <motion.div
                          key={index}
                          className="spacing-system-md bg-muted rounded-lg border-clean"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{motivation.动机类型}</h5>
                            <Badge variant="outline" className="text-xs">
                              {motivation.比例}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                            {motivation.特征描述}
                          </p>
                          {motivation.关键review信息 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => showQuotes([motivation.关键review信息], motivation.动机类型)}
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
            <CardTitle className="gap-system-sm flex items-center justify-between text-base">
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
              {consumerScenarioData.使用场景洞察 && (
                <div className="gap-system-lg flex flex-col">
                  <motion.div 
                    className="spacing-system-md bg-accent rounded-lg border-clean"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium mb-2 text-sm">{language === 'en' ? 'Core Usage Scenarios' : '核心使用场景'}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {consumerScenarioData.使用场景洞察?.核心使用场景}
                    </p>
                  </motion.div>

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
                              onClick={() => showQuotes([scenario.关键review信息], scenario.场景类型)}
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
                <div className="bg-muted/30 rounded-lg spacing-system-md border-l-4 border-primary/30">
                  <p className="text-sm leading-relaxed text-foreground italic">
                    "{selectedQuotes.quotes[0]}"
                  </p>
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
