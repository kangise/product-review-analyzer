import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Play, ChevronDown, Languages, Upload, Zap, BarChart3,
  Users, Target, Lightbulb, Eye, Settings, CheckCircle, Terminal, Code, Cpu
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface DashboardProps {
  language: 'en' | 'zh';
  onPageChange: (page: string) => void;
  onLanguageChange?: (lang: 'en' | 'zh') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ language, onPageChange, onLanguageChange }) => {
  const currentLanguage = language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    onLanguageChange?.(newLanguage);
  };

  return (
    <div className="fixed inset-0 bg-black text-white z-50">
      {/* Language Toggle - Fixed position */}
      <div className="fixed top-6 right-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="h-10 px-4 gap-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">
            {currentLanguage === 'en' ? 'EN' : '中文'}
          </span>
        </Button>
      </div>

      {/* Scrollable Content Container */}
      <div className="h-screen overflow-y-auto hide-scrollbar" style={{ scrollBehavior: 'smooth' }}>
        
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 text-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-white/80">
                  {currentLanguage === 'en' ? 'Review Genius • AI-Powered Business Intelligence' : '评论天才 • AI驱动的商业智能'}
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-light mb-6 leading-none">
                <span className="text-primary font-medium">Regen</span>{' '}
                <span className="text-white">AI</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-3xl mx-auto leading-relaxed">
                {currentLanguage === 'en' 
                  ? 'Turn customer feedback into competitive advantage. Discover hidden insights, understand user behavior, and unlock growth opportunities with our AI-powered review analysis platform.'
                  : '将客户反馈转化为竞争优势。通过我们的AI驱动评论分析平台，发现隐藏洞察，了解用户行为，解锁增长机会。'
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => onPageChange('upload')}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                {currentLanguage === 'en' ? 'Start Analysis' : '开始分析'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg rounded-xl transition-all duration-300 bg-black/20 backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5" />
                {currentLanguage === 'en' ? 'View Demo' : '查看演示'}
              </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-center"
            >
              <p className="text-white/40 text-sm mb-2">
                {currentLanguage === 'en' ? 'Scroll to explore' : '向下滚动探索'}
              </p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                <ChevronDown className="h-4 w-4 text-white/40" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                <Play className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-emerald-300">
                  {currentLanguage === 'en' ? 'Watch how it works' : '观看工作原理'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
                {currentLanguage === 'en' ? 'See the Magic in Action' : '观看神奇的过程'}
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                {currentLanguage === 'en' 
                  ? 'Experience how Regeni transforms thousands of reviews into actionable insights within minutes'
                  : '体验Regeni如何在几分钟内将数千条评论转化为可操作的洞察'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-5xl mx-auto"
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-gray-900/90 backdrop-blur border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* Video Player Interface */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                  {/* Fake video content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Play button overlay */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 bg-primary/20 backdrop-blur border border-primary/30 rounded-full flex items-center justify-center group hover:bg-primary/30 transition-all duration-300"
                      >
                        <Play className="h-8 w-8 text-primary ml-1 group-hover:text-white transition-colors" />
                      </motion.button>
                    </div>
                    
                    {/* Animated data visualization overlay */}
                    <div className="absolute inset-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        className="absolute top-4 left-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <BarChart3 className="h-3 w-3 text-primary" />
                          <span>{currentLanguage === 'en' ? 'Processing 2,847 reviews...' : '处理中 2,847 条评论...'}</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                        className="absolute top-4 right-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <Users className="h-3 w-3 text-emerald-400" />
                          <span>{currentLanguage === 'en' ? 'User insights generated' : '用户洞察已生成'}</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                        className="absolute bottom-4 left-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <Lightbulb className="h-3 w-3 text-green-400" />
                          <span>{currentLanguage === 'en' ? 'Opportunities identified' : '机会识别完成'}</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Video Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur p-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                      <Play className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1">
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <motion.div 
                          className="bg-primary h-1.5 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: ['0%', '30%', '0%'] }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <span>2:34</span>
                      <span>/</span>
                      <span>3:21</span>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Video Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 grid md:grid-cols-3 gap-6"
              >
                {[
                  {
                    icon: Upload,
                    title: currentLanguage === 'en' ? 'Easy Data Upload' : '简易数据上传',
                    description: currentLanguage === 'en' 
                      ? 'Simply drag and drop your review files to get started'
                      : '只需拖放您的评论文件即可开始'
                  },
                  {
                    icon: Zap,
                    title: currentLanguage === 'en' ? 'AI Processing' : 'AI智能处理',
                    description: currentLanguage === 'en' 
                      ? 'Advanced algorithms analyze sentiment and extract insights'
                      : '先进算法分析情感并提取洞察'
                  },
                  {
                    icon: BarChart3,
                    title: currentLanguage === 'en' ? 'Instant Reports' : '即时报告',
                    description: currentLanguage === 'en' 
                      ? 'Get comprehensive analysis reports in minutes'
                      : '几分钟内获得全面分析报告'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Showcase Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
                {currentLanguage === 'en' ? 'Everything you need' : '您需要的一切'}
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                {currentLanguage === 'en' 
                  ? 'Comprehensive review analysis tools for modern businesses'
                  : '为现代企业提供全面的评论分析工具'}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: currentLanguage === 'en' ? 'User Persona Analysis' : '用户画像分析',
                  description: currentLanguage === 'en' 
                    ? 'Deep dive into customer demographics, behavior patterns, and purchase motivations'
                    : '深入分析客户人口统计、行为模式和购买动机',
                  features: currentLanguage === 'en' 
                    ? ['Age & demographic breakdown', 'Purchase behavior analysis', 'Usage scenario mapping', 'Satisfaction drivers']
                    : ['年龄和人口统计分解', '购买行为分析', '使用场景映射', '满意度驱动因素']
                },
                {
                  icon: BarChart3,
                  title: currentLanguage === 'en' ? 'Competitive Intelligence' : '竞争情报',
                  description: currentLanguage === 'en' 
                    ? 'Compare your brand against competitors with detailed performance metrics'
                    : '通过详细的性能指标将您的品牌与竞争对手进行比较',
                  features: currentLanguage === 'en' 
                    ? ['Market positioning analysis', 'Competitive advantage mapping', 'Gap identification', 'Benchmark scoring']
                    : ['市场定位分析', '竞争优势映射', '差距识别', '基准评分']
                },
                {
                  icon: Lightbulb,
                  title: currentLanguage === 'en' ? 'Growth Opportunities' : '增长机会',
                  description: currentLanguage === 'en' 
                    ? 'Discover untapped market opportunities and product improvement areas'
                    : '发现未开发的市场机会和产品改进领域',
                  features: currentLanguage === 'en' 
                    ? ['Product enhancement suggestions', 'Market gap analysis', 'Innovation opportunities', 'Strategic recommendations']
                    : ['产品增强建议', '市场缺口分析', '创新机会', '策略建议']
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-medium mb-4 text-white">{feature.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-3xl p-12"
            >
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                {currentLanguage === 'en' ? 'Ready to Unleash' : '准备释放'}
                <br />
                <span className="text-primary">{currentLanguage === 'en' ? 'Review Intelligence?' : '评论智能的力量？'}</span>
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                {currentLanguage === 'en'
                  ? 'Transform customer feedback into competitive advantage. Start your journey to data-driven success with Regeni.'
                  : '将客户反馈转化为竞争优势。开始您的数据驱动成功之旅，与Regeni一起。'
                }
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black font-medium px-12 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => onPageChange('upload')}
              >
                <Zap className="mr-2 h-5 w-5" />
                {currentLanguage === 'en' ? 'Start Free Analysis' : '开始免费分析'}
              </Button>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
