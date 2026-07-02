import React, { useState, useEffect } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { ECGCanvas } from '../../components/ECGCanvas';
import { Bar, Line } from 'react-chartjs-2';
import { SupabaseHardwarePanel } from '../../components/SupabaseHardwarePanel';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  FolderOpen,
  ClipboardList
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DoctorDashboard = () => {
  const { selectedPatientId, setSelectedPatientId } = useAuth();
  const { darkMode } = useUI();
  const { medicineLogs, telemetry, patients, notifications, markNotificationRead, dbSensorLog } = useMedical();
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Calculate compliance statistics
  const todayStr = new Date().toISOString().split('T')[0];
  const patientLogs = medicineLogs.filter(
    (log) => log.patientId === activePatient.id && log.date === todayStr
  );
  const takenCount = patientLogs.filter((l) => l.status === 'Taken').length;
  const missedCount = patientLogs.filter((l) => l.status === 'Missed').length;
  const totalCount = patientLogs.length;
  const complianceRate = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  // Chart configs
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Compliance',
        data: [90, 80, 100, 85, 95, 60, complianceRate],
        backgroundColor: '#2563eb',
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
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.05)',
        tension: 0.35,
        borderWidth: 2.5,
      }
    ]
  };

  const activePatientNotifications = notifications.filter(
    (n) => n.patientId === activePatient.id
  );

  return (
    <div className="space-y-6">
      
      {/* Selected Patient Banner */}
      <div className={`p-6 rounded-medical border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        <div className="flex items-center space-x-4">
          <img
            src={activePatient.photo}
            alt={activePatient.name}
            className="h-14 w-14 rounded-full object-cover ring-4 ring-primary/10"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-850 dark:text-white leading-none">
                {activePatient.name}
              </h2>
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                EMR Folder: {activePatient.id}
              </span>
            </div>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1.5 font-semibold">
              Diagnosis: {activePatient.condition}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/doctor/patients')}
            className={`flex-1 md:flex-initial border hover:bg-slate-500/5 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all
              ${darkMode ? 'border-slate-800 text-slate-350' : 'border-slate-205 text-slate-600'}`}
          >
            <FolderOpen size={14} />
            <span>Switch Patient File</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Compliance */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Dosage Rate</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Medication Adherence</h3>
          </div>

          <div className="flex items-center justify-around py-2">
            <div className="relative h-20 w-20">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke={darkMode ? '#1e293b' : '#f1f5f9'} strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="3.5" strokeDasharray={`${complianceRate} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold font-mono text-slate-850 dark:text-white">{complianceRate}%</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1 text-xs">
              <span className="text-emerald-500 font-semibold">{takenCount} Taken</span>
              <span className="text-rose-500 font-semibold">{missedCount} Missed</span>
              <span className="text-slate-400">{totalCount - (takenCount + missedCount)} Pending</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry vitals */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Patient Vitals</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Live Telemetry</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center pulse-animation shrink-0">
                <Heart size={18} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Heart Rate</span>
                <span className="text-sm font-extrabold font-mono text-slate-850 dark:text-white">
                  {dbSensorLog?.bpm !== null && dbSensorLog?.bpm !== undefined ? dbSensorLog.bpm : '--'} <span className="text-[9px] font-normal text-slate-400">BPM</span>
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
                  {dbSensorLog?.temp_c !== null && dbSensorLog?.temp_c !== undefined ? `${dbSensorLog.temp_c}` : '--'} <span className="text-[9px] font-normal text-slate-400">°C</span>
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px]">
            <span className="text-slate-400 font-semibold">Diagnostic</span>
            <span className="font-extrabold text-emerald-500 uppercase">{telemetry.vitals.ecgStatus}</span>
          </div>
        </div>

        {/* Supabase Hardware Integration Panel */}
        <SupabaseHardwarePanel />

        {/* EMR Registry Quicklinks */}
        <div className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Clinical Admin</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">EMR Workflows</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <button
              onClick={() => navigate('/doctor/prescription-upload')}
              className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 hover:bg-slate-500/5 transition-colors text-center"
            >
              <ClipboardList size={14} className="text-primary" />
              <span className="text-[10px] font-bold text-slate-650 dark:text-slate-300">New Prescription</span>
            </button>

            <button
              onClick={() => navigate('/doctor/patient-profile')}
              className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 hover:bg-slate-500/5 transition-colors text-center"
            >
              <Activity size={14} className="text-teal-500" />
              <span className="text-[10px] font-bold text-slate-650 dark:text-slate-300">EMR Profile</span>
            </button>
          </div>
        </div>

      </div>

      {/* Live ECG Canvas */}
      <div className={`p-5 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
          Live Lead II Waveform Monitor
        </h3>
        <ECGCanvas heartRate={dbSensorLog?.bpm || telemetry.vitals.heartRate} height={140} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
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

      {/* Alerts */}
      <div className={`p-5 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
          EMR Clinical Notifications ({activePatientNotifications.length})
        </h3>
        
        <div className="space-y-3">
          {activePatientNotifications.map((ntf) => (
            <div 
              key={ntf.id}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs
                ${darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-100'}
                ${!ntf.read ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex items-center space-x-3.5">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0
                  ${ntf.type === 'Warning' ? 'bg-amber-505' : ntf.type === 'Danger' ? 'bg-rose-500' : 'bg-primary'}`}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-850 dark:text-slate-100">{ntf.title}</span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">{ntf.message}</span>
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
                    Mark Reviewed
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
