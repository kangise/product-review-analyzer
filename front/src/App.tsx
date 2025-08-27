import React, { useState, useEffect } from 'react'
import { Upload, FileText, TrendingUp, Users, Target, Star, Download, History, BarChart3, PieChart, ArrowRight, CheckCircle, Clock, AlertCircle, Menu, X, ThumbsUp, ThumbsDown, Lightbulb, Zap, MessageSquare, Info, RefreshCw, ChevronDown, ChevronRight, Home, Play, Eye, BarChart2, ShoppingCart, Sparkles, Settings, Bell, User, Moon, Sun, Monitor, Tag, Languages, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Alert, AlertDescription } from './components/ui/alert'
import { Separator } from './components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet'
import { Switch } from './components/ui/switch'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { projectId, publicAnonKey } from './utils/supabase/info'

// 导入新创建的分析页面组件
import { UserInsights } from './pages/analysis/UserInsights'
import { UserFeedback } from './pages/analysis/UserFeedback'
import { Opportunities } from './pages/analysis/Opportunities'
import { UnmetNeeds } from './pages/analysis/UnmetNeeds'

// Translation system
const translations = {
  en: {
    // App title and main branding
    appTitle: "Amazon Review Intelligence Tool",
    appSubtitle: "AI-powered deep analysis to uncover user insights and market opportunities from customer reviews",
    
    // Navigation
    nav: {
      dashboard: "Dashboard",
      upload: "Data Upload",
      ownBrand: "Own Brand Analysis", 
      ownBrandInsights: "User Insights",
      ownBrandFeedback: "User Feedback Analysis",
      ownBrandUnmet: "Unmet Needs Analysis",
      competitive: "Competitive Analysis",
      opportunities: "Opportunity Insights",
      opportunitiesImprovement: "Product Improvement",
      opportunitiesInnovation: "Product Innovation",
      opportunitiesMarketing: "Marketing Positioning",
      history: "Historical Reports",
      analyticsTools: "Analytics Tools"
    },
    
    // Dashboard content
    dashboard: {
      startAnalysis: "Start Analysis",
      viewFeatures: "View Features",
      coreFeatures: "Core Features",
      platformData: "Platform Statistics",
      readyToStart: "Ready to Start Analyzing?",
      readyDescription: "Upload your Amazon review data to get deep user insights and market opportunity analysis, let data drive your business decisions",
      features: {
        userInsights: {
          title: "Deep User Insights",
          description: "Analyze user personas, usage scenarios, timing and demographics to deeply understand your target customer groups and purchase motivations",
          items: ["User Persona Analysis", "Usage Scenario Mining", "Purchase Motivation Insights"]
        },
        competitive: {
          title: "Competitive Analysis", 
          description: "Compare and analyze feedback differences between your brand and competitors to discover competitive advantages and areas for improvement",
          items: ["Feedback Frequency Comparison", "Strengths & Weaknesses Analysis", "Market Positioning Recommendations"]
        },
        opportunities: {
          title: "Opportunity Insights",
          description: "Provide specific recommendations for product improvement, innovation directions and marketing positioning based on analysis results",
          items: ["Product Improvement Opportunities", "Innovation Direction Suggestions", "Marketing Positioning Strategies"]
        }
      },
      stats: {
        dimensions: "Analysis Dimensions",
        insights: "Insight Types", 
        fileSupport: "Max File Support",
        speed: "Analysis Speed"
      }
    },
    
    // Upload page
    upload: {
      title: "Data Upload",
      subtitle: "Upload your review data to begin analysis",
      infoMessage: "Simply upload your own brand review data to start analysis. For competitive comparison analysis, you can optionally upload competitor review data. Supported formats: CSV, Excel (.csv, .xls, .xlsx), File size limit: 10MB",
      targetCategory: {
        title: "Target Category",
        description: "Please enter the product category you want to analyze, this will help AI provide more precise analysis",
        label: "Product Category",
        placeholder: "e.g., Wireless Headphones, Laptops, Sports Shoes, Skincare Products, etc.",
        helpText: "Clear category description helps provide more accurate analysis results",
        commonCategories: "Common Categories:"
      },
      ownBrand: {
        title: "Own Brand Reviews",
        description: "Upload your brand's customer review data (Required)",
        uploaded: "Uploaded:",
        reupload: "Re-upload"
      },
      competitor: {
        title: "Competitor Reviews", 
        description: "Upload competitor product customer review data",
        optional: "Optional"
      },
      selectFile: "Select File to Upload",
      uploading: "Uploading...",
      startAnalysis: "Start AI Analysis",
      analyzing: "AI Analyzing...",
      analysisProgress: "We are deeply analyzing review data to identify user insights and market opportunities...",
      category: "Category:"
    },
    
    // Analysis results
    analysis: {
      reportGenerated: "Analysis Report Generated",
      withCompetitor: "With Competitor Comparison",
      generatedTime: "Generated:",
      keyUserInsights: "Key User Persona Insights",
      coreUserPersona: "Core User Persona",
      segmentedUserTypes: "Segmented Potential User Types", 
      keyUserBehavior: "Key User Behavior",
      demographicAnalysis: "Demographic Analysis",
      coreInsight: "Core Insight",
      segmentedDetails: "Segmented Details",
      keyReviewInfo: "Key Review Information",
      userPersona: "User Persona",
      category: "Category"
    },
    
    // Common UI elements
    ui: {
      light: "Light",
      dark: "Dark", 
      system: "System",
      notifications: "Notifications",
      settings: "Settings",
      userCenter: "User Center",
      downloadReport: "Download Report",
      newAnalysis: "New Analysis",
      uploadProgress: "Upload Progress:",
      developing: "Under Development",
      featureDeveloping: "This feature is under development, stay tuned!",
      english: "English",
      chinese: "中文",
      search: "Search"
    },
    
    // Error messages
    errors: {
      uploadCsvExcel: "Please upload CSV or Excel files (.csv, .xls, .xlsx)",
      fileTooLarge: "File size cannot exceed 10MB", 
      fileEmpty: "File cannot be empty",
      uploadOwnBrand: "Please upload own brand review data first",
      enterCategory: "Please enter target category information",
      categoryTooShort: "Target category information needs at least 2 characters",
      uploadFailed: "File upload failed",
      unsupportedFormat: "Unsupported file format, please upload CSV or Excel files",
      fileTooLarge2: "File too large, please upload files smaller than 10MB", 
      storageUnavailable: "Storage service temporarily unavailable, please try again later",
      analysisFailed: "Analysis failed:",
      retryAnalysis: "Analysis failed, please try again",
      loadReportFailed: "Failed to load historical report"
    },
    
    // Success messages
    success: {
      pdfDeveloping: "PDF download feature is under development, stay tuned!"
    },
    
    // Sample categories
    categories: {
      wirelessEarphones: "Wireless Earphones",
      smartWatch: "Smart Watch", 
      laptop: "Laptop",
      skincare: "Skincare",
      sportShoes: "Sport Shoes",
      coffeeMachine: "Coffee Machine"
    }
  },
  zh: {
    // App title and main branding
    appTitle: "亚马逊评论智能分析工具",
    appSubtitle: "通过AI驱动的深度分析，挖掘客户评论中的用户洞察和市场机会",
    
    // Navigation
    nav: {
      dashboard: "仪表盘",
      upload: "数据上传",
      ownBrand: "自有品牌分析",
      ownBrandInsights: "用户洞察", 
      ownBrandFeedback: "用户反馈分析",
      ownBrandUnmet: "未满足需求分析",
      competitive: "竞品对比分析",
      opportunities: "机会洞察",
      opportunitiesImprovement: "产品改进机会",
      opportunitiesInnovation: "产品创新机会", 
      opportunitiesMarketing: "营销定位机会",
      history: "历史报告",
      analyticsTools: "分析工具"
    },
    
    // Dashboard content
    dashboard: {
      startAnalysis: "开始分析",
      viewFeatures: "查看功能",
      coreFeatures: "核心功能",
      platformData: "平台数据",
      readyToStart: "准备开始分析了吗？",
      readyDescription: "上传您的亚马逊评论数据，获得深度用户洞察和市场机会分析，让数据驱动您的商业决策",
      features: {
        userInsights: {
          title: "深度用户洞察",
          description: "分析用户画像、使用场景、使用时机和人群分布，深入了解您的目标客户群体和购买动机",
          items: ["用户画像分析", "使用场景挖掘", "购买动机洞察"]
        },
        competitive: {
          title: "竞品对比分析",
          description: "对比分析自有品牌与竞品的用户反馈差异，发现竞争优势和需要改进的领域",
          items: ["反馈频率对比", "优势劣势分析", "市场定位建议"]
        },
        opportunities: {
          title: "机会洞察", 
          description: "基于分析结果提供产品改进、创新方向和营销定位的具体建议",
          items: ["产品改进机会", "创新方向建议", "营销定位策略"]
        }
      },
      stats: {
        dimensions: "分析维度",
        insights: "洞察类型",
        fileSupport: "最大文件支持", 
        speed: "分析速度"
      }
    },
    
    // Upload page
    upload: {
      title: "数据上传",
      subtitle: "上传您的评论数据以开始分析",
      infoMessage: "只需上传自有品牌评论数据即可开始分析。如需进行竞品对比分析，可以选择性上传竞品评论数据。支持格式：CSV、Excel (.csv, .xls, .xlsx)，文件大小限制：10MB",
      targetCategory: {
        title: "目标品类",
        description: "请输入您要分析的产品品类，这将帮助AI提供更精准的分析",
        label: "产品品类",
        placeholder: "例如：无线耳机、笔记本电脑、运动鞋、护肤品等",
        helpText: "清晰的品类描述有助于提供更准确的分析结果",
        commonCategories: "常见品类："
      },
      ownBrand: {
        title: "自有品牌评论",
        description: "上传您品牌产品的客户评论数据 (必须)",
        uploaded: "已上传:",
        reupload: "重新上传"
      },
      competitor: {
        title: "竞品评论",
        description: "上传竞争对手产品的客户评论数据", 
        optional: "可选"
      },
      selectFile: "选择文件上传",
      uploading: "上传中...",
      startAnalysis: "开始智能分析",
      analyzing: "AI分析中...",
      analysisProgress: "我们正在深度分析评论数据，识别用户洞察和市场机会...",
      category: "分析品类:"
    },
    
    // Analysis results
    analysis: {
      reportGenerated: "分析报告已生成",
      withCompetitor: "含竞品对比",
      generatedTime: "生成时间:",
      keyUserInsights: "关键用户画像洞察",
      coreUserPersona: "核心用户画像",
      segmentedUserTypes: "细分潜力用户类型",
      keyUserBehavior: "关键用户行为",
      demographicAnalysis: "人群特征分析", 
      coreInsight: "核心洞察",
      segmentedDetails: "细分人群详情",
      keyReviewInfo: "关键评论信息",
      userPersona: "用户画像",
      category: "品类:"
    },
    
    // Common UI elements
    ui: {
      light: "浅色",
      dark: "深色",
      system: "系统", 
      notifications: "通知",
      settings: "设置",
      userCenter: "用户中心",
      downloadReport: "下载报告",
      newAnalysis: "新建分析",
      uploadProgress: "上传进度:",
      developing: "功能开发中",
      featureDeveloping: "该功能正在开发中，敬请期待！",
      english: "English",
      chinese: "中文",
      search: "搜索"
    },
    
    // Error messages
    errors: {
      uploadCsvExcel: "请上传CSV或Excel文件(.csv, .xls, .xlsx)",
      fileTooLarge: "文件大小不能超过10MB",
      fileEmpty: "文件不能为空",
      uploadOwnBrand: "请先上传自有品牌评论数据", 
      enterCategory: "请输入目标品类信息",
      categoryTooShort: "目标品类信息至少需要2个字符",
      uploadFailed: "文件上传失败",
      unsupportedFormat: "文件格式不支持，请上传CSV或Excel文件",
      fileTooLarge2: "文件过大，请上传小于10MB的文件",
      storageUnavailable: "存储服务暂时不可用，请稍后重试",
      analysisFailed: "分析失败:",
      retryAnalysis: "分析失败，请重试",
      loadReportFailed: "加载历史报告失败"
    },
    
    // Success messages
    success: {
      pdfDeveloping: "PDF下载功能开发中，敬请期待！"
    },
    
    // Sample categories
    categories: {
      wirelessEarphones: "无线耳机",
      smartWatch: "智能手表",
      laptop: "笔记本电脑", 
      skincare: "护肤品",
      sportShoes: "运动鞋",
      coffeeMachine: "咖啡机"
    }
  }
}

interface UploadedFile {
  fileName: string
  originalName: string
  fileType: 'own' | 'competitor'
  size?: number
}

interface StarRatingData {
  percentage: number
  mainThemes: string[]
}

interface FeedbackGap {
  ownBrand: number
  competitor: number
  gap: number
  insight: string
}

interface UsageTimingData {
  timing: string
  percentage: number
  description: string
  characteristics: string[]
}

interface UserGroupData {
  name: string
  percentage: number
  color: string
  description: string
  characteristics: string[]
  behaviorPatterns: string[]
}

interface AnalysisResult {
  id: string
  timestamp: string
  hasCompetitorData: boolean
  targetCategory?: string
  ownBrandAnalysis: {
    userInsights: {
      关键用户画像洞察?: {
        核心用户画像: string
        细分潜力用户类型: string
        关键用户行为: string
      }
      消费者画像分析?: {
        人群特征: {
          核心insight: string
          细分人群: Array<{
            用户人群: string
            特征描述: string
            比例: number
            关键review信息: string
          }>
        }
        使用时刻: {
          核心insight: string
          细分场景: Array<{
            使用时刻: string
            特征描述: string
            比例: number
            关键review信息: string
          }>
        }
        使用地点: {
          核心insight: string
          细分场景: Array<{
            使用地点: string
            特征描述: string
            比例: number
            关键review信息: string
          }>
        }
        使用行为: {
          核心insight: string
          细分行为: Array<{
            使用行为: string
            特征描述: string
            比例: number
            关键review信息: string
          }>
        }
      }
      // 保留原有字段以支持旧数据
      userPersona: string
      usageScenarios: string[]
      usageTiming: UsageTimingData[]
      userGroups: UserGroupData[]
      purchaseMotivations: string[]
    }
    userFeedback: {
      positiveAspects: string[]
      negativeAspects: string[]
      starRatingBreakdown: {
        fiveStar: StarRatingData
        fourStar: StarRatingData
        threeStar: StarRatingData
        twoStar: StarRatingData
        oneStar: StarRatingData
      }
    }
    unmetNeeds: string[]
  }
  competitiveAnalysis?: {
    userPersonaComparison: {
      ownBrand: string
      competitor: string
      keyDifferences: string[]
    }
    feedbackFrequencyGaps: Record<string, FeedbackGap>
    competitiveAdvantages: string[]
    competitiveWeaknesses: string[]
  }
  opportunityInsights: {
    productImprovement: Array<{
      category: string
      suggestions: string[]
    }>
    productInnovation: Array<{
      category: string
      suggestions: string[]
    }>
    marketingPositioning: Array<{
      category: string
      suggestions: string[]
    }>
  }
}

interface HistoricalReport {
  id: string
  timestamp: string
  title: string
  hasCompetitorData?: boolean
  targetCategory?: string
}

type ActiveModule = 'dashboard' | 'upload' | 'own-brand-insights' | 'own-brand-feedback' | 'own-brand-unmet' | 'competitive' | 'opportunities-improvement' | 'opportunities-innovation' | 'opportunities-marketing' | 'history'
type ThemeMode = 'light' | 'dark' | 'system'
type Language = 'en' | 'zh'

export default function App() {
  const [ownBrandFile, setOwnBrandFile] = useState<UploadedFile | null>(null)
  const [competitorFile, setCompetitorFile] = useState<UploadedFile | null>(null)
  const [targetCategory, setTargetCategory] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [analysisSteps, setAnalysisSteps] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState<string>('')
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [historicalReports, setHistoricalReports] = useState<HistoricalReport[]>([])
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['own-brand', 'opportunities']))
  const [hoveredUserGroup, setHoveredUserGroup] = useState<UserGroupData | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('system')
  const [language, setLanguage] = useState<Language>('en') // Default to English
  const [notifications, setNotifications] = useState(3)
  const [showSettings, setShowSettings] = useState(false)

  // 本地开发API配置
  const apiBase = 'http://localhost:8000'
  const t = translations[language]

  // Language management
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'zh' : 'en'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  // Theme management
  useEffect(() => {
    const root = window.document.documentElement
    
    const applyTheme = (mode: ThemeMode) => {
      root.classList.remove('light', 'dark')
      
      if (mode === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(mode)
      }
    }
    
    applyTheme(theme)
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme('system')
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  useEffect(() => {
    loadHistoricalReports()
  }, [])

  // Auto-expand relevant sections based on active module
  useEffect(() => {
    const newExpanded = new Set(expandedSections)
    if (activeModule.startsWith('own-brand')) {
      newExpanded.add('own-brand')
    }
    if (activeModule.startsWith('opportunities')) {
      newExpanded.add('opportunities')
    }
    setExpandedSections(newExpanded)
  }, [activeModule])

  const loadHistoricalReports = async () => {
    try {
      const response = await fetch(`${apiBase}/reports`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
      
      if (!response.ok) {
        console.error('Failed to load historical reports:', response.status, response.statusText)
        return
      }
      
      const reports = await response.json()
      setHistoricalReports(reports)
    } catch (error) {
      console.error('Failed to load historical reports:', error)
    }
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    const allowedExtensions = ['.csv', '.xls', '.xlsx']
    
    const hasValidType = allowedTypes.includes(file.type)
    const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    
    if (!hasValidType && !hasValidExtension) {
      return t.errors.uploadCsvExcel
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return t.errors.fileTooLarge
    }
    
    if (file.size === 0) {
      return t.errors.fileEmpty
    }
    
    return null
  }

  const validateAnalysisInputs = (): string | null => {
    if (!ownBrandFile) {
      return t.errors.uploadOwnBrand
    }
    
    if (!targetCategory.trim()) {
      return t.errors.enterCategory
    }
    
    if (targetCategory.trim().length < 2) {
      return t.errors.categoryTooShort
    }
    
    return null
  }

  const handleFileUpload = async (file: File, fileType: 'own' | 'competitor', retryCount = 0) => {
    const maxRetries = 2
    let progressInterval: number | undefined
    
    try {
      setError(null)
      setUploadProgress(0)
      setUploadingFile(fileType)
      
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        setUploadingFile(null)
        return
      }
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', fileType)

      progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200) as unknown as number

      console.log(`Uploading ${fileType} file:`, file.name, `Size: ${file.size} bytes`)

      const response = await fetch(`${apiBase}/upload`, {
        method: 'POST',
        body: formData
      })

      if (progressInterval) clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Upload failed:', response.status, response.statusText, errorData)
        
        // Retry logic for server errors
        if (response.status >= 500 && retryCount < maxRetries) {
          console.log(`Retrying upload (${retryCount + 1}/${maxRetries})...`)
          setTimeout(() => {
            handleFileUpload(file, fileType, retryCount + 1)
          }, 1000 * (retryCount + 1))
          return
        }
        
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()
      console.log('Upload successful:', result)
      
      if (fileType === 'own') {
        setOwnBrandFile(result)
      } else {
        setCompetitorFile(result)
      }

      setTimeout(() => {
        setUploadProgress(0)
        setUploadingFile(null)
      }, 1000)
      
    } catch (error) {
      if (progressInterval) clearInterval(progressInterval)
      console.error('Upload error:', error)
      
      let errorMessage = t.errors.uploadFailed
      if (error instanceof Error) {
        if (error.message.includes('Invalid file type')) {
          errorMessage = t.errors.unsupportedFormat
        } else if (error.message.includes('too large')) {
          errorMessage = t.errors.fileTooLarge2
        } else if (error.message.includes('Storage service not available')) {
          errorMessage = t.errors.storageUnavailable
        } else {
          errorMessage = `${t.errors.analysisFailed} ${error.message}`
        }
      }
      
      setError(errorMessage)
      setUploadProgress(0)
      setUploadingFile(null)
    }
  }

  const handleAnalyze = async () => {
    const validationError = validateAnalysisInputs()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setIsAnalyzing(true)
      setError(null)
      setAnalysisSteps([])
      setCurrentStep('')

      console.log('Starting analysis with files and category:', {
        ownBrand: ownBrandFile!.fileName,
        competitor: competitorFile?.fileName || 'none',
        targetCategory: targetCategory.trim(),
        language: language
      })

      const response = await fetch(`${apiBase}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownBrandFile: ownBrandFile!.fileName,
          competitorFile: competitorFile?.fileName || null,
          targetCategory: targetCategory.trim(),
          language: language
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Analysis failed:', response.status, response.statusText, errorData)
        throw new Error(errorData.error || `Analysis failed with status ${response.status}`)
      }

      const result = await response.json()
      console.log('Analysis started:', result.analysis_id)
      
      setAnalysisId(result.analysis_id)
      
      // 开始轮询分析进度
      pollAnalysisProgress(result.analysis_id)
      
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error instanceof Error ? `${t.errors.analysisFailed} ${error.message}` : t.errors.retryAnalysis)
      setIsAnalyzing(false)
    }
  }

  const pollAnalysisProgress = async (analysisId: string) => {
    try {
      const response = await fetch(`${apiBase}/analysis/${analysisId}/status`)
      
      if (!response.ok) {
        throw new Error('Failed to get analysis status')
      }
      
      const status = await response.json()
      console.log('Analysis status:', status)
      
      // 更新进度
      setAnalysisProgress(status.progress || 0)
      setAnalysisSteps(status.steps || [])
      
      // 更新当前步骤
      if (status.current_step < status.steps?.length) {
        const currentStepData = status.steps[status.current_step]
        setCurrentStep(language === 'en' ? currentStepData?.name : currentStepData?.name_zh)
      }
      
      if (status.status === 'completed') {
        // 分析完成，获取结果
        const resultResponse = await fetch(`${apiBase}/analysis/${analysisId}/result`)
        if (resultResponse.ok) {
          const analysisResult = await resultResponse.json()
          setAnalysisResult(analysisResult)
          setActiveModule('own-brand-insights')
          loadHistoricalReports()
        }
        setIsAnalyzing(false)
        setAnalysisProgress(100)
      } else if (status.status === 'failed') {
        throw new Error(status.error || 'Analysis failed')
      } else if (status.status === 'running' || status.status === 'starting') {
        // 继续轮询
        setTimeout(() => pollAnalysisProgress(analysisId), 2000)
      }
      
    } catch (error) {
      console.error('Progress polling error:', error)
      setError(error instanceof Error ? error.message : 'Failed to get analysis progress')
      setIsAnalyzing(false)
    }
  }

  const loadHistoricalReport = async (reportId: string) => {
    try {
      const response = await fetch(`${apiBase}/report/${reportId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to load report: ${response.status}`)
      }
      
      const report = await response.json()
      setAnalysisResult(report)
      setActiveModule('own-brand-insights')
    } catch (error) {
      console.error('Failed to load report:', error)
      setError(t.errors.loadReportFailed)
    }
  }

  const downloadPDF = () => {
    alert(t.success.pdfDeveloping)
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setOwnBrandFile(null)
    setCompetitorFile(null)
    setTargetCategory('')
    setActiveModule('dashboard')
    setError(null)
    setExpandedSections(new Set(['own-brand', 'opportunities']))
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const navigationItems = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: Home,
      available: true,
      children: []
    },
    {
      id: 'upload',
      label: t.nav.upload,
      icon: Upload,
      available: true,
      children: []
    },
    {
      id: 'own-brand',
      label: t.nav.ownBrand,
      icon: Users,
      available: !!analysisResult,
      children: [
        { id: 'own-brand-insights', label: t.nav.ownBrandInsights, icon: Target },
        { id: 'own-brand-feedback', label: t.nav.ownBrandFeedback, icon: MessageSquare },
        { id: 'own-brand-unmet', label: t.nav.ownBrandUnmet, icon: AlertCircle }
      ]
    },
    {
      id: 'competitive',
      label: t.nav.competitive,
      icon: BarChart3,
      available: !!(analysisResult && analysisResult.hasCompetitorData),
      children: []
    },
    {
      id: 'opportunities',
      label: t.nav.opportunities,
      icon: Lightbulb,
      available: !!analysisResult,
      children: [
        { id: 'opportunities-improvement', label: t.nav.opportunitiesImprovement, icon: Target },
        { id: 'opportunities-innovation', label: t.nav.opportunitiesInnovation, icon: Zap },
        { id: 'opportunities-marketing', label: t.nav.opportunitiesMarketing, icon: TrendingUp }
      ]
    },
    {
      id: 'history',
      label: t.nav.history,
      icon: History,
      available: historicalReports.length > 0,
      children: []
    }
  ]

  const NavigationContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="gap-system-sm flex flex-col">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isExpanded = expandedSections.has(item.id)
        const hasChildren = item.children.length > 0
        const isDisabled = !item.available
        const isActive = activeModule === item.id

        return (
          <div key={item.id}>
            <motion.button
              whileHover={!isDisabled ? { x: 2 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={() => {
                if (hasChildren && item.available) {
                  toggleSection(item.id)
                  if (!isExpanded && item.children.length > 0) {
                    setActiveModule(item.children[0].id as ActiveModule)
                  }
                } else if (item.available) {
                  setActiveModule(item.id as ActiveModule)
                  if (isMobile) setMobileMenuOpen(false)
                }
              }}
              disabled={isDisabled}
              className={`w-full flex items-center gap-system-sm px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : isDisabled
                  ? 'text-muted-foreground cursor-not-allowed opacity-50'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-primary' : isDisabled ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
              {(sidebarOpen || isMobile) && (
                <>
                  <span className="text-sm flex-1">{item.label}</span>
                  {hasChildren && item.available && (
                    <motion.div 
                      className="ml-auto"
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </motion.div>
                  )}
                </>
              )}
            </motion.button>

            {/* Children items */}
            {(sidebarOpen || isMobile) && hasChildren && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-5 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-3 overflow-hidden"
                  >
                    {item.children.map((child) => {
                      const ChildIcon = child.icon
                      const isActive = activeModule === child.id

                      return (
                        <motion.button
                          key={child.id}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setActiveModule(child.id as ActiveModule)
                            if (isMobile) setMobileMenuOpen(false)
                          }}
                          className={`w-full flex items-center gap-system-sm px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                            isActive
                              ? 'bg-sidebar-accent text-sidebar-primary'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent'
                          }`}
                        >
                          <ChildIcon className={`h-3 w-3 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-xs">{child.label}</span>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )
      })}
    </nav>
  )

  const renderMainContent = () => {
    if (activeModule === 'dashboard') {
      return (
        <motion.div 
          className="gap-system-2xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section - Google Analytics inspired clean header */}
          <div className="border-b border-border pb-8">
            <motion.div 
              className="gap-system-md flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-3 bg-accent rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="mb-2">
                  {t.appTitle}
                </h1>
                <p className="text-muted-foreground text-base mb-6 max-w-2xl">
                  {t.appSubtitle}
                </p>
                <motion.div 
                  className="gap-system-sm flex"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setActiveModule('upload')}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {t.dashboard.startAnalysis}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      document.getElementById('features-section')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      })
                    }}
                  >
                    {t.dashboard.viewFeatures}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Core Features - Clean Google Analytics style */}
          <motion.div 
            id="features-section"
            className="gap-system-lg flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-2">{t.dashboard.coreFeatures}</h2>
            <div className="gap-system-md grid md:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: t.dashboard.features.userInsights.title,
                  description: t.dashboard.features.userInsights.description,
                  features: t.dashboard.features.userInsights.items
                },
                {
                  icon: BarChart2,
                  title: t.dashboard.features.competitive.title,
                  description: t.dashboard.features.competitive.description,
                  features: t.dashboard.features.competitive.items
                },
                {
                  icon: Lightbulb,
                  title: t.dashboard.features.opportunities.title,
                  description: t.dashboard.features.opportunities.description,
                  features: t.dashboard.features.opportunities.items
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="h-full border-clean shadow-clean-md hover:shadow-clean-lg transition-shadow duration-300">
                    <CardContent className="spacing-system-lg">
                      <div className="gap-system-md flex flex-col">
                        <div className="gap-system-sm flex items-center">
                          <div className="p-2 bg-accent rounded-lg">
                            <feature.icon className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-medium">{feature.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="gap-system-sm flex flex-col text-xs text-muted-foreground">
                          {feature.features.map((f, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats - Clean metrics display */}
          <motion.div 
            className="gap-system-lg flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="mb-2">{t.dashboard.platformData}</h2>
            <div className="gap-system-md grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "6+", label: t.dashboard.stats.dimensions },
                { value: "15+", label: t.dashboard.stats.insights },
                { value: "10MB", label: t.dashboard.stats.fileSupport },
                { value: language === 'en' ? "Seconds" : "秒级", label: t.dashboard.stats.speed }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-clean shadow-clean">
                    <CardContent className="spacing-system-lg text-center">
                      <div className="text-2xl font-normal text-primary mb-1">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA - Clean call to action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center bg-accent rounded-lg spacing-system-2xl border-clean"
          >
            <h2 className="mb-4">{t.dashboard.readyToStart}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-base leading-relaxed">
              {t.dashboard.readyDescription}
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setActiveModule('upload')}
            >
              <Upload className="mr-2 h-4 w-4" />
              {t.dashboard.startAnalysis}
            </Button>
          </motion.div>
        </motion.div>
      )
    }

    if (activeModule === 'upload') {
      return (
        <motion.div 
          className="gap-system-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Clean header */}
          <div className="border-b border-border pb-6">
            <div className="gap-system-sm flex items-center">
              <Upload className="h-5 w-5 text-primary" />
              <div>
                <h2 className="mb-1">{t.upload.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {t.upload.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Info alert - cleaner styling */}
          <Alert className="border-primary/20 bg-accent">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-accent-foreground text-sm leading-relaxed">
              {t.upload.infoMessage}
            </AlertDescription>
          </Alert>

          {/* Target Category Input - Google Analytics style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-clean shadow-clean">
              <CardContent className="spacing-system-lg">
                <div className="gap-system-lg flex flex-col">
                  <div className="gap-system-sm flex items-center">
                    <div className="p-2 bg-accent rounded-lg">
                      <Tag className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t.upload.targetCategory.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.upload.targetCategory.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="gap-system-sm flex flex-col">
                    <Label htmlFor="targetCategory" className="text-sm">
                      {t.upload.targetCategory.label} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="targetCategory"
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value)}
                      placeholder={t.upload.targetCategory.placeholder}
                      className="border-clean"
                      maxLength={50}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t.upload.targetCategory.helpText}</span>
                      <span>{targetCategory.length}/50</span>
                    </div>
                  </div>

                  {/* Category suggestions - cleaner styling */}
                  <div className="gap-system-sm flex flex-wrap items-center">
                    <span className="text-xs text-muted-foreground">{t.upload.targetCategory.commonCategories}</span>
                    {[
                      t.categories.wirelessEarphones,
                      t.categories.smartWatch,
                      t.categories.laptop,
                      t.categories.skincare,
                      t.categories.sportShoes,
                      t.categories.coffeeMachine
                    ].map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs border-clean"
                        onClick={() => setTargetCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* File Upload - Clean Google Analytics style cards */}
          <div className="gap-system-md grid md:grid-cols-2">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              delay={0.2}
            >
              <Card className={`h-full border-2 border-dashed transition-all duration-300 ${
                ownBrandFile ? 'border-primary/50 bg-accent shadow-clean-md' : 
                'border-border hover:border-primary/50 hover:shadow-clean'
              }`}>
                <CardContent className="spacing-system-lg">
                  <div className="text-center gap-system-md flex flex-col">
                    <motion.div 
                      animate={uploadingFile === 'own' ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: uploadingFile === 'own' ? Infinity : 0 }}
                    >
                      {ownBrandFile ? (
                        <CheckCircle className="mx-auto h-8 w-8 text-primary" />
                      ) : uploadingFile === 'own' ? (
                        <RefreshCw className="mx-auto h-8 w-8 text-primary" />
                      ) : (
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      )}
                    </motion.div>
                    <div>
                      <h3 className="font-medium mb-1">{t.upload.ownBrand.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t.upload.ownBrand.description}
                      </p>
                    </div>
                    
                    {ownBrandFile ? (
                      <div className="gap-system-sm flex flex-col">
                        <Badge variant="outline" className="text-primary border-primary/30 bg-accent text-xs">
                          {t.upload.ownBrand.uploaded} {ownBrandFile.originalName}
                          {ownBrandFile.size && (
                            <span className="ml-1">({Math.round(ownBrandFile.size / 1024)}KB)</span>
                          )}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={uploadingFile === 'own'}
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept='.csv,.xlsx,.xls'
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) handleFileUpload(file, 'own')
                            }
                            input.click()
                          }}
                          className="border-clean"
                        >
                          {t.upload.ownBrand.reupload}
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline"
                        disabled={uploadingFile === 'own'}
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept='.csv,.xlsx,.xls'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleFileUpload(file, 'own')
                          }
                          input.click()
                        }}
                        className="border-clean"
                      >
                        {uploadingFile === 'own' ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            {t.upload.uploading}
                          </>
                        ) : (
                          t.upload.selectFile
                        )}
                      </Button>
                    )}
                    
                    {uploadProgress > 0 && uploadProgress < 100 && uploadingFile === 'own' && (
                      <motion.div 
                        className="gap-system-sm flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-xs text-muted-foreground">{t.ui.uploadProgress} {uploadProgress}%</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              delay={0.3}
            >
              <Card className={`h-full border-2 border-dashed transition-all duration-300 ${
                competitorFile ? 'border-primary/50 bg-accent shadow-clean-md' : 
                'border-border hover:border-primary/50 hover:shadow-clean'
              }`}>
                <CardContent className="spacing-system-lg">
                  <div className="text-center gap-system-md flex flex-col">
                    <motion.div 
                      animate={uploadingFile === 'competitor' ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: uploadingFile === 'competitor' ? Infinity : 0 }}
                    >
                      {competitorFile ? (
                        <CheckCircle className="mx-auto h-8 w-8 text-primary" />
                      ) : uploadingFile === 'competitor' ? (
                        <RefreshCw className="mx-auto h-8 w-8 text-primary" />
                      ) : (
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      )}
                    </motion.div>
                    <div>
                      <div className="gap-system-xs flex items-center justify-center mb-1">
                        <h3 className="font-medium">{t.upload.competitor.title}</h3>
                        <Badge variant="outline" className="text-muted-foreground text-xs">
                          {t.upload.competitor.optional}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t.upload.competitor.description}
                      </p>
                    </div>
                    
                    {competitorFile ? (
                      <div className="gap-system-sm flex flex-col">
                        <Badge variant="outline" className="text-primary border-primary/30 bg-accent text-xs">
                          {t.upload.ownBrand.uploaded} {competitorFile.originalName}
                          {competitorFile.size && (
                            <span className="ml-1">({Math.round(competitorFile.size / 1024)}KB)</span>
                          )}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={uploadingFile === 'competitor'}
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept='.csv,.xlsx,.xls'
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) handleFileUpload(file, 'competitor')
                            }
                            input.click()
                          }}
                          className="border-clean"
                        >
                          {t.upload.ownBrand.reupload}
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline"
                        disabled={uploadingFile === 'competitor'}
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept='.csv,.xlsx,.xls'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleFileUpload(file, 'competitor')
                          }
                          input.click()
                        }}
                        className="border-clean"
                      >
                        {uploadingFile === 'competitor' ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            {t.upload.uploading}
                          </>
                        ) : (
                          t.upload.selectFile
                        )}
                      </Button>
                    )}
                    
                    {uploadProgress > 0 && uploadProgress < 100 && uploadingFile === 'competitor' && (
                      <motion.div 
                        className="gap-system-sm flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-xs text-muted-foreground">{t.ui.uploadProgress} {uploadProgress}%</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Action button */}
          <div className="flex justify-center pt-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              delay={0.4}
            >
              <Button
                onClick={handleAnalyze}
                disabled={!ownBrandFile || !targetCategory.trim() || isAnalyzing || uploadingFile !== null}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    {t.upload.analyzing}
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {t.upload.startAnalysis}
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Analysis progress - Real-time progress tracking */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="max-w-2xl mx-auto border-clean shadow-clean-md">
                  <CardContent className="spacing-system-lg">
                    <div className="gap-system-md flex flex-col items-center">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium mb-2">AI {language === 'en' ? 'Analyzing Your Data' : '正在分析您的数据'}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'en' ? 'Category:' : '类别:'} <span className="text-primary font-medium">{targetCategory}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {language === 'en' ? 'We are deeply analyzing review data to identify user insights and market opportunities...' : '我们正在深度分析评论数据，识别用户洞察和市场机会...'}
                        </p>
                      </div>
                      
                      {/* Overall Progress Bar */}
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>{language === 'en' ? 'Overall Progress' : '总体进度'}</span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div 
                            className="bg-primary h-2 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${analysisProgress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      {/* Current Step */}
                      {currentStep && (
                        <div className="text-center">
                          <p className="text-sm font-medium text-primary">
                            {language === 'en' ? 'Current Step:' : '当前步骤:'} {currentStep}
                          </p>
                        </div>
                      )}

                      {/* Step Progress List */}
                      {analysisSteps.length > 0 && (
                        <div className="w-full max-w-md">
                          <h4 className="text-sm font-medium mb-3 text-center">
                            {language === 'en' ? 'Analysis Steps' : '分析步骤'}
                          </h4>
                          <div className="gap-2 flex flex-col">
                            {analysisSteps.map((step, index) => (
                              <motion.div
                                key={step.id}
                                className="flex items-center gap-3 text-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  step.status === 'completed' ? 'bg-green-500' :
                                  step.status === 'running' ? 'bg-primary animate-pulse' :
                                  'bg-muted'
                                }`}>
                                  {step.status === 'completed' && (
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  )}
                                  {step.status === 'running' && (
                                    <Clock className="w-3 h-3 text-white animate-spin" />
                                  )}
                                </div>
                                <span className={`flex-1 ${
                                  step.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                                  step.status === 'running' ? 'text-primary font-medium' :
                                  'text-muted-foreground'
                                }`}>
                                  {language === 'en' ? step.name : step.name_zh}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )
    }

    if (activeModule === 'own-brand-insights') {
      return (
        <UserInsights 
          language={language}
          t={t}
          analysisResult={analysisResult}
        />
      )
    }

    if (activeModule === 'own-brand-feedback') {
      return (
        <UserFeedback 
          language={language}
          t={t}
          analysisResult={analysisResult}
        />
      )
    }

    if (activeModule === 'own-brand-unmet') {
      return (
        <UnmetNeeds 
          language={language}
          t={t}
          analysisResult={analysisResult}
        />
      )
    }

    if (activeModule === 'opportunities-improvement' || 
        activeModule === 'opportunities-innovation' || 
        activeModule === 'opportunities-marketing') {
      const activeTab = activeModule.replace('opportunities-', '')
      return (
        <Opportunities 
          language={language}
          t={t}
          analysisResult={analysisResult}
          activeTab={activeTab}
        />
      )
    }

    // Other modules - clean placeholder
    return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="mb-2">{t.ui.developing}</h3>
        <p className="text-muted-foreground text-sm">{t.ui.featureDeveloping}</p>
      </motion.div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar - Clean Google Analytics style */}
        <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 hidden md:block ${sidebarOpen ? 'w-64' : 'w-16'}`}>
          <div className="spacing-system-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <motion.div 
                  className="gap-system-sm flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sidebar-foreground">{t.nav.analyticsTools}</span>
                </motion.div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-sidebar-accent"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            <NavigationContent />

            {/* Action buttons */}
            {sidebarOpen && analysisResult && (
              <motion.div 
                className="mt-8 pt-6 border-t border-sidebar-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="gap-system-sm flex flex-col">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadPDF}
                    className="w-full text-sidebar-foreground border-clean hover:bg-sidebar-accent"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    {t.ui.downloadReport}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetAnalysis}
                    className="w-full text-sidebar-foreground border-clean hover:bg-sidebar-accent"
                  >
                    {t.ui.newAnalysis}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-80 p-0 bg-sidebar border-sidebar-border">
            <div className="spacing-system-md">
              <div className="gap-system-sm flex items-center mb-8">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="font-medium text-sidebar-foreground">{t.nav.analyticsTools}</span>
              </div>
              
              <NavigationContent isMobile />

              {analysisResult && (
                <div className="mt-8 pt-6 border-t border-sidebar-border">
                  <div className="gap-system-sm flex flex-col">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadPDF}
                      className="w-full text-sidebar-foreground border-clean hover:bg-sidebar-accent"
                    >
                      <Download className="mr-2 h-3 w-3" />
                      {t.ui.downloadReport}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAnalysis}
                      className="w-full text-sidebar-foreground border-clean hover:bg-sidebar-accent"
                    >
                      {t.ui.newAnalysis}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex flex-col">
          {/* Top Bar - Clean Google Analytics style */}
          <div className="bg-background border-b border-border px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="gap-system-sm flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                
                {analysisResult && activeModule !== 'dashboard' && (
                  <div className="gap-system-sm flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <div className="hidden sm:block">
                      <div className="gap-system-xs flex items-center">
                        <span className="text-sm font-medium">{t.analysis.reportGenerated}</span>
                        {analysisResult.hasCompetitorData && (
                          <Badge variant="outline" className="text-primary border-primary/30 bg-accent text-xs">
                            {t.analysis.withCompetitor}
                          </Badge>
                        )}
                        {analysisResult.targetCategory && (
                          <Badge variant="outline" className="text-muted-foreground border-border bg-muted text-xs">
                            {analysisResult.targetCategory}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t.analysis.generatedTime} {new Date(analysisResult.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="gap-system-xs flex items-center">
                {/* Language Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLanguage}
                      className="h-8 px-2 gap-1"
                    >
                      <Languages className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        {language === 'en' ? 'EN' : '中'}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{language === 'en' ? t.ui.chinese : t.ui.english}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Theme Toggle - Clean button group */}
                <div className="gap-0 flex items-center bg-muted rounded-lg p-0.5">
                  {[
                    { mode: 'light' as ThemeMode, icon: Sun, label: t.ui.light },
                    { mode: 'system' as ThemeMode, icon: Monitor, label: t.ui.system },
                    { mode: 'dark' as ThemeMode, icon: Moon, label: t.ui.dark }
                  ].map(({ mode, icon: Icon, label }) => (
                    <Tooltip key={mode}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={theme === mode ? "default" : "ghost"}
                          size="sm"
                          className={`h-6 w-6 p-0 ${theme === mode ? 'bg-background shadow-clean' : ''}`}
                          onClick={() => setTheme(mode)}
                        >
                          <Icon className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* User actions */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-4 w-4" />
                      {notifications > 0 && (
                        <motion.div
                          className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <span className="text-[9px] text-primary-foreground font-bold">
                            {notifications}
                          </span>
                        </motion.div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.ui.notifications}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.ui.settings}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.ui.userCenter}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert className="m-6 border-destructive/20 bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive-foreground text-sm">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {/* Main Content - Google Analytics style with better spacing */}
          <div className="flex-1 spacing-system-xl">
            <div className="max-w-7xl mx-auto">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}