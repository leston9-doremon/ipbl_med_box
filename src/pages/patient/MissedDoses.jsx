import React from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { AlertOctagon, MessageSquare, Clipboard, User, HeartHandshake } from 'lucide-react';

export const MissedDoses = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { medicineLogs } = useMedical();

  const patientId = user?.patientId || 'PAT-8802';
  // Filter all missed logs for this patient
  const missedLogs = medicineLogs.filter(
    (log) => log.patientId === patientId && log.status === 'Missed'
  );

  return (
    <div className="space-y-6">
      
      {/* Page Description Header */}
      <div className={`p-4 rounded-medical border flex items-center space-x-4
        ${darkMode ? 'bg-amber-500/5 border-amber-500/20 text-amber-450' : 'bg-amber-50 border-amber-200/60 text-amber-700'}`}>
        <AlertOctagon size={24} className="shrink-0" />
        <div className="text-xs leading-relaxed">
          <span className="font-extrabold block">Medication Compliance Advisory</span>
          Our records show missed medication alarms. Consistent dosage is critical for heart valve stabilization. Guardian alerts have been dispatched automatically.
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {missedLogs.length === 0 ? (
          <div className={`col-span-2 text-center py-12 rounded-medical border 
            ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-xs text-slate-400">Excellent! No missed dosages recorded in your active history.</span>
          </div>
        ) : (
          missedLogs.map((log) => (
            <div
              key={log.id}
              className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between hover-medical-card
                ${darkMode 
                  ? 'bg-slate-900/50 border-rose-500/25 hover:border-rose-500/40' 
                  : 'bg-white border-rose-200 hover:border-rose-300'}`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                      <AlertOctagon size={18} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">
                        {log.medicineName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Dose: {log.dose} • Slot: {log.slot}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Missed Dose
                  </span>
                </div>

                {/* Details list */}
                <div className={`mt-5 p-3 rounded-xl border grid grid-cols-2 gap-4 text-xs
                  ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Scheduled Time</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 block mt-0.5">
                      {log.scheduledTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Date</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 block mt-0.5">
                      {log.date}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Logged Reason</span>
                    <span className="font-semibold text-rose-500 block mt-0.5">
                      {log.missedReason || 'Sensor reported compartment remained unopened.'}
                    </span>
                  </div>
                </div>

                {/* Notes (Doctor & Guardian) */}
                <div className="space-y-3 mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  {log.doctorNote && (
                    <div className="flex items-start space-x-2.5">
                      <Clipboard size={14} className="text-primary shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Doctor Instruction:</span>
                        <p className="text-slate-500 dark:text-slate-400 italic">"{log.doctorNote}"</p>
                      </div>
                    </div>
                  )}

                  {log.guardianNote && (
                    <div className="flex items-start space-x-2.5">
                      <HeartHandshake size={14} className="text-teal-500 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">Guardian Note:</span>
                        <p className="text-slate-500 dark:text-slate-400 italic">"{log.guardianNote}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status footer */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-5 text-[10px] text-slate-400 flex justify-between">
                <span>Alert ID: {log.id}</span>
                <span className="font-semibold">Review Pending</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
