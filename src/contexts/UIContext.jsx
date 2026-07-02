import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext(undefined);

export const UIProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('medical_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('medical_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileDrawer = () => setMobileDrawerOpen(!mobileDrawerOpen);
  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  return (
    <UIContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        mobileDrawerOpen,
        toggleMobileDrawer,
        closeMobileDrawer
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
