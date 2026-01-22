import React from 'react';
import { useTheme, Theme } from '@/app/components/Theme/ThemeProvider';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md'
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = getSizeClasses(size);
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-outline ${sizeClasses} ${className}`}
      aria-label={`Switch to ${getNextThemeLabel(theme)} theme`}
      title={`Current: ${theme} theme. Click to switch.`}
    >
      {theme === 'light' && <SunIcon className={iconSize} />}
      {theme === 'dark' && <MoonIcon className={iconSize} />}
      {theme === 'system' && <SystemIcon className={iconSize} />}
      
      {showLabel && (
        <span className="ml-2 capitalize">{theme}</span>
      )}
    </button>
  );
};

// Helper function for size classes
function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  const sizes = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  };
  return sizes[size];
}

// Helper function to get next theme label
function getNextThemeLabel(currentTheme: Theme): string {
  const nextTheme = {
    light: 'dark',
    dark: 'system',
    system: 'light'
  };
  return nextTheme[currentTheme];
}

// Sun Icon Component
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

// Moon Icon Component
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

// System Icon Component (Monitor/Computer)
const SystemIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export default ThemeToggle;