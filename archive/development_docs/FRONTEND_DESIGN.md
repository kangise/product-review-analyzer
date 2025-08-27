# ReviewMind AI - 前端设计文档

## 📋 项目概述

### 项目名称
**ReviewMind AI - AI-Powered Customer Intelligence Engine**

### 项目目标
基于现有的AI分析引擎，开发完整的前端界面，实现从数据上传到结果展示的完整用户体验，为WWGS 2025 GenAI Shark Tank提供专业的产品展示平台。

### 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **UI组件**: Radix UI
- **动画库**: Framer Motion
- **图表库**: Recharts
- **PDF生成**: jsPDF + html2canvas
- **后端集成**: Supabase

## 🏗️ 系统架构

### 前后端分离架构
```
┌─────────────────┐    API调用    ┌─────────────────┐
│   React前端     │ ←----------→  │  Python后端     │
│                 │               │                 │
│ - 用户界面      │               │ - 分析引擎      │
│ - 状态管理      │               │ - 数据处理      │
│ - 本地存储      │               │ - JSON输出      │
└─────────────────┘               └─────────────────┘
```

### API通信机制
- **轮询方式**: 每2-3秒轮询分析状态
- **RESTful API**: 标准的HTTP请求/响应
- **错误处理**: 完整的错误捕获和重试机制
- **数据格式**: JSON标准化传输

## 🎨 设计原则

### 视觉设计风格
- **Google Analytics风格**: 清洁、专业的界面设计
- **一致性**: 统一的颜色、字体、间距系统
- **响应式**: 完美适配桌面和移动端
- **无障碍**: 符合WCAG标准的可访问性设计

### 交互设计原则
基于example.jpg参考设计：

#### 1. 主线信息清晰
- 关键洞察一目了然
- 重要数据突出显示
- 清晰的信息层次结构

#### 2. 渐进式信息展示
- **默认视图**: 显示核心洞察和汇总数据
- **点击展开**: 显示详细分析内容
- **悬停提示**: 显示简短解释
- **模态框**: 显示完整的用户评论原声

#### 3. 表格化数据展示
```
深色表头 (深蓝/灰色背景)
├── 项目名称 (左对齐)
├── 进度条 (中间，带颜色编码)
├── 数值 (右对齐)
└── 详细说明 (小字体，可点击展开)

颜色编码:
- 橙色: 中性/一般表现
- 绿色: 正面/优势
- 红色: 负面/劣势/问题
```

#### 4. 交互式详情展示
- **可点击的洞察卡片**: 蓝色边框突出重要洞察
- **悬停显示详情**: 鼠标悬停显示更多解释
- **原声引用**: 点击查看具体的用户评论原文

## 📊 功能模块设计

### 核心功能模块

#### 1. 仪表盘 (Dashboard)
- **功能**: 产品介绍、核心功能展示、快速入口
- **设计**: Hero区域 + 功能卡片 + 统计数据 + CTA
- **交互**: 流畅的动画效果、功能导航

#### 2. 数据上传 (Data Upload)
- **功能**: 文件上传、品类设置、分析启动
- **设计**: 分步骤的上传流程、清晰的状态指示
- **交互**: 拖拽上传、实时验证、进度显示

#### 3. 分析进度 (Analysis Progress)
- **位置**: 集成在Data Upload页面下方
- **功能**: 实时显示9个分析步骤的进度
- **设计**: 整体进度条 + 详细步骤列表
- **交互**: 实时更新、完成提示、跳转引导

#### 4. 分析结果展示
基于后端JSON输出的9个分析维度：

##### User Insights (用户洞察) - 3个子模块
- **Consumer Profile**: 基于 `consumer_profile.json`
- **Consumer Motivation**: 基于 `consumer_motivation.json`  
- **Consumer Scenario**: 基于 `consumer_scenario.json`

##### User Feedback Analysis (用户反馈分析) - 2个子模块
- **Consumer Love**: 基于 `consumer_love.json`
- **Star Rating Root Cause**: 基于 `star_rating_root_cause.json`

##### Unmet Needs Analysis (未满足需求分析) - 1个模块
- **Unmet Needs**: 基于 `unmet_needs.json`

##### Competitive Analysis (竞品分析) - 1个模块
- **Competitor Analysis**: 基于 `competitor.json`

##### Opportunity Insights (机会洞察) - 3个子模块
- **Product Improvement**: 基于 `opportunity.json` 的产品改进机会
- **Product Innovation**: 基于 `opportunity.json` 的产品创新机会
- **Marketing Positioning**: 基于 `opportunity.json` 的营销定位机会

#### 5. 报告管理
- **PDF下载**: 前端生成专业PDF报告
- **历史报告**: 本地存储的历史记录管理
- **报告搜索**: 按时间、品类、类型筛选

#### 6. 设置页面
- **显示设置**: 字体大小、行间距、内容密度、动画效果
- **分析设置**: 默认语言、自动保存、进度提醒
- **导出设置**: PDF格式、页面大小、包含内容
- **数据设置**: 历史记录保留、缓存管理

## 🔧 技术实现方案

### 状态管理
- **React Hooks**: 使用useState、useEffect进行状态管理
- **本地存储**: localStorage存储用户设置和历史报告
- **实时同步**: 轮询机制保持数据同步

### API集成
- **文件上传API**: 支持CSV/Excel文件上传
- **分析状态API**: 轮询获取分析进度
- **结果获取API**: 获取完整的分析结果
- **历史报告API**: 管理历史分析记录

### 数据处理
- **类型安全**: TypeScript接口定义所有数据结构
- **数据验证**: 前端验证用户输入和API响应
- **错误处理**: 完整的错误捕获和用户友好的错误提示

### 性能优化
- **组件懒加载**: 按需加载大型组件
- **动画优化**: 使用Framer Motion进行性能优化的动画
- **缓存机制**: 合理使用缓存减少API调用

## 🎯 用户体验设计

### 信息架构
```
主导航
├── 仪表盘 (Dashboard)
├── 数据上传 (Data Upload)
├── 用户洞察 (User Insights)
│   ├── 消费者画像 (Consumer Profile)
│   ├── 购买动机 (Consumer Motivation)
│   └── 使用场景 (Consumer Scenario)
├── 用户反馈分析 (User Feedback Analysis)
│   ├── 消费者喜爱点 (Consumer Love)
│   └── 评分根因分析 (Star Rating Root Cause)
├── 未满足需求分析 (Unmet Needs Analysis)
├── 竞品分析 (Competitive Analysis)
├── 机会洞察 (Opportunity Insights)
│   ├── 产品改进机会 (Product Improvement)
│   ├── 产品创新机会 (Product Innovation)
│   └── 营销定位机会 (Marketing Positioning)
├── 历史报告 (Historical Reports)
└── 设置 (Settings)
```

### 交互流程
```
用户访问 → 仪表盘介绍 → 数据上传 → 分析进度 → 结果展示 → 报告下载/保存
     ↑                                                    ↓
     ←─────────── 历史报告查看 ←─────────────────────────────┘
```

### 响应式设计
- **桌面端**: 侧边栏导航 + 主内容区域
- **平板端**: 可折叠侧边栏 + 适配的内容布局
- **移动端**: 底部导航 + 全屏内容展示

## 🌐 国际化支持

### 多语言设计
- **支持语言**: 中文、英文
- **切换机制**: 全局语言切换按钮
- **持久化**: 本地存储用户语言偏好
- **文化适配**: 考虑不同文化的设计习惯

### 翻译管理
- **翻译文件**: 结构化的翻译对象
- **动态加载**: 按需加载语言包
- **回退机制**: 缺失翻译时的默认处理

## 🧩 组件设计规范

### 核心UI组件

#### InsightTable 组件
```typescript
interface TableRow {
  id: string
  name: string
  value: number
  percentage: number
  color: 'orange' | 'green' | 'red'
  description: string
  details?: string[]
  quotes?: string[]
  expandable: boolean
}

interface InsightTableProps {
  title: string
  subtitle?: string
  rows: TableRow[]
  onRowClick?: (row: TableRow) => void
  onRowHover?: (row: TableRow) => void
  className?: string
}

// 使用示例
<InsightTable 
  title="客户满意度分析"
  subtitle="基于用户反馈的满意度分布"
  rows={satisfactionData}
  onRowClick={(row) => showRowDetails(row)}
  onRowHover={(row) => showTooltip(row)}
/>
```

#### InsightCard 组件
```typescript
interface InsightCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  summary: string
  details: string
  quotes: string[]
  priority: 'high' | 'medium' | 'low'
  expandable: boolean
  expanded: boolean
  onToggle: () => void
  onQuoteClick: (quote: string) => void
}

// 使用示例
<InsightCard 
  icon={Lightbulb}
  title="AI智能追踪功能"
  summary="用户最称赞的核心功能，解放双手操作"
  details="详细的功能分析内容..."
  quotes={relatedQuotes}
  priority="high"
  expandable={true}
  expanded={isExpanded}
  onToggle={() => setExpanded(!isExpanded)}
  onQuoteClick={(quote) => showQuoteModal(quote)}
/>
```

#### ProgressBar 组件
```typescript
interface ProgressBarProps {
  value: number
  max: number
  color: 'orange' | 'green' | 'red'
  size: 'sm' | 'md' | 'lg'
  showLabel: boolean
  animated: boolean
  className?: string
}

// 使用示例
<ProgressBar 
  value={75}
  max={100}
  color="green"
  size="md"
  showLabel={true}
  animated={true}
/>
```

#### AnalysisProgress 组件
```typescript
interface AnalysisStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  progress: number
  startTime?: Date
  endTime?: Date
  duration?: number
  details?: string
}

interface AnalysisProgressProps {
  steps: AnalysisStep[]
  overallProgress: number
  estimatedTimeRemaining: number
  onStepClick?: (step: AnalysisStep) => void
}

// 使用示例
<AnalysisProgress 
  steps={analysisSteps}
  overallProgress={overallProgress}
  estimatedTimeRemaining={estimatedTime}
  onStepClick={(step) => showStepDetails(step)}
/>
```

### 数据可视化组件

#### PieChartGrid 组件
```typescript
interface PieChartData {
  name: string
  value: number
  color: string
  description?: string
}

interface PieChartGridProps {
  title: string
  charts: Array<{
    title: string
    data: PieChartData[]
    centerText?: string
  }>
  gridCols: 2 | 3 | 4
  onChartClick?: (chartIndex: number, data: PieChartData) => void
}

// 使用示例 - 基于example.jpg的2x2布局
<PieChartGrid 
  title="消费者画像分布"
  charts={[
    { title: "年龄分布", data: ageData },
    { title: "职业分布", data: occupationData },
    { title: "使用场景", data: scenarioData },
    { title: "购买动机", data: motivationData }
  ]}
  gridCols={2}
  onChartClick={(index, data) => showChartDetails(index, data)}
/>
```

## 📋 数据结构定义

### API响应数据结构

#### 分析结果主结构
```typescript
interface AnalysisResult {
  id: string
  timestamp: string
  targetCategory: string
  hasCompetitorData: boolean
  status: 'completed' | 'processing' | 'error'
  
  // 9个分析维度的结果
  productType: ProductTypeResult
  consumerProfile: ConsumerProfileResult
  consumerScenario: ConsumerScenarioResult
  consumerMotivation: ConsumerMotivationResult
  consumerLove: ConsumerLoveResult
  unmetNeeds: UnmetNeedsResult
  opportunity: OpportunityResult
  starRatingRootCause: StarRatingResult
  competitor?: CompetitorResult
}
```

#### Consumer Profile 数据结构
```typescript
interface ConsumerProfileResult {
  关键用户画像洞察: {
    核心用户画像: string
    细分潜力用户类型: string
    关键用户行为: string
  }
  消费者画像分析: {
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
    // ... 其他维度
  }
}
```

#### Opportunity 数据结构
```typescript
interface OpportunityResult {
  商业机会洞察: {
    核心洞察总结: string
    产品改进机会: Array<{
      机会名称: string
      目标用户: string
      核心方案: string
      实施路径: string
      预期价值: string
      启发性评论原文: string[]
    }>
    产品创新机会: Array<{
      机会名称: string
      目标用户: string
      核心方案: string
      实施路径: string
      预期价值: string
      启发性评论原文: string[]
    }>
    营销定位机会: Array<{
      机会名称: string
      目标用户: string
      核心方案: string
      实施路径: string
      预期价值: string
      启发性评论原文: string[]
    }>
  }
}
```

### 本地存储数据结构

#### 历史报告存储
```typescript
interface HistoricalReport {
  id: string
  timestamp: string
  title: string
  targetCategory: string
  hasCompetitorData: boolean
  fileNames: {
    ownBrand: string
    competitor?: string
  }
  analysisResult: AnalysisResult
  settings: {
    language: 'en' | 'zh'
    theme: 'light' | 'dark' | 'system'
  }
}

// localStorage key: 'reviewmind_historical_reports'
// 数据格式: HistoricalReport[]
```

#### 用户设置存储
```typescript
interface UserSettings {
  display: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large'
    lineHeight: 'compact' | 'standard' | 'relaxed'
    contentDensity: 'compact' | 'standard' | 'relaxed'
    animations: boolean
  }
  analysis: {
    defaultLanguage: 'en' | 'zh'
    autoSave: boolean
    progressNotifications: boolean
  }
  export: {
    pdfPageSize: 'A4' | 'Letter'
    pdfOrientation: 'portrait' | 'landscape'
    includeCharts: boolean
    watermark: boolean
  }
  data: {
    historyRetention: 7 | 30 | 90 | -1 // -1 表示永久
    lastCleanup: string
  }
}

// localStorage key: 'reviewmind_user_settings'
```

## 🔄 API接口设计

### 文件上传接口
```typescript
// POST /api/upload
interface UploadRequest {
  file: File
  fileType: 'own' | 'competitor'
}

interface UploadResponse {
  success: boolean
  fileName: string
  originalName: string
  size: number
  fileType: 'own' | 'competitor'
  error?: string
}
```

### 分析启动接口
```typescript
// POST /api/analyze
interface AnalyzeRequest {
  ownBrandFile: string
  competitorFile?: string
  targetCategory: string
  language: 'en' | 'zh'
}

interface AnalyzeResponse {
  success: boolean
  analysisId: string
  estimatedDuration: number
  error?: string
}
```

### 分析状态查询接口
```typescript
// GET /api/analysis/{analysisId}/status
interface AnalysisStatusResponse {
  analysisId: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  overallProgress: number
  currentStep: string
  steps: Array<{
    name: string
    status: 'pending' | 'running' | 'completed' | 'error'
    progress: number
    startTime?: string
    endTime?: string
    details?: string
  }>
  estimatedTimeRemaining: number
  error?: string
}
```

### 分析结果获取接口
```typescript
// GET /api/analysis/{analysisId}/result
interface AnalysisResultResponse {
  success: boolean
  result: AnalysisResult
  error?: string
}
```

## 🎨 样式系统设计

### 颜色系统
基于example.jpg的配色方案：

```css
:root {
  /* 主色调 */
  --primary-blue: #2c3e50;
  --primary-orange: #f39c12;
  
  /* 状态颜色 */
  --success-green: #27ae60;
  --warning-orange: #f39c12;
  --error-red: #e74c3c;
  
  /* 中性色 */
  --gray-50: #f8f9fa;
  --gray-100: #e9ecef;
  --gray-200: #dee2e6;
  --gray-300: #ced4da;
  --gray-400: #adb5bd;
  --gray-500: #6c757d;
  --gray-600: #495057;
  --gray-700: #343a40;
  --gray-800: #212529;
  --gray-900: #000000;
}
```

### 字体系统
```css
:root {
  /* 字体大小 */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  
  /* 行高 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### 间距系统
```css
:root {
  /* 间距 */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
}
```

## 📱 响应式断点
```css
/* 移动端 */
@media (max-width: 640px) { /* sm */ }

/* 平板端 */
@media (min-width: 641px) and (max-width: 1024px) { /* md */ }

/* 桌面端 */
@media (min-width: 1025px) { /* lg */ }

/* 大屏桌面 */
@media (min-width: 1280px) { /* xl */ }
```

## 🚀 实现计划

### Phase 1: 核心功能开发 (优先级: 高)

#### 1.1 API对接和数据流
- [ ] 建立前后端API通信机制
- [ ] 实现文件上传功能
- [ ] 建立分析状态轮询机制
- [ ] 完成数据结构映射和类型定义

#### 1.2 分析结果展示核心模块
- [ ] Consumer Profile 展示组件
- [ ] Consumer Motivation 展示组件
- [ ] Consumer Scenario 展示组件
- [ ] Consumer Love 展示组件
- [ ] Star Rating Root Cause 展示组件
- [ ] Unmet Needs 展示组件
- [ ] Competitor Analysis 展示组件
- [ ] Opportunity Insights 三个子模块

#### 1.3 基础交互功能
- [ ] 表格化数据展示组件
- [ ] 可点击展开的洞察卡片
- [ ] 悬停显示详情功能
- [ ] 原声评论模态框

### Phase 2: 增强功能开发 (优先级: 中)

#### 2.1 分析进度展示
- [ ] 实时分析进度组件
- [ ] 9个步骤的详细状态显示
- [ ] 预估时间和完成提示
- [ ] 集成到Data Upload页面

#### 2.2 报告管理功能
- [ ] PDF生成和下载功能
- [ ] 历史报告本地存储
- [ ] 历史报告列表和搜索
- [ ] 报告重新加载功能

#### 2.3 用户设置页面
- [ ] 显示设置 (字体、间距、密度)
- [ ] 分析设置 (语言、自动保存)
- [ ] 导出设置 (PDF格式配置)
- [ ] 数据管理 (历史记录清理)

### Phase 3: 优化和完善 (优先级: 低)

#### 3.1 用户体验优化
- [ ] 动画效果优化
- [ ] 加载状态优化
- [ ] 错误处理完善
- [ ] 性能优化

#### 3.2 高级功能
- [ ] 数据可视化增强
- [ ] 报告模板定制
- [ ] 批量操作功能
- [ ] 高级搜索和筛选

## 🛠️ 开发指南

### 项目结构
```
front/
├── src/
│   ├── components/           # 通用组件
│   │   ├── ui/              # 基础UI组件 (已有)
│   │   ├── analysis/        # 分析结果展示组件
│   │   │   ├── InsightTable.tsx
│   │   │   ├── InsightCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── AnalysisProgress.tsx
│   │   ├── charts/          # 图表组件
│   │   │   ├── PieChartGrid.tsx
│   │   │   └── ProgressChart.tsx
│   │   └── layout/          # 布局组件
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── pages/               # 页面组件
│   │   ├── Dashboard.tsx
│   │   ├── Upload.tsx
│   │   ├── Analysis/        # 分析结果页面
│   │   │   ├── UserInsights/
│   │   │   ├── UserFeedback/
│   │   │   ├── UnmetNeeds/
│   │   │   ├── Competitive/
│   │   │   └── Opportunities/
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── hooks/               # 自定义Hooks
│   │   ├── useAnalysis.ts
│   │   ├── useLocalStorage.ts
│   │   └── useSettings.ts
│   ├── services/            # API服务
│   │   ├── api.ts
│   │   ├── upload.ts
│   │   └── analysis.ts
│   ├── types/               # 类型定义
│   │   ├── analysis.ts
│   │   ├── api.ts
│   │   └── settings.ts
│   ├── utils/               # 工具函数
│   │   ├── pdf.ts
│   │   ├── storage.ts
│   │   └── format.ts
│   └── constants/           # 常量定义
│       ├── colors.ts
│       └── config.ts
```

### 编码规范

#### TypeScript规范
```typescript
// 1. 接口命名使用PascalCase
interface AnalysisResult {
  id: string
  timestamp: string
}

// 2. 组件Props接口以Props结尾
interface InsightTableProps {
  title: string
  data: TableRow[]
}

// 3. 使用严格的类型定义
type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'error'

// 4. 导出类型和接口
export type { AnalysisResult, InsightTableProps }
```

#### 组件规范
```typescript
// 1. 使用函数组件和Hooks
const InsightTable: React.FC<InsightTableProps> = ({ title, data }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  
  // 2. 使用useCallback优化性能
  const handleRowClick = useCallback((rowId: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }, [])
  
  return (
    <div className="insight-table">
      {/* 组件内容 */}
    </div>
  )
}

export default InsightTable
```

#### 样式规范
```typescript
// 1. 使用Tailwind CSS类名
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">
    {title}
  </h3>
</div>

// 2. 复杂样式使用CSS变量
<div 
  className="progress-bar" 
  style={{ 
    '--progress': `${percentage}%`,
    '--color': colorMap[color]
  }}
>
```

### API集成规范

#### API服务封装
```typescript
// services/api.ts
class ApiService {
  private baseURL: string
  private headers: Record<string, string>
  
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || ''
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
    }
  }
  
  async uploadFile(file: File, fileType: 'own' | 'competitor'): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', fileType)
    
    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: { 'Authorization': this.headers.Authorization },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  async startAnalysis(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await fetch(`${this.baseURL}/analyze`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request)
    })
    
    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`)
    }
    
    return response.json()
  }
}

export const apiService = new ApiService()
```

#### 自定义Hooks
```typescript
// hooks/useAnalysis.ts
export const useAnalysis = () => {
  const [status, setStatus] = useState<AnalysisStatus>('pending')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  
  const startAnalysis = useCallback(async (request: AnalyzeRequest) => {
    try {
      setStatus('processing')
      const response = await apiService.startAnalysis(request)
      
      // 开始轮询状态
      const pollInterval = setInterval(async () => {
        const statusResponse = await apiService.getAnalysisStatus(response.analysisId)
        setProgress(statusResponse.overallProgress)
        
        if (statusResponse.status === 'completed') {
          clearInterval(pollInterval)
          const result = await apiService.getAnalysisResult(response.analysisId)
          setResult(result.result)
          setStatus('completed')
        } else if (statusResponse.status === 'error') {
          clearInterval(pollInterval)
          setStatus('error')
        }
      }, 3000)
      
    } catch (error) {
      setStatus('error')
      console.error('Analysis failed:', error)
    }
  }, [])
  
  return { status, progress, result, startAnalysis }
}
```

### 测试策略

#### 单元测试
```typescript
// __tests__/components/InsightTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import InsightTable from '../InsightTable'

describe('InsightTable', () => {
  const mockData = [
    { id: '1', name: 'Test Item', value: 75, color: 'green' as const }
  ]
  
  it('renders table with data', () => {
    render(<InsightTable title="Test Table" data={mockData} />)
    expect(screen.getByText('Test Table')).toBeInTheDocument()
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })
  
  it('handles row click', () => {
    const onRowClick = jest.fn()
    render(
      <InsightTable 
        title="Test Table" 
        data={mockData} 
        onRowClick={onRowClick}
      />
    )
    
    fireEvent.click(screen.getByText('Test Item'))
    expect(onRowClick).toHaveBeenCalledWith(mockData[0])
  })
})
```

#### 集成测试
```typescript
// __tests__/integration/analysis-flow.test.tsx
describe('Analysis Flow', () => {
  it('completes full analysis workflow', async () => {
    // 1. 上传文件
    // 2. 启动分析
    // 3. 等待完成
    // 4. 验证结果展示
  })
})
```

## 📋 质量保证

### 代码质量
- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型安全
- **Husky**: Git hooks自动化

### 性能监控
- **Bundle分析**: 定期检查包大小
- **渲染性能**: 使用React DevTools监控
- **内存使用**: 避免内存泄漏
- **加载时间**: 优化首屏加载

### 用户体验
- **可访问性**: WCAG 2.1 AA标准
- **响应式**: 多设备适配测试
- **浏览器兼容**: 主流浏览器支持
- **错误处理**: 友好的错误提示

## 🔒 安全考虑

### 数据安全
- **文件上传**: 文件类型和大小验证
- **数据传输**: HTTPS加密传输
- **本地存储**: 敏感数据加密存储
- **XSS防护**: 用户输入内容转义

### API安全
- **身份验证**: API密钥管理
- **请求验证**: 参数验证和清理
- **错误处理**: 不暴露敏感信息
- **速率限制**: 防止API滥用

## 📚 文档和维护

### 开发文档
- **组件文档**: Storybook组件展示
- **API文档**: 接口说明和示例
- **部署指南**: 环境配置和部署流程
- **故障排除**: 常见问题和解决方案

### 版本管理
- **语义化版本**: 遵循SemVer规范
- **变更日志**: 详细的版本更新记录
- **分支策略**: Git Flow工作流
- **发布流程**: 自动化CI/CD

---

*文档最后更新: 2025年8月27日*
*版本: v1.0*
*作者: ReviewMind AI Team*

## 📞 联系信息

如有技术问题或建议，请联系开发团队：
- **项目负责人**: kangise
- **技术架构**: ReviewMind AI Team
- **设计规范**: 基于Google Analytics风格
- **参考设计**: example.jpg
