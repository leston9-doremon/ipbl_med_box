import React from 'react';
import { useMedical } from '../../contexts/MedicalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { Phone, Mail, Award, MapPin, Heart, AlertOctagon } from 'lucide-react';

export const EmergencyContacts = () => {
  const { user } = useAuth();
  const { darkMode } = useUI();
  const { emergencyContacts } = useMedical();

  const patientId = user?.patientId || 'PAT-8802';
  const contacts = emergencyContacts.filter(c => c.patientId === patientId);

  // Split into primary and other
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
      case 'Ambulance':
        return 'bg-rose-500/10 text-rose-500';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Emergency Advisory banner */}
      <div className={`p-4 rounded-medical border flex items-center space-x-4
        ${darkMode ? 'bg-rose-500/5 border-rose-500/20 text-rose-450' : 'bg-rose-50 border-rose-200/60 text-rose-700'}`}>
        <AlertOctagon size={24} className="shrink-0 animate-pulse" />
        <div className="text-xs leading-relaxed">
          <span className="font-extrabold block">Emergency Vitals Dispatch System</span>
          In case of severe telemetry warnings or chest tightness, please contact the dispatch ambulance below immediately. The Smartbox automatically notifies the Primary Guardian if telemetry exceeds critical thresholds for more than 45 seconds.
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Primary Guardian Hero Card */}
        {primaryContact && (
          <div
            className={`p-6 rounded-medical border shadow-md md:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden
              ${darkMode 
                ? 'bg-slate-900/60 border-teal-500/20 hover:border-teal-500/35' 
                : 'bg-teal-50/20 border-teal-200 hover:border-teal-350'}
              transition-all`}
          >
            <div className="absolute top-0 right-0 h-16 w-16 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <Heart size={28} className="stroke-[2]" fill="currentColor" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-extrabold text-slate-850 dark:text-white">
                    {primaryContact.name}
                  </span>
                  <span className="text-[9px] font-bold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Primary Guardian
                  </span>
                </div>
                <span className="text-xs text-slate-450 dark:text-slate-400 font-semibold block mt-0.5">
                  {primaryContact.relationship}
                </span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                className="flex-1 md:flex-initial bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-teal-500/20 transition-all"
                title="Mock Dial Call"
              >
                <Phone size={14} />
                <span>Call Primary: {primaryContact.phone}</span>
              </button>
              <button
                className={`p-2.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors
                  ${darkMode ? 'border-slate-800 text-slate-350' : 'border-slate-200 text-slate-600'}`}
                title="Mock Email"
              >
                <Mail size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Other Contacts grid */}
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
              <p className="text-xs text-slate-450 dark:text-slate-450 mt-0.5">
                {contact.relationship}
              </p>

              {/* Info fields */}
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

            {/* Actions footer */}
            <div className="border-t border-slate-100 dark:border-slate-850/85 pt-3 mt-4 grid grid-cols-2 gap-2">
              <button
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-250 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-200/50 dark:border-slate-800"
              >
                <Phone size={12} />
                <span>Call Phone</span>
              </button>
              <button
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-250 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-200/50 dark:border-slate-800"
              >
                <Mail size={12} />
                <span>Email</span>
              </button>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
};
