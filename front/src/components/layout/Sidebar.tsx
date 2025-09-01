import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Upload, Users, Target, Star, TrendingUp, 
  History, Settings, ChevronDown, ChevronRight,
  Lightbulb, Zap, MessageSquare
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  language: 'en' | 'zh';
}

interface NavItem {
  id: string;
  label: { en: string; zh: string };
  icon: React.ReactNode;
  children?: NavItem[];
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: { en: 'Dashboard', zh: '仪表板' },
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: 'upload',
    label: { en: 'Data Upload', zh: '数据上传' },
    icon: <Upload className="w-4 h-4" />,
  },
  {
    id: 'user-insights',
    label: { en: 'User Insights', zh: '用户洞察' },
    icon: <Users className="w-4 h-4" />,
    children: [
      {
        id: 'consumer-profile',
        label: { en: 'Consumer Profile', zh: '消费者画像' },
        icon: <Users className="w-3 h-3" />,
      },
      {
        id: 'consumer-scenario',
        label: { en: 'Usage Scenarios', zh: '使用场景' },
        icon: <Target className="w-3 h-3" />,
      },
      {
        id: 'consumer-motivation',
        label: { en: 'Purchase Motivation', zh: '购买动机' },
        icon: <Star className="w-3 h-3" />,
      },
    ],
  },
  {
    id: 'user-feedback',
    label: { en: 'User Feedback', zh: '用户反馈' },
    icon: <MessageSquare className="w-4 h-4" />,
    children: [
      {
        id: 'consumer-love',
        label: { en: 'What Users Love', zh: '用户喜爱点' },
        icon: <Star className="w-3 h-3" />,
      },
      {
        id: 'star-rating-analysis',
        label: { en: 'Rating Analysis', zh: '评分分析' },
        icon: <Star className="w-3 h-3" />,
      },
    ],
  },
  {
    id: 'unmet-needs',
    label: { en: 'Unmet Needs', zh: '未满足需求' },
    icon: <Target className="w-4 h-4" />,
  },
  {
    id: 'opportunities',
    label: { en: 'Opportunities', zh: '机会洞察' },
    icon: <TrendingUp className="w-4 h-4" />,
    badge: 'New',
    children: [
      {
        id: 'product-improvement',
        label: { en: 'Product Improvement', zh: '产品改进' },
        icon: <Lightbulb className="w-3 h-3" />,
      },
      {
        id: 'product-innovation',
        label: { en: 'Product Innovation', zh: '产品创新' },
        icon: <Zap className="w-3 h-3" />,
      },
      {
        id: 'marketing-positioning',
        label: { en: 'Marketing Positioning', zh: '营销定位' },
        icon: <Target className="w-3 h-3" />,
      },
    ],
  },
  {
    id: 'competitive',
    label: { en: 'Competitive Analysis', zh: '竞争分析' },
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: 'history',
    label: { en: 'Historical Reports', zh: '历史报告' },
    icon: <History className="w-4 h-4" />,
  },
  {
    id: 'settings',
    label: { en: 'Settings', zh: '设置' },
    icon: <Settings className="w-4 h-4" />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  language,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['user-insights', 'opportunities']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = currentPage === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`
            w-full justify-start gap-system-sm
            ${level > 0 ? 'ml-4 text-sm' : ''}
            ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onPageChange(item.id);
            }
          }}
        >
          {item.icon}
          <span className="flex-1 text-left">
            {item.label[language]}
          </span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          )}
        </Button>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="gap-system-xs flex flex-col mt-1">
                {item.children?.map(child => renderNavItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="spacing-system-lg border-b border-sidebar-border">
        <div className="flex items-center gap-system-sm">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">Regen AI</h1>
            <p className="text-xs text-sidebar-foreground/60">
              {language === 'en' ? 'Customer Intelligence' : '客户智能分析'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 spacing-system-md">
        <div className="gap-system-xs flex flex-col">
          {navigationItems.map(item => renderNavItem(item))}
        </div>
      </nav>

      {/* Footer */}
      <div className="spacing-system-md border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          {language === 'en' ? 'Powered by Amazon Q' : '由 Amazon Q 驱动'}
        </div>
      </div>
    </div>
  );
};
