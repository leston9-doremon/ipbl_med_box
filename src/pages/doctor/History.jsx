import React from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { CheckCircle2, AlertTriangle, Clock, Pill } from 'lucide-react';

export const DoctorHistory = () => {
  const { selectedPatientId } = useAuth();
  const { darkMode } = useUI();
  const { medicineLogs } = useMedical();

  const patientId = selectedPatientId || 'PAT-8802';
  const myLogs = medicineLogs
    .filter(log => log.patientId === patientId)
    .sort((a, b) => new Date(b.date + ' ' + b.scheduledTime) - new Date(a.date + ' ' + a.scheduledTime));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Taken':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 size={10} className="mr-1" />
            Taken
          </span>
        );
      case 'Missed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500">
            <AlertTriangle size={10} className="mr-1" />
            Missed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500">
            <Clock size={10} className="mr-1" />
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className={`p-6 rounded-medical border shadow-sm
      ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
      
      <div className="mb-6">
        <h2 className="text-base font-extrabold text-slate-850 dark:text-white">Medication Dispensation Logs</h2>
        <p className="text-xs text-slate-400 mt-0.5">Chronological record of pill box slot openings and delays</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="pb-3 pr-2">Medication Details</th>
              <th className="pb-3 pr-2">Scheduled slot</th>
              <th className="pb-3 pr-2">Logged Time</th>
              <th className="pb-3 pr-2">Status</th>
              <th className="pb-3 pr-2">Box Delay</th>
              <th className="pb-3 pr-2">Patient / Caregiver Annotation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40">
            {myLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No log entries recorded for this patient.
                </td>
              </tr>
            ) : (
              myLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-500/5 transition-colors">
                  {/* Name */}
                  <td className="py-4 pr-2 font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0">
                        <Pill size={15} className="text-primary" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span>{log.medicineName}</span>
                        <span className="text-[10px] text-slate-400 font-normal mt-0.5">{log.dose}</span>
                      </div>
                    </div>
                  </td>

                  {/* Scheduled Slot */}
                  <td className="py-4 pr-2 font-semibold text-slate-600 dark:text-slate-350">
                    {log.date} <br />
                    <span className="text-[10px] text-slate-400">{log.slot} • {log.scheduledTime}</span>
                  </td>

                  {/* Taken Time */}
                  <td className="py-4 pr-2 text-slate-500 font-mono">
                    {log.takenTime ? log.takenTime : log.status === 'Missed' ? 'Alarm Timeout' : 'Pending'}
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-2">{getStatusBadge(log.status)}</td>

                  {/* Delay */}
                  <td className="py-4 pr-2 font-semibold font-mono text-slate-500">
                    {log.status === 'Taken' ? (
                      log.delayMinutes > 0 ? (
                        <span className="text-amber-500">+{log.delayMinutes} min</span>
                      ) : (
                        <span className="text-emerald-500">On Time</span>
                      )
                    ) : log.status === 'Missed' ? (
                      <span className="text-rose-500">Alarm Timeout</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>

                  {/* Remarks */}
                  <td className="py-4 pr-2 text-slate-500 leading-normal max-w-[200px] truncate">
                    {log.remarks && (
                      <span className="block font-semibold">Patient: "{log.remarks}"</span>
                    )}
                    {log.guardianNote && (
                      <span className="block text-[10px] text-slate-400 mt-0.5">Guardian: "{log.guardianNote}"</span>
                    )}
                    {!log.remarks && !log.guardianNote && <span className="text-slate-400 italic">No notes</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
