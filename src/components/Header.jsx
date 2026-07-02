import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  ChevronDown, 
  Check, 
  User, 
  LogOut, 
  FileText,
  Activity,
  AlertCircle,
  Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useMedical } from '../contexts/MedicalContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, sidebarCollapsed, toggleMobileDrawer } = useUI();
  const { notifications, markNotificationRead, clearNotifications } = useMedical();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Detect screen size in JS to adjust header offset responsively
  const [isLargeScreen, setIsLargeScreen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  React.useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
      <div className="flex items-center space-x-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
        <span className="capitalize">{user?.role} Portal</span>
        {pathnames.slice(1).map((value, index) => {
          const to = `/${pathnames.slice(0, index + 2).join('/')}`;
          const isLast = index === pathnames.length - 2;
          const displayValue = value.replace('-', ' ');
          return (
            <React.Fragment key={to}>
              <span>/</span>
              <Link 
                to={to} 
                className={`capitalize transition-colors hover:text-primary ${isLast ? 'text-slate-600 dark:text-slate-300 font-semibold' : ''}`}
              >
                {displayValue}
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const getPageTitle = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    if (pathnames.length <= 1) return 'Dashboard';
    const lastPath = pathnames[pathnames.length - 1];
    return lastPath.charAt(0).toUpperCase() + lastPath.slice(1).replace('-', ' ');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Warning':
        return <AlertCircle className="text-amber-500 h-4.5 w-4.5" />;
      case 'Danger':
        return <AlertCircle className="text-rose-500 h-4.5 w-4.5" />;
      case 'Success':
        return <Activity className="text-emerald-500 h-4.5 w-4.5" />;
      default:
        return <FileText className="text-blue-500 h-4.5 w-4.5" />;
    }
  };

  return (
    <header 
      className={`fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 border-b transition-all duration-300
        ${darkMode 
          ? 'bg-[#090D16]/95 border-slate-800 text-slate-100' 
          : 'bg-white/95 border-slate-200 text-slate-800'}
        backdrop-blur-md`}
      style={{ left: isLargeScreen ? (sidebarCollapsed ? '80px' : '260px') : '0' }}
    >
      {/* Left Area: Hamburger, Title & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        {!isLargeScreen && (
          <button
            onClick={toggleMobileDrawer}
            className={`h-9 w-9 rounded-xl border flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
              ${darkMode ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            <Menu size={18} />
          </button>
        )}
        <div className="flex flex-col items-start">
          <div className="hidden sm:block">
            {getBreadcrumbs()}
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-none sm:mt-1">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search patient vitals, schedules..."
            className={`w-64 pl-9 pr-4 py-1.5 text-xs rounded-xl border outline-none transition-all focus:ring-2 focus:ring-primary/20
              ${darkMode 
                ? 'bg-slate-900 border-slate-800 text-slate-300 placeholder-slate-500 focus:border-primary/50' 
                : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-primary'}`}
          />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`h-9 w-9 rounded-xl border flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
            ${darkMode ? 'border-slate-800 bg-slate-900 text-amber-400' : 'border-slate-200 bg-white text-slate-500'}`}
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications Tray */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`h-9 w-9 rounded-xl border flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative
              ${darkMode ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-500'}`}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2.5 w-80 rounded-xl border shadow-xl z-50 overflow-hidden
                    ${darkMode ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200/80'}`}
                >
                  <div className={`px-4 py-3 flex items-center justify-between border-b 
                    ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="font-bold text-sm">Notifications Center</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No recent activity logs
                      </div>
                    ) : (
                      notifications.map((ntf) => (
                        <div
                          key={ntf.id}
                          onClick={() => {
                            markNotificationRead(ntf.id);
                          }}
                          className={`px-4 py-3 border-b flex space-x-3 cursor-pointer transition-colors
                            ${darkMode ? 'border-slate-800/60' : 'border-slate-100'}
                            ${!ntf.read 
                              ? (darkMode ? 'bg-slate-900/50 hover:bg-slate-900' : 'bg-slate-50/70 hover:bg-slate-100/50') 
                              : (darkMode ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50')}`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {getNotificationIcon(ntf.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <span className={`text-xs font-bold truncate ${!ntf.read ? 'text-slate-850 dark:text-white' : 'text-slate-500'}`}>
                                {ntf.title}
                              </span>
                              {!ntf.read && (
                                <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {ntf.message}
                            </p>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              {new Date(ntf.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Account Button */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 text-left focus:outline-none"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name}
              className="h-8.5 w-8.5 rounded-xl border object-cover ring-2 ring-primary/10 border-slate-200/50"
            />
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2.5 w-48 rounded-xl border shadow-xl z-50 overflow-hidden
                    ${darkMode ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200/80'}`}
                >
                  <div className={`px-4 py-3.5 border-b flex flex-col 
                    ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="font-bold text-xs truncate">{user?.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate">{user?.title}</span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    <Link
                      to={`/${user?.role.toLowerCase()}/profile`}
                      onClick={() => setShowProfileMenu(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors
                        ${darkMode ? 'text-slate-350 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <User size={14} className="mr-2" />
                      View Profile
                    </Link>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-red-655 hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-400 transition-colors text-left"
                    >
                      <LogOut size={14} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
