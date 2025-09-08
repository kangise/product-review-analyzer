import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { exportReportToHTML } from '../utils/exportHTML'
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
  ChevronRight,
  Star,
  Trash2,
  Loader2
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [deletingReports, setDeletingReports] = useState<Set<string>>(new Set())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // 过滤和排序报告
  const filteredReports = reports
    .filter(report => !showFavoritesOnly || favorites.has(report.id))
    .sort((a, b) => {
      // 收藏的报告排在前面
      const aFavorite = favorites.has(a.id)
      const bFavorite = favorites.has(b.id)
      
      if (aFavorite && !bFavorite) return -1
      if (!aFavorite && bFavorite) return 1
      
      // 然后按时间倒序排列
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

  useEffect(() => {
    loadHistoricalReports()
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('regen-favorites')
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)))
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }

  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem('regen-favorites', JSON.stringify(Array.from(newFavorites)))
      setFavorites(newFavorites)
    } catch (error) {
      console.error('Failed to save favorites:', error)
    }
  }

  const toggleFavorite = (reportId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(reportId)) {
      newFavorites.delete(reportId)
    } else {
      newFavorites.add(reportId)
    }
    saveFavorites(newFavorites)
  }

  const deleteReport = async (reportId: string) => {
    if (!confirm(language === 'en' ? 
      'Are you sure you want to delete this report? This action cannot be undone.' :
      '确定要删除这个报告吗？此操作无法撤销。'
    )) {
      return
    }

    setDeletingReports(prev => new Set(prev).add(reportId))
    
    try {
      const response = await fetch(`http://localhost:8000/reports/${reportId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // 从本地状态中移除报告
        setReports(prev => prev.filter(report => report.id !== reportId))
        
        // 从收藏中移除
        const newFavorites = new Set(favorites)
        newFavorites.delete(reportId)
        saveFavorites(newFavorites)
        
        console.log('✅ Report deleted:', reportId)
      } else {
        throw new Error('Failed to delete report')
      }
    } catch (error) {
      console.error('Failed to delete report:', error)
      alert(language === 'en' ? 
        'Failed to delete report. Please try again.' :
        '删除报告失败，请重试。'
      )
    } finally {
      setDeletingReports(prev => {
        const newSet = new Set(prev)
        newSet.delete(reportId)
        return newSet
      })
    }
  }

  const viewReport = (reportId: string) => {
    // 切换到该报告并导航到分析页面
    onSelectReport(reportId)
    console.log('📊 Viewing report:', reportId)
  }

  const exportReport = async (reportId: string) => {
    try {
      console.log('📥 Starting HTML export for report:', reportId)
      
      // 加载报告数据
      const response = await fetch(`http://localhost:8000/report/${reportId}`)
      if (!response.ok) {
        throw new Error('Failed to load report data')
      }
      
      const reportData = await response.json()
      console.log('📊 Report data loaded for export')
      
      // 使用前端导出功能
      await exportReportToHTML(reportData, language)
      
      console.log('✅ HTML report exported successfully')
      
    } catch (error) {
      console.error('❌ Failed to export HTML report:', error)
      alert(language === 'en' ? 'Failed to export HTML report' : 'HTML报告导出失败')
    }
  }

  const loadHistoricalReports = async () => {
    try {
      setLoading(true)
      
      // 使用正确的API端点
      const response = await fetch('http://localhost:8000/reports')
      if (!response.ok) {
        throw new Error('Failed to load reports')
      }
      
      const data = await response.json()
      const reportsData = data.reports || []
      console.log('📊 HistoricalReports loaded:', reportsData.length, 'reports')
      setReports(reportsData)
      
    } catch (err) {
      console.error('Failed to load historical reports:', err)
      setError('Failed to load historical reports')
      setReports([]) // 不使用模拟数据，显示错误状态
      
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      // 正确处理UTC时间戳
      const date = new Date(timestamp.replace('Z', '+00:00'))
      
      if (language === 'zh') {
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Shanghai' // 使用中国时区
        })
      } else {
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Shanghai' // 保持一致的时区
        })
      }
    } catch (error) {
      console.error('Time format error:', error)
      return timestamp // 如果格式化失败，返回原始时间戳
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
            <h2 className="mb-1 text-foreground">
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
                <span>{filteredReports.length} {language === 'en' ? 'reports' : '个报告'}</span>
                {showFavoritesOnly && (
                  <span className="text-green-600">
                    ({favorites.size} {language === 'en' ? 'favorites' : '收藏'})
                  </span>
                )}
              </div>
              <Separator orientation="vertical" className="h-3" />
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="h-6 px-2 text-xs"
              >
                <Star className={`mr-1 h-3 w-3 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                {showFavoritesOnly 
                  ? (language === 'en' ? 'Show All' : '显示全部')
                  : (language === 'en' ? 'Favorites Only' : '仅收藏')
                }
              </Button>
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
                {t.ui.start + (language === 'en' ? ' Analysis' : '分析')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report, index) => (
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
                      <h4 className="text-sm font-medium mb-2 text-foreground">
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
                    <h4 className="text-sm font-medium mb-2 text-foreground">
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
                      {favorites.has(report.id) && (
                        <Star className="h-3 w-3 text-green-500 fill-current ml-2" />
                      )}
                    </div>
                    <div className="gap-system-xs flex">
                      {/* 收藏按钮 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(report.id)}
                        className={`h-7 px-3 text-xs ${
                          favorites.has(report.id) 
                            ? 'text-green-600 border-green-300 bg-green-50 hover:bg-green-100' 
                            : ''
                        }`}
                        title={favorites.has(report.id) 
                          ? t.ui.remove + (language === 'en' ? ' from favorites' : '收藏')
                          : t.ui.add + (language === 'en' ? ' to favorites' : '收藏')
                        }
                      >
                        <Star className={`mr-1 h-3 w-3 ${
                          favorites.has(report.id) ? 'fill-current' : ''
                        }`} />
                        {favorites.has(report.id) 
                          ? (language === 'en' ? 'Starred' : '已收藏')
                          : (language === 'en' ? 'Star' : '收藏')
                        }
                      </Button>
                      
                      {/* 查看按钮 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewReport(report.id)}
                        className="h-7 px-3 text-xs"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        {language === 'en' ? 'View' : '查看'}
                      </Button>
                      
                      {/* 导出按钮 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportReport(report.id)}
                        className="h-7 px-3 text-xs"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        {language === 'en' ? 'Export' : '导出'}
                      </Button>
                      
                      {/* 删除按钮 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteReport(report.id)}
                        disabled={deletingReports.has(report.id)}
                        className="h-7 px-3 text-xs text-red-600 border-red-300 hover:bg-red-50"
                      >
                        {deletingReports.has(report.id) ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="mr-1 h-3 w-3" />
                        )}
                        {deletingReports.has(report.id)
                          ? (language === 'en' ? 'Deleting...' : '删除中...')
                          : t.ui.delete
                        }
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
