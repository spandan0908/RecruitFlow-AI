'use client';

import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, Users, UserPlus, Kanban, Briefcase, 
  Calendar, Copy, Building2, Bot, BarChart3, Sliders, History, Sparkles 
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'candidates' 
  | 'import' 
  | 'pipeline' 
  | 'jobs' 
  | 'interviews' 
  | 'duplicates' 
  | 'clients' 
  | 'aitools' 
  | 'analytics' 
  | 'integrations' 
  | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  candidateCount: number;
  duplicateCount: number;
  jobCount: number;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  candidateCount,
  duplicateCount,
  jobCount,
  currentRole
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HR_MANAGER', 'RECRUITER', 'SME', 'CLIENT'] },
    { id: 'pipeline', label: 'Candidate Pipeline', icon: Kanban, badge: candidateCount, roles: ['ADMIN', 'HR_MANAGER', 'RECRUITER', 'SME', 'CLIENT'] },
    { id: 'import', label: 'Candidate Import Hub', icon: UserPlus, highlight: true, roles: ['ADMIN', 'HR_MANAGER', 'RECRUITER'] },
    { id: 'candidates', label: 'All Candidates', icon: Users, badge: candidateCount, roles: ['ADMIN', 'HR_MANAGER', 'RECRUITER', 'SME', 'CLIENT'] },
    { id: 'jobs', label: 'Job Requisitions', icon: Briefcase, badge: jobCount, roles: ['ADMIN', 'HR_MANAGER', 'RECRUITER', 'CLIENT'] },
    { id: 'interviews', label: 'Interviews & SME Feedback', icon: Calendar, roles: ['ADMIN', 'HR_MANAGER', 'RECRUITER', 'SME'] },
    { id: 'duplicates', label: 'Duplicate Merger', icon: Copy, badge: duplicateCount > 0 ? duplicateCount : undefined, alert: duplicateCount > 0, roles: ['ADMIN', 'HR_MANAGER', 'RECRUITER'] },
    { id: 'aitools', label: 'AI Intelligence Suite', icon: Bot, highlight: true, roles: ['ADMIN', 'HR_MANAGER', 'RECRUITER', 'SME'] },
    { id: 'clients', label: 'Client Accounts', icon: Building2, roles: ['ADMIN', 'HR_MANAGER', 'CLIENT'] },
    { id: 'analytics', label: 'Recruitment Analytics', icon: BarChart3, roles: ['ADMIN', 'HR_MANAGER', 'CLIENT'] },
    { id: 'integrations', label: 'Integration Settings', icon: Sliders, roles: ['ADMIN', 'HR_MANAGER'] },
    { id: 'audit', label: 'System Audit Trail', icon: History, roles: ['ADMIN', 'HR_MANAGER'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className="w-64 border-r border-slate-800 glass-panel flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-3 flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation ({currentRole})
        </div>

        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.alert 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : isActive 
                    ? 'bg-blue-500/30 text-blue-300' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status Banner */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="font-medium text-slate-300">RecruitFlow Engine</span>
          </div>
          <span className="text-[10px] text-slate-500">v2.4 Prod</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-500">Single Source of Truth Connected</p>
      </div>
    </aside>
  );
};
