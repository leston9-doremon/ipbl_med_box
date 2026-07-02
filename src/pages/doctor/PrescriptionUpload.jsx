import React, { useState, useRef, useEffect } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { ClipboardList, Upload, FileText, Check, HelpCircle, RefreshCw } from 'lucide-react';

export const DoctorPrescriptionUpload = () => {
  const { selectedPatientId } = useAuth();
  const { darkMode } = useUI();
  const { prescriptions, uploadPrescription } = useMedical();
  const [success, setSuccess] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');

  // Signature canvas
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const patientId = selectedPatientId || 'PAT-8802';
  const pastRx = prescriptions.filter(rx => rx.patientId === patientId);

  // Setup drawing canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#2563EB'; // Medical blue pen
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, [darkMode]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!title || !notes) return;

    const rxData = {
      patientId,
      doctorName: 'Dr. Alexander Thorne',
      title,
      notes,
      fileUrl: fileName || 'presc_v2.pdf',
      signature: 'Dr. Alexander Thorne, FACC (Digital Sign)'
    };

    uploadPrescription(rxData);

    // Reset Form
    setTitle('');
    setNotes('');
    setFileName('');
    clearSignature();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      
      {/* Upload Form */}
      <div className={`lg:col-span-2 p-6 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="text-base font-extrabold text-slate-850 dark:text-white mb-6">Create New Treatment Plan</h2>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          {success && (
            <div className="text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl font-bold flex items-center">
              <Check size={14} className="mr-1.5" />
              Prescription Care Plan uploaded successfully!
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plan / Prescription Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Lisinopril Dosage Escalation Plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border outline-none
                ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-250' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Treatment instructions & Notes</label>
            <textarea
              required
              placeholder="Provide dosage quantities, frequencies, and instructions. These notes will sync to patient details."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border outline-none h-28 resize-none
                ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-250' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          {/* File input (Optional mock attachment) */}
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attach Official PDF Report (Optional)</label>
            <input
              type="text"
              placeholder="e.g. cardiovascular_directives.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className={`w-full mt-1.5 px-3.5 py-2 rounded-xl border outline-none
                ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-250' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          {/* Signature drawing pad */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Physician Digital Signature</label>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[10px] text-primary font-bold hover:underline"
              >
                Clear Pad
              </button>
            </div>
            
            <div className={`mt-1.5 border rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950
              ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <canvas
                ref={canvasRef}
                width={450}
                height={80}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-20 block cursor-crosshair bg-transparent"
              />
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">Draw your signature with your mouse or trackpad to authorize dispatch.</span>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-primary/25 transition-all mt-4"
          >
            <Upload size={14} />
            <span>Publish Treatment Plan</span>
          </button>
        </form>
      </div>

      {/* Version History */}
      <div className={`p-6 rounded-medical border shadow-sm
        ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="text-base font-extrabold text-slate-850 dark:text-white mb-6">Version History</h2>

        <div className="space-y-4">
          {pastRx.map((rx) => (
            <div
              key={rx.id}
              className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between
                ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800 dark:text-slate-250 truncate max-w-[130px]">{rx.title}</span>
                  <span className="text-[9px] bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-slate-500">
                    {rx.version}
                  </span>
                </div>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 truncate">{rx.notes}</p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-2.5 mt-3 flex justify-between items-center text-[9px] text-slate-400">
                <span className="font-mono">{rx.uploadDate}</span>
                <span>ID: {rx.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
