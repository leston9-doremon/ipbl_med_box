import React from 'react';
import { useMedical } from '../contexts/MedicalContext';
import { useUI } from '../contexts/UIContext';
import { 
  Activity, 
  Thermometer, 
  Clock, 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  Grid
} from 'lucide-react';

// Helper to convert minutes since midnight to readable AM/PM time
const formatMinutesToTime = (minutes) => {
  if (minutes === null || minutes === undefined) return '--';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 || 12;
  const displayMins = mins < 10 ? '0' + mins : mins;
  return `${displayHrs}:${displayMins} ${ampm}`;
};

export const SupabaseHardwarePanel = () => {
  const { darkMode } = useUI();
  const { 
    dbSchedule, 
    dbSensorLog, 
    dbDispenseLogs, 
    dbLoading, 
    dbError 
  } = useMedical();

  // Loading state render
  if (dbLoading && dbSchedule.length === 0) {
    return (
      <div className={`p-8 rounded-medical border shadow-sm flex flex-col items-center justify-center space-y-4 text-center min-h-[300px]
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <div>
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Connecting to IoT Smartbox</h3>
          <p className="text-xs text-slate-400 mt-1">Establishing real-time Supabase socket channel...</p>
        </div>
      </div>
    );
  }

  // Error state render
  if (dbError) {
    return (
      <div className={`p-8 rounded-medical border shadow-sm flex flex-col items-center justify-center space-y-4 text-center min-h-[300px]
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Supabase Connection Error</h3>
          <p className="text-xs text-rose-500 font-medium mt-1.5 px-4 py-2 bg-rose-500/5 rounded-xl border border-rose-500/10">
            {dbError}
          </p>
          <p className="text-[10px] text-slate-400 mt-3">Check your network connection and .env configurations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Hardware Status Header */}
      <div className={`p-4 rounded-medical border shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Database size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-850 dark:text-white">Supabase Hardware Integration</h2>
            <p className="text-[10px] text-slate-400">Live IoT micro-controller logs and active dispensing rules</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-emerald-500">Live Syncing</span>
        </div>
      </div>

      {/* Live Vitals Gauge & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Sensor Readings Card */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200/80'}`}>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">IoT Sensor Telemetry</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Live Readings</h3>
          </div>

          {/* BPM & Temp displays */}
          <div className="grid grid-cols-2 gap-4 py-6">
            
            {/* Heart Rate (BPM) */}
            <div className={`p-4 rounded-xl border flex flex-col items-center text-center
              ${darkMode ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2">
                <Activity size={18} />
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-400">Pulse</span>
              <span className="text-2xl font-extrabold font-mono text-slate-850 dark:text-white mt-1">
                {dbSensorLog?.bpm !== null && dbSensorLog?.bpm !== undefined ? dbSensorLog.bpm : '--'}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">BPM</span>
            </div>

            {/* Temperature (°C) */}
            <div className={`p-4 rounded-xl border flex flex-col items-center text-center
              ${darkMode ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                <Thermometer size={18} />
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-400">Temp</span>
              <span className="text-2xl font-extrabold font-mono text-slate-850 dark:text-white mt-1">
                {dbSensorLog?.temp_c !== null && dbSensorLog?.temp_c !== undefined ? `${dbSensorLog.temp_c}°` : '--'}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Celsius</span>
            </div>

          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 flex justify-between items-center text-[10px] text-slate-400">
            <span>Last Sync</span>
            <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">
              {dbSensorLog?.recorded_at 
                ? new Date(dbSensorLog.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                : 'No data'}
            </span>
          </div>
        </div>

        {/* Middle Column: Active Schedule (15 Compartments) */}
        <div className={`lg:col-span-2 p-6 rounded-medical border shadow-sm flex flex-col
          ${darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200/80'}`}>
          <div className="mb-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">15-Slot Compartments Grid</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">Active Dispenser Schedule</h3>
          </div>

          {/* Grid layout for 15 slots */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 my-auto py-2">
            {Array.from({ length: 15 }, (_, i) => {
              const sectionNum = i + 1;
              const sched = dbSchedule.find(s => s.section === sectionNum);
              const isScheduled = sched && sched.minutes !== null;
              
              return (
                <div 
                  key={sectionNum}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all duration-200
                    ${isScheduled 
                      ? 'border-primary/30 bg-primary/5 text-primary' 
                      : darkMode 
                        ? 'bg-slate-950/40 border-slate-850 text-slate-500' 
                        : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}
                >
                  <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">Sec {sectionNum}</span>
                  <span className="text-xs font-bold font-mono mt-1.5">
                    {isScheduled ? formatMinutesToTime(sched.minutes) : '--:--'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Dispense Logs History */}
      <div className={`p-6 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            Dispense Event History (Recent 20 Logs)
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">Real-time alerts when dispenser segments are triggered</p>
        </div>

        {dbDispenseLogs.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No dispensing events recorded yet. Ready for hardware signals...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Event ID</th>
                  <th className="pb-3 pr-4">Dispenser Compartment</th>
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {dbDispenseLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-500/5 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 pr-4 font-mono text-slate-400 text-[10px]">#{log.id}</td>

                    {/* Section */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                          {log.section}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Section {log.section}</span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(log.dispensed_at).toLocaleString()}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 pr-4">
                      <span className="px-2 py-0.5 text-[10px] rounded-md font-bold bg-emerald-500/10 text-emerald-500 inline-flex items-center space-x-1">
                        <CheckCircle2 size={10} className="mr-1" />
                        Dispensed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
