import React, { useState } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Search, UserCheck, AlertTriangle, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PatientSelector = () => {
  const { patients } = useMedical();
  const { setSelectedPatientId } = useAuth();
  const { darkMode } = useUI();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    navigate('/doctor/dashboard');
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className={`p-6 rounded-medical border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className="text-base font-extrabold text-slate-850 dark:text-white leading-tight">Patient Records Registry</h2>
          <p className="text-xs text-slate-400 mt-0.5">Search and select patient folders to inspect telemetry, schedules, and clinical histories</p>
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search name, EMR ID, diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-64 pl-9 pr-4 py-1.5 text-xs rounded-xl border outline-none transition-all
              ${darkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-300 placeholder-slate-600 focus:border-primary/50' 
                : 'bg-slate-550/5 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-primary'}`}
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between hover-medical-card
              ${darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200/80'}
              ${patient.status === 'Warning' ? 'border-amber-500/30' : ''}`}
          >
            <div>
              {/* Header: Photo and ID */}
              <div className="flex items-center space-x-3.5">
                <img
                  src={patient.photo}
                  alt={patient.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white">
                    {patient.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {patient.id}
                  </span>
                </div>
              </div>

              {/* Patient details */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] border-b border-slate-100 dark:border-slate-850 pb-4">
                <div className="text-slate-450">
                  Gender: <b className="text-slate-700 dark:text-slate-250 font-semibold">{patient.gender}</b>
                </div>
                <div className="text-slate-450">
                  Age: <b className="text-slate-700 dark:text-slate-250 font-semibold">{patient.age} yrs</b>
                </div>
                <div className="text-slate-450 col-span-2 mt-1">
                  Last Checked: <b className="text-slate-700 dark:text-slate-250 font-semibold">{patient.lastVisit}</b>
                </div>
              </div>

              {/* Diagnosis info */}
              <div className="mt-4">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Diagnosis</span>
                <span className="text-xs font-semibold text-slate-750 dark:text-slate-300 block mt-1 leading-normal truncate">
                  {patient.condition}
                </span>
              </div>
            </div>

            {/* Selector Footer */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-5 flex items-center justify-between">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase
                ${patient.status === 'Stable' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-amber-505/10 text-amber-500'}`}>
                {patient.status}
              </span>

              <button
                onClick={() => handleSelectPatient(patient.id)}
                className="bg-primary hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center space-x-1 transition-colors"
              >
                <span>Access EMR File</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
