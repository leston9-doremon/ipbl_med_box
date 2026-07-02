import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMedical } from '../../contexts/MedicalContext';
import { useUI } from '../../contexts/UIContext';
import { ShieldCheck, Heart, User, CheckCircle2 } from 'lucide-react';

export const GuardianProfile = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { patients } = useMedical();

  const monitoredPatient = patients.find(p => p.id === user.patientId) || patients[0];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Guardian Profile details */}
      <div className={`p-6 rounded-medical border shadow-sm md:col-span-1 flex flex-col items-center justify-between text-center
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="w-full flex flex-col items-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/20 mb-4"
          />
          <h2 className="text-base font-extrabold text-slate-850 dark:text-white leading-none">
            {user.name}
          </h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5 animate-pulse text-primary">
            Active Health Guardian
          </span>

          <div className={`w-full mt-6 p-4 rounded-xl border text-xs text-left
            ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Designation</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 block mt-0.5">{user.title}</span>
            
            <span className="text-[9px] text-slate-400 font-bold uppercase block mt-3">Auth Role</span>
            <span className="font-semibold text-teal-500 block mt-0.5">{user.role} (HIPAA Authorized)</span>
          </div>
        </div>

        <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 text-[10px] text-slate-400 flex justify-between items-center">
          <span>Security Token</span>
          <span className="font-bold text-slate-500">AUTH-9921-X</span>
        </div>
      </div>

      {/* Monitored Patient Connection profile */}
      <div className={`p-6 rounded-medical border shadow-sm md:col-span-2 flex flex-col justify-between
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h2 className="text-base font-extrabold text-slate-850 dark:text-white">Monitored Patient Accounts</h2>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">Linked profiles synchronizing vitals and alarm records</p>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4
              ${darkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200/60'}`}>
              
              <div className="flex items-center space-x-3.5">
                <img
                  src={monitoredPatient?.photo}
                  alt={monitoredPatient?.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-850 dark:text-white">
                    {monitoredPatient?.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                    ID: {monitoredPatient?.id} • {monitoredPatient?.condition}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-semibold">
                <div className="flex items-center text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">
                  <Heart size={12} className="mr-1" />
                  <span>Vitals Sync</span>
                </div>
                <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <CheckCircle2 size={12} className="mr-1" />
                  <span>Box Linked</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 text-[10px] text-slate-400">
          <ShieldCheck size={14} className="text-primary" />
          <span>Patient records shared in compliance with healthcare data regulations.</span>
        </div>
      </div>

    </div>
  );
};
