import React from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Phone, Mail, Heart, AlertOctagon } from 'lucide-react';

export const DoctorEmergencyContacts = () => {
  const { selectedPatientId } = useAuth();
  const { darkMode } = useUI();
  const { emergencyContacts } = useMedical();

  const patientId = selectedPatientId || 'PAT-8802';
  const contacts = emergencyContacts.filter(c => c.patientId === patientId);

  const primaryContact = contacts.find(c => c.isPrimary);
  const otherContacts = contacts.filter(c => !c.isPrimary);

  const getContactBadgeColor = (role) => {
    switch (role) {
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
      
      {/* Emergency Advisory */}
      <div className={`p-4 rounded-medical border flex items-center space-x-4
        ${darkMode ? 'bg-rose-500/5 border-rose-500/20 text-rose-455' : 'bg-rose-50 border-rose-200/60 text-rose-700'}`}>
        <AlertOctagon size={22} className="shrink-0" />
        <div className="text-xs leading-relaxed">
          <span className="font-extrabold block">Emergency Contact Notification Scheme</span>
          In the event of critical cardiac arrhythmias or telemetry drop-out exceeding 60 seconds, the primary contact below will receive automated SMS notifications from the Smartbox server.
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Primary Guardian Card */}
        {primaryContact && (
          <div
            className={`p-6 rounded-medical border shadow-md md:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden
              ${darkMode ? 'bg-slate-900/60 border-teal-500/20' : 'bg-teal-50/20 border-teal-200'}
              transition-all`}
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-extrabold text-slate-850 dark:text-white">
                    {primaryContact.name}
                  </span>
                  <span className="text-[9px] font-bold text-teal-650 bg-teal-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Primary Guardian
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-semibold block mt-0.5">
                  {primaryContact.relationship}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto text-xs">
              <span className="text-slate-450 dark:text-slate-400">
                Phone: <b className="text-slate-805 dark:text-slate-200">{primaryContact.phone}</b>
              </span>
              <span className="text-slate-300 dark:text-slate-800">|</span>
              <span className="text-slate-450 dark:text-slate-400">
                Email: <b className="text-slate-805 dark:text-slate-200">{primaryContact.email}</b>
              </span>
            </div>
          </div>
        )}

        {/* Other Contacts Grid */}
        {otherContacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-5 rounded-medical border shadow-sm flex flex-col justify-between hover-medical-card
              ${darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200/80'}`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                  ${getContactBadgeColor(contact.role)}`}>
                  {contact.role}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {contact.id}</span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mt-4">
                {contact.name}
              </h3>
              <p className="text-xs text-slate-405 mt-0.5">
                {contact.relationship}
              </p>

              <div className="space-y-2 mt-4 pt-4 border-t border-slate-105 dark:border-slate-850">
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

            <div className="border-t border-slate-100 dark:border-slate-850 pt-3 mt-4 text-[9px] text-slate-400 flex justify-between">
              <span>Sync Status</span>
              <span className="text-emerald-500 font-semibold uppercase">Active</span>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
};
