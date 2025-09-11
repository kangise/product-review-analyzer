// API Types for Regeni
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadRequest {
  file: File;
  language: 'en' | 'zh';
  analysisType: 'full' | 'quick';
}

export interface UploadResponse {
  analysisId: string;
  status: 'uploaded' | 'processing';
  estimatedTime: number;
}

export interface AnalysisStatusResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  currentModule?: string;
  completedModules: string[];
  errorMessage?: string;
  estimatedTimeRemaining?: number;
}

export interface AnalysisResultResponse {
  id: string;
  result: AnalysisResult;
  downloadUrl?: string;
}

export interface HistoryItem {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'completed' | 'error';
  reviewCount: number;
  language: 'en' | 'zh';
  fileSize: number;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

// Settings Types
export interface UserSettings {
  language: 'en' | 'zh';
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  analysis: AnalysisSettings;
  export: ExportSettings;
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  analysisComplete: boolean;
  weeklyReport: boolean;
}

export interface AnalysisSettings {
  defaultLanguage: 'en' | 'zh';
  autoStart: boolean;
  includeCompetitor: boolean;
  detailLevel: 'basic' | 'detailed' | 'comprehensive';
}

export interface ExportSettings {
  format: 'pdf' | 'excel' | 'json';
  includeCharts: boolean;
  includeQuotes: boolean;
  template: 'standard' | 'executive' | 'technical';
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

import { AnalysisResult } from './analysis';
