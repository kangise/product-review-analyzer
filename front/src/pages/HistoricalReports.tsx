import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { 
  History, 
  Calendar, 
  Tag, 
  FileText, 
  Eye, 
  Download,
  Clock,
  BarChart3,
  Users,
  MessageSquare,
  Lightbulb,
  AlertCircle,
  ChevronRight
} from 'lucide-react'

interface HistoricalReport {
  id: string
  timestamp: string
  category: string
  status: 'completed' | 'processing' | 'failed'
  hasCompetitorData: boolean
  fileInfo?: {
    ownBrandFile?: string
    competitorFile?: string
  }
}

interface HistoricalReportsProps {
  language: 'en' | 'zh'
  t: any
  onSelectReport: (reportId: string) => void
  currentReportId?: string
}

export const HistoricalReports: React.FC<HistoricalReportsProps> = ({
  language,
  t,
  onSelectReport,
  currentReportId
}) => {
  const [reports, setReports] = useState<HistoricalReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHistoricalReports()
  }, [])

  const loadHistoricalReports = async () => {
    try {
      setLoading(true)
      
      // 获取所有分析结果目录
      const response = await fetch('/api/reports')
      if (!response.ok) {
        throw new Error('Failed to load reports')
      }
      
      const data = await response.json()
      setReports(data.reports || [])
      
    } catch (err) {
      console.error('Failed to load historical reports:', err)
      
      // 模拟数据作为fallback
      const mockReports: HistoricalReport[] = [
        {
          id: 'analysis_results_20250827_182036',
          timestamp: '2025-08-27T18:20:36Z',
          category: 'Consumer Electronics',
          status: 'completed',
          hasCompetitorData: true,
          fileInfo: {
            ownBrandFile: 'Customer ASIN Reviews.csv',
            competitorFile: 'Competitor ASIN Reviews.csv'
          }
        },
        {
          id: 'analysis_results_20250827_153813',
          timestamp: '2025-08-27T15:38:13Z',
          category: 'Consumer Electronics',
          status: 'completed',
          hasCompetitorData: true,
          fileInfo: {
            ownBrandFile: 'Customer ASIN Reviews.csv',
            competitorFile: 'Competitor ASIN Reviews.csv'
          }
        },
        {
          id: 'analysis_results_20250827_151525',
          timestamp: '2025-08-27T15:15:25Z',
          category: 'Consumer Electronics',
          status: 'completed',
          hasCompetitorData: true,
          fileInfo: {
            ownBrandFile: 'Customer ASIN Reviews.csv',
            competitorFile: 'Competitor ASIN Reviews.csv'
          }
        }
      ]
      
      setReports(mockReports)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    if (language === 'zh') {
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          {language === 'en' ? 'Completed' : '已完成'}
        </Badge>
      case 'processing':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
          {language === 'en' ? 'Processing' : '处理中'}
        </Badge>
      case 'failed':
        return <Badge variant="destructive">
          {language === 'en' ? 'Failed' : '失败'}
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAnalysisModules = (hasCompetitorData: boolean) => {
    const modules = [
      { icon: Users, label: language === 'en' ? 'User Insights' : '用户洞察' },
      { icon: MessageSquare, label: language === 'en' ? 'User Feedback' : '用户反馈' },
      { icon: AlertCircle, label: language === 'en' ? 'Unmet Needs' : '未满足需求' },
      { icon: Lightbulb, label: language === 'en' ? 'Opportunities' : '机会分析' }
    ]

    if (hasCompetitorData) {
      modules.push({ icon: BarChart3, label: language === 'en' ? 'Competitive Analysis' : '竞品分析' })
    }

    return modules
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-96"
      >
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {language === 'en' ? 'Loading historical reports...' : '加载历史报告...'}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="spacing-system-2xl"
    >
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="gap-system-sm flex items-center">
          <History className="h-5 w-5 text-primary" />
          <div>
            <h2 className="mb-1">
              {language === 'en' ? 'Historical Reports' : '历史报告'}
            </h2>
            <div className="gap-system-sm flex items-center text-sm text-muted-foreground">
              <span>
                {language === 'en' 
                  ? 'Access and manage your previous analysis reports' 
                  : '访问和管理您之前的分析报告'
                }
              </span>
              <Separator orientation="vertical" className="h-3" />
              <div className="gap-1 flex items-center">
                <FileText className="h-3 w-3" />
                <span>{reports.length} {language === 'en' ? 'reports' : '个报告'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="gap-system-lg flex flex-col">
        {reports.length === 0 ? (
          <Card className="border-clean shadow-clean">
            <CardContent className="spacing-system-2xl text-center">
              <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">
                {language === 'en' ? 'No Historical Reports' : '暂无历史报告'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'en' 
                  ? 'Start your first analysis to see reports here' 
                  : '开始您的第一次分析以查看报告'
                }
              </p>
              <Button onClick={() => window.location.href = '#upload'}>
                {language === 'en' ? 'Start Analysis' : '开始分析'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-clean shadow-clean hover:shadow-clean-md transition-all duration-200 ${
                currentReportId === report.id ? 'ring-2 ring-primary ring-opacity-20 bg-accent/30' : ''
              }`}>
                <CardHeader className="spacing-system-lg">
                  <div className="flex items-center justify-between">
                    <div className="gap-system-sm flex items-center">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <CardTitle className="text-base">
                          {formatTimestamp(report.timestamp)}
                        </CardTitle>
                        <div className="gap-system-xs flex items-center mt-1">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{report.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="gap-system-sm flex items-center">
                      {getStatusBadge(report.status)}
                      {currentReportId === report.id && (
                        <Badge variant="outline" className="text-primary border-primary">
                          {language === 'en' ? 'Current' : '当前'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="spacing-system-lg">
                  {/* File Information */}
                  {report.fileInfo && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">
                        {language === 'en' ? 'Data Sources' : '数据源'}
                      </h4>
                      <div className="gap-2 flex flex-col text-xs text-muted-foreground">
                        {report.fileInfo.ownBrandFile && (
                          <div className="gap-1 flex items-center">
                            <FileText className="h-3 w-3" />
                            <span>{language === 'en' ? 'Own Brand:' : '自有品牌:'} {report.fileInfo.ownBrandFile}</span>
                          </div>
                        )}
                        {report.fileInfo.competitorFile && (
                          <div className="gap-1 flex items-center">
                            <BarChart3 className="h-3 w-3" />
                            <span>{language === 'en' ? 'Competitor:' : '竞品:'} {report.fileInfo.competitorFile}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Analysis Modules */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">
                      {language === 'en' ? 'Available Analysis' : '可用分析'}
                    </h4>
                    <div className="gap-2 flex flex-wrap">
                      {getAnalysisModules(report.hasCompetitorData).map((module, moduleIndex) => {
                        const Icon = module.icon
                        return (
                          <div
                            key={moduleIndex}
                            className="gap-1 flex items-center px-2 py-1 bg-muted rounded text-xs"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{module.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="gap-system-sm flex items-center justify-between">
                    <div className="gap-system-xs flex items-center text-xs text-muted-foreground">
                      <span>ID: {report.id.replace('analysis_results_', '')}</span>
                    </div>
                    <div className="gap-system-xs flex">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectReport(report.id)}
                        className="h-7 px-3 text-xs"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        {language === 'en' ? 'View' : '查看'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 text-xs"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        {language === 'en' ? 'Export' : '导出'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
