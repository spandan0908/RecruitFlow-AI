'use client';

import React from 'react';
import { Candidate, Job, Interview, UserRole } from '../../types';
import { 
  Briefcase, Users, Clock, Calendar, CheckCircle2, XCircle, 
  Sparkles, TrendingUp, ChevronRight, UserPlus, FileSearch, Filter 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';

interface DashboardProps {
  candidates: Candidate[];
  jobs: Job[];
  interviews: Interview[];
  currentRole: UserRole;
  onNavigateTab: (tab: any) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenImport: () => void;
  onOpenNewJob: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  candidates,
  jobs,
  interviews,
  currentRole,
  onNavigateTab,
  onSelectCandidate,
  onOpenImport,
  onOpenNewJob
}) => {
  // KPI Calculations
  const openJobsCount = jobs.filter(j => j.status === 'Active').length;
  const newCandidatesTodayCount = candidates.filter(c => c.createdAt >= '2026-08-01').length;
  const pendingReviewsCount = candidates.filter(c => c.stage === 'Applied' || c.stage === 'Recruiter Review' || c.stage === 'HR Review').length;
  const interviewsTodayCount = interviews.filter(i => i.status === 'Scheduled').length;
  const offersPendingCount = candidates.filter(c => c.stage === 'Offer Released').length;
  const joinedCandidatesCount = candidates.filter(c => c.stage === 'Joined').length;
  const rejectedCandidatesCount = candidates.filter(c => c.stage === 'Rejected').length;

  // Hiring Funnel Data
  const stagesList = [
    'Applied', 'Recruiter Review', 'HR Review', 'SME Assigned', 
    'Interview Scheduled', 'Technical Round', 'Client Round', 
    'Offer Released', 'Joined', 'Rejected'
  ];

  const funnelData = stagesList.map(stage => ({
    stage: stage.replace(' Scheduled', '').replace(' Review', ''),
    candidates: candidates.filter(c => c.stage === stage).length
  }));

  // Candidate Source Distribution Data
  const sourceCounts: Record<string, number> = {};
  candidates.forEach(c => {
    sourceCounts[c.source] = (sourceCounts[c.source] || 0) + 1;
  });

  const sourceData = Object.keys(sourceCounts).map(source => ({
    name: source,
    value: sourceCounts[source]
  }));

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#64748b'];

  // Monthly Hiring Data
  const monthlyData = [
    { month: 'Apr', Sourced: 24, Interviews: 18, Offers: 4, Placed: 3 },
    { month: 'May', Sourced: 32, Interviews: 22, Offers: 6, Placed: 5 },
    { month: 'Jun', Sourced: 45, Interviews: 30, Offers: 9, Placed: 7 },
    { month: 'Jul', Sourced: 58, Interviews: 41, Offers: 12, Placed: 9 },
    { month: 'Aug', Sourced: candidates.length, Interviews: interviews.length + 5, Offers: 3, Placed: 2 },
  ];

  // Time-to-Hire Data
  const timeToHireData = [
    { role: 'Data Engineer', avgDays: 18 },
    { role: 'Cloud Architect', avgDays: 22 },
    { role: 'Full Stack Dev', avgDays: 14 },
    { role: 'DevOps SME', avgDays: 16 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-blue-950/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" /> Active Workspace: Staffing Agency HQ
              </span>
              <span className="text-xs text-slate-400">View Mode: <strong className="text-white">{currentRole}</strong></span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 tracking-tight">
              Recruitment Command Center
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
              Single Source of Truth for candidate tracking, AI resume parsing, SME evaluations, and client requisitions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenImport}
              className="px-4 py-2 text-xs font-semibold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Import Candidates</span>
            </button>
            <button
              onClick={() => onNavigateTab('pipeline')}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Filter className="w-4 h-4 text-blue-400" />
              <span>Kanban Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Open Jobs</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{openJobsCount}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> 3 Client requisitions
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>New Candidates</span>
            <UserPlus className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{newCandidatesTodayCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Across 8 portal sources</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{pendingReviewsCount}</div>
          <div className="text-[10px] text-amber-400 mt-1">Action required by HR</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Interviews Today</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{interviewsTodayCount}</div>
          <div className="text-[10px] text-indigo-400 mt-1">SME rounds active</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Offers Pending</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{offersPendingCount}</div>
          <div className="text-[10px] text-purple-300 mt-1">Awaiting e-signatures</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Joined</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{joinedCandidatesCount}</div>
          <div className="text-[10px] text-teal-400 mt-1">Successfully placed</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-rose-500/40 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Rejected</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{rejectedCandidatesCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Archived profiles</div>
        </div>
      </div>

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Funnel Stage Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" /> Active Candidate Hiring Funnel
              </h3>
              <p className="text-slate-400 text-xs">Volume distribution across recruitment pipeline stages</p>
            </div>
            <button 
              onClick={() => onNavigateTab('pipeline')} 
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              Open Kanban <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="stage" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="candidates" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sourcing Channel Split */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-indigo-400" /> Candidate Sources
            </h3>
            <p className="text-slate-400 text-xs">Origin breakdown of imported talent</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`source-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Hiring Trends */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="mb-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Recruitment Velocity
            </h3>
            <p className="text-slate-400 text-xs">Candidates Sourced, Interviewed, Offered & Placed</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSourced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Sourced" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSourced)" />
                <Area type="monotone" dataKey="Placed" stroke="#10b981" fillOpacity={1} fill="url(#colorPlaced)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time-to-Hire by Role */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="mb-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" /> Average Time-to-Hire (Days)
            </h3>
            <p className="text-slate-400 text-xs">Days from resume import to client job offer release</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeToHireData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="role" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="avgDays" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Candidates Quick Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Recent Active Candidates</h3>
            <p className="text-slate-400 text-xs">Top profiles imported across agency portals</p>
          </div>
          <button
            onClick={() => onNavigateTab('candidates')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            View All ({candidates.length}) <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Target Job</th>
                <th className="py-2.5 px-3">Source Portal</th>
                <th className="py-2.5 px-3">AI Match Score</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {candidates.slice(0, 5).map(cand => (
                <tr key={cand.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{cand.name}</div>
                    <div className="text-[11px] text-slate-400">{cand.email} • {cand.yearsExperience} yrs exp</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">{cand.jobTitle}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {cand.source}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${cand.matchScore >= 90 ? 'bg-emerald-500' : cand.matchScore >= 75 ? 'bg-blue-500' : 'bg-amber-500'}`}
                          style={{ width: `${cand.matchScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-200">{cand.matchScore}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {cand.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectCandidate(cand)}
                      className="px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded border border-blue-500/30 transition-all cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
