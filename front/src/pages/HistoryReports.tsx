import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, FileText, BarChart3, Users, Clock, Download, Eye, Trash2, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Separator } from '../components/ui/separator'

interface HistoryReportsProps {
  language: 'en' | 'zh'
  t: any
  onLoadReport: (reportId: string) => void
}

interface HistoricalReport {
  id: string
  timestamp: string
  title: string
  targetCategory: string
  hasCompetitorData: boolean
  status: 'completed' | 'processing' | 'failed'
  fileSize?: string
  analysisModules?: number
}

export const HistoryReports: React.FC<HistoryReportsProps> = ({
  language,
  t,
  onLoadReport
}) => {
  const [reports, setReports] = useState<HistoricalReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing' | 'failed'>('all')

  // 模拟历史报告数据
  useEffect(() => {
    const loadHistoryReports = async () => {
      setLoading(true)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 创建示例历史报告
      const mockReports: HistoricalReport[] = [
        {
          id: 'analysis_20250827_151525',
          timestamp: '2025-08-27T15:15:25.000Z',
          title: 'Webcams Market Analysis',
          targetCategory: 'Webcams',
          hasCompetitorData: true,
          status: 'completed',
          fileSize: '2.3 MB',
          analysisModules: 9
        },
        {
          id: 'analysis_20250826_143022',
          timestamp: '2025-08-26T14:30:22.000Z',
          title: 'Consumer Electronics Study',
          targetCategory: 'Consumer Electronics',
          hasCompetitorData: false,
          status: 'completed',
          fileSize: '1.8 MB',
          analysisModules: 6
        },
        {
          id: 'analysis_20250825_091245',
          timestamp: '2025-08-25T09:12:45.000Z',
          title: 'Tech Accessories Analysis',
          targetCategory: 'Tech Accessories',
          hasCompetitorData: true,
          status: 'completed',
          fileSize: '3.1 MB',
          analysisModules: 9
        },
        {
          id: 'analysis_20250824_165530',
          timestamp: '2025-08-24T16:55:30.000Z',
          title: 'Smart Devices Research',
          targetCategory: 'Smart Devices',
          hasCompetitorData: false,
          status: 'processing',
          fileSize: '0.5 MB',
          analysisModules: 3
        }
      ]
      
      setReports(mockReports)
      setLoading(false)
    }

    loadHistoryReports()
  }, [])

  // 过滤报告
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.targetCategory.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return language === 'en' ? 'Completed' : '已完成'
      case 'processing': return language === 'en' ? 'Processing' : '处理中'
      case 'failed': return language === 'en' ? 'Failed' : '失败'
      default: return status
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="spacing-system-xl"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'en' ? 'Analysis History' : '分析历史'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'View and manage your previous analysis reports' 
                : '查看和管理您的历史分析报告'}
            </p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'en' ? 'Search reports...' : '搜索报告...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              {language === 'en' ? 'All' : '全部'}
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('completed')}
            >
              {language === 'en' ? 'Completed' : '已完成'}
            </Button>
            <Button
              variant={filterStatus === 'processing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('processing')}
            >
              {language === 'en' ? 'Processing' : '处理中'}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-clean">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {language === 'en' ? 'No reports found' : '未找到报告'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Try adjusting your search or filter criteria' 
              : '尝试调整搜索或筛选条件'}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-clean hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusText(report.status)}
                        </Badge>
                        {report.hasCompetitorData && (
                          <Badge variant="outline" className="text-xs">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {language === 'en' ? 'With Competitor' : '含竞品'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(report.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {report.targetCategory}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {report.fileSize && (
                          <span>{language === 'en' ? 'Size:' : '大小:'} {report.fileSize}</span>
                        )}
                        {report.analysisModules && (
                          <span>
                            {language === 'en' ? 'Modules:' : '模块:'} {report.analysisModules}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {report.status === 'completed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLoadReport(report.id)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            {language === 'en' ? 'View' : '查看'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            {language === 'en' ? 'Export' : '导出'}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 pt-6 border-t border-border"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{reports.length}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Total Reports' : '总报告数'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Completed' : '已完成'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'processing').length}
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Processing' : '处理中'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {reports.filter(r => r.hasCompetitorData).length}
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'With Competitor' : '含竞品分析'}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
