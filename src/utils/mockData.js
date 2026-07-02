// Initial mock database for the medical dashboard
export const INITIAL_PATIENTS = [
  {
    id: "PAT-8802",
    name: "Eleanor Vance",
    age: 68,
    gender: "Female",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    lastVisit: "2026-06-25",
    condition: "Type 2 Diabetes & Hypertension",
    bloodGroup: "O-Positive",
    height: "162 cm",
    weight: "64 kg",
    guardianName: "Sarah Vance (Daughter)",
    doctorName: "Dr. Alexander Thorne",
    boxId: "SMB-990-T",
    status: "Stable"
  },
  {
    id: "PAT-3012",
    name: "Arthur Pendelton",
    age: 72,
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    lastVisit: "2026-06-28",
    condition: "Chronic Heart Failure & Arrhythmia",
    bloodGroup: "A-Positive",
    height: "178 cm",
    weight: "82 kg",
    guardianName: "Sarah Vance",
    doctorName: "Dr. Alexander Thorne",
    boxId: "SMB-881-A",
    status: "Warning"
  },
  {
    id: "PAT-4409",
    name: "Claire Redfield",
    age: 45,
    gender: "Female",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    lastVisit: "2026-07-01",
    condition: "Post-op Recovery & Heart Murmur",
    bloodGroup: "B-Negative",
    height: "168 cm",
    weight: "58 kg",
    guardianName: "Chris Redfield (Brother)",
    doctorName: "Dr. Alexander Thorne",
    boxId: "SMB-443-B",
    status: "Stable"
  }
];

export const INITIAL_MEDICINES = [
  {
    id: "MED-001",
    patientId: "PAT-8802",
    name: "Metformin (Glucophage)",
    image: "capsule",
    dose: "500 mg",
    quantity: "30 tablets",
    morning: true,
    afternoon: false,
    night: true,
    exactTime: "08:00 AM, 08:00 PM",
    instructions: "Take with food",
    duration: "90 days",
    startDate: "2026-06-01",
    endDate: "2026-08-30",
    repeatDaily: true,
    timingType: "With Food",
    boxSlot: 1
  },
  {
    id: "MED-002",
    patientId: "PAT-8802",
    name: "Lisinopril (Zestril)",
    image: "round-tablet",
    dose: "10 mg",
    quantity: "15 tablets",
    morning: true,
    afternoon: false,
    night: false,
    exactTime: "08:00 AM",
    instructions: "Take before food",
    duration: "30 days",
    startDate: "2026-06-15",
    endDate: "2026-07-15",
    repeatDaily: true,
    timingType: "Before Food",
    boxSlot: 2
  },
  {
    id: "MED-003",
    patientId: "PAT-8802",
    name: "Atorvastatin (Lipitor)",
    image: "oval-tablet",
    dose: "20 mg",
    quantity: "30 tablets",
    morning: false,
    afternoon: false,
    night: true,
    exactTime: "09:00 PM",
    instructions: "Take before sleep, after food",
    duration: "60 days",
    startDate: "2026-06-10",
    endDate: "2026-08-10",
    repeatDaily: true,
    timingType: "After Food",
    boxSlot: 3
  },
  {
    id: "MED-004",
    patientId: "PAT-8802",
    name: "Low-Dose Aspirin",
    image: "pink-tablet",
    dose: "81 mg",
    quantity: "100 tablets",
    morning: false,
    afternoon: true,
    night: false,
    exactTime: "01:00 PM",
    instructions: "Take with water",
    duration: "365 days",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    repeatDaily: true,
    timingType: "With Food",
    boxSlot: 4
  }
];

// Complete history logs of taken, missed, and pending medications for today
export const INITIAL_MEDINE_LOGS = [
  // Today's Logs (Eleanor Vance - PAT-8802)
  {
    id: "LOG-100",
    patientId: "PAT-8802",
    medicineId: "MED-001",
    medicineName: "Metformin (Glucophage)",
    dose: "500 mg",
    slot: "Morning",
    scheduledTime: "08:00 AM",
    takenTime: "08:05 AM",
    status: "Taken",
    delayMinutes: 5,
    remarks: "Taken on time",
    date: "2026-07-02"
  },
  {
    id: "LOG-101",
    patientId: "PAT-8802",
    medicineId: "MED-002",
    medicineName: "Lisinopril (Zestril)",
    dose: "10 mg",
    slot: "Morning",
    scheduledTime: "08:00 AM",
    takenTime: "08:24 AM",
    status: "Taken",
    delayMinutes: 24,
    remarks: "A bit delayed due to breakfast prep",
    date: "2026-07-02"
  },
  {
    id: "LOG-102",
    patientId: "PAT-8802",
    medicineId: "MED-004",
    medicineName: "Low-Dose Aspirin",
    dose: "81 mg",
    slot: "Afternoon",
    scheduledTime: "01:00 PM",
    takenTime: null,
    status: "Missed",
    delayMinutes: null,
    remarks: "Patient fell asleep during afternoon rest period",
    missedReason: "Slept through alarm",
    doctorNote: "Aspirin is key for platelet suppression. Guardian should ensure patient remains awake or double-check box alarm.",
    guardianNote: "Will set vibration alert on her smartwatch next time.",
    date: "2026-07-02"
  },
  {
    id: "LOG-103",
    patientId: "PAT-8802",
    medicineId: "MED-001",
    medicineName: "Metformin (Glucophage)",
    dose: "500 mg",
    slot: "Night",
    scheduledTime: "08:00 PM",
    takenTime: null,
    status: "Upcoming",
    delayMinutes: null,
    remarks: null,
    date: "2026-07-02"
  },
  {
    id: "LOG-104",
    patientId: "PAT-8802",
    medicineId: "MED-003",
    medicineName: "Atorvastatin (Lipitor)",
    dose: "20 mg",
    slot: "Night",
    scheduledTime: "09:00 PM",
    takenTime: null,
    status: "Upcoming",
    delayMinutes: null,
    remarks: null,
    date: "2026-07-02"
  },

  // Past Historical Logs (to populate adherence charts)
  // July 1st Logs (Adherence: 5/5)
  { id: "LOG-090", patientId: "PAT-8802", medicineId: "MED-001", medicineName: "Metformin (Glucophage)", dose: "500 mg", slot: "Morning", scheduledTime: "08:00 AM", takenTime: "08:12 AM", status: "Taken", delayMinutes: 12, date: "2026-07-01" },
  { id: "LOG-091", patientId: "PAT-8802", medicineId: "MED-002", medicineName: "Lisinopril (Zestril)", dose: "10 mg", slot: "Morning", scheduledTime: "08:00 AM", takenTime: "08:02 AM", status: "Taken", delayMinutes: 2, date: "2026-07-01" },
  { id: "LOG-092", patientId: "PAT-8802", medicineId: "MED-004", medicineName: "Low-Dose Aspirin", dose: "81 mg", slot: "Afternoon", scheduledTime: "01:00 PM", takenTime: "01:10 PM", status: "Taken", delayMinutes: 10, date: "2026-07-01" },
  { id: "LOG-093", patientId: "PAT-8802", medicineId: "MED-001", medicineName: "Metformin (Glucophage)", dose: "500 mg", slot: "Night", scheduledTime: "08:00 PM", takenTime: "08:05 PM", status: "Taken", delayMinutes: 5, date: "2026-07-01" },
  { id: "LOG-094", patientId: "PAT-8802", medicineId: "MED-003", medicineName: "Atorvastatin (Lipitor)", dose: "20 mg", slot: "Night", scheduledTime: "09:00 PM", takenTime: "09:12 PM", status: "Taken", delayMinutes: 12, date: "2026-07-01" },
  
  // June 30th Logs (Adherence: 3/5 - 2 Missed)
  { id: "LOG-080", patientId: "PAT-8802", medicineId: "MED-001", medicineName: "Metformin (Glucophage)", dose: "500 mg", slot: "Morning", scheduledTime: "08:00 AM", takenTime: "08:03 AM", status: "Taken", delayMinutes: 3, date: "2026-06-30" },
  { id: "LOG-081", patientId: "PAT-8802", medicineId: "MED-002", medicineName: "Lisinopril (Zestril)", dose: "10 mg", slot: "Morning", scheduledTime: "08:00 AM", takenTime: null, status: "Missed", missedReason: "Out of stock, wait for delivery", date: "2026-06-30" },
  { id: "LOG-082", patientId: "PAT-8802", medicineId: "MED-004", medicineName: "Low-Dose Aspirin", dose: "81 mg", slot: "Afternoon", scheduledTime: "01:00 PM", takenTime: "01:30 PM", status: "Taken", delayMinutes: 30, date: "2026-06-30" },
  { id: "LOG-083", patientId: "PAT-8802", medicineId: "MED-001", medicineName: "Metformin (Glucophage)", dose: "500 mg", slot: "Night", scheduledTime: "08:00 PM", takenTime: "08:10 PM", status: "Taken", delayMinutes: 10, date: "2026-06-30" },
  { id: "LOG-084", patientId: "PAT-8802", medicineId: "MED-003", medicineName: "Atorvastatin (Lipitor)", dose: "20 mg", slot: "Night", scheduledTime: "09:00 PM", takenTime: null, status: "Missed", missedReason: "Fell asleep early", date: "2026-06-30" },

  // June 29th Logs (Adherence: 4/5 - 1 Missed)
  { id: "LOG-070", patientId: "PAT-8802", medicineId: "MED-001", medicineName: "Metformin (Glucophage)", dose: "500 mg", slot: "Morning", scheduledTime: "08:00 AM", takenTime: "08:15 AM", status: "Taken", delayMinutes: 15, date: "2026-06-29" },
  { id: "LOG-071", patientId: "PAT-8802", medicineId: "MED-002", medicineName: "Lisinopril (Zestril)", dose: "10 mg", slot: "Morning", scheduledTime: "08:00 AM", takenTime: "08:04 AM", status: "Taken", delayMinutes: 4, date: "2026-06-29" },
  { id: "LOG-072", patientId: "PAT-8802", medicineId: "MED-004", medicineName: "Low-Dose Aspirin", dose: "81 mg", slot: "Afternoon", scheduledTime: "01:00 PM", takenTime: null, status: "Missed", missedReason: "Away from home without box", date: "2026-06-29" },
  { id: "LOG-073", patientId: "PAT-8802", medicineId: "MED-001", medicineName: "Metformin (Glucophage)", dose: "500 mg", slot: "Night", scheduledTime: "08:00 PM", takenTime: "08:08 PM", status: "Taken", delayMinutes: 8, date: "2026-06-29" },
  { id: "LOG-074", patientId: "PAT-8802", medicineId: "MED-003", medicineName: "Atorvastatin (Lipitor)", dose: "20 mg", slot: "Night", scheduledTime: "09:00 PM", takenTime: "09:05 PM", status: "Taken", delayMinutes: 5, date: "2026-06-29" }
];

export const INITIAL_EMERGENCY_CONTACTS = [
  {
    id: "CON-001",
    patientId: "PAT-8802",
    name: "Sarah Vance",
    relationship: "Primary Guardian (Daughter)",
    phone: "+1 (555) 019-2834",
    email: "sarah.vance@clinical.org",
    role: "Guardian",
    isPrimary: true
  },
  {
    id: "CON-002",
    patientId: "PAT-8802",
    name: "Thomas Vance",
    relationship: "Secondary Guardian (Son-in-law)",
    phone: "+1 (555) 019-5839",
    email: "thomas.vance@clinical.org",
    role: "Guardian",
    isPrimary: false
  },
  {
    id: "CON-003",
    patientId: "PAT-8802",
    name: "Dr. Alexander Thorne",
    relationship: "Primary Cardiologist (Doctor)",
    phone: "+1 (555) 993-8021",
    email: "a.thorne@metrohealth.org",
    role: "Doctor",
    isPrimary: false
  },
  {
    id: "CON-004",
    patientId: "PAT-8802",
    name: "St. Jude Medical Center",
    relationship: "Primary Care Hospital",
    phone: "+1 (555) 800-4422",
    email: "emergency@stjudemedical.org",
    role: "Hospital",
    isPrimary: false
  },
  {
    id: "CON-005",
    patientId: "PAT-8802",
    name: "Metro-Cardiac Ambulance Service",
    relationship: "Emergency Cardiac Transport",
    phone: "911 (Option 3)",
    email: "ambulance@metrodispatch.org",
    role: "Ambulance",
    isPrimary: false
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: "RX-4091",
    patientId: "PAT-8802",
    doctorName: "Dr. Alexander Thorne",
    uploadDate: "2026-06-25",
    title: "Cardiovascular Care Plan & Lipitor adjustment",
    notes: "Increased Atorvastatin (Lipitor) to 20mg at night. Continue Metformin 500mg morning and night. Monitor heart rate daily.",
    fileUrl: "presc_cardio_june2026.pdf",
    version: "v1.2",
    size: "1.4 MB",
    signature: "Dr. Alexander Thorne, FACC"
  },
  {
    id: "RX-3801",
    patientId: "PAT-8802",
    doctorName: "Dr. Alexander Thorne",
    uploadDate: "2026-05-10",
    title: "Hypertension & Diabetes Standard Regimen",
    notes: "Initiated Metformin (Glucophage) 500mg, Lisinopril 10mg once daily. Patient reports mild fatigue.",
    fileUrl: "presc_standard_may2026.pdf",
    version: "v1.0",
    size: "1.2 MB",
    signature: "Dr. Alexander Thorne, FACC"
  }
];

export const INITIAL_MEDICAL_DOCUMENTS = [
  {
    id: "DOC-001",
    patientId: "PAT-8802",
    title: "HbA1c & Blood Glucose Report",
    type: "Blood Test",
    uploadDate: "2026-06-27",
    uploaderName: "Sarah Vance (Guardian)",
    uploaderRole: "Guardian",
    fileUrl: "blood_report_june27.pdf",
    size: "2.8 MB"
  },
  {
    id: "DOC-002",
    patientId: "PAT-8802",
    title: "Cardiac Echocardiogram Assessment",
    type: "Lab Report",
    uploadDate: "2026-06-20",
    uploaderName: "Dr. Alexander Thorne",
    uploaderRole: "Doctor",
    fileUrl: "echo_report_june20.pdf",
    size: "4.1 MB"
  },
  {
    id: "DOC-003",
    patientId: "PAT-8802",
    title: "Chest X-Ray Post-Exam Review",
    type: "CT Scan",
    uploadDate: "2026-05-15",
    uploaderName: "Sarah Vance (Guardian)",
    uploaderRole: "Guardian",
    fileUrl: "xray_may15.png",
    size: "8.5 MB"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NTF-001",
    patientId: "PAT-8802",
    title: "Medication Missed Alert",
    message: "Low-Dose Aspirin scheduled for 01:00 PM was missed.",
    type: "Warning",
    timestamp: "2026-07-02T13:30:00+05:30",
    read: false
  },
  {
    id: "NTF-002",
    patientId: "PAT-8802",
    title: "New Prescription",
    message: "Dr. Alexander Thorne uploaded a new prescription: RX-4091.",
    type: "Info",
    timestamp: "2026-06-25T15:45:00+05:30",
    read: true
  },
  {
    id: "NTF-003",
    patientId: "PAT-8802",
    title: "Vitals Warning: Elevated Heart Rate",
    message: "Systolic alert: Pulse rate exceeded 102 bpm during morning walk.",
    type: "Danger",
    timestamp: "2026-07-02T09:12:00+05:30",
    read: false
  }
];

// Telemetry datasets
export const INITIAL_TELEMETRY = {
  vitals: {
    heartRate: 74,
    temperature: 36.8,
    ecgStatus: "Normal Sinus Rhythm",
    healthStatus: "Excellent" // Excellent, Good, Warning, Critical
  },
  pulseHistory: [
    { label: "08:00 AM", value: 68 },
    { label: "10:00 AM", value: 84 },
    { label: "12:00 PM", value: 72 },
    { label: "02:00 PM", value: 78 },
    { label: "04:00 PM", value: 92 },
    { label: "06:00 PM", value: 81 },
    { label: "08:00 PM", value: 74 },
    { label: "10:00 PM", value: 70 }
  ],
  tempHistory: [
    { label: "08:00 AM", value: 36.5 },
    { label: "10:00 AM", value: 36.7 },
    { label: "12:00 PM", value: 36.8 },
    { label: "02:00 PM", value: 37.1 },
    { label: "04:00 PM", value: 36.9 },
    { label: "06:00 PM", value: 36.8 },
    { label: "08:00 PM", value: 36.7 },
    { label: "10:00 PM", value: 36.6 }
  ]
};
