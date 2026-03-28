import React, { createContext, useContext, useState, useEffect } from 'react';

// --- THEME CONTEXT ---
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: 'light'
});

// --- THEME PROVIDER COMPONENT ---
export const ThemeProvider = ({ children }) => {
  // Initialize with dark mode as default
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from memory on mount (avoiding localStorage in artifacts)
  useEffect(() => {
    // In a real app, you would use localStorage here:
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //   setIsDarkMode(savedTheme === 'dark');
    // }
    
    // For this artifact, we'll just use the default
    setIsDarkMode(true);
  }, []);

  // Apply theme to document whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      // In a real app: localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      // In a real app: localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- CUSTOM HOOK TO USE THEME ---
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;