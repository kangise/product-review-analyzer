import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
// Import other pages as they are created
// import { Upload } from './pages/Upload';
// import { ConsumerProfile } from './pages/analysis/UserInsights/ConsumerProfile';
// ... other imports

interface AppState {
  currentPage: string;
  language: 'en' | 'zh';
  theme: 'light' | 'dark' | 'system';
  analysisData: any;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentPage: 'dashboard',
    language: 'en',
    theme: 'system',
    analysisData: null,
  });

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('reviewmind-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setState(prev => ({
          ...prev,
          language: settings.language || 'en',
          theme: settings.theme || 'system',
        }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    const settings = {
      language: state.language,
      theme: state.theme,
    };
    localStorage.setItem('reviewmind-settings', JSON.stringify(settings));
  }, [state.language, state.theme]);

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (state.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', state.theme === 'dark');
    }
  }, [state.theme]);

  const handlePageChange = (page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const handleLanguageChange = (language: 'en' | 'zh') => {
    setState(prev => ({ ...prev, language }));
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setState(prev => ({ ...prev, theme }));
  };

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            language={state.language}
            onPageChange={handlePageChange}
          />
        );
      
      case 'upload':
        // Placeholder for Upload component
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Upload Page</h1>
            <p className="text-muted-foreground">Upload component will be implemented here</p>
          </div>
        );

      case 'consumer-profile':
        // Placeholder for Consumer Profile component
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Consumer Profile Analysis</h1>
            <p className="text-muted-foreground">Consumer Profile component will be implemented here</p>
          </div>
        );

      case 'consumer-scenario':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Usage Scenarios Analysis</h1>
            <p className="text-muted-foreground">Consumer Scenario component will be implemented here</p>
          </div>
        );

      case 'consumer-motivation':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Purchase Motivation Analysis</h1>
            <p className="text-muted-foreground">Consumer Motivation component will be implemented here</p>
          </div>
        );

      case 'consumer-love':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">What Users Love Analysis</h1>
            <p className="text-muted-foreground">Consumer Love component will be implemented here</p>
          </div>
        );

      case 'star-rating-analysis':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Star Rating Root Cause Analysis</h1>
            <p className="text-muted-foreground">Star Rating Analysis component will be implemented here</p>
          </div>
        );

      case 'unmet-needs':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Unmet Needs Analysis</h1>
            <p className="text-muted-foreground">Unmet Needs component will be implemented here</p>
          </div>
        );

      case 'product-improvement':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Product Improvement Opportunities</h1>
            <p className="text-muted-foreground">Product Improvement component will be implemented here</p>
          </div>
        );

      case 'product-innovation':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Product Innovation Opportunities</h1>
            <p className="text-muted-foreground">Product Innovation component will be implemented here</p>
          </div>
        );

      case 'marketing-positioning':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Marketing Positioning Opportunities</h1>
            <p className="text-muted-foreground">Marketing Positioning component will be implemented here</p>
          </div>
        );

      case 'competitive':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Competitive Analysis</h1>
            <p className="text-muted-foreground">Competitive Analysis component will be implemented here</p>
          </div>
        );

      case 'history':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Historical Reports</h1>
            <p className="text-muted-foreground">History component will be implemented here</p>
          </div>
        );

      case 'settings':
        return (
          <div className="text-center spacing-system-xl">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-muted-foreground">Settings component will be implemented here</p>
          </div>
        );

      default:
        return (
          <Dashboard
            language={state.language}
            onPageChange={handlePageChange}
          />
        );
    }
  };

  return (
    <Layout
      currentPage={state.currentPage}
      onPageChange={handlePageChange}
      language={state.language}
      onLanguageChange={handleLanguageChange}
      theme={state.theme}
      onThemeChange={handleThemeChange}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;
