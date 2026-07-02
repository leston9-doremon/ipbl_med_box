import React, { useState } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { FileText, Search, Download, Eye, Calendar, User, FileSignature, ArrowRight } from 'lucide-react';

export const GuardianPrescriptions = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { prescriptions } = useMedical();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);

  const patientId = user?.patientId || 'PAT-8802';
  const myPrescriptions = prescriptions.filter(rx => rx.patientId === patientId);

  const filteredRx = myPrescriptions.filter(rx => 
    rx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      
      {/* Prescriptions List Table */}
      <div className={`lg:col-span-2 p-6 rounded-medical border shadow-sm flex flex-col justify-between
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-850 dark:text-white">Prescriptions Registry</h2>
              <p className="text-xs text-slate-405 dark:text-slate-400 mt-0.5">Doctor directives for the monitored patient</p>
            </div>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-60 pl-9 pr-4 py-1.5 text-xs rounded-xl border outline-none transition-all
                  ${darkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-355 placeholder-slate-500 focus:border-primary/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-primary'}`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-2">Prescription Title</th>
                  <th className="pb-3 pr-2">Prescribed By</th>
                  <th className="pb-3 pr-2">Upload Date</th>
                  <th className="pb-3 pr-2">Version</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
                {filteredRx.map((rx) => (
                  <tr key={rx.id} className="group hover:bg-slate-500/5 transition-colors">
                    {/* Title */}
                    <td className="py-4 pr-2 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{rx.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{rx.size}</span>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-4 pr-2 text-slate-500">
                      <span className="font-semibold">{rx.doctorName}</span>
                    </td>

                    {/* Date */}
                    <td className="py-4 pr-2 text-slate-500 font-mono">{rx.uploadDate}</td>

                    {/* Version */}
                    <td className="py-4 pr-2 text-slate-500">
                      <span className="bg-slate-105 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">
                        {rx.version}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedRx(rx)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Open Prescription Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="p-1.5 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-colors"
                          title="Download PDF File"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Prescription Detail Preview Panel */}
      <div className={`p-6 rounded-medical border shadow-sm flex flex-col justify-between
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        {selectedRx ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-extrabold text-slate-850 dark:text-white">Care Plan Details</h2>
              <span className="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded uppercase">
                {selectedRx.id}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 dark:bg-slate-950/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Document Title</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block mt-1">{selectedRx.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3 rounded-lg border border-slate-150 bg-slate-50/50 dark:bg-slate-950/60 dark:border-slate-800 flex items-center space-x-2.5">
                  <User size={15} className="text-primary" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block">Doctor</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate block">
                      {selectedRx.doctorName.split('. ')[1]}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-150 bg-slate-50/50 dark:bg-slate-950/60 dark:border-slate-800 flex items-center space-x-2.5">
                  <Calendar size={15} className="text-primary" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block">Signed Date</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate block">
                      {selectedRx.uploadDate}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Instructions & Notes</span>
                <div className={`mt-1.5 p-4 rounded-xl border text-xs leading-relaxed text-slate-550 dark:text-slate-400 italic
                  ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  "{selectedRx.notes}"
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Digital Signature</span>
                <div className={`mt-1.5 p-3 rounded-xl border flex items-center justify-between
                  ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
                  <div className="flex items-center space-x-2.5">
                    <FileText size={15} className="text-teal-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {selectedRx.signature}
                    </span>
                  </div>
                  <span className="text-[9px] text-emerald-500 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-primary/25 transition-all mt-4"
              >
                <span>Preview PDF Document</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 text-xs flex flex-col items-center justify-center space-y-3.5">
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <FileText size={20} />
            </div>
            <span>Select a prescription to view clinical instructions.</span>
          </div>
        )}
      </div>

    </div>
  );
};
