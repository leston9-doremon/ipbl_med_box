import React, { useState, useEffect } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Calendar, 
  Clock, 
  Plus, 
  Upload, 
  PhoneCall, 
  User, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const GuardianDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { medicineLogs, telemetry, patients, notifications } = useMedical();
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const patientId = user?.patientId || 'PAT-8802';
  const patient = patients.find(p => p.id === patientId);

  // Calculate stats
  const todayStr = new Date().toISOString().split('T')[0];
  const patientTodayLogs = medicineLogs.filter(
    (log) => log.patientId === patientId && log.date === todayStr
  );
  const takenCount = patientTodayLogs.filter((l) => l.status === 'Taken').length;
  const missedCount = patientTodayLogs.filter((l) => l.status === 'Missed').length;
  const totalCount = patientTodayLogs.length;
  const completionPercentage = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  // Chart configs (similar to patient, matching guidelines)
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Compliance',
        data: [90, 80, 100, 85, 95, 60, completionPercentage],
        backgroundColor: '#14b8a6',
        borderRadius: 8,
        barThickness: 16,
      }
    ]
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        fill: true,
        label: 'Adherence',
        data: [82, 88, 75, 92],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        tension: 0.35,
        borderWidth: 2.5,
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Panel */}
      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Guardian Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Supervising patient: <b className="text-primary font-bold">{patient?.name}</b> • Age: {patient?.age} • EMR ID: {patient?.id}
          </p>
        </div>

        {/* Date / Time Badge */}
        <div className={`p-4 rounded-medical border flex items-center justify-between shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase">System Time</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-850 dark:text-slate-200 pl-4 border-l border-slate-100 dark:border-slate-800">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Compliance Progress Ring */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Patient Status</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Today's Adherence</h3>
          </div>

          <div className="flex items-center justify-around py-2">
            <div className="relative h-20 w-20">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke={darkMode ? '#1e293b' : '#f1f5f9'} strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14b8a6" strokeWidth="3.5" strokeDasharray={`${completionPercentage} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold font-mono text-slate-850 dark:text-white">{completionPercentage}%</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1 text-xs">
              <span className="text-emerald-500 font-semibold">{takenCount} Taken</span>
              <span className="text-rose-500 font-semibold">{missedCount} Missed</span>
              <span className="text-slate-400">{totalCount - (takenCount + missedCount)} Pending</span>
            </div>
          </div>
        </div>

        {/* Patient Vitals Readonly */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Patient Telemetry</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Live Readings</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center pulse-animation shrink-0">
                <Heart size={18} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Heart Rate</span>
                <span className="text-sm font-extrabold font-mono text-slate-850 dark:text-white">
                  {telemetry.vitals.heartRate} <span className="text-[9px] font-normal text-slate-400">BPM</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Thermometer size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Temp</span>
                <span className="text-sm font-extrabold font-mono text-slate-850 dark:text-white">
                  {telemetry.vitals.temperature} <span className="text-[9px] font-normal text-slate-400">°C</span>
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px]">
            <span className="text-slate-400 font-semibold">ECG Status</span>
            <span className="font-extrabold text-emerald-500 uppercase">{telemetry.vitals.ecgStatus}</span>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Guardian Admin</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-3 gap-2.5 py-1">
            <button
              onClick={() => navigate('/guardian/schedule')}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-150 dark:border-slate-800 hover:bg-slate-500/5 transition-colors text-center"
            >
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1.5">
                <Plus size={15} />
              </div>
              <span className="text-[9px] font-bold text-slate-650 dark:text-slate-300">Add Pill</span>
            </button>

            <button
              onClick={() => navigate('/guardian/documents')}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-150 dark:border-slate-800 hover:bg-slate-500/5 transition-colors text-center"
            >
              <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center mb-1.5">
                <Upload size={15} />
              </div>
              <span className="text-[9px] font-bold text-slate-650 dark:text-slate-300">Upload Doc</span>
            </button>

            <button
              onClick={() => navigate('/guardian/contacts')}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-150 dark:border-slate-800 hover:bg-slate-500/5 transition-colors text-center"
            >
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-1.5">
                <PhoneCall size={15} />
              </div>
              <span className="text-[9px] font-bold text-slate-650 dark:text-slate-300">Contacts</span>
            </button>
          </div>
        </div>

      </div>

      {/* Compliance Trends charts */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Weekly Adherence Chart */}
        <div className={`p-5 rounded-medical border shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
            Patient Weekly Adherence Compliance
          </h3>
          <div className="h-56 relative">
            <Bar 
              data={weeklyData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { min: 0, max: 100, ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { color: darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' } },
                  x: { ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>

        {/* Monthly Adherence Chart */}
        <div className={`p-5 rounded-medical border shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
            Patient Monthly Adherence Compliance
          </h3>
          <div className="h-56 relative">
            <Line 
              data={lineData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { min: 0, max: 100, ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { color: darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' } },
                  x: { ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>

      </div>

      {/* Alert logs list */}
      <div className={`p-5 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
          Patient Exception Log Summary
        </h3>
        
        {/* Missed pill alert */}
        <div className="space-y-3">
          <div className={`p-3 rounded-xl border border-rose-250 bg-rose-500/5 text-rose-550 dark:border-rose-900/35 dark:text-rose-450 flex items-center justify-between text-xs`}>
            <div className="flex items-center space-x-3">
              <AlertTriangle size={15} />
              <div>
                <span className="font-bold">Missed Medication: Low-Dose Aspirin</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Scheduled for 01:00 PM today. Patient missed alarm slot. Notes updated.</span>
              </div>
            </div>
            <Link to="/guardian/missed" className="text-[10px] text-primary font-bold hover:underline shrink-0">
              View Log
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
