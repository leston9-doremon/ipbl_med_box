import React, { useState } from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Phone, Mail, Plus, X, Trash2, Edit, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GuardianEmergencyContacts = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { emergencyContacts, addEmergencyContact, editEmergencyContact, deleteEmergencyContact } = useMedical();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Guardian'); // Guardian, Doctor, Hospital, Ambulance

  const patientId = user?.patientId || 'PAT-8802';
  const myContacts = emergencyContacts.filter(c => c.patientId === patientId);

  const resetForm = () => {
    setName('');
    setRelationship('');
    setPhone('');
    setEmail('');
    setRole('Guardian');
    setEditingContact(null);
  };

  const handleOpenEdit = (contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setRelationship(contact.relationship);
    setPhone(contact.phone);
    setEmail(contact.email);
    setRole(contact.role);
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const contactData = {
      patientId,
      name,
      relationship,
      phone,
      email,
      role,
      isPrimary: editingContact ? editingContact.isPrimary : false
    };

    if (editingContact) {
      editEmergencyContact(editingContact.id, contactData);
    } else {
      addEmergencyContact(contactData);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this emergency contact?')) {
      deleteEmergencyContact(id);
    }
  };

  const getBadgeStyle = (contactRole) => {
    switch (contactRole) {
      case 'Guardian':
        return 'bg-teal-500/10 text-teal-500';
      case 'Doctor':
        return 'bg-blue-500/10 text-blue-500';
      case 'Hospital':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-rose-500/10 text-rose-500';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-extrabold text-slate-850 dark:text-white leading-tight">Emergency Contacts Registry</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage fast-dial directory syncs on the patient's box interface</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-primary/20 transition-all"
        >
          <Plus size={15} />
          <span>Add New Contact</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-3 gap-6">
        {myContacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between hover-medical-card
              ${darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200/80'}`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                  ${getBadgeStyle(contact.role)}`}>
                  {contact.role}
                </span>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(contact)}
                    className="p-1 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                  >
                    <Edit size={13} />
                  </button>
                  {/* Prevent deleting primary contact unless edited */}
                  {!contact.isPrimary && (
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mt-4">
                {contact.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {contact.relationship}
              </p>

              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="flex items-center text-xs text-slate-500">
                  <Phone size={13} className="mr-2 text-slate-400 shrink-0" />
                  <span className="font-semibold truncate">{contact.phone}</span>
                </div>
                <div className="flex items-center text-xs text-slate-500">
                  <Mail size={13} className="mr-2 text-slate-400 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-850/85 pt-3 mt-4 text-[9px] text-slate-400 flex justify-between">
              <span>Contact ID: {contact.id}</span>
              {contact.isPrimary && <span className="text-teal-500 font-bold uppercase">Primary Dial</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddModal(false); resetForm(); }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-[24px] border shadow-2xl overflow-hidden relative z-10 flex flex-col justify-between
                ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
            >
              <div className={`px-6 py-4 flex items-center justify-between border-b 
                ${darkMode ? 'border-slate-800' : 'border-slate-150'}`}>
                <h3 className="text-sm font-bold flex items-center">
                  <Phone size={16} className="mr-2 text-primary" />
                  {editingContact ? 'Edit Contact Details' : 'Create Emergency Contact'}
                </h3>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[65vh] overflow-y-auto">
                {/* Name */}
                <div>
                  <label className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border outline-none
                      ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Relationship / Job</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Caregiver / Cardiologist"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border outline-none
                      ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +1 (555) 012-3456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border outline-none
                      ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@clinical.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border outline-none
                      ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Contact Role Category</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full mt-1.5 px-3 py-2.5 rounded-xl border outline-none bg-inherit
                      ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="Guardian">Guardian</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Ambulance">Ambulance</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border
                      ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-550/5 text-slate-650'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-xl text-xs shadow-md shadow-primary/20"
                  >
                    {editingContact ? 'Save Changes' : 'Add Contact'}
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
