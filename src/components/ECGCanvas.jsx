import React, { useRef, useEffect } from 'react';
import { useUI } from '../contexts/UIContext';

export const ECGCanvas = ({ heartRate = 72, height = 120 }) => {
  const canvasRef = useRef(null);
  const { darkMode } = useUI();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const canvasHeight = height;

    // ECG wave properties
    let animationFrameId;
    let x = 0;
    const points = new Array(Math.ceil(width)).fill(canvasHeight / 2);

    // Heart cycle tracking
    const bpm = heartRate;
    const beatsPerSec = bpm / 60;
    const framesPerSec = 60; // Assuming 60fps standard requestAnimationFrame
    const cycleLength = framesPerSec / beatsPerSec; // Frames per heartbeat
    let cycleFrame = 0;

    const drawGrid = (context) => {
      context.strokeStyle = darkMode ? 'rgba(20, 184, 166, 0.08)' : 'rgba(37, 99, 235, 0.05)';
      context.lineWidth = 1;

      // Vertical lines
      for (let i = 0; i < width; i += 20) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvasHeight);
        context.stroke();
      }

      // Horizontal lines
      for (let j = 0; j < canvasHeight; j += 20) {
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(width, j);
        context.stroke();
      }
    };

    const getEcgValue = (frame) => {
      const t = frame / cycleLength; // 0 to 1 normalized heart cycle
      const baseline = canvasHeight / 2;

      // P-Q-R-S-T wave calculation
      // P wave: small positive bump around 0.1 - 0.2
      if (t > 0.1 && t < 0.22) {
        const angle = ((t - 0.1) / 0.12) * Math.PI;
        return baseline - Math.sin(angle) * 8;
      }
      
      // Q wave: small dip right before R at 0.3
      if (t >= 0.28 && t < 0.32) {
        return baseline + 4;
      }

      // R wave: massive spike up at 0.34
      if (t >= 0.32 && t < 0.36) {
        const progress = (t - 0.32) / 0.04;
        return baseline - Math.sin(progress * Math.PI) * 45;
      }

      // S wave: sharp dip down at 0.37
      if (t >= 0.36 && t < 0.40) {
        const progress = (t - 0.36) / 0.04;
        return baseline + Math.sin(progress * Math.PI) * 15;
      }

      // T wave: medium positive bump at 0.55 - 0.70
      if (t > 0.52 && t < 0.68) {
        const angle = ((t - 0.52) / 0.16) * Math.PI;
        return baseline - Math.sin(angle) * 14;
      }

      // U wave (optional): very small bump at 0.8
      if (t > 0.76 && t < 0.84) {
        const angle = ((t - 0.76) / 0.08) * Math.PI;
        return baseline - Math.sin(angle) * 2;
      }

      return baseline;
    };

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = darkMode ? '#0e1726' : '#ffffff';
      ctx.fillRect(0, 0, width, canvasHeight);

      // Draw Grid
      drawGrid(ctx);

      // Add new point representing current position of lead
      const yVal = getEcgValue(cycleFrame);
      points[x] = yVal;

      // Draw active waveform line
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = darkMode ? '#14b8a6' : '#2563eb'; // Teal in dark, Blue in light
      ctx.lineJoin = 'round';

      for (let i = 0; i < width; i++) {
        if (i === 0) {
          ctx.moveTo(0, points[0]);
        } else {
          ctx.lineTo(i, points[i]);
        }
      }
      ctx.stroke();

      // Draw rolling lead marker (dot)
      ctx.fillStyle = darkMode ? '#2dd4bf' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, points[x], 4, 0, 2 * Math.PI);
      ctx.fill();

      // Increment rolling index
      x = (x + 1) % Math.floor(width);
      cycleFrame = (cycleFrame + 1) % Math.floor(cycleLength);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [heartRate, darkMode, height]);

  return (
    <div className={`relative overflow-hidden border border-slate-200/60 dark:border-slate-800 rounded-medical ${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-sm`}>
      <div className="absolute top-3 left-4 flex items-center justify-between w-[90%] pointer-events-none z-10">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">ECG Lead II</span>
        </div>
        <span className="text-xs font-mono text-slate-500">{heartRate} BPM • Real-time</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};
