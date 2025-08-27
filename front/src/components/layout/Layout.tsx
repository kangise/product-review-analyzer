import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  language: 'en' | 'zh';
  onLanguageChange: (lang: 'en' | 'zh') => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  onPageChange,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={onPageChange}
        language={language}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          language={language}
          onLanguageChange={onLanguageChange}
          theme={theme}
          onThemeChange={onThemeChange}
        />
        <main className="flex-1 overflow-auto">
          <div className="spacing-system-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
