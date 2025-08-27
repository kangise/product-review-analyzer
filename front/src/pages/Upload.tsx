import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Info, Tag, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

interface UploadPageProps {
  language: 'en' | 'zh'
  t: any
  targetCategory: string
  setTargetCategory: (category: string) => void
  ownBrandFile: File | null
  setOwnBrandFile: (file: File | null) => void
  competitorFile: File | null
  setCompetitorFile: (file: File | null) => void
  isUploading: boolean
  isAnalyzing: boolean
  analysisProgress: number
  error: string | null
  onStartAnalysis: () => void
}

export const UploadPage: React.FC<UploadPageProps> = ({
  language,
  t,
  targetCategory,
  setTargetCategory,
  ownBrandFile,
  setOwnBrandFile,
  competitorFile,
  setCompetitorFile,
  isUploading,
  isAnalyzing,
  analysisProgress,
  error,
  onStartAnalysis
}) => {
  const handleFileUpload = (file: File, type: 'own' | 'competitor') => {
    // 文件上传逻辑
    if (type === 'own') {
      setOwnBrandFile(file)
    } else {
      setCompetitorFile(file)
    }
  }

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
                  "Wireless Headphones",
                  "Smart Watch", 
                  "Laptop",
                  "Skincare",
                  "Sports Shoes",
                  "Coffee Machine"
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
                  animate={isUploading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isUploading ? Infinity : 0 }}
                >
                  {ownBrandFile ? (
                    <CheckCircle className="mx-auto h-8 w-8 text-primary" />
                  ) : isUploading ? (
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
                      {t.upload.ownBrand.uploaded} {ownBrandFile.name}
                      <span className="ml-1">({Math.round(ownBrandFile.size / 1024)}KB)</span>
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={isUploading}
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
                    disabled={isUploading}
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
                    {isUploading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {t.upload.uploading}
                      </>
                    ) : (
                      t.upload.selectFile
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Competitor File Upload */}
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
                  animate={isUploading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isUploading ? Infinity : 0 }}
                >
                  {competitorFile ? (
                    <CheckCircle className="mx-auto h-8 w-8 text-primary" />
                  ) : isUploading ? (
                    <RefreshCw className="mx-auto h-8 w-8 text-primary" />
                  ) : (
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  )}
                </motion.div>
                <div>
                  <h3 className="font-medium mb-1">
                    {t.upload.competitor.title}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {t.upload.competitor.optional}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t.upload.competitor.description}
                  </p>
                </div>
                
                {competitorFile ? (
                  <div className="gap-system-sm flex flex-col">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-accent text-xs">
                      {t.upload.ownBrand.uploaded} {competitorFile.name}
                      <span className="ml-1">({Math.round(competitorFile.size / 1024)}KB)</span>
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={isUploading}
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
                    disabled={isUploading}
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
                    {isUploading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {t.upload.uploading}
                      </>
                    ) : (
                      t.upload.selectFile
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Start Analysis Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Button
          size="lg"
          disabled={!ownBrandFile || !targetCategory.trim() || isAnalyzing}
          onClick={onStartAnalysis}
          className="gap-system-sm"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              {t.upload.analysisInProgress}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {t.upload.startAnalysis}
            </>
          )}
        </Button>
        
        {error && (
          <div className="mt-4 text-sm text-destructive">
            {error}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
