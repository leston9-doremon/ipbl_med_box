import React from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Pill, Clock, Calendar } from 'lucide-react';

export const DoctorSchedule = () => {
  const { selectedPatientId } = useAuth();
  const { darkMode } = useUI();
  const { medicines, patients } = useMedical();

  const patientId = selectedPatientId || 'PAT-8802';
  const activePatient = patients.find(p => p.id === patientId);
  const patientMeds = medicines.filter(m => m.patientId === patientId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-extrabold text-slate-850 dark:text-white leading-tight">Patient Medication Schedule</h2>
        <p className="text-xs text-slate-400 mt-0.5">Active schedule records sync'd to the patient's physical Smart Medicine Box</p>
      </div>

      {/* Grid list of medicines */}
      <div className="grid md:grid-cols-2 gap-6">
        {patientMeds.length === 0 ? (
          <div className={`col-span-2 text-center py-12 rounded-medical border 
            ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-xs text-slate-400">No active medications scheduled for this patient.</span>
          </div>
        ) : (
          patientMeds.map((med) => (
            <div
              key={med.id}
              className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between
                ${darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200'}`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Pill size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-850 dark:text-white leading-normal truncate max-w-[200px]">
                        {med.name}
                      </h3>
                      <span className="text-[10px] text-slate-405 font-semibold block mt-0.5">
                        Dose: {med.dose} • Quantity: {med.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                    ID: {med.id}
                  </span>
                </div>

                {/* Slots */}
                <div className="flex items-center space-x-2 mt-5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${med.morning ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    Morning
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${med.afternoon ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    Midday
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${med.night ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    Night
                  </span>
                </div>

                {/* Instructions grid */}
                <div className={`mt-5 p-3 rounded-xl border grid grid-cols-2 gap-4 text-xs
                  ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Scheduled Time</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 block mt-0.5">
                      {med.exactTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Food Instructions</span>
                    <span className="font-semibold text-primary block mt-0.5">
                      {med.timingType || 'With Food'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Directions</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-350 block mt-0.5">
                      {med.instructions || 'Take with water'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box slot Indicator */}
              <div className="border-t border-slate-100 dark:border-slate-850/80 pt-3 mt-5 flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Box Slot: <b className="text-primary font-bold">Compartment {med.boxSlot}</b></span>
                <span className="text-slate-500 font-medium flex items-center">
                  <Calendar size={12} className="mr-1 text-slate-400" />
                  {med.duration} (Start: {med.startDate})
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
