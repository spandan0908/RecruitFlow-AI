'use client';

import React from 'react';
import { UserRole } from '../types';
import { 
  Sparkles, Search, Bell, Shield, UserCheck, Briefcase, 
  UserPlus, FileText, CheckCircle2 
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenImport: () => void;
  onOpenNewJob: () => void;
  duplicateCount: number;
  userEmail?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  searchQuery,
  onSearchChange,
  onOpenImport,
  onOpenNewJob,
  duplicateCount,
  userEmail,
  onLogout
}) => {
  const roleBadges: Record<UserRole, { label: string; color: string; icon: any }> = {
    ADMIN: { label: 'Admin', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Shield },
    HR_MANAGER: { label: 'HR Manager', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: UserCheck },
    RECRUITER: { label: 'Recruiter', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: UserPlus },
    SME: { label: 'SME Evaluator', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: FileText },
    CLIENT: { label: 'Hiring Manager / Client', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: Briefcase }
  };

  const RoleIcon = roleBadges[currentRole].icon;

  return (
    <header className="h-16 border-b border-slate-800 glass-panel sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-tight">RecruitFlow</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              AI CRM
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">Enterprise Recruitment Single Source of Truth</p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidates, skills, jobs, clients, notes..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-900/80 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Role Switcher & Header Controls */}
      <div className="flex items-center space-x-3">
        {/* Quick Action Buttons based on Role */}
        {(currentRole === 'ADMIN' || currentRole === 'RECRUITER' || currentRole === 'HR_MANAGER') && (
          <button
            onClick={onOpenImport}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Import Candidate</span>
          </button>
        )}

        {(currentRole === 'ADMIN' || currentRole === 'HR_MANAGER') && (
          <button
            onClick={onOpenNewJob}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>Post Job</span>
          </button>
        )}

        {/* Duplicate Indicator */}
        {duplicateCount > 0 && (
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>{duplicateCount} Duplicates Detected</span>
          </div>
        )}

        {/* Role Switcher Dropdown */}
        <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-lg p-1">
          <RoleIcon className="w-4 h-4 ml-1 text-slate-400" />
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent text-xs font-semibold text-slate-200 py-1 pl-1.5 pr-2 focus:outline-none cursor-pointer"
            title="Switch User Role View"
          >
            <option value="ADMIN" className="bg-slate-900 text-slate-100">Role: Admin</option>
            <option value="HR_MANAGER" className="bg-slate-900 text-slate-100">Role: HR Manager</option>
            <option value="RECRUITER" className="bg-slate-900 text-slate-100">Role: Recruiter</option>
            <option value="SME" className="bg-slate-900 text-slate-100">Role: SME Evaluator</option>
            <option value="CLIENT" className="bg-slate-900 text-slate-100">Role: Hiring Manager / Client</option>
          </select>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-600 flex items-center justify-center font-bold text-xs text-white" title={userEmail}>
            {currentRole === 'ADMIN' ? 'AD' : currentRole === 'HR_MANAGER' ? 'HR' : currentRole === 'RECRUITER' ? 'RC' : currentRole === 'SME' ? 'SM' : 'CL'}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-2.5 py-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-all cursor-pointer"
              title="Sign Out of Session"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
