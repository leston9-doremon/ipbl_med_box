import React, { useState } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Pill, Clock, CheckCircle2, AlertTriangle, Play, HelpCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const TodayMedicines = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { medicineLogs, markMedicineTaken } = useMedical();
  const [remarkInput, setRemarkInput] = useState({});

  const patientId = user?.patientId || 'PAT-8802';
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter logs for today
  const todayLogs = medicineLogs
    .filter((log) => log.patientId === patientId && log.date === todayStr)
    // Sort so taken/upcoming/missed follow chronological order (Morning -> Afternoon -> Night)
    .sort((a, b) => {
      const slotsOrder = { Morning: 1, Afternoon: 2, Night: 3 };
      return slotsOrder[a.slot] - slotsOrder[b.slot];
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Taken':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 size={12} className="mr-1" />
            Taken
          </span>
        );
      case 'Missed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500">
            <AlertTriangle size={12} className="mr-1" />
            Missed
          </span>
        );
      case 'Upcoming':
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500">
            <Clock size={12} className="mr-1" />
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  const handleTakePill = (logId) => {
    const remark = remarkInput[logId] || '';
    markMedicineTaken(logId, remark);
    setRemarkInput(prev => ({ ...prev, [logId]: '' }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* Timeline View */}
      <div className={`p-6 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="text-base font-extrabold text-slate-850 dark:text-white mb-6">Today's Timeline</h2>

        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 pl-6 space-y-6">
          {todayLogs.map((log) => (
            <div key={log.id} className="relative">
              {/* Node Marker */}
              <span className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 flex items-center justify-center
                ${log.status === 'Taken' 
                  ? 'bg-emerald-500 border-emerald-500 text-white ring-4 ring-emerald-500/10' 
                  : log.status === 'Missed'
                    ? 'bg-rose-500 border-rose-500 text-white ring-4 ring-rose-500/10'
                    : 'bg-white border-slate-300 text-slate-300 dark:bg-slate-950 dark:border-slate-800'}`}
              >
                {log.status === 'Taken' && <Check size={10} className="stroke-[3]" />}
              </span>

              {/* Time Label */}
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {log.slot} • {log.scheduledTime}
              </span>

              {/* Box Details */}
              <div className={`mt-1.5 p-3 rounded-xl border text-xs
                ${darkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/60'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{log.medicineName}</span>
                  <span className="text-[9px] bg-slate-200/50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded-md font-semibold text-slate-550">
                    Slot {log.boxSlot || 1}
                  </span>
                </div>
                <div className="text-slate-450 dark:text-slate-400 text-[10px] mt-1">
                  Dosage: {log.dose}
                </div>
                {log.takenTime && (
                  <div className="text-emerald-500 text-[10px] mt-1.5 font-bold">
                    Dispensed at {log.takenTime} ({log.delayMinutes}m delay)
                  </div>
                )}
                {log.status === 'Missed' && (
                  <div className="text-rose-500 text-[10px] mt-1.5 font-bold">
                    Missed. Reason: {log.missedReason}
                  </div>
                )}
                
                {/* Embedded action button for upcoming items */}
                {log.status === 'Upcoming' && (
                  <div className="mt-3 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add remark..."
                      value={remarkInput[log.id] || ''}
                      onChange={(e) => setRemarkInput({ ...remarkInput, [log.id]: e.target.value })}
                      className={`flex-grow px-2 py-1 text-[10px] rounded-md border outline-none
                        ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                    />
                    <button
                      onClick={() => handleTakePill(log.id)}
                      className="bg-primary hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg text-[10px] flex items-center justify-center space-x-1 whitespace-nowrap"
                    >
                      <Play size={10} className="fill-current mr-1" />
                      <span>Mark Taken</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
