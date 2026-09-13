import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  // Input states - empty by default (no dummy data)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      toast.error('Please enter both Email ID and Password');
      return;
    }

    try {
      await login(cleanEmail, password);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Email ID or Password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none bg-gradient-to-b from-[#0a150c] via-[#122415] to-[#050b06]">
      {/* Dynamic Multi-Stop Gradient Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none scale-110 filter blur-[45px]"
        style={{
          background: `
            radial-gradient(circle at 50% 30%, rgba(48, 92, 56, 0.75) 0%, rgba(25, 52, 30, 0.6) 35%, rgba(12, 27, 15, 0.85) 70%, #050b06 100%),
            linear-gradient(135deg, #0e1d11 0%, #1c3621 35%, #0f2214 70%, #040905 100%)
          `
        }}
      />

      {/* Radiant Gradient Glowing Orbs for rich color depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[12%] left-[18%] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#2d5f37]/45 to-[#4d8a59]/35 filter blur-[100px]" />
        <div className="absolute bottom-[12%] right-[18%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#1d4224]/50 to-[#0e2513]/75 filter blur-[90px]" />
        <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-r from-[#173a1f]/35 via-[#295832]/30 to-[#102b16]/35 filter blur-[110px]" />
      </div>

      {/* Subtle Vignette Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="w-full max-w-[360px] sm:max-w-[375px] relative z-10 animate-fade-in pt-12">
        
        {/* Top Avatar Circle Badge with Gradient */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-20 h-20 rounded-full bg-gradient-to-b from-[#28462b] via-[#1c321e] to-[#122214] border-2 border-white/25 shadow-[0_12px_28px_rgba(0,0,0,0.55)] flex items-center justify-center text-white">
          <User className="w-9 h-9 text-white stroke-[1.5]" />
        </div>

        {/* Frosted Glass Card with Gradient Sheen */}
        <div className="relative rounded-[28px] bg-gradient-to-br from-white/[0.16] via-white/[0.08] to-white/[0.04] backdrop-blur-2xl border border-white/35 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.4)] pt-14 pb-7 px-6 sm:px-8 overflow-hidden">
          
          {/* Diagonal Glass Sheen Reflection */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-white/25 via-white/5 to-transparent rotate-45 pointer-events-none rounded-3xl" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Hidden catchers to prevent browser aggressive auto-fill */}
            <input type="text" name="prevent_autofill_user" className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="password" name="prevent_autofill_pwd" className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Email ID Field */}
            <div className="flex items-center rounded-md bg-[#e4e7e4] overflow-hidden shadow-sm border border-black/10 focus-within:ring-2 focus-within:ring-[#2d4c2e]/60 transition-all">
              <div className="w-11 h-11 flex items-center justify-center bg-black/5 text-slate-700 border-r border-black/10 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="admin_email_id"
                id="admin_email_id"
                autoComplete="off"
                spellCheck="false"
                required
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-transparent text-slate-900 text-sm font-medium placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center rounded-md bg-[#e4e7e4] overflow-hidden shadow-sm border border-black/10 focus-within:ring-2 focus-within:ring-[#2d4c2e]/60 transition-all">
              <div className="w-11 h-11 flex items-center justify-center bg-black/5 text-slate-700 border-r border-black/10 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="admin_password_val"
                id="admin_password_val"
                autoComplete="new-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-transparent text-slate-900 text-sm font-medium placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-2.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-[11px] text-white/80 font-medium pt-1 px-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 rounded accent-[#1c2e1d] cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <span className="text-white/70 hover:text-white cursor-pointer transition-colors italic">
                Forgot Password?
              </span>
            </div>

            {/* LOGIN Button with Gradient */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-5 py-3 rounded-md bg-gradient-to-r from-[#1b341f] via-[#2a502f] to-[#1c3621] hover:from-[#234428] hover:via-[#35633b] hover:to-[#24472a] text-white text-xs font-black uppercase tracking-[0.25em] shadow-[0_4px_16px_rgba(0,0,0,0.35)] border border-white/15 active:scale-[0.98] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>LOGIN</span>
              )}
            </button>
          </form>

          {/* Go to Portfolio Website Option */}
          <div className="mt-5 pt-3 border-t border-white/15 text-center">
            <a
              href={
                typeof window !== 'undefined' && window.location.hostname.includes('github.io')
                  ? 'https://ajit0121k.github.io/Ajit-Portfolio/'
                  : '/'
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/75 hover:text-white transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Go to Portfolio Website</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
