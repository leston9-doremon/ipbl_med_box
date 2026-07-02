import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout Guard
import { PortalLayout } from './layouts/PortalLayout';

// Auth Screen
import { Login } from './pages/auth/Login';

// Patient Portal Screens
import { PatientDashboard } from './pages/patient/Dashboard';
import { TodayMedicines } from './pages/patient/TodayMedicines';
import { MissedDoses } from './pages/patient/MissedDoses';
import { Vitals } from './pages/patient/Vitals';
import { Prescriptions } from './pages/patient/Prescriptions';
import { Documents } from './pages/patient/Documents';
import { EmergencyContacts } from './pages/patient/EmergencyContacts';
import { Profile } from './pages/patient/Profile';

// Guardian Portal Screens
import { GuardianDashboard } from './pages/guardian/Dashboard';
import { Schedule } from './pages/guardian/Schedule';
import { GuardianMissedDoses } from './pages/guardian/MissedDoses';
import { GuardianVitals } from './pages/guardian/Vitals';
import { GuardianPrescriptions } from './pages/guardian/Prescriptions';
import { GuardianDocuments } from './pages/guardian/Documents';
import { GuardianEmergencyContacts } from './pages/guardian/EmergencyContacts';
import { GuardianProfile } from './pages/guardian/Profile';

// Doctor Portal Screens
import { PatientSelector } from './pages/doctor/Patients';
import { DoctorDashboard } from './pages/doctor/Dashboard';
import { DoctorHistory } from './pages/doctor/History';
import { DoctorSchedule } from './pages/doctor/Schedule';
import { DoctorMissedDoses } from './pages/doctor/MissedDoses';
import { DoctorVitals } from './pages/doctor/Vitals';
import { DoctorPrescriptionUpload } from './pages/doctor/PrescriptionUpload';
import { DoctorDocuments } from './pages/doctor/Documents';
import { DoctorEmergencyContacts } from './pages/doctor/EmergencyContacts';
import { DoctorPatientProfile } from './pages/doctor/PatientProfile';

// Session Landings
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const defaultPaths = {
    Patient: '/patient/dashboard',
    Guardian: '/guardian/dashboard',
    Doctor: '/doctor/patients',
  };
  return <Navigate to={defaultPaths[user.role]} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Patient Routes */}
        <Route path="/patient" element={<PortalLayout requiredRole="Patient" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="today" element={<TodayMedicines />} />
          <Route path="missed" element={<MissedDoses />} />
          <Route path="vitals" element={<Vitals />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="documents" element={<Documents />} />
          <Route path="contacts" element={<EmergencyContacts />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Protected Guardian Routes */}
        <Route path="/guardian" element={<PortalLayout requiredRole="Guardian" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GuardianDashboard />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="missed" element={<GuardianMissedDoses />} />
          <Route path="vitals" element={<GuardianVitals />} />
          <Route path="prescriptions" element={<GuardianPrescriptions />} />
          <Route path="documents" element={<GuardianDocuments />} />
          <Route path="contacts" element={<GuardianEmergencyContacts />} />
          <Route path="profile" element={<GuardianProfile />} />
        </Route>

        {/* Protected Doctor Routes */}
        <Route path="/doctor" element={<PortalLayout requiredRole="Doctor" />}>
          <Route index element={<Navigate to="patients" replace />} />
          <Route path="patients" element={<PatientSelector />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="history" element={<DoctorHistory />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="missed" element={<DoctorMissedDoses />} />
          <Route path="vitals" element={<DoctorVitals />} />
          <Route path="prescription-upload" element={<DoctorPrescriptionUpload />} />
          <Route path="documents" element={<DoctorDocuments />} />
          <Route path="contacts" element={<DoctorEmergencyContacts />} />
          <Route path="patient-profile" element={<DoctorPatientProfile />} />
        </Route>

        {/* Catch-all and Entry redirect */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
