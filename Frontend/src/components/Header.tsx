import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
  onExport?: () => void;
  sidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onExport, sidebarOpen = false }) => {
  const { isDark, toggleTheme } = useTheme();

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export functionality
      const currentDate = new Date().toLocaleDateString('fr-FR');
      const content = `
DURABILIS.CO - Export de conversation
Date: ${currentDate}

Cette conversation a été exportée depuis l'assistant IA DURABILIS.CO
spécialisé dans l'analyse de documents techniques sur le développement durable.

Pour plus d'informations, visitez: https://durabilis.co
      `.trim();

      // Create a downloadable text file
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `durabilis-conversation-${currentDate.replace(/\//g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // DURABILIS.CO Logo SVG Component
  const DurabilisLogo = () => (
    <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="100" cy="100" r="95" fill="white" stroke="#e5e7eb" strokeWidth="2"/>

      {/* Main blue circle */}
      <path d="M100 30 C135 30 165 60 165 95 C165 130 135 160 100 160 C90 160 80 155 72 148 L72 95 L100 95 L100 30 Z" fill="#2daae1"/>

      {/* Dark blue circle */}
      <path d="M100 30 C65 30 35 60 35 95 C35 130 65 160 100 160 C110 160 120 155 128 148 L128 95 L100 95 L100 30 Z" fill="#2b2e83"/>

      {/* Center white overlap */}
      <circle cx="100" cy="95" r="25" fill="white"/>

      {/* Small accent circle */}
      <circle cx="115" cy="80" r="8" fill="#0f70b7"/>
    </svg>
  );

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 sticky top-0 z-30 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="flex items-center justify-between max-w-full">

        {/* Left side - Menu button and Logo */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">

          {/* Sidebar Toggle Button - Always visible */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 shrink-0"
            aria-label={sidebarOpen ? "Fermer l'historique" : "Afficher l'historique"}
            title={sidebarOpen ? "Fermer l'historique" : "Afficher l'historique"}
          >
            {sidebarOpen ? (
              // Close icon when sidebar is open
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Menu icon when sidebar is closed
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="shrink-0 hover:scale-105 transition-all duration-200">
              <DurabilisLogo />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-durabilis-primary dark:text-durabilis-light truncate">
                DURABILIS.CO
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Assistant IA pour le développement durable
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 lg:space-x-3 shrink-0">

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">En ligne</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 lg:p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
            title={isDark ? "Mode clair" : "Mode sombre"}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 text-sm border border-durabilis-primary text-durabilis-primary hover:bg-durabilis-primary hover:text-white rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105"
            title="Exporter la conversation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden lg:inline">Exporter</span>
          </button>

          {/* Mobile Export Button */}
          <button
            onClick={handleExport}
            className="sm:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            title="Exporter"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
