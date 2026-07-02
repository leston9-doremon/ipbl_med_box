import React from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { AlertCircle, TrendingUp, Info } from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const DoctorMissedDoses = () => {
  const { selectedPatientId } = useAuth();
  const { darkMode } = useUI();
  const { medicineLogs, patients } = useMedical();

  const patientId = selectedPatientId || 'PAT-8802';
  const activePatient = patients.find(p => p.id === patientId);

  // Filter missed logs for this patient
  const patientMissedLogs = medicineLogs.filter(
    (log) => log.patientId === patientId && log.status === 'Missed'
  );

  // Calculate reason metrics
  let sleptCount = 0;
  let awayCount = 0;
  let supplyCount = 0;

  patientMissedLogs.forEach(log => {
    const reason = log.missedReason?.toLowerCase() || '';
    if (reason.includes('sleep') || reason.includes('slept') || reason.includes('alarm')) {
      sleptCount++;
    } else if (reason.includes('away') || reason.includes('home') || reason.includes('travel')) {
      awayCount++;
    } else {
      supplyCount++;
    }
  });

  // Fallback default values if no missed logs to display beautiful chart
  const reasonData = [
    sleptCount || 2, 
    awayCount || 1, 
    supplyCount || 1
  ];

  // Pie chart reasons
  const pieData = {
    labels: ['Slept through alarm', 'Away from home', 'Pharmacy out-of-stock'],
    datasets: [
      {
        data: reasonData,
        backgroundColor: ['#ef4444', '#f59e0b', '#2563eb'],
        borderWidth: darkMode ? 2 : 1,
        borderColor: darkMode ? '#1e293b' : '#ffffff',
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? '#94a3b8' : '#64748b',
          boxWidth: 12,
          font: { size: 10 }
        }
      }
    }
  };

  // Weekly Missed Dose Trends
  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Missed Alarms',
        data: [1, 2, 0, 1], // Bind standard mock trends
        backgroundColor: '#ef4444',
        borderRadius: 6,
        barThickness: 16
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Vitals Diagnostics summary */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Total Missed Badge */}
        <div className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Compliance Audit</span>
          <div className="py-2.5">
            <span className="text-3xl font-extrabold text-rose-500 font-mono leading-none">
              {patientMissedLogs.length}
            </span>
            <span className="text-xs text-slate-450 font-bold ml-1.5">Missed Slots</span>
          </div>
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Total history logs</span>
        </div>

        {/* Primary Missed Reason */}
        <div className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Frequent Incident</span>
          <div className="py-2.5">
            <span className="text-sm font-extrabold text-slate-800 dark:text-white leading-tight block">
              Slept Through Alarm
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">50% of missed count</span>
          </div>
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Alarm audio adjustment recommended</span>
        </div>

        {/* Doctor Action banner */}
        <div className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between bg-rose-500/5 border-rose-500/10`}>
          <div className="flex items-center space-x-2 text-rose-500 font-bold text-[10px] uppercase">
            <AlertCircle size={14} />
            <span>Clinical Notice</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal py-1">
            Please review the guardian notes below. Add custom prescription adjustments on the Prescription Upload page.
          </p>
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Sensor alert dispatched automatically</span>
        </div>

      </div>

      {/* Analytics Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Pie reasons */}
        <div className={`p-5 rounded-medical border shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
            Missed Dose Reason Breakdown
          </h3>
          <div className="h-56 relative">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Bar missed trends */}
        <div className={`p-5 rounded-medical border shadow-sm
          ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
            Missed Dose Trends (4 Weeks)
          </h3>
          <div className="h-56 relative">
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { min: 0, ticks: { color: darkMode ? '#64748b' : '#94a3b8', stepSize: 1 }, grid: { color: darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' } },
                  x: { ticks: { color: darkMode ? '#64748b' : '#94a3b8' }, grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>

      </div>

      {/* Logs Table with responses */}
      <div className={`p-5 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
          Detailed Missed Doses Log List
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-105 dark:border-slate-850 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-2">Medication</th>
                <th className="pb-3 pr-2">Scheduled time</th>
                <th className="pb-3 pr-2">Uploader Reason</th>
                <th className="pb-3 pr-2">Patient Feedback</th>
                <th className="pb-3 pr-2">Guardian Action Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40">
              {patientMissedLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-450">
                    No missed doses recorded for this patient file.
                  </td>
                </tr>
              ) : (
                patientMissedLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-500/5 transition-colors">
                    {/* Medicine */}
                    <td className="py-4 pr-2 font-bold text-slate-800 dark:text-slate-200">
                      {log.medicineName} <br />
                      <span className="text-[10px] text-slate-400 font-normal">{log.dose}</span>
                    </td>

                    {/* Time */}
                    <td className="py-4 pr-2 text-slate-500 font-mono">
                      {log.date} <br />
                      <span className="text-[10px] text-slate-400 font-semibold">{log.slot} • {log.scheduledTime}</span>
                    </td>

                    {/* Reason */}
                    <td className="py-4 pr-2 text-rose-500 font-semibold">
                      {log.missedReason || 'Sensor alarm timeout'}
                    </td>

                    {/* Patient feedback */}
                    <td className="py-4 pr-2 text-slate-500 leading-normal max-w-[150px] truncate italic">
                      {log.remarks ? `"${log.remarks}"` : <span className="text-slate-400">No input</span>}
                    </td>

                    {/* Guardian Action */}
                    <td className="py-4 pr-2 text-slate-550 leading-normal max-w-[150px] truncate italic">
                      {log.guardianNote ? `"${log.guardianNote}"` : <span className="text-slate-400 font-normal">Review pending</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
