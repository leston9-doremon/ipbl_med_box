import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Pill,
  AlertTriangle,
  Activity,
  FileText,
  FolderOpen,
  PhoneCall,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Upload,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useMedical } from '../contexts/MedicalContext';

export const Sidebar = () => {
  const { user, logout, selectedPatientId } = useAuth();
  const { sidebarCollapsed, toggleSidebar, darkMode } = useUI();
  const { patients } = useMedical();

  const activePatient = patients.find(p => p.id === selectedPatientId);

  const getLinks = (role) => {
    switch (role) {
      case 'Patient':
        return [
          { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/patient/today', label: "Today's Medicines", icon: Pill },
          { path: '/patient/missed', label: 'Missed Doses', icon: AlertTriangle },
          { path: '/patient/vitals', label: 'Health Vitals', icon: Activity },
          { path: '/patient/prescriptions', label: 'Prescriptions', icon: FileText },
          { path: '/patient/documents', label: 'Medical Reports', icon: FolderOpen },
          { path: '/patient/contacts', label: 'Emergency Contacts', icon: PhoneCall },
          { path: '/patient/profile', label: 'Profile', icon: User }
        ];
      case 'Guardian':
        return [
          { path: '/guardian/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/guardian/schedule', label: 'Medicine Schedule', icon: Pill },
          { path: '/guardian/missed', label: 'Missed Doses', icon: AlertTriangle },
          { path: '/guardian/vitals', label: 'Patient Vitals', icon: Activity },
          { path: '/guardian/prescriptions', label: 'Prescriptions', icon: FileText },
          { path: '/guardian/documents', label: 'Medical Reports', icon: FolderOpen },
          { path: '/guardian/contacts', label: 'Emergency Contacts', icon: PhoneCall },
          { path: '/guardian/profile', label: 'Profile', icon: User }
        ];
      case 'Doctor':
        return [
          { path: '/doctor/patients', label: 'Patient Selector', icon: UserCheck },
          { path: '/doctor/dashboard', label: 'Patient Dashboard', icon: LayoutDashboard },
          { path: '/doctor/history', label: 'Medicine History', icon: ClipboardList },
          { path: '/doctor/schedule', label: 'Medicine Schedule', icon: Pill },
          { path: '/doctor/missed', label: 'Missed Doses', icon: AlertTriangle },
          { path: '/doctor/vitals', label: 'Health Monitoring', icon: Activity },
          { path: '/doctor/prescription-upload', label: 'Prescription Upload', icon: Upload },
          { path: '/doctor/documents', label: 'Medical Documents', icon: FolderOpen },
          { path: '/doctor/contacts', label: 'Emergency Contacts', icon: PhoneCall },
          { path: '/doctor/patient-profile', label: 'Patient Profile', icon: User }
        ];
      default:
        return [];
    }
  };

  const menuItems = getLinks(user?.role);

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col border-r shrink-0
        ${darkMode 
          ? 'bg-[#0B1220] border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'}
        shadow-sm`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center justify-between px-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
              <Activity size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">AURA SMARTBOX</span>
              <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">Health Portal</span>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold mx-auto shadow-md shadow-primary/20">
            <Activity size={20} className="stroke-[2.5]" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className={`hidden md:flex h-6 w-6 rounded-md border items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors
            ${darkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Selected Patient Banner (For Doctor/Guardian when not collapsed) */}
      {!sidebarCollapsed && user && (user.role === 'Doctor' || user.role === 'Guardian') && activePatient && (
        <div className={`p-4 mx-3 mt-4 rounded-xl border flex items-center space-x-3 
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'}`}>
          <img
            src={activePatient.photo}
            alt={activePatient.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/25"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Monitoring Patient</span>
            <span className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{activePatient.name}</span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/15' 
                  : darkMode 
                    ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
              }
            >
              <Icon size={18} className="shrink-0 stroke-[2]" />
              {!sidebarCollapsed && (
                <span className="ml-3.5 truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className={`p-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        {!sidebarCollapsed && (
          <div className={`p-2 rounded-xl flex items-center space-x-3 mb-2 
            ${darkMode ? 'bg-slate-900/40' : 'bg-slate-50/70'}`}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name}
              className="h-9 w-9 rounded-full object-cover border border-slate-200/50"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{user?.name}</span>
              <span className="text-[10px] text-slate-400 truncate">{user?.title}</span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`w-full flex items-center px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200
            ${darkMode 
              ? 'text-red-400 hover:bg-red-500/10' 
              : 'text-red-600 hover:bg-red-50 hover:text-red-700'}`}
        >
          <LogOut size={18} className="shrink-0" />
          {!sidebarCollapsed && <span className="ml-3.5">Logout Session</span>}
        </button>
      </div>
    </motion.aside>
  );
};
