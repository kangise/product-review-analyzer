import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', logger(console.log))
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const bucketName = 'make-bda2f768-reviews'
let bucketInitialized = false

// Create storage bucket for uploaded files
const initStorage = async () => {
  try {
    console.log('Initializing storage bucket...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      throw listError
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`)
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, { 
        public: false,
        allowedMimeTypes: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        fileSizeLimit: 10485760 // 10MB
      })
      
      if (createError) {
        console.error('Error creating bucket:', createError)
        throw createError
      }
      
      console.log(`Successfully created bucket: ${bucketName}`)
    } else {
      console.log(`Bucket ${bucketName} already exists`)
    }
    
    bucketInitialized = true
    console.log('Storage initialization completed')
  } catch (error) {
    console.error('Failed to initialize storage:', error)
    bucketInitialized = false
    throw error
  }
}

// Initialize storage on startup
initStorage().catch(error => {
  console.error('Critical error during storage initialization:', error)
})

// Upload file endpoint
app.post('/make-server-bda2f768/upload', async (c) => {
  try {
    console.log('Upload request received')
    
    // Check if bucket is initialized
    if (!bucketInitialized) {
      console.log('Bucket not initialized, attempting to initialize now...')
      try {
        await initStorage()
      } catch (initError) {
        console.error('Failed to initialize bucket during upload:', initError)
        return c.json({ error: 'Storage service not available' }, 503)
      }
    }

    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('fileType') as string

    console.log('Upload parameters:', { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: fileType 
    })

    if (!file || !fileType) {
      console.log('Missing file or fileType parameter')
      return c.json({ error: 'Missing file or fileType parameter' }, 400)
    }

    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx)$/i)) {
      console.log('Invalid file type:', file.type)
      return c.json({ error: 'Invalid file type. Please upload CSV or Excel files only.' }, 400)
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.log('File too large:', file.size)
      return c.json({ error: 'File size too large. Maximum size is 10MB.' }, 400)
    }

    const fileName = `${fileType}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    console.log('Generated file name:', fileName)

    const fileBuffer = await file.arrayBuffer()
    console.log('File buffer size:', fileBuffer.byteLength)

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        duplex: 'half'
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      return c.json({ 
        error: `Failed to upload file: ${error.message}`,
        details: error
      }, 500)
    }

    if (!data) {
      console.error('No data returned from upload')
      return c.json({ error: 'Upload failed: No data returned' }, 500)
    }

    console.log('Upload successful:', data)

    return c.json({ 
      success: true, 
      fileName: data.path,
      originalName: file.name,
      fileType,
      size: file.size
    })
  } catch (error) {
    console.error('Upload endpoint error:', error)
    return c.json({ 
      error: 'Internal server error during file upload',
      details: error.message
    }, 500)
  }
})

// Bilingual content generator
const generateBilingualContent = (targetCategory: string, language = 'en') => {
  const isEnglish = language === 'en'
  
  return {
    keyUserInsights: {
      coreUserPersona: isEnglish 
        ? `The core user base for ${targetCategory} consists of young working professionals who value life quality, pursue efficient work tools, value product design aesthetics and user experience, and are willing to pay reasonable prices for quality products.`
        : `${targetCategory}的核心用户群体为注重生活品质的年轻职场女性，她们追求高效率的工作工具，重视产品的设计美学和使用体验，愿意为优质产品支付合理价格。`,
      
      segmentedUserTypes: isEnglish
        ? `For the ${targetCategory} category, tech enthusiasts and entrepreneurs show strong purchase intent. They are sensitive to new technology, value product innovation and professionalism, and have strong purchasing power and brand loyalty.`
        : `针对${targetCategory}品类，科技爱好者和创业者群体表现出强烈的购买意愿，他们对新技术敏感，注重产品的创新性和专业性，有较强的购买力和品牌忠诚度。`,
      
      keyUserBehavior: isEnglish
        ? `Users primarily purchase ${targetCategory} products to improve work efficiency and life quality. They thoroughly research product reviews before purchasing and often share usage experiences on social media and professional communities after purchase.`
        : `用户主要为提升工作效率和生活品质而购买${targetCategory}产品，购买前会详细研究产品评价，购买后经常在社交媒体和专业社区分享使用体验。`
    },
    
    demographicAnalysis: {
      coreInsight: isEnglish
        ? `${targetCategory} users are mainly concentrated in the 25-35 age group of workplace elites, with high educational backgrounds, focusing on quality and efficiency, and relatively price-insensitive.`
        : `${targetCategory}用户主要集中在25-35岁的职场精英群体，具有高学历背景，注重品质和效率，对价格相对不敏感。`,
      
      segmentedGroups: [
        {
          userGroup: isEnglish ? "Tech Industry Professionals" : "科技行业从业者",
          description: isEnglish 
            ? `Aged 25-35, mostly software engineers and product managers, with high technical requirements and innovation acceptance for ${targetCategory}`
            : `年龄在25-35岁，多为软件工程师、产品经理等，对${targetCategory}的技术含量和创新性要求高，对新功能接受度高`,
          percentage: 32.5,
          keyReviewInfo: isEnglish
            ? `"As a programmer, this ${targetCategory}'s functional design aligns well with my work needs, with a clean and efficient interface."`
            : `作为程序员，这个${targetCategory}的功能设计很符合我的工作需求，界面简洁高效。`
        },
        {
          userGroup: isEnglish ? "Finance & Consulting Professionals" : "金融与咨询专业人士", 
          description: isEnglish
            ? `Aged 28-40, including investment bankers and management consultants, emphasizing professionalism and stability of ${targetCategory}`
            : `年龄在28-40岁，包括投资银行家、管理咨询师等，注重${targetCategory}的专业性和稳定性`,
          percentage: 25.3,
          keyReviewInfo: isEnglish
            ? `"In high-intensity work environments, this ${targetCategory}'s reliability has been a great help, trustworthy."`
            : `在高强度的工作环境下，这个${targetCategory}的可靠性给了我很大帮助，值得信赖。`
        },
        {
          userGroup: isEnglish ? "Creative & Media Workers" : "创意与媒体工作者",
          description: isEnglish
            ? `Aged 24-32, including designers and advertisers, with high requirements for ${targetCategory} appearance and user experience`
            : `年龄在24-32岁，包括设计师、广告人等，对${targetCategory}的外观和用户体验要求很高`,
          percentage: 18.7,
          keyReviewInfo: isEnglish
            ? `"The design is really great, high aesthetic value, easy to use, perfect for someone like me who values beauty."`
            : `设计真的很棒，颜值很高，用起来也很顺手，很适合我这种对美感有要求的人。`
        },
        {
          userGroup: isEnglish ? "Education & Research Personnel" : "教育与研究人员",
          description: isEnglish
            ? `Aged 26-38, including university professors and researchers, emphasizing comprehensive functionality and long-term value of ${targetCategory}`
            : `年龄在26-38岁，包括大学教授、研究员等，注重${targetCategory}的功能全面性和长期价值`,
          percentage: 14.8,
          keyReviewInfo: isEnglish
            ? `"Very comprehensive features that meet all my research work needs, excellent value for money."`
            : `功能很全面，可以满足我各种研究工作的需要，性价比很高。`
        },
        {
          userGroup: isEnglish ? "Other Professionals" : "其他专业人士",
          description: isEnglish
            ? `Aged 30-45, including doctors and lawyers, emphasizing professional certification and industry standards for ${targetCategory}`
            : `年龄在30-45岁，包括医生、律师等，注重${targetCategory}的专业认证和行业标准`,
          percentage: 8.7,
          keyReviewInfo: isEnglish
            ? `"Meets our industry's professional standards, reassuring to use, colleagues are all using it too."`
            : `符合我们行业的专业标准，用起来很放心，同事们也都在用。`
        }
      ]
    },

    positiveAspects: isEnglish ? [
      "Beautiful Design - Stylish appearance that meets modern aesthetics",
      "Reliable Quality - Solid construction with long service life", 
      "Complete Features - Able to meet various usage needs",
      "Responsive Customer Service - Timely and effective after-sales service",
      "Exquisite Packaging - Good unboxing experience"
    ] : [
      "设计美观 - 外观时尚，符合现代审美",
      "质量可靠 - 做工扎实，使用寿命长",
      "功能齐全 - 能够满足各种使用需求", 
      "客服响应快 - 售后服务及时有效",
      "包装精美 - 开箱体验良好"
    ],

    negativeAspects: isEnglish ? [
      "Higher Price - More expensive compared to similar products",
      "Learning Curve - Some features require time to adapt",
      "Accessory Cost - Additional accessories are expensive",
      "Compatibility Issues - Problems with certain device compatibility"
    ] : [
      "价格偏高 - 相比同类产品价格较贵",
      "学习成本 - 部分功能需要时间适应",
      "配件成本 - 额外配件价格较高",
      "兼容性问题 - 与某些设备配合存在问题"
    ],

    unmetNeeds: isEnglish ? [
      `Personalized Customization - Hope to customize ${targetCategory} functions and appearance according to personal needs`,
      `Wireless Connectivity - Expect ${targetCategory} to have more convenient wireless connection methods`,
      `Multi-device Sync - Need ${targetCategory} to seamlessly switch between multiple devices`,
      `Smart Features - Hope ${targetCategory} adds AI or automation features`,
      `Eco-friendly Materials - More users care about ${targetCategory} environmental performance`,
      `Improved Portability - Hope ${targetCategory} is lighter and more portable`
    ] : [
      `个性化定制 - 希望能够根据个人需求定制${targetCategory}的功能和外观`,
      `无线连接 - 期待${targetCategory}有更便捷的无线连接方式`,
      `多设备同步 - 需要${targetCategory}在多个设备间无缝切换使用`,
      `智能化功能 - 希望${targetCategory}加入AI或自动化功能`,
      `环保材料 - 更多用户关注${targetCategory}的环保性能`,
      `便携性提升 - 希望${targetCategory}更轻便，便于携带`
    ]
  }
}

// Analyze reviews endpoint - now includes language and bilingual support
app.post('/make-server-bda2f768/analyze', async (c) => {
  try {
    console.log('Analysis request received')
    const { ownBrandFile, competitorFile, targetCategory, language = 'en' } = await c.req.json()

    if (!ownBrandFile) {
      return c.json({ error: 'Own brand file is required' }, 400)
    }

    if (!targetCategory || targetCategory.trim().length === 0) {
      return c.json({ error: 'Target category is required' }, 400)
    }

    console.log('Analysis parameters:', { 
      ownBrandFile, 
      competitorFile, 
      targetCategory: targetCategory.trim(),
      language: language 
    })

    // Get own brand file content from storage
    const { data: ownData, error: ownError } = await supabase.storage
      .from(bucketName)
      .download(ownBrandFile)

    if (ownError) {
      console.error('Own brand file download error:', ownError)
      return c.json({ error: `Failed to download own brand file: ${ownError.message}` }, 500)
    }

    const ownContent = await ownData.text()
    console.log('Own brand file content length:', ownContent.length)

    // Optionally get competitor file content if provided
    let compContent = null
    if (competitorFile) {
      const { data: compData, error: compError } = await supabase.storage
        .from(bucketName)
        .download(competitorFile)

      if (compError) {
        console.error('Competitor file download error:', compError)
        return c.json({ error: `Failed to download competitor file: ${compError.message}` }, 500)
      }

      compContent = await compData.text()
      console.log('Competitor file content length:', compContent.length)
    }

    // Generate bilingual content based on language preference
    const content = generateBilingualContent(targetCategory, language)
    const isEnglish = language === 'en'

    // Enhanced mock AI analysis result with bilingual support
    const mockAnalysisResult = {
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      hasCompetitorData: !!competitorFile,
      targetCategory: targetCategory.trim(),
      language: language,
      
      // Own brand analysis with bilingual content
      ownBrandAnalysis: {
        userInsights: {
          关键用户画像洞察: {
            核心用户画像: content.keyUserInsights.coreUserPersona,
            细分潜力用户类型: content.keyUserInsights.segmentedUserTypes,
            关键用户行为: content.keyUserInsights.keyUserBehavior
          },
          消费者画像分析: {
            人群特征: {
              核心insight: content.demographicAnalysis.coreInsight,
              细分人群: content.demographicAnalysis.segmentedGroups
            },
            使用时刻: {
              核心insight: isEnglish 
                ? `${targetCategory} is mainly used during work hours, with the highest usage frequency during weekday peak hours, and high usage in evenings and weekends.`
                : `${targetCategory}主要在工作时间使用，其中工作日高峰时段使用频率最高，晚间和周末也有较高的使用率。`,
              细分场景: [
                {
                  使用时刻: isEnglish ? "Weekday Peak Hours" : "工作日高峰时段",
                  特征描述: isEnglish 
                    ? `9-11 AM and 2-5 PM, mainly using ${targetCategory} for important work tasks and meetings, requiring extremely high functional stability`
                    : `上午9-11点和下午2-5点，主要用${targetCategory}处理重要工作任务和参与会议，对功能稳定性要求极高`,
                  比例: 35.2,
                  关键review信息: isEnglish
                    ? "Used most during work hours, especially during meetings, very stable and easy to use."
                    : "上班时间用得最多，特别是开会的时候，很稳定很好用。"
                },
                {
                  使用时刻: isEnglish ? "Weekday Evenings" : "工作日晚间",
                  特征描述: isEnglish
                    ? `7-10 PM at home using ${targetCategory}, mainly for completing unfinished work or personal projects, with relatively ample time`
                    : `晚上7-10点在家中使用${targetCategory}，主要用于完成白天未完成的工作或个人项目，使用时间相对充裕`,
                  比例: 28.4,
                  关键review信息: isEnglish
                    ? "Often used when working overtime at home in the evening, comfortable interface design, no eye fatigue."
                    : "晚上在家加班的时候经常用，界面设计很舒服，不会眼睛疲劳。"
                }
              ]
            },
            使用地点: {
              核心insight: isEnglish
                ? `${targetCategory} is mainly used in office and home environments, with the highest usage frequency in offices and longer usage duration at home.`
                : `${targetCategory}主要在办公室和家庭环境中使用，其中办公室使用频率最高，家庭环境使用时长较长。`,
              细分场景: [
                {
                  使用地点: isEnglish ? "Office Environment" : "办公室环境",
                  特征描述: isEnglish
                    ? `Using ${targetCategory} in company offices, mostly for team collaboration and formal work, with high requirements for product professionalism and stability`
                    : `在公司办公室使用${targetCategory}，多为团队协作和正式工作，对产品的专业性和稳定性要求高`,
                  比例: 42.6,
                  关键review信息: isEnglish
                    ? "Used most in the office, colleagues say it's great, very suitable for business environment."
                    : "在办公室用得最多，同事看到都说不错，很适合商务环境。"
                }
              ]
            },
            使用行为: {
              核心insight: isEnglish
                ? `Users purchase ${targetCategory} mainly for personal use to improve work efficiency, with a considerable proportion for gifting. They carefully research reviews before purchasing and recommend to others after purchase.`
                : `用户购买${targetCategory}主要是为了自用提升工作效率，也有相当比例用于送礼，购买前会仔细研究评价，购买后会推荐给他人。`,
              细分行为: [
                {
                  使用行为: isEnglish ? "Personal Efficiency Improvement" : "自用提升效率",
                  特征描述: isEnglish
                    ? `Mainly purchasing ${targetCategory} to improve personal work efficiency, focusing on practicality and long-term value, using all functions in depth`
                    : `主要为提升个人工作效率而购买${targetCategory}，注重实用性和长期价值，会深度使用各项功能`,
                  比例: 52.3,
                  关键review信息: isEnglish
                    ? "Bought for personal use, really improved work efficiency, very satisfied with this purchase."
                    : "买来自己用的，确实提高了工作效率，很满意这次购买。"
                }
              ]
            }
          },
          
          // Keep original fields for backward compatibility
          userPersona: isEnglish 
            ? `Main user base for ${targetCategory}: Young professionals (25-35 years old) who value product quality and cost-effectiveness, with strong brand awareness. They are typically highly educated office workers who focus on work efficiency and quality of life, willing to pay reasonable prices for quality ${targetCategory} products.`
            : `${targetCategory}的主要用户群体：年轻专业人士（25-35岁），重视产品品质和性价比，具有较强的品牌意识。他们通常是高学历的上班族，注重工作效率和生活品质，愿意为优质的${targetCategory}产品支付合理价格。`,
          
          usageScenarios: isEnglish ? [
            `Daily Work Scenarios - Using ${targetCategory} in the office to handle various work tasks`,
            `Business Meetings - Using ${targetCategory} in important business negotiations and presentations`,
            `Home Office - Using ${targetCategory} at home to create an efficient work environment`,
            `Travel Business - Carrying ${targetCategory} when traveling to maintain work continuity`,
            `Learning Development - Using ${targetCategory} for personal skill enhancement and knowledge accumulation`
          ] : [
            `日常工作场景 - 在办公室使用${targetCategory}处理各种工作任务`,
            `商务会议 - 在重要的商业洽谈和演示中使用${targetCategory}`,
            `居家办公 - 在家中使用${targetCategory}创建高效的工作环境`,
            `旅行出差 - 外出时携带${targetCategory}保持工作连续性`,
            `学习进修 - 使用${targetCategory}进行个人技能提升和知识积累`
          ],
          
          usageTiming: [
            {
              timing: isEnglish ? "Weekday Peak Hours" : "工作日高峰时段",
              percentage: 35,
              description: isEnglish 
                ? `${targetCategory} usage is most frequent from 9-11 AM and 2-5 PM, mainly for handling important work tasks and meetings`
                : `上午9-11点和下午2-5点使用${targetCategory}最频繁，主要用于处理重要工作任务和会议`,
              characteristics: isEnglish 
                ? ["Efficiency Priority", "High Focus", "Extremely High Functional Stability Requirements"]
                : ["效率优先", "专注度高", "对功能稳定性要求极高"]
            }
          ],
          
          userGroups: [
            {
              name: isEnglish ? "Tech Industry Professionals" : "科技行业从业者",
              percentage: 32,
              color: "#3b82f6", 
              description: isEnglish ? "Mainly includes software engineers, product managers, designers, etc." : "主要包括软件工程师、产品经理、设计师等",
              characteristics: isEnglish ? [
                `High sensitivity to ${targetCategory} new technology, pursuing latest features and performance improvements`,
                "Fast work pace, needs efficient and stable tool support",
                "Focus on product technical content and innovation",
                "Willing to pay reasonable prices for quality tools",
                "Often needs multi-device collaborative work"
              ] : [
                `对${targetCategory}新技术敏感度高，追求最新功能和性能提升`,
                "工作节奏快，需要高效稳定的工具支持",
                "注重产品的技术含量和创新性",
                "愿意为优质工具支付合理价格",
                "经常需要多设备协同工作"
              ],
              behaviorPatterns: isEnglish ? [
                "Tends to use product features in depth",
                "Actively explores advanced features",
                "High attention to product updates and new features",
                "Often shares usage experiences in professional communities"
              ] : [
                "倾向于深度使用产品功能",
                "会主动探索高级功能", 
                "对产品更新和新功能关注度高",
                "经常在专业社区分享使用体验"
              ]
            }
          ],
          
          purchaseMotivations: isEnglish ? [
            `Improve Work Efficiency - Hope to improve productivity through quality ${targetCategory}`,
            "Professional Image - Create a professional and trustworthy image in the workplace",
            "Long-term Investment - Value product durability and long-term value",
            "Brand Trust - Confidence in the quality and service of well-known brands",
            "Feature Completeness - Need comprehensive features to meet diverse usage requirements"
          ] : [
            `提升工作效率 - 希望通过优质的${targetCategory}提高生产力`,
            "展现专业形象 - 在职场中塑造专业可信的形象",
            "长期投资考虑 - 重视产品的耐用性和长期价值",
            "品牌信任度 - 对知名品牌的质量和服务有信心",
            "功能完整性 - 需要满足多样化使用需求的全面功能"
          ]
        },
        
        userFeedback: {
          positiveAspects: content.positiveAspects,
          negativeAspects: content.negativeAspects,
          starRatingBreakdown: {
            fiveStar: {
              percentage: 45,
              mainThemes: isEnglish ? [
                "Product exceeded expectations, excellent quality",
                "Beautiful design, powerful features",
                "Great customer service attitude, timely problem resolution"
              ] : [
                "产品超出预期，质量非常好",
                "设计精美，功能强大",
                "客服服务态度很好，解决问题及时"
              ]
            },
            fourStar: {
              percentage: 30,
              mainThemes: isEnglish ? [
                "Overall satisfied, but hope price could be more affordable",
                "Good features, but takes time to learn",
                "Good quality, but limited accessory options"
              ] : [
                "整体满意，但希望价格能更实惠",
                "功能很好，但学习使用需要时间",
                "质量不错，但配件选择有限"
              ]
            },
            threeStar: {
              percentage: 15,
              mainThemes: isEnglish ? [
                "Basically meets needs, but average cost-effectiveness",
                "Product is okay, but after-sales response is slow",
                "Features are adequate, but lacks innovation"
              ] : [
                "基本满足需求，但性价比一般",
                "产品可以，但售后响应较慢",
                "功能够用，但创新性不足"
              ]
            },
            twoStar: {
              percentage: 7,
              mainThemes: isEnglish ? [
                "Product has defects, but barely usable",
                "Price doesn't match quality",
                "Slow shipping, damaged packaging"
              ] : [
                "产品有缺陷，但勉强可用",
                "价格与质量不匹配",
                "物流速度慢，包装有损坏"
              ]
            },
            oneStar: {
              percentage: 3,
              mainThemes: isEnglish ? [
                "Serious product quality issues, unable to use normally",
                "Doesn't match product description, felt misled",
                "Poor after-sales service attitude, problems not resolved"
              ] : [
                "产品质量问题严重，无法正常使用",
                "与产品描述不符，感觉被误导",
                "售后服务态度差，问题未得到解决"
              ]
            }
          }
        },
        
        unmetNeeds: content.unmetNeeds
      },

      // Competitive analysis - only if competitor data provided
      ...(competitorFile && {
        competitiveAnalysis: {
          userPersonaComparison: {
            ownBrand: isEnglish 
              ? `Young professionals focused on ${targetCategory} quality and design`
              : `${targetCategory}的年轻专业人士，重视品质和设计`,
            competitor: isEnglish
              ? `${targetCategory} user base is relatively older (30-45 years old), more focused on functional practicality, higher price sensitivity`
              : `${targetCategory}用户群体相对年长（30-45岁），更关注功能实用性，对价格敏感度较高`,
            keyDifferences: isEnglish ? [
              "Age group differences: Own brand users are younger",
              "Consumer mindset: Own brand users value quality more, competitor users focus more on cost-effectiveness",
              "Purchasing power: Own brand users have relatively stronger consumption capacity"
            ] : [
              "年龄段差异：自有品牌用户更年轻化",
              "消费理念：自有品牌用户更重视品质，竞品用户更看重性价比",
              "购买力：自有品牌用户消费能力相对较强"
            ]
          },
          feedbackFrequencyGaps: {
            designAppreciation: {
              ownBrand: 78,
              competitor: 45,
              gap: 33,
              insight: isEnglish 
                ? `Own brand significantly leads in ${targetCategory} design aesthetics`
                : `自有品牌在${targetCategory}设计美观度方面显著领先`
            },
            priceComplaint: {
              ownBrand: 25,
              competitor: 52,
              gap: -27,
              insight: isEnglish
                ? `Competitor ${targetCategory} users complain about price more frequently`
                : `竞品${targetCategory}用户对价格的抱怨更频繁`
            }
          },
          competitiveAdvantages: isEnglish ? [
            `Quality Perception Advantage - Users rate ${targetCategory} quality higher`,
            `Design Leadership - Leading in ${targetCategory} appearance and user experience design`,
            `Service Experience Advantage - ${targetCategory} customer service satisfaction significantly higher than competitors`,
            `Brand Loyalty - ${targetCategory} users have stronger brand identity and loyalty`
          ] : [
            `品质认知优势 - 用户对${targetCategory}质量评价更高`,
            `设计领先优势 - 在${targetCategory}外观和用户体验设计上领先`,
            `服务体验优势 - ${targetCategory}客户服务满意度显著高于竞品`,
            `品牌忠诚度 - ${targetCategory}用户品牌认同感和忠诚度更强`
          ],
          competitiveWeaknesses: isEnglish ? [
            `Price Sensitivity - ${targetCategory} price higher than competitors, limiting some user groups`,
            `Market Penetration - Compared to competitors, ${targetCategory} market share still has room for improvement`,
            `Feature Innovation Speed - Somewhat conservative in developing certain ${targetCategory} practical features`
          ] : [
            `价格敏感性 - ${targetCategory}价格比竞品高，限制了部分用户群体`,
            `市场渗透率 - 相比竞品${targetCategory}市场占有率还有提升空间`,
            `功能创新速度 - 在某些${targetCategory}实用功能开发上稍显保守`
          ]
        }
      }),

      // Opportunity insights
      opportunityInsights: {
        productImprovement: [
          {
            category: isEnglish ? "Improvements Based on Low-Star Reviews" : "基于低星级评论的改进",
            suggestions: isEnglish ? [
              `Optimize ${targetCategory} product manuals and beginner guidance to reduce learning costs`,
              `Improve ${targetCategory} packaging design to reduce damage risk during shipping`,
              `Strengthen ${targetCategory} quality control to reduce defect rates`,
              `Establish better ${targetCategory} pre-sales consultation system to avoid user expectation mismatch`
            ] : [
              `优化${targetCategory}产品说明书和新手指导，降低学习成本`,
              `改进${targetCategory}包装设计，减少运输过程中的损坏风险`,
              `加强${targetCategory}质量控制，减少产品缺陷率`,
              `建立更完善的${targetCategory}售前咨询体系，避免用户期望与实际产品不符`
            ]
          }
        ],
        productInnovation: [
          {
            category: isEnglish ? "New Features Based on Unmet Needs" : "基于未满足需求的新功能",
            suggestions: isEnglish ? [
              `Develop ${targetCategory} personalization platform for users to customize product features and appearance`,
              `Integrate AI smart features into ${targetCategory} to provide personalized usage suggestions and auto-optimization`,
              `Launch ${targetCategory} wireless connectivity solutions to improve usage convenience`,
              `Develop ${targetCategory} cross-device sync system for seamless multi-device switching`
            ] : [
              `开发${targetCategory}个性化定制平台，让用户可以定制产品功能和外观`,
              `集成AI智能功能到${targetCategory}中，提供个性化使用建议和自动优化`,
              `推出${targetCategory}无线连接解决方案，提升使用便利性`,
              `开发${targetCategory}跨设备同步系统，实现多设备无缝切换`
            ]
          }
        ],
        marketingPositioning: competitorFile ? [
          {
            category: isEnglish ? "Advantage Strengthening Strategy" : "优势强化策略", 
            suggestions: isEnglish ? [
              `Emphasize 'Professional Quality, Long-term Value' ${targetCategory} brand positioning`,
              `Highlight ${targetCategory} design aesthetics and user experience differentiation advantages`,
              `Build 'Young Professionals' First Choice ${targetCategory}' brand image`,
              `Establish 'Quality ${targetCategory} Service' brand reputation`
            ] : [
              `强调'专业品质，长期价值'的${targetCategory}品牌定位`,
              `突出${targetCategory}设计美学和用户体验的差异化优势`,
              `打造'年轻专业人士首选${targetCategory}'的品牌形象`,
              `建立'优质${targetCategory}服务'的品牌口碑`
            ]
          }
        ] : [
          {
            category: isEnglish ? "Brand Positioning Recommendations" : "品牌定位建议",
            suggestions: isEnglish ? [
              `Emphasize 'Professional Quality, Long-term Value' ${targetCategory} brand positioning`,
              `Highlight ${targetCategory} design aesthetics and user experience advantages`,
              `Build 'Young Professionals' First Choice ${targetCategory}' brand image`,
              `Establish 'Quality ${targetCategory} Service' brand reputation`
            ] : [
              `强调'专业品质，长期价值'的${targetCategory}品牌定位`,
              `突出${targetCategory}设计美学和用户体验的优势`,
              `打造'年轻专业人士首选${targetCategory}'的品牌形象`,
              `建立'优质${targetCategory}服务'的品牌口碑`
            ]
          }
        ]
      }
    }

    // Store analysis result
    await kv.set(`analysis:${mockAnalysisResult.id}`, mockAnalysisResult)
    console.log('Analysis result stored with ID:', mockAnalysisResult.id)

    return c.json(mockAnalysisResult)
  } catch (error) {
    console.error('Analysis endpoint error:', error)
    return c.json({ 
      error: 'Internal server error during analysis',
      details: error.message
    }, 500)
  }
})

// Get historical reports endpoint - now includes bilingual report titles
app.get('/make-server-bda2f768/reports', async (c) => {
  try {
    console.log('Historical reports request received')
    const reports = await kv.getByPrefix('analysis:')
    const sortedReports = reports
      .map(report => {
        const isEnglish = report.language === 'en'
        return {
          id: report.id,
          timestamp: report.timestamp,
          title: isEnglish 
            ? `Analysis Report - ${new Date(report.timestamp).toLocaleDateString('en-US')}`
            : `分析报告 - ${new Date(report.timestamp).toLocaleDateString('zh-CN')}`,
          hasCompetitorData: report.hasCompetitorData || false,
          targetCategory: report.targetCategory || (isEnglish ? 'Unspecified Category' : '未指定品类'),
          language: report.language || 'en'
        }
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    console.log('Found reports:', sortedReports.length)
    return c.json(sortedReports)
  } catch (error) {
    console.error('Reports endpoint error:', error)
    return c.json({ 
      error: 'Internal server error while fetching reports',
      details: error.message
    }, 500)
  }
})

// Get specific report endpoint
app.get('/make-server-bda2f768/report/:id', async (c) => {
  try {
    const reportId = c.req.param('id')
    console.log('Specific report request for ID:', reportId)
    
    const report = await kv.get(`analysis:${reportId}`)

    if (!report) {
      console.log('Report not found:', reportId)
      return c.json({ error: 'Report not found' }, 404)
    }

    console.log('Report found and returned')
    return c.json(report)
  } catch (error) {
    console.error('Report fetch error:', error)
    return c.json({ 
      error: 'Internal server error while fetching report',
      details: error.message
    }, 500)
  }
})

// Health check endpoint
app.get('/make-server-bda2f768/health', async (c) => {
  return c.json({ 
    status: 'ok', 
    bucketInitialized,
    timestamp: new Date().toISOString()
  })
})

Deno.serve(app.fetch)