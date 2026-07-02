import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, ShieldCheck, HeartPulse, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('patient');
  const [password, setPassword] = useState('patient123');
  const [role, setRole] = useState('Patient'); // Default role
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      const defaultPaths = {
        Patient: '/patient/dashboard',
        Guardian: '/guardian/dashboard',
        Doctor: '/doctor/patients',
      };
      navigate(defaultPaths[user.role] || '/login', { replace: true });
    }
  }, [user, navigate]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    // Auto-fill test logins for evaluating convenience
    if (newRole === 'Patient') {
      setUsername('patient');
      setPassword('patient123');
    } else if (newRole === 'Guardian') {
      setUsername('guardian');
      setPassword('guardian123');
    } else if (newRole === 'Doctor') {
      setUsername('doctor');
      setPassword('doctor123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(username, password, role);
      setLoading(false);
      if (result.success) {
        const from = location.state?.from?.pathname;
        const defaultPaths = {
          Patient: '/patient/dashboard',
          Guardian: '/guardian/dashboard',
          Doctor: '/doctor/patients',
        };
        navigate(from || defaultPaths[role], { replace: true });
      } else {
        setError(result.error);
      }
    }, 800); // realistic feel delay
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Animated Medical Backdrop (Gradient Orbs) */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.2, 0.9, 1],
            x: [0, 80, -40, 0],
            y: [0, -50, 60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/30 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 0.8, 1.1, 1],
            x: [0, -60, 80, 0],
            y: [0, 70, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-teal-500/20 blur-[120px]"
        />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 z-0" />

      {/* Main Container */}
      <div className="w-full max-w-5xl px-4 grid md:grid-cols-2 gap-8 z-10">
        
        {/* Left Side: Elegant Branding Illustration */}
        <div className="hidden md:flex flex-col justify-center text-slate-100 pr-8">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30">
            <HeartPulse size={26} className="stroke-[2.5]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Aura Smartbox &
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              Vitals Care System
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-sm">
            A commercial-grade clinical portal connecting smart IoT medication boxes, continuous telemetry monitoring, and real-time alerts. Designed for premium hospitals.
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-center space-x-3.5">
              <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xs text-slate-350 font-medium">HIPAA Compliant Data Architecture</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                <Activity size={18} />
              </div>
              <span className="text-xs text-slate-350 font-medium">Real-time Lead II ECG waveform analysis</span>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Card Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/80 border border-slate-800 rounded-[24px] p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm font-bold">Portal Access</span>
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Live V2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Please select your clinical role to continue.</p>
            </div>

            {/* Role selection tab buttons */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl mb-6 border border-slate-800/80">
              {['Patient', 'Guardian', 'Doctor'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all
                    ${role === r 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl font-medium">
                  {error}
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Username
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-500">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Enter clinical username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Security Password
                  </label>
                  <button type="button" className="text-[10px] font-bold text-primary hover:underline">
                    Forgot Key?
                  </button>
                </div>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-12 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-350"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <label className="flex items-center space-x-2 text-slate-450 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-primary focus:ring-0"
                  />
                  <span>Remember Session</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all mt-6"
              >
                {loading ? (
                  <span className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate as {role}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Test Credentials Helper Card */}
          <div className="mt-8 p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/50 flex flex-col space-y-1">
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Demo Credentials</span>
            <div className="grid grid-cols-3 gap-1 pt-1.5">
              <button
                onClick={() => {
                  setRole('Patient');
                  setUsername('patient');
                  setPassword('patient123');
                }}
                className="text-[9px] bg-slate-900 hover:bg-slate-850 text-slate-300 py-1 px-1.5 rounded-md border border-slate-800 truncate"
              >
                Patient Acc
              </button>
              <button
                onClick={() => {
                  setRole('Guardian');
                  setUsername('guardian');
                  setPassword('guardian123');
                }}
                className="text-[9px] bg-slate-900 hover:bg-slate-850 text-slate-300 py-1 px-1.5 rounded-md border border-slate-800 truncate"
              >
                Guardian Acc
              </button>
              <button
                onClick={() => {
                  setRole('Doctor');
                  setUsername('doctor');
                  setPassword('doctor123');
                }}
                className="text-[9px] bg-slate-900 hover:bg-slate-850 text-slate-300 py-1 px-1.5 rounded-md border border-slate-800 truncate"
              >
                Doctor Acc
              </button>
            </div>
            <span className="text-[8px] text-slate-600 mt-2 text-center">Clicking auto-completes selection instantly.</span>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
