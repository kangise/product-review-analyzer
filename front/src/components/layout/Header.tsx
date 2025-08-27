import React from 'react';
import { Bell, User, Moon, Sun, Monitor, Languages } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface HeaderProps {
  language: 'en' | 'zh';
  onLanguageChange: (lang: 'en' | 'zh') => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  const themeIcons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
  };

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full spacing-system-lg">
        {/* Left side - could add breadcrumbs or page title here */}
        <div className="flex items-center gap-system-md">
          {/* Page context could go here */}
        </div>

        {/* Right side - controls */}
        <div className="flex items-center gap-system-sm">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-system-xs">
                <Languages className="w-4 h-4" />
                <span className="text-sm">
                  {language === 'en' ? 'EN' : '中文'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => onLanguageChange('en')}
                className={language === 'en' ? 'bg-accent' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onLanguageChange('zh')}
                className={language === 'zh' ? 'bg-accent' : ''}
              >
                中文
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {themeIcons[theme]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => onThemeChange('light')}
                className={theme === 'light' ? 'bg-accent' : ''}
              >
                <Sun className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Light' : '浅色'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onThemeChange('dark')}
                className={theme === 'dark' ? 'bg-accent' : ''}
              >
                <Moon className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Dark' : '深色'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onThemeChange('system')}
                className={theme === 'system' ? 'bg-accent' : ''}
              >
                <Monitor className="w-4 h-4 mr-2" />
                {language === 'en' ? 'System' : '系统'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs"
            >
              <span className="sr-only">New notifications</span>
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                {language === 'en' ? 'Profile' : '个人资料'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {language === 'en' ? 'Account Settings' : '账户设置'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {language === 'en' ? 'Sign Out' : '退出登录'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
