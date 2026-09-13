import React, { useState, useEffect } from 'react';
import { Activity, Server, Zap } from 'lucide-react';
import api from '../../services/api.js';

export default function BackendLiveBeacon({ inline = false }) {
  const [health, setHealth] = useState(null);
  const [latency, setLatency] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const pingServer = async () => {
      const start = performance.now();
      try {
        const res = await api.get('/health');
        const end = performance.now();
        setLatency(Math.round(end - start));
        setIsOnline(true);
        if (res.data?.data) {
          setHealth(res.data.data);
        }
      } catch (err) {
        setIsOnline(false);
        setLatency(null);
      }
    };

    pingServer();
    const interval = setInterval(pingServer, 20000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    if (!seconds) return 'Active';
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    return `${m}m ${seconds % 60}s`;
  };

  if (inline) {
    return (
      <div 
        onClick={() => setShowDetail(!showDetail)}
        className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#edf3ed] dark:bg-[#0c160e] border border-emerald-500/20 dark:border-emerald-400/20 shadow-[0_2px_8px_rgba(16,185,129,0.12)] text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-[#e4ece4] dark:hover:bg-[#112215] transition-all select-none group"
        title="Click to toggle server telemetry"
      >
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          {isOnline ? (
            <>
              {/* Radiating Multi-Ring Radar Wave */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400/30 animate-pulse"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
          )}
        </span>
        <span className="text-[11px] font-extrabold tracking-tight">
          {isOnline ? 'Live Backend' : 'Connecting...'}
        </span>
        {latency !== null && (
          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 rounded-full border border-emerald-500/20 shadow-xs">
            {latency}ms
          </span>
        )}

        {/* Popover */}
        {showDetail && health && (
          <div className="absolute top-10 right-0 z-50 w-56 p-3 rounded-2xl bg-white dark:bg-[#122015] shadow-2xl border border-black/10 dark:border-white/10 text-left animate-fade-in text-xs space-y-1.5">
            <div className="flex items-center justify-between font-extrabold text-[#153f31] dark:text-emerald-400 pb-1 border-b border-black/5 dark:border-white/10">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Live Telemetry
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                {health.status}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
              <span>Ping Latency:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{latency} ms</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
              <span>Server Uptime:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatUptime(health.uptimeSeconds)}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
              <span>Memory Heap:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{health.memoryMb} MB</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
      <div 
        onClick={() => setShowDetail(!showDetail)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 dark:bg-[#101b13]/90 backdrop-blur-xl border border-emerald-500/25 dark:border-emerald-400/20 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.2),0_2px_6px_rgba(0,0,0,0.05)] text-xs font-bold text-slate-700 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer select-none group"
      >
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          {isOnline ? (
            <>
              {/* Radiating Multi-Ring Radar Wave */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400/30 animate-pulse"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
          )}
        </span>
        <span className="text-[11px] font-extrabold tracking-tight">
          {isOnline ? 'Server Active' : 'Connecting...'}
        </span>
        {latency !== null && (
          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 rounded-full border border-emerald-500/20 shadow-xs">
            {latency}ms
          </span>
        )}
      </div>

      {/* Popover */}
      {showDetail && health && (
        <div className="absolute bottom-12 right-0 w-60 p-3.5 rounded-2xl bg-white/95 dark:bg-[#111d14]/95 backdrop-blur-2xl shadow-2xl border border-black/10 dark:border-white/10 text-left animate-fade-in text-xs space-y-2">
          <div className="flex items-center justify-between font-extrabold text-[#153f31] dark:text-emerald-400 pb-1.5 border-b border-black/5 dark:border-white/10">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Backend Heartbeat
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-black">
              {health.status}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>API Latency:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{latency} ms</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Server Uptime:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatUptime(health.uptimeSeconds)}</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Memory Heap:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{health.memoryMb} MB</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Environment:</span>
            <span className="font-mono font-bold uppercase text-slate-800 dark:text-slate-200">{health.env}</span>
          </div>
        </div>
      )}
    </div>
  );
}
