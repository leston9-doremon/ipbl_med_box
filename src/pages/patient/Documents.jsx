import React, { useState } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { FolderOpen, Search, Download, Trash, Eye, Calendar, User, FileImage, FileText, Filter } from 'lucide-react';

export const Documents = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { medicalDocuments, deleteDocument } = useMedical();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const patientId = user?.patientId || 'PAT-8802';
  const myDocs = medicalDocuments.filter(d => d.patientId === patientId);

  // Filters types list
  const docTypes = ['All', 'Blood Test', 'MRI', 'CT Scan', 'Lab Report'];

  // Apply filters and searches
  const filteredDocs = myDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.uploaderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || doc.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getDocIcon = (type) => {
    switch (type) {
      case 'MRI':
      case 'CT Scan':
        return <FileImage className="text-purple-500 h-6 w-6" />;
      case 'Blood Test':
        return <FileText className="text-rose-500 h-6 w-6" />;
      default:
        return <FolderOpen className="text-blue-500 h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header bar */}
      <div className={`p-4 rounded-medical border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        {/* Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <div className="text-slate-450 mr-2 flex items-center text-xs font-bold uppercase tracking-wider shrink-0">
            <Filter size={13} className="mr-1" />
            Filter
          </div>
          {docTypes.map(t => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all shrink-0
                ${activeFilter === t 
                  ? 'bg-primary text-white shadow-sm' 
                  : darkMode 
                    ? 'bg-slate-950 border border-slate-800 text-slate-450 hover:text-slate-250' 
                    : 'bg-slate-50 border border-slate-200/80 text-slate-650 hover:bg-slate-100/50'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search report title, uploader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-64 pl-9 pr-4 py-1.5 text-xs rounded-xl border outline-none transition-all
              ${darkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-350 placeholder-slate-600 focus:border-primary/50' 
                : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-primary'}`}
          />
        </div>

      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredDocs.length === 0 ? (
          <div className={`col-span-3 text-center py-20 rounded-medical border 
            ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-xs text-slate-400">No medical reports found matching selected criteria.</span>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between hover-medical-card
                ${darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200/80'}`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center shrink-0">
                    {getDocIcon(doc.type)}
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {doc.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-250 mt-4 leading-normal truncate" title={doc.title}>
                  {doc.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>

                {/* Metadata */}
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <div className="flex items-center text-[10px] text-slate-400">
                    <User size={13} className="mr-1.5 text-primary" />
                    <span className="truncate">Uploaded by: <b className="font-semibold text-slate-600 dark:text-slate-350">{doc.uploaderName}</b></span>
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400">
                    <Calendar size={13} className="mr-1.5 text-primary" />
                    <span>Upload Date: <b className="font-semibold text-slate-650 dark:text-slate-350">{doc.uploadDate}</b></span>
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="border-t border-slate-100 dark:border-slate-850/80 pt-3 mt-4 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Doc ID: {doc.id}
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="View Document"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    className="p-1.5 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-colors"
                    title="Download Report File"
                  >
                    <Download size={14} />
                  </button>
                  {/* Delete button (only show for user/guardian uploaded docs) */}
                  {doc.uploaderRole === 'Guardian' && (
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Report File"
                    >
                      <Trash size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
