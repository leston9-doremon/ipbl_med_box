import React from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useUI } from '../../contexts/UIContext';
import { ECGCanvas } from '../../components/ECGCanvas';
import { Line } from 'react-chartjs-2';
import { Heart, Thermometer, Activity, AlertCircle, RefreshCw } from 'lucide-react';

export const GuardianVitals = () => {
  const { darkMode } = useUI();
  const { telemetry } = useMedical();

  const pulseChartData = {
    labels: telemetry.pulseHistory.map((h) => h.label),
    datasets: [
      {
        label: 'Pulse (BPM)',
        data: telemetry.pulseHistory.map((h) => h.value),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: '#ef4444',
      }
    ]
  };

  const pulseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 50, max: 120, ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { color: darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' } },
      x: { ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { display: false } }
    }
  };

  const tempChartData = {
    labels: telemetry.tempHistory.map((h) => h.label),
    datasets: [
      {
        label: 'Body Temp (°C)',
        data: telemetry.tempHistory.map((h) => h.value),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#f59e0b',
      }
    ]
  };

  const tempChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 35.5, max: 38.5, ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { color: darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' } },
      x: { ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { display: false } }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Vitals Summary Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Pulse */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Patient Pulse</span>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="flex items-center space-x-4 py-4">
            <div className="h-11 w-11 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center pulse-animation shrink-0">
              <Heart size={22} fill="currentColor" />
            </div>
            <div>
              <span className="text-3xl font-extrabold font-mono text-slate-850 dark:text-white leading-none">
                {telemetry.vitals.heartRate}
              </span>
              <span className="text-xs text-slate-400 font-bold ml-1">BPM</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px]">
            <span className="text-slate-400">Normal Bounds</span>
            <span className="font-bold text-slate-650 dark:text-slate-350">60 - 100 BPM</span>
          </div>
        </div>

        {/* Temp */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Patient Temp</span>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="flex items-center space-x-4 py-4">
            <div className="h-11 w-11 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <Thermometer size={22} />
            </div>
            <div>
              <span className="text-3xl font-extrabold font-mono text-slate-850 dark:text-white leading-none">
                {telemetry.vitals.temperature}
              </span>
              <span className="text-xs text-slate-400 font-bold ml-1">°C</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px]">
            <span className="text-slate-400">Normal Bounds</span>
            <span className="font-bold text-slate-650 dark:text-slate-350">36.1 - 37.2 °C</span>
          </div>
        </div>

        {/* Status */}
        <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Cardiogram Diagnostic</span>
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          </div>
          <div className="flex items-center space-x-4 py-4">
            <div className="h-11 w-11 bg-teal-500/10 text-teal-500 rounded-xl flex items-center justify-center shrink-0">
              <Activity size={22} />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-extrabold text-slate-850 dark:text-white truncate block leading-tight">
                {telemetry.vitals.ecgStatus}
              </span>
              <span className="text-[9px] text-slate-450 dark:text-slate-550 block">Telemetry active</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px]">
            <span className="text-slate-400">Medical State</span>
            <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {telemetry.vitals.healthStatus}
            </span>
          </div>
        </div>

      </div>

      {/* Live Waveform */}
      <div className={`p-6 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Patient Live ECG Waveform Feed
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Continuous data parsed via Smartbox sensors</p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono flex items-center">
            <RefreshCw size={11} className="mr-1 animate-spin-slow" />
            60 Hz filter active
          </span>
        </div>
        <ECGCanvas heartRate={telemetry.vitals.heartRate} height={150} />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Pulse history chart */}
        <div className={`p-5 rounded-medical border shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
            Heart Rate Trend (Today)
          </h3>
          <div className="h-64 relative">
            <Line data={pulseChartData} options={pulseChartOptions} />
          </div>
        </div>

        {/* Temperature history chart */}
        <div className={`p-5 rounded-medical border shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
            Body Temperature Trend (Today)
          </h3>
          <div className="h-64 relative">
            <Line data={tempChartData} options={tempChartOptions} />
          </div>
        </div>

      </div>

      {/* Abnormal Telemetry Logs */}
      <div className={`p-5 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
          Telemetry Readings Exceptions
        </h3>
        <div className="space-y-3">
          <div className={`p-3.5 rounded-xl border border-rose-250 bg-rose-500/5 text-rose-550 dark:border-rose-900/35 dark:text-rose-450 flex items-center justify-between text-xs`}>
            <div className="flex items-center space-x-3">
              <AlertCircle size={16} />
              <div>
                <span className="font-bold block">Abnormal Vitals Alarm (Pulse: 104 BPM)</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Recorded at 09:12 AM - Heart rate exceeded threshold of 100 BPM during active period.</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">2026-07-02</span>
          </div>
        </div>
      </div>

    </div>
  );
};
