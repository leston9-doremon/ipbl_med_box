import React, { useState } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { FolderOpen, Search, Download, Trash, Eye, Upload, FileSignature, FileText, AlertCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuardianDocuments = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { medicalDocuments, uploadDocument, deleteDocument } = useMedical();
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form States
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Blood Test');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const patientId = user?.patientId || 'PAT-8802';
  const myDocs = medicalDocuments.filter(d => d.patientId === patientId);

  // Search filter
  const filteredDocs = myDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.uploaderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!title || !fileName) return;

    const docData = {
      patientId,
      title,
      type: docType,
      uploaderName: user.name,
      uploaderRole: user.role,
      fileUrl: fileName,
      size: '2.5 MB'
    };

    uploadDocument(docData);
    
    // Clear & Success alert
    setTitle('');
    setFileName('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      
      {/* Upload Form Panel */}
      <div className={`p-6 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="text-base font-extrabold text-slate-850 dark:text-white mb-6">Upload Lab Report</h2>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          {uploadSuccess && (
            <div className="text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl font-bold flex items-center">
              <Check size={14} className="mr-1.5" />
              Document uploaded successfully!
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Report Description Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Lipids Panel Results"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border outline-none
                ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Report Category</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className={`w-full mt-1.5 px-3 py-2.5 rounded-xl border outline-none bg-inherit
                ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
            >
              <option value="Blood Test">Blood Test</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
              <option value="Lab Report">Lab Report</option>
            </select>
          </div>

          {/* Drag and Drop Zone */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Document File (PDF / PNG)</label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-1.5 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center
                ${dragOver ? 'border-primary bg-primary/5' : 'border-slate-200/80 dark:border-slate-800'}
                ${fileName ? 'bg-slate-500/5' : ''}`}
            >
              <Upload className={`h-8 w-8 ${fileName ? 'text-primary' : 'text-slate-405'} mb-2.5`} />
              
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {fileName ? (
                  <span className="font-bold text-slate-700 dark:text-slate-300 block max-w-[200px] truncate">
                    {fileName}
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-primary block">Click to select files</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">or drag and drop PDF / image reports here</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-primary/25 transition-all mt-4"
          >
            <Upload size={14} />
            <span>Upload Document</span>
          </button>
        </form>
      </div>

      {/* Uploads List */}
      <div className={`lg:col-span-2 p-6 rounded-medical border shadow-sm flex flex-col justify-between
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-850 dark:text-white">Uploaded Documents</h2>
              <p className="text-xs text-slate-405 dark:text-slate-400 mt-0.5">Records repository for patient reports</p>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-52 pl-9 pr-4 py-1.5 text-xs rounded-xl border outline-none transition-all
                  ${darkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-350 placeholder-slate-650 focus:border-primary/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-750 placeholder-slate-450 focus:border-primary'}`}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-105 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-2">Report Description</th>
                  <th className="pb-3 pr-2">Category</th>
                  <th className="pb-3 pr-2">Uploaded By</th>
                  <th className="pb-3 pr-2">Date</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="group hover:bg-slate-500/5 transition-colors">
                    {/* Title */}
                    <td className="py-4 pr-2 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex flex-col min-w-0">
                        <span className="truncate max-w-[150px]">{doc.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal mt-0.5">{doc.size}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 pr-2 text-slate-500 font-semibold">{doc.type}</td>

                    {/* Uploader */}
                    <td className="py-4 pr-2 text-slate-550 truncate max-w-[100px]">
                      {doc.uploaderName}
                    </td>

                    {/* Date */}
                    <td className="py-4 pr-2 text-slate-500 font-mono">{doc.uploadDate}</td>

                    {/* Actions */}
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="p-1.5 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                        {/* Only allow Guardian to delete Guardian uploads */}
                        {doc.uploaderRole === 'Guardian' && (
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete File"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
