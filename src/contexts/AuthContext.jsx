import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Sample credentials and user templates
const MOCK_PROFILES = {
  Patient: {
    username: 'eleanor_vance',
    role: 'Patient',
    name: 'Eleanor Vance',
    patientId: 'PAT-8802',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    title: 'Senior Patient'
  },
  Guardian: {
    username: 'sarah_vance',
    role: 'Guardian',
    name: 'Sarah Vance',
    patientId: 'PAT-8802', // Monitoring Eleanor
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    title: 'Primary Health Guardian'
  },
  Doctor: {
    username: 'dr_thorne',
    role: 'Doctor',
    name: 'Dr. Alexander Thorne',
    patientId: null, // Selects dynamically
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    title: 'Senior Cardiologist, FACC'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medical_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedPatientId, setSelectedPatientId] = useState(() => {
    return localStorage.getItem('medical_selected_patient_id') || 'PAT-8802';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('medical_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medical_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (selectedPatientId) {
      localStorage.setItem('medical_selected_patient_id', selectedPatientId);
    } else {
      localStorage.removeItem('medical_selected_patient_id');
    }
  }, [selectedPatientId]);

  const login = (username, password, role) => {
    // Standardize credentials for easy testing
    const defaultUser = MOCK_PROFILES[role];
    if (!defaultUser) return { success: false, error: 'Invalid role selection' };
    
    // Simulate simple validation
    const targetUsername = username.trim().toLowerCase();
    const targetPassword = password.trim();

    if (
      (role === 'Patient' && targetUsername === 'patient' && targetPassword === 'patient123') ||
      (role === 'Guardian' && targetUsername === 'guardian' && targetPassword === 'guardian123') ||
      (role === 'Doctor' && targetUsername === 'doctor' && targetPassword === 'doctor123') ||
      (targetUsername === defaultUser.username && targetPassword === 'password123')
    ) {
      setUser(defaultUser);
      // Reset selected patient for Doctor
      if (role === 'Doctor') {
        setSelectedPatientId('PAT-8802');
      } else {
        setSelectedPatientId(defaultUser.patientId);
      }
      return { success: true };
    }
    
    return { 
      success: false, 
      error: `Invalid credentials. Use username: '${role.toLowerCase()}' and password: '${role.toLowerCase()}123' for testing.` 
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medical_auth_user');
    localStorage.removeItem('medical_selected_patient_id');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        selectedPatientId,
        setSelectedPatientId,
        profiles: MOCK_PROFILES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
