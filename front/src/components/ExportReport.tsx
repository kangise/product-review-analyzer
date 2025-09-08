import React from 'react'
import { UserInsights } from '../pages/analysis/UserInsights'
import { UserFeedback } from '../pages/analysis/UserFeedback'
import { CompetitorAnalysis } from '../pages/analysis/CompetitorAnalysis'
import { Opportunities } from '../pages/analysis/Opportunities'
import { UnmetNeeds } from '../pages/analysis/UnmetNeeds'

interface ExportReportProps {
  analysisResult: any
  language: 'en' | 'zh'
}

// 简化的翻译对象，只包含导出需要的内容
const exportTranslations = {
  en: {
    title: 'Product Review Analysis Report',
    generatedAt: 'Generated at',
    category: 'Category:',
    nav: {
      ownBrandInsights: 'User Insights',
      ownBrandFeedback: 'Customer Satisfaction',
      ownBrandUnmet: 'Unmet Needs',
      competitive: 'Competitive Analysis',
      opportunities: 'Opportunities'
    },
    analysis: {
      category: 'Category:'
    }
  },
  zh: {
    title: '产品评论分析报告',
    generatedAt: '生成时间',
    category: '产品类别：',
    nav: {
      ownBrandInsights: '用户洞察',
      ownBrandFeedback: '客户满意度分析',
      ownBrandUnmet: '未满足需求分析',
      competitive: '竞品对比分析',
      opportunities: '机会洞察'
    },
    analysis: {
      category: '产品类别：'
    }
  }
}

export const ExportReport: React.FC<ExportReportProps> = ({
  analysisResult,
  language = 'zh'
}) => {
  const t = exportTranslations[language]
  const currentDate = new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')

  return (
    <div className="export-report max-w-6xl mx-auto p-8 bg-white">
      {/* 报告头部 */}
      <div className="report-header mb-12 text-center border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>
        <div className="text-lg text-gray-600 space-y-2">
          <p>{t.generatedAt}: {currentDate}</p>
          {analysisResult?.targetCategory && (
            <p>{t.category} {analysisResult.targetCategory}</p>
          )}
        </div>
      </div>

      {/* 用户洞察 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-l-4 border-blue-500 pl-4">
          {t.nav.ownBrandInsights}
        </h2>
        <UserInsights 
          language={language}
          t={t}
          analysisResult={analysisResult}
        />
      </div>

      {/* 客户满意度分析 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-l-4 border-green-500 pl-4">
          {t.nav.ownBrandFeedback}
        </h2>
        <UserFeedback 
          language={language}
          t={t}
          analysisResult={analysisResult}
        />
      </div>

      {/* 未满足需求分析 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-l-4 border-red-500 pl-4">
          {t.nav.ownBrandUnmet}
        </h2>
        <UnmetNeeds 
          language={language}
          t={t}
          analysisResult={analysisResult}
        />
      </div>

      {/* 机会洞察 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-l-4 border-purple-500 pl-4">
          {t.nav.opportunities}
        </h2>
        <Opportunities 
          language={language}
          t={t}
          analysisResult={analysisResult}
        />
      </div>

      {/* 竞品分析（如果有数据） */}
      {analysisResult?.hasCompetitorData && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-l-4 border-orange-500 pl-4">
            {t.nav.competitive}
          </h2>
          <CompetitorAnalysis 
            language={language}
            t={t}
            analysisResult={analysisResult}
          />
        </div>
      )}

      {/* 报告尾部 */}
      <div className="report-footer mt-16 pt-8 border-t border-gray-200 text-center text-gray-500">
        <p>© 2025 Novochoice AI - AI-Powered Customer Intelligence Engine</p>
      </div>
    </div>
  )
}
