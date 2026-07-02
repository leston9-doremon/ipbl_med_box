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

  // 1. Medicine Actions
  const addMedicine = (medicine) => {
    const newMed = {
      ...medicine,
      id: `MED-${Math.floor(100 + Math.random() * 900)}`,
      boxSlot: medicines.length + 1
    };
    setMedicines((prev) => [...prev, newMed]);

    // Create an upcoming log for today if daily
    if (medicine.repeatDaily) {
      const slots = [];
      if (medicine.morning) slots.push('Morning');
      if (medicine.afternoon) slots.push('Afternoon');
      if (medicine.night) slots.push('Night');

      const times = medicine.exactTime.split(',');

      slots.forEach((slot, index) => {
        const timeStr = times[index] ? times[index].trim() : medicine.exactTime;
        const newLog = {
          id: `LOG-${Math.floor(200 + Math.random() * 800)}`,
          patientId: medicine.patientId,
          medicineId: newMed.id,
          medicineName: newMed.name,
          dose: newMed.dose,
          slot: slot,
          scheduledTime: timeStr,
          takenTime: null,
          status: 'Upcoming',
          delayMinutes: null,
          remarks: null,
          date: new Date().toISOString().split('T')[0]
        };
        setMedicineLogs((prev) => [newLog, ...prev]);
      });
    }

    // Trigger info notification
    addNotification({
      patientId: medicine.patientId,
      title: 'New Medicine Scheduled',
      message: `${medicine.name} has been added by your Guardian.`,
      type: 'Info'
    });
  };

  const editMedicine = (id, updatedFields) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updatedFields } : med))
    );
    // Sync logs name / dose for today
    setMedicineLogs((prev) =>
      prev.map((log) =>
        log.medicineId === id && log.status === 'Upcoming'
          ? {
              ...log,
              medicineName: updatedFields.name || log.medicineName,
              dose: updatedFields.dose || log.dose
            }
          : log
      )
    );
  };

  const deleteMedicine = (id) => {
    const medToDelete = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((med) => med.id !== id));
    // Remove upcoming logs for this medicine today
    setMedicineLogs((prev) =>
      prev.filter((log) => !(log.medicineId === id && log.status === 'Upcoming'))
    );

    if (medToDelete) {
      addNotification({
        patientId: medToDelete.patientId,
        title: 'Medication Cancelled',
        message: `${medToDelete.name} was removed from your schedule.`,
        type: 'Info'
      });
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
