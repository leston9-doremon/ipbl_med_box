import React, { useState, useEffect } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { ECGCanvas } from '../../components/ECGCanvas';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Calendar, 
  Clock, 
  Pill, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { 
    medicineLogs, 
    telemetry, 
    notifications, 
    markNotificationRead 
  } = useMedical();

  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter logs for this patient today
  const patientId = user?.patientId || 'PAT-8802';
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = medicineLogs.filter(
    (log) => log.patientId === patientId && log.date === todayStr
  );

  const takenLogs = todayLogs.filter((l) => l.status === 'Taken');
  const missedLogs = todayLogs.filter((l) => l.status === 'Missed');
  const upcomingLogs = todayLogs.filter((l) => l.status === 'Upcoming' || l.status === 'Pending');

  const totalLogsCount = todayLogs.length;
  const completionPercentage = totalLogsCount > 0 
    ? Math.round((takenLogs.length / totalLogsCount) * 100) 
    : 0;

  // Find next medicine details
  const nextMedicine = upcomingLogs[upcomingLogs.length - 1] || null; // standard sorted upcoming

  // Chart 1: Weekly Medicine Adherence (Mon - Sun)
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Adherence %',
        data: [90, 80, 100, 85, 95, 60, completionPercentage], // Bind Sunday to today's progress dynamically
        backgroundColor: darkMode ? '#14b8a6' : '#2563eb',
        borderRadius: 8,
        barThickness: 16,
      }
    ]
  };

  const weeklyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#0f172a' : '#fff',
        titleColor: darkMode ? '#f8fafc' : '#0f172a',
        bodyColor: darkMode ? '#94a3b8' : '#64748b',
        borderWidth: 1,
        borderColor: darkMode ? '#334155' : '#e2e8f0',
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { color: darkMode ? '#64748b' : '#94a3b8', stepSize: 20 },
        grid: { color: darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' }
      },
      x: {
        ticks: { color: darkMode ? '#64748b' : '#94a3b8' },
        grid: { display: false }
      }
    }
  };

  // Chart 2: Monthly Adherence (past 4 weeks)
  const monthlyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        fill: true,
        label: 'Compliance',
        data: [82, 88, 75, 92],
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: '#14b8a6',
      }
    ]
  };

  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { color: darkMode ? '#64748b' : '#94a3b8' },
        grid: { color: darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' }
      },
      x: {
        ticks: { color: darkMode ? '#64748b' : '#94a3b8' },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Time Header */}
      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Welcome Back, Eleanor
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            System Status: Box connected • Vitals telemetry active
          </p>
        </div>

        {/* Live Date / Time Badge */}
        <div className={`p-4 rounded-medical border flex items-center justify-between shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Today</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="text-right border-l pl-4 border-slate-250 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Stats Row */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Adherence Circle Progress Card */}
        <div className={`p-6 rounded-medical border flex flex-col justify-between shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
              Medication Completion
            </span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Today's Progress</h3>
          </div>

          <div className="flex items-center justify-around py-4">
            {/* SVG Progress Circle */}
            <div className="relative h-24 w-24">
              <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${completionPercentage}, 100` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="text-primary stroke-round"
                  strokeWidth="3.5"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold font-mono text-slate-800 dark:text-white">
                  {completionPercentage}%
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-semibold">Done</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5 text-xs">
              <div className="flex items-center text-emerald-500 font-bold">
                <CheckCircle2 size={13} className="mr-1.5" />
                <span>{takenLogs.length} Taken</span>
              </div>
              <div className="flex items-center text-amber-500 font-bold">
                <Clock size={13} className="mr-1.5" />
                <span>{upcomingLogs.length} Pending</span>
              </div>
              <div className="flex items-center text-rose-500 font-bold">
                <AlertTriangle size={13} className="mr-1.5" />
                <span>{missedLogs.length} Missed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Dose Countdown Card */}
        <div className={`p-6 rounded-medical border flex flex-col justify-between shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
              Upcoming Schedule
            </span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Next Medicine</h3>
          </div>

          {nextMedicine ? (
            <div className="py-2.5">
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Pill size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">
                    {nextMedicine.medicineName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                    Dose: {nextMedicine.dose} • Slot: {nextMedicine.slot}
                  </span>
                </div>
              </div>

              {/* Box slot Indicator */}
              <div className={`mt-4 px-3 py-2 rounded-lg border text-xs flex justify-between items-center
                ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
                <span className="text-slate-400">Smartbox Compartment</span>
                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md text-[11px]">
                  Slot {nextMedicine.boxSlot || 3}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No pending doses scheduled for today.
            </div>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center">
            <span className="text-[10px] text-slate-405 font-bold uppercase">Scheduled for</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
              <Clock size={13} className="mr-1 text-primary" />
              {nextMedicine ? nextMedicine.scheduledTime : 'N/A'}
            </span>
          </div>
        </div>

        {/* Mini Vitals Pulse Panel */}
        <div className={`p-6 rounded-medical border flex flex-col justify-between shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
                Active Telemetry
              </span>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Physical Vitals</h3>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center pulse-animation">
                <Heart size={20} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Heart Rate</span>
                <span className="text-base font-extrabold font-mono text-slate-850 dark:text-white">
                  {telemetry.vitals.heartRate} <span className="text-[10px] font-normal text-slate-400">BPM</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Thermometer size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Temp</span>
                <span className="text-base font-extrabold font-mono text-slate-850 dark:text-white">
                  {telemetry.vitals.temperature} <span className="text-[10px] font-normal text-slate-400">°C</span>
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-xs">
            <span className="text-[10px] text-slate-405 font-bold uppercase">System Index</span>
            <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
              {telemetry.vitals.healthStatus}
            </span>
          </div>
        </div>

      </div>

      {/* ECG Live wave */}
      <div className="grid grid-cols-1">
        <div className={`p-4 rounded-medical border shadow-sm ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
              <Activity size={14} className="mr-1.5 text-primary stroke-[2.5]" />
              Live Lead II Electrocardiogram Waveform
            </span>
            <Link to="/patient/vitals" className="text-[10px] font-semibold text-primary hover:underline flex items-center">
              Analyze History
              <ChevronRight size={12} className="ml-0.5" />
            </Link>
          </div>
          <ECGCanvas heartRate={telemetry.vitals.heartRate} height={100} />
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Weekly Adherence Chart */}
        <div className={`p-5 rounded-medical border shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Weekly Adherence Compliance
            </h3>
            <span className="text-xs text-primary font-bold flex items-center bg-primary/10 px-2.5 py-0.5 rounded-full">
              <TrendingUp size={12} className="mr-1" />
              88% Avg
            </span>
          </div>
          <div className="h-56 relative">
            <Bar data={weeklyData} options={weeklyOptions} />
          </div>
        </div>

        {/* Monthly Adherence Chart */}
        <div className={`p-5 rounded-medical border shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Monthly Adherence Progress
            </h3>
            <span className="text-xs text-teal-500 font-bold flex items-center bg-teal-500/10 px-2.5 py-0.5 rounded-full">
              <TrendingUp size={12} className="mr-1" />
              87% Avg
            </span>
          </div>
          <div className="h-56 relative">
            <Line data={monthlyData} options={monthlyOptions} />
          </div>
        </div>

      </div>

      {/* Bottom Row: Recent Notifications */}
      <div className={`p-5 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
          Recent Notifications & Alerts
        </h3>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((ntf) => (
            <div 
              key={ntf.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors
                ${darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50/50 border-slate-100'}
                ${!ntf.read ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex items-center space-x-3.5">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0
                  ${ntf.type === 'Warning' ? 'bg-amber-500' : ntf.type === 'Danger' ? 'bg-rose-500' : 'bg-primary'}`}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-100">{ntf.title}</span>
                  <span className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">{ntf.message}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(ntf.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {!ntf.read && (
                  <button 
                    onClick={() => markNotificationRead(ntf.id)}
                    className="text-[10px] text-primary font-bold hover:underline"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
