import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UIProvider } from './contexts/UIContext'
import { AuthProvider } from './contexts/AuthContext'
import { MedicalProvider } from './contexts/MedicalContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <AuthProvider>
        <MedicalProvider>
          <App />
        </MedicalProvider>
      </AuthProvider>
    </UIProvider>
  </StrictMode>,
)
