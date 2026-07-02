import React, { useState } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Plus, Edit3, Trash2, Calendar, Clock, Pill, X, ChevronRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Schedule = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { medicines, addMedicine, editMedicine, deleteMedicine } = useMedical();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const patientId = user?.patientId || 'PAT-8802';
  const myMeds = medicines.filter(m => m.patientId === patientId);

  // Form States
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [quantity, setQuantity] = useState('30 tablets');
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [night, setNight] = useState(false);
  const [exactTime, setExactTime] = useState('08:00 AM');
  const [instructions, setInstructions] = useState('Take with water');
  const [duration, setDuration] = useState('30 days');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [repeatDaily, setRepeatDaily] = useState(true);
  const [timingType, setTimingType] = useState('With Food'); // Before Food, After Food, With Food
  const [boxSlot, setBoxSlot] = useState(1);

  const resetForm = () => {
    setName('');
    setDose('');
    setQuantity('30 tablets');
    setMorning(true);
    setAfternoon(false);
    setNight(false);
    setExactTime('08:00 AM');
    setInstructions('Take with water');
    setDuration('30 days');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setRepeatDaily(true);
    setTimingType('With Food');
    setBoxSlot(1);
    setEditingMed(null);
  };

  const handleOpenEdit = (med) => {
    setEditingMed(med);
    setName(med.name);
    setDose(med.dose);
    setQuantity(med.quantity || '30 tablets');
    setMorning(med.morning);
    setAfternoon(med.afternoon);
    setNight(med.night);
    setExactTime(med.exactTime);
    setInstructions(med.instructions);
    setDuration(med.duration);
    setStartDate(med.startDate);
    setEndDate(med.endDate || '');
    setRepeatDaily(med.repeatDaily);
    setTimingType(med.timingType || 'With Food');
    setBoxSlot(med.boxSlot || 1);
    setShowAddModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !dose) return;

    const medData = {
      patientId,
      name,
      dose,
      quantity,
      morning,
      afternoon,
      night,
      exactTime,
      instructions,
      duration,
      startDate,
      endDate: endDate || new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      repeatDaily,
      timingType,
      boxSlot: parseInt(boxSlot, 10),
      image: 'capsule'
    };

    if (editingMed) {
      editMedicine(editingMed.id, medData);
    } else {
      addMedicine(medData);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this medication schedule?')) {
      deleteMedicine(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-extrabold text-slate-850 dark:text-white leading-tight">Patient Prescription Scheduler</h2>
          <p className="text-xs text-slate-400 mt-0.5">Define timings and sync alarms with the Smart Medicine Box</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-primary/20 transition-all"
        >
          <Plus size={15} />
          <span>Schedule New Medication</span>
        </button>
      </div>

      {/* Grid List of scheduled medicines */}
      <div className="grid md:grid-cols-2 gap-6">
        {myMeds.map((med) => (
          <div
            key={med.id}
            className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between hover-medical-card
              ${darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200/80'}`}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Pill size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-850 dark:text-white leading-normal truncate max-w-[180px]">
                      {med.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Dose: {med.dose} • Quantity: {med.quantity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleOpenEdit(med)}
                    className="p-1.5 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-colors"
                    title="Edit Schedule"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Cancel Medication"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Timing slots badges */}
              <div className="flex items-center space-x-2.5 mt-5">
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

              {/* Instructions and exact times */}
              <div className={`mt-5 p-3 rounded-xl border grid grid-cols-2 gap-4 text-xs
                ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Alarms Time</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block mt-0.5 truncate">
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
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Special Directions</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-350 block mt-0.5">
                    {med.instructions || 'Take with full glass of water'}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration Footer */}
            <div className="border-t border-slate-100 dark:border-slate-850/80 pt-3 mt-5 flex justify-between items-center text-[10px]">
              <span className="text-slate-400">Box Slot: <b className="text-primary font-bold">Compartment {med.boxSlot}</b></span>
              <span className="text-slate-500 font-medium flex items-center">
                <Calendar size={12} className="mr-1 text-slate-400" />
                {med.duration} (Start: {med.startDate})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Medicine Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddModal(false); resetForm(); }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl rounded-[24px] border shadow-2xl overflow-hidden relative z-10 flex flex-col justify-between
                ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
            >
              <div className={`px-6 py-4 flex items-center justify-between border-b 
                ${darkMode ? 'border-slate-800' : 'border-slate-150'}`}>
                <h3 className="text-sm font-bold flex items-center">
                  <Pill size={16} className="mr-2 text-primary" />
                  {editingMed ? 'Edit Medication Schedule' : 'Schedule New Medication'}
                </h3>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  
                  {/* Name */}
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Medication Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Metformin (Glucophage)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full mt-1.5 px-3.5 py-2 rounded-xl border outline-none
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  {/* Dose */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dosage Strength</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500 mg / 10 mg"
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                      className={`w-full mt-1.5 px-3.5 py-2 rounded-xl border outline-none
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Quantity</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 30 tablets"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className={`w-full mt-1.5 px-3.5 py-2 rounded-xl border outline-none
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  {/* Slots select */}
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Timing Slots (Select all that apply)</label>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center space-x-2 font-semibold text-slate-650 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={morning}
                          onChange={(e) => setMorning(e.target.checked)}
                          className="rounded border-slate-300 text-primary focus:ring-0"
                        />
                        <span>Morning</span>
                      </label>

                      <label className="flex items-center space-x-2 font-semibold text-slate-650 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={afternoon}
                          onChange={(e) => setAfternoon(e.target.checked)}
                          className="rounded border-slate-300 text-primary focus:ring-0"
                        />
                        <span>Midday</span>
                      </label>

                      <label className="flex items-center space-x-2 font-semibold text-slate-650 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={night}
                          onChange={(e) => setNight(e.target.checked)}
                          className="rounded border-slate-300 text-primary focus:ring-0"
                        />
                        <span>Night</span>
                      </label>
                    </div>
                  </div>

                  {/* Compartment Slot Selection */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Smartbox Compartment (Slot 1-15)</label>
                    <select
                      value={boxSlot}
                      onChange={(e) => setBoxSlot(parseInt(e.target.value, 10))}
                      className={`w-full mt-1.5 px-3 py-2 rounded-xl border outline-none bg-inherit
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    >
                      {Array.from({ length: 15 }, (_, idx) => (
                        <option key={idx + 1} value={idx + 1} className="bg-slate-900">
                          Slot {idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exact times */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alarm Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 08:00 AM, 08:00 PM"
                      value={exactTime}
                      onChange={(e) => setExactTime(e.target.value)}
                      className={`w-full mt-1.5 px-3.5 py-2 rounded-xl border outline-none
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  {/* Food Relation */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Food Guidelines</label>
                    <select
                      value={timingType}
                      onChange={(e) => setTimingType(e.target.value)}
                      className={`w-full mt-1.5 px-3 py-2 rounded-xl border outline-none bg-inherit
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <option value="Before Food" className="bg-slate-900">Before Food</option>
                      <option value="With Food" className="bg-slate-900">With Food</option>
                      <option value="After Food" className="bg-slate-900">After Food</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`w-full mt-1.5 px-3 py-2 rounded-xl border outline-none
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 30 days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={`w-full mt-1.5 px-3.5 py-2 rounded-xl border outline-none
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  {/* Instructions */}
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Special Instructions</label>
                    <textarea
                      placeholder="e.g. Swallow with water, do not chew."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className={`w-full mt-1.5 px-3.5 py-2 rounded-xl border outline-none h-16 resize-none
                        ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex items-center justify-end space-x-2.5">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border
                      ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-550/5 text-slate-600'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-xl text-xs shadow-md shadow-primary/20"
                  >
                    {editingMed ? 'Save Changes' : 'Schedule Medication'}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
