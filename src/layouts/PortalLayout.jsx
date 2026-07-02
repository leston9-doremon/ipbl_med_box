import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { motion } from 'framer-motion';

export const PortalLayout = ({ requiredRole }) => {
  const { user } = useAuth();
  const { sidebarCollapsed, darkMode } = useUI();
  const location = useLocation();

  // Route Guard: If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Route Guard: If role doesn't match requiredRole, redirect to user's home portal
  if (requiredRole && user.role !== requiredRole) {
    const defaultPaths = {
      Patient: '/patient/dashboard',
      Guardian: '/guardian/schedule', // Primary page is schedule for Guardian
      Doctor: '/doctor/patients',     // Doctor starts on Patient selection screen
    };
    return <Navigate to={defaultPaths[user.role] || '/login'} replace />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#090D16] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Wrapper */}
      <div 
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '80px' : '260px' }}
      >
        {/* Top Header */}
        <Header />

        {/* Content Shell */}
        <main className="flex-1 p-6 mt-16 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {/* Animated Page Transitions */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
