'use client';

import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Sparkles, Lock, Mail, Eye, EyeOff, Shield, UserCheck, UserPlus, FileText, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@recruitflow.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const demoUsers: { role: UserRole; name: string; email: string; color: string; icon: any }[] = [
    { role: 'ADMIN', name: 'System Admin', email: 'admin@recruitflow.ai', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300', icon: Shield },
    { role: 'HR_MANAGER', name: 'Rachel Green (HR)', email: 'rachel.green@recruitflow.ai', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300', icon: UserCheck },
    { role: 'RECRUITER', name: 'Alex Mercer (Recruiter)', email: 'alex.mercer@recruitflow.ai', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300', icon: UserPlus },
    { role: 'SME', name: 'Dr. Michael Vance (SME)', email: 'dr.vance@recruitflow.ai', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300', icon: FileText },
    { role: 'CLIENT', name: 'Sarah Jenkins (Client)', email: 's.jenkins@apextech.io', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300', icon: Briefcase }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both username/email and password.');
      return;
    }
    setErrorMsg('');
    onLogin(email, selectedRole);
  };

  const handleSelectDemoUser = (demo: typeof demoUsers[0]) => {
    setEmail(demo.email);
    setSelectedRole(demo.role);
    setPassword('demoPass123!');
    onLogin(demo.email, demo.role);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center shadow-xl shadow-blue-500/25">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-3">
            Sign in to <span className="gradient-text">RecruitFlow AI</span>
          </h1>
          <p className="text-xs text-slate-400">Enterprise AI Recruitment CRM for Staffing Agencies</p>
        </div>

        {/* Login Form Card */}
        <div className="glass-modal p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email / Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Account Role View</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ADMIN">System Administrator</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="RECRUITER">Senior Recruiter</option>
                <option value="SME">Subject Matter Expert (SME)</option>
                <option value="CLIENT">Hiring Manager / Client Account</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                />
                <span>Remember me on this browser</span>
              </label>

              <button type="button" onClick={() => alert('Password reset email dispatched to registered email.')} className="text-blue-400 hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
            >
              <span>Sign In to CRM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* One-Click Quick Demo Sign Ins */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Quick 1-Click Demo Accounts
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              {demoUsers.map(demo => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleSelectDemoUser(demo)}
                    className={`w-full p-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${demo.color} hover:scale-[1.01]`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="font-semibold">{demo.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Sign In →</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted Enterprise Auth</span>
        </div>
      </div>
    </div>
  );
};
