#!/usr/bin/env python3

import re

# 读取文件
with open('front/src/pages/analysis/CompetitorAnalysis.tsx', 'r') as f:
    content = f.read()

# 定义替换模式
patterns = [
    # 模式：找到错误格式并替换为正确格式
    (
        r'<div className="w-3 h-3 bg-([^"]+) rounded-full"></div>\s*\{language === \'en\' \? \(\s*<>\s*([^<]+)<span([^>]+)>([^<]+)</span>\s*</>\s*\) : \(\s*<>\s*([^<]+)<span([^>]+)>([^<]+)</span>\s*</>\s*\)\}\s*<Badge([^>]+)>([^<]+)</Badge>',
        r'''<div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-\1 rounded-full"></div>
                              {language === 'en' ? '\2'.strip() : '\5'.strip()}
                              <Badge\8>\9</Badge>
                            </div>
                            {language === 'en' ? (
                              <span\3>\4</span>
                            ) : (
                              <span\6>\7</span>
                            )}'''
    )
]

# 应用替换
for pattern, replacement in patterns:
    content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)

# 写回文件
with open('front/src/pages/analysis/CompetitorAnalysis.tsx', 'w') as f:
    f.write(content)

print("象限格式修复完成！")
