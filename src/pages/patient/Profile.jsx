import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMedical } from '../../contexts/MedicalContext';
import { useUI } from '../../contexts/UIContext';
import { User, Activity, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { patients } = useMedical();

  const patientId = user?.patientId || 'PAT-8802';
  const patient = patients.find(p => p.id === patientId) || patients[0];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      
      {/* Patient EMR ID Card */}
      <div className={`p-6 rounded-medical border shadow-sm md:col-span-1 flex flex-col items-center justify-between text-center
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="w-full flex flex-col items-center">
          <img
            src={patient.photo}
            alt={patient.name}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/20 mb-4"
          />
          <h2 className="text-base font-extrabold text-slate-850 dark:text-white leading-none">
            {patient.name}
          </h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">
            Patient ID: {patient.id}
          </span>

          <div className="w-full grid grid-cols-2 gap-3 mt-6 text-xs text-left">
            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Age</span>
              <span className="font-bold text-slate-700 dark:text-slate-200 block mt-0.5">{patient.age} yrs</span>
            </div>
            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Gender</span>
              <span className="font-bold text-slate-700 dark:text-slate-200 block mt-0.5">{patient.gender}</span>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 flex justify-between items-center text-xs">
          <span className="text-slate-400">Box Sync</span>
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center">
            <CheckCircle2 size={12} className="mr-1 animate-pulse" />
            Online
          </span>
        </div>
      </div>

      {/* Clinical Profile details */}
      <div className={`p-6 rounded-medical border shadow-sm md:col-span-2 flex flex-col justify-between
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h2 className="text-base font-extrabold text-slate-850 dark:text-white">EMR Medical Profile</h2>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">Clinical metrics logged in the central hospital directory</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-xs">
            {/* Condition */}
            <div className="p-3.5 rounded-xl border border-rose-250 bg-rose-500/5 dark:border-rose-900/30">
              <div className="flex items-center space-x-2 text-rose-500 font-bold">
                <ShieldAlert size={15} />
                <span>Active Diagnosis</span>
              </div>
              <span className="font-semibold text-slate-750 dark:text-slate-300 block mt-1.5">
                {patient.condition}
              </span>
            </div>

            {/* Blood Type */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between
              ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2 text-slate-500">
                <Heart size={15} className="text-rose-500" />
                <span className="font-semibold text-slate-600 dark:text-slate-400">Blood Group</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-white">{patient.bloodGroup}</span>
            </div>

            {/* Heights / Weights */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between
              ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-semibold text-slate-600 dark:text-slate-400">Height</span>
              <span className="font-bold text-slate-850 dark:text-slate-200">{patient.height}</span>
            </div>
            <div className={`p-3.5 rounded-xl border flex items-center justify-between
              ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-semibold text-slate-600 dark:text-slate-400">Weight</span>
              <span className="font-bold text-slate-850 dark:text-slate-200">{patient.weight}</span>
            </div>

            {/* Hardware sync */}
            <div className={`p-3.5 rounded-xl border md:col-span-2 flex items-center justify-between
              ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2.5">
                <Cpu size={15} className="text-primary" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 dark:text-slate-350">Smart Medicine Box Device</span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400">Registred Unit Address</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{patient.boxId}</span>
            </div>
          </div>
        </div>

        {/* EMR Footer disclaimer */}
        <span className="text-[9px] text-slate-400 uppercase font-semibold text-center border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-6">
          Record locked by metropolitan health board • HIPAA code #10A-3801
        </span>
      </div>

    </div>
  );
};
