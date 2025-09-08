import React from 'react'
import { createRoot } from 'react-dom/client'
import { ExportReport } from '../components/ExportReport'

// 提取所有CSS样式
const extractAllCSS = (): string => {
  let css = ''
  
  // 获取所有样式表
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const styleSheet = document.styleSheets[i]
      if (styleSheet.cssRules) {
        for (let j = 0; j < styleSheet.cssRules.length; j++) {
          css += styleSheet.cssRules[j].cssText + '\n'
        }
      }
    } catch (e) {
      // 跨域样式表可能无法访问，跳过
      console.warn('Cannot access stylesheet:', e)
    }
  }
  
  // 添加基础样式确保导出效果
  css += `
    /* 只强制白色背景，保持原有样式 */
    body, html {
      background-color: #ffffff !important;
    }
    
    .export-report {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      background-color: #ffffff !important;
    }
    
    .export-report * {
      box-sizing: border-box;
    }
    
    /* 修复标题颜色为橙色 */
    .export-report h1,
    .export-report h2,
    .export-report h3,
    .export-report h4,
    .export-report h5,
    .export-report h6 {
      color: #f97316 !important;
    }
    
    /* 修复报告头部文字颜色 */
    .export-report .report-header h1 {
      color: #f97316 !important;
    }
    
    .export-report .report-header p {
      color: #6b7280 !important;
    }
    
    @media print {
      .export-report {
        max-width: none !important;
        margin: 0 !important;
        padding: 20px !important;
        background-color: #ffffff !important;
      }
      
      .export-report h1,
      .export-report h2,
      .export-report h3,
      .export-report h4,
      .export-report h5,
      .export-report h6 {
        color: #f97316 !important;
      }
    }
  `
  
  return css
}

// 下载HTML文件
const downloadHTML = (htmlContent: string, filename: string) => {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// 主导出函数
export const exportReportToHTML = async (
  analysisResult: any,
  language: 'en' | 'zh' = 'zh'
): Promise<void> => {
  try {
    // 创建隐藏的导出容器
    const exportContainer = document.createElement('div')
    exportContainer.style.position = 'absolute'
    exportContainer.style.left = '-9999px'
    exportContainer.style.top = '0'
    exportContainer.style.width = '1200px' // 固定宽度确保布局一致
    document.body.appendChild(exportContainer)

    // 渲染导出组件
    const root = createRoot(exportContainer)
    
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(ExportReport, {
          analysisResult,
          language
        })
      )
      
      // 等待渲染完成
      setTimeout(resolve, 2000)
    })

    // 提取HTML内容
    const htmlContent = exportContainer.innerHTML
    
    // 提取CSS样式
    const css = extractAllCSS()
    
    // 生成完整的HTML文档
    const reportTitle = analysisResult?.targetCategory || 'Product Analysis'
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    
    const fullHTML = `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle} - Analysis Report</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`

    // 清理DOM
    document.body.removeChild(exportContainer)
    
    // 下载文件
    const filename = `${reportTitle}_Report_${timestamp}.html`
    downloadHTML(fullHTML, filename)
    
    console.log('✅ HTML report exported successfully')
    
  } catch (error) {
    console.error('❌ Failed to export HTML report:', error)
    throw error
  }
}
