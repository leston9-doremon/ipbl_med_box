import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import {
  INITIAL_PATIENTS,
  INITIAL_MEDICINES,
  INITIAL_MEDINE_LOGS, // Note: matched the spelling in mockData
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TELEMETRY
} from '../utils/mockData';

const MedicalContext = createContext(undefined);

// Helper to parse "08:00 AM" into minutes since midnight
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return null;
  let hrs = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hrs < 12) hrs += 12;
  if (ampm === 'AM' && hrs === 12) hrs = 0;
  return hrs * 60 + mins;
};

// Helper to convert minutes since midnight to AM/PM string
const formatMinutesToTime = (minutes) => {
  if (minutes === null || minutes === undefined) return '--';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 || 12;
  const displayMins = mins < 10 ? '0' + mins : mins;
  return `${displayHrs}:${displayMins} ${ampm}`;
};

export const MedicalProvider = ({ children }) => {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [medicineLogs, setMedicineLogs] = useState(INITIAL_MEDINE_LOGS);
  const [emergencyContacts, setEmergencyContacts] = useState(INITIAL_EMERGENCY_CONTACTS);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [medicalDocuments, setMedicalDocuments] = useState(INITIAL_MEDICAL_DOCUMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);

  // Supabase states
  const [dbSchedule, setDbSchedule] = useState([]);
  const [dbSensorLog, setDbSensorLog] = useState(null);
  const [dbDispenseLogs, setDbDispenseLogs] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Supabase Initial Fetch and Real-time Subscriptions
  useEffect(() => {
    let active = true;

    const fetchInitialData = async () => {
      setDbLoading(true);
      setDbError(null);
      try {
        // 1. Fetch schedule (15 rows)
        const { data: scheduleData, error: scheduleErr } = await supabase
          .from('schedule')
          .select('*')
          .order('section', { ascending: true });

        if (scheduleErr) throw scheduleErr;

        // 2. Fetch latest sensor_log
        const { data: sensorData, error: sensorErr } = await supabase
          .from('sensor_log')
          .select('*')
          .order('recorded_at', { ascending: false })
          .limit(1);

        if (sensorErr) throw sensorErr;

        // 3. Fetch recent dispense_logs
        const { data: dispenseData, error: dispenseErr } = await supabase
          .from('dispense_log')
          .select('*')
          .order('dispensed_at', { ascending: false })
          .limit(20);

        if (dispenseErr) throw dispenseErr;

        if (active) {
          setDbSchedule(scheduleData || []);
          setDbSensorLog(sensorData?.[0] || null);
          setDbDispenseLogs(dispenseData || []);
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
        if (active) {
          setDbError(err.message || 'Failed to connect to Supabase');
        }
      } finally {
        if (active) {
          setDbLoading(false);
        }
      }
    };

    fetchInitialData();

    // Set up real-time subscriptions
    const sensorChannel = supabase
      .channel('sensor_log_inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_log' },
        (payload) => {
          if (active) {
            console.log('Real-time sensor_log insert:', payload.new);
            setDbSensorLog(payload.new);
          }
        }
      )
      .subscribe();

    const dispenseChannel = supabase
      .channel('dispense_log_inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dispense_log' },
        (payload) => {
          if (active) {
            console.log('Real-time dispense_log insert:', payload.new);
            setDbDispenseLogs((prev) => [payload.new, ...prev].slice(0, 20));
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(sensorChannel);
      supabase.removeChannel(dispenseChannel);
    };
  }, []);

  // Sync mock medicines and today's logs with Supabase dbSchedule
  useEffect(() => {
    if (dbSchedule.length === 0) return;

    const syncedMedicines = dbSchedule
      .filter((row) => row.minutes !== null)
      .map((row) => {
        return {
          id: `MED-SLOT-${row.section}`,
          name: `Slot ${row.section} Med`,
          dose: `1 Dose`,
          boxSlot: row.section,
          exactTime: formatMinutesToTime(row.minutes),
          repeatDaily: true,
          morning: row.minutes < 720,
          afternoon: row.minutes >= 720 && row.minutes < 1080,
          night: row.minutes >= 1080,
          patientId: 'PAT-8802'
        };
      });

    setMedicines(syncedMedicines);

    // Sync today's logs
    const todayStr = new Date().toISOString().split('T')[0];
    setMedicineLogs((prevLogs) => {
      return syncedMedicines.map((med) => {
        const existingLog = prevLogs.find((l) => l.medicineId === med.id && l.date === todayStr);
        return {
          id: existingLog?.id || `LOG-DB-${med.boxSlot}`,
          patientId: med.patientId,
          medicineId: med.id,
          medicineName: med.name,
          dose: med.dose,
          slot: med.morning ? 'Morning' : med.afternoon ? 'Afternoon' : 'Night',
          scheduledTime: med.exactTime,
          takenTime: existingLog?.takenTime || null,
          status: existingLog?.status || 'Upcoming',
          delayMinutes: existingLog?.delayMinutes || null,
          remarks: existingLog?.remarks || null,
          date: todayStr,
          boxSlot: med.boxSlot
        };
      });
    });
  }, [dbSchedule]);

  // Dynamic Telemetry Simulation: Fluctuate vitals in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const currentHr = prev.vitals.heartRate;
        const currentTemp = prev.vitals.temperature;

        // Micro fluctuations
        const hrDelta = Math.random() > 0.5 ? 1 : -1;
        const tempDelta = Math.random() > 0.5 ? 0.1 : -0.1;

        // Keep inside normal parameters
        let nextHr = currentHr + hrDelta;
        if (nextHr < 65) nextHr = 65;
        if (nextHr > 98) nextHr = 98; // keep below warning threshold

        let nextTemp = parseFloat((currentTemp + tempDelta).toFixed(1));
        if (nextTemp < 36.4) nextTemp = 36.4;
        if (nextTemp > 37.3) nextTemp = 37.3;

        // Decide status
        let status = 'Excellent';
        if (nextHr > 90 || nextTemp > 37.5) {
          status = 'Warning';
        }

        return {
          ...prev,
          vitals: {
            ...prev.vitals,
            heartRate: nextHr,
            temperature: nextTemp,
            healthStatus: status
          }
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 1. Medicine Actions connected to Supabase
  const addMedicine = async (medicine) => {
    const slotNumber = parseInt(medicine.boxSlot, 10) || 1;
    const parsedMinutes = parseTimeToMinutes(medicine.exactTime);

    try {
      const { error } = await supabase
        .from('schedule')
        .update({ minutes: parsedMinutes })
        .eq('section', slotNumber);

      if (error) throw error;

      // Refresh schedule locally
      const { data: updatedSchedule } = await supabase
        .from('schedule')
        .select('*')
        .order('section', { ascending: true });
      
      if (updatedSchedule) {
        setDbSchedule(updatedSchedule);
      }

      addNotification({
        patientId: medicine.patientId,
        title: 'Medicine Scheduled in Box',
        message: `${medicine.name} (Slot ${slotNumber}) has been scheduled.`,
        type: 'Info'
      });
    } catch (err) {
      console.error('Error writing to Supabase schedule:', err);
    }
  };

  const editMedicine = async (id, updatedFields) => {
    const slotNumber = parseInt(id.replace('MED-SLOT-', ''), 10);
    const parsedMinutes = updatedFields.exactTime ? parseTimeToMinutes(updatedFields.exactTime) : null;

    try {
      if (parsedMinutes !== null) {
        const { error } = await supabase
          .from('schedule')
          .update({ minutes: parsedMinutes })
          .eq('section', slotNumber);
        
        if (error) throw error;
      }

      // Refresh schedule locally
      const { data: updatedSchedule } = await supabase
        .from('schedule')
        .select('*')
        .order('section', { ascending: true });
      
      if (updatedSchedule) {
        setDbSchedule(updatedSchedule);
      }
    } catch (err) {
      console.error('Error updating Supabase schedule:', err);
    }
  };

  const deleteMedicine = async (id) => {
    const slotNumber = parseInt(id.replace('MED-SLOT-', ''), 10);

    try {
      const { error } = await supabase
        .from('schedule')
        .update({ minutes: null })
        .eq('section', slotNumber);

      if (error) throw error;

      // Refresh schedule locally
      const { data: updatedSchedule } = await supabase
        .from('schedule')
        .select('*')
        .order('section', { ascending: true });
      
      if (updatedSchedule) {
        setDbSchedule(updatedSchedule);
      }

      addNotification({
        patientId: 'PAT-8802',
        title: 'Medication Cancelled',
        message: `Smartbox Compartment ${slotNumber} schedule cleared.`,
        type: 'Info'
      });
    } catch (err) {
      console.error('Error deleting Supabase schedule:', err);
    }
  };

  // 2. Medicine Log Actions (Patient interactivity)
  const markMedicineTaken = (logId, remark = '') => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const padMinutes = minutes < 10 ? '0' + minutes : minutes;
    const takenTimeStr = `${displayHours}:${padMinutes} ${ampm}`;

    setMedicineLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          // Calculate delay in minutes roughly
          const delay = Math.floor(Math.random() * 20); // Simulated delay
          return {
            ...log,
            status: 'Taken',
            takenTime: takenTimeStr,
            delayMinutes: delay,
            remarks: remark || 'Taken via Smart Medicine Box verification'
          };
        }
        return log;
      })
    );

    const log = medicineLogs.find((l) => l.id === logId);
    if (log) {
      addNotification({
        patientId: log.patientId,
        title: 'Medication Taken',
        message: `${log.medicineName} (${log.slot}) marked as taken.`,
        type: 'Success'
      });
    }
  };

  // 3. Document Actions
  const uploadDocument = (doc) => {
    const newDoc = {
      ...doc,
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setMedicalDocuments((prev) => [newDoc, ...prev]);

    addNotification({
      patientId: doc.patientId,
      title: 'New Medical Report',
      message: `Document '${doc.title}' uploaded successfully.`,
      type: 'Info'
    });
  };

  const deleteDocument = (docId) => {
    setMedicalDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // 4. Prescription Actions (Doctor)
  const uploadPrescription = (prescription) => {
    const newRx = {
      ...prescription,
      id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      version: 'v1.0',
      size: '1.5 MB'
    };
    setPrescriptions((prev) => [newRx, ...prev]);

    // Also update patient schedule slots dynamically if detailed in instructions
    addNotification({
      patientId: prescription.patientId,
      title: 'Prescription Uploaded',
      message: `Dr. Alexander Thorne uploaded: ${prescription.title}.`,
      type: 'Info'
    });
  };

  // 5. Emergency Contact Actions
  const addEmergencyContact = (contact) => {
    const newContact = {
      ...contact,
      id: `CON-${Math.floor(100 + Math.random() * 900)}`
    };
    setEmergencyContacts((prev) => [...prev, newContact]);
  };

  const editEmergencyContact = (id, updatedFields) => {
    setEmergencyContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteEmergencyContact = (id) => {
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // 6. Notifications Actions
  const addNotification = (n) => {
    const newNtf = {
      id: `NTF-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...n
    };
    setNotifications((prev) => [newNtf, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <MedicalContext.Provider
      value={{
        patients,
        setPatients,
        medicines,
        medicineLogs,
        emergencyContacts,
        prescriptions,
        medicalDocuments,
        notifications,
        telemetry,
        addMedicine,
        editMedicine,
        deleteMedicine,
        markMedicineTaken,
        uploadDocument,
        deleteDocument,
        uploadPrescription,
        addEmergencyContact,
        editEmergencyContact,
        deleteEmergencyContact,
        addNotification,
        markNotificationRead,
        clearNotifications,
        dbSchedule,
        dbSensorLog,
        dbDispenseLogs,
        dbLoading,
        dbError
      }}
    >
      {children}
    </MedicalContext.Provider>
  );
};

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
};
