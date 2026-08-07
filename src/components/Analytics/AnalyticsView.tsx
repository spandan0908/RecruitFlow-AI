'use client';

import React from 'react';
import { Candidate, Job, Interview } from '../../types';
import { BarChart3, TrendingUp, PieChart as PieIcon, Award, Clock, CheckCircle2 } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';

interface AnalyticsViewProps {
  candidates: Candidate[];
  jobs: Job[];
  interviews: Interview[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  candidates,
  jobs,
  interviews
}) => {
  const sourceCounts: Record<string, number> = {};
  candidates.forEach(c => {
    sourceCounts[c.source] = (sourceCounts[c.source] || 0) + 1;
  });

  const sourceData = Object.keys(sourceCounts).map(source => ({
    name: source,
    value: sourceCounts[source]
  }));

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#64748b'];

  const recruiterPerformance = [
    { recruiter: 'Alex Mercer', Sourced: 14, Interviews: 10, Offers: 4, Placed: 3 },
    { recruiter: 'Jessica Taylor', Sourced: 11, Interviews: 7, Offers: 3, Placed: 2 },
    { recruiter: 'Rachel Green', Sourced: 8, Interviews: 5, Offers: 2, Placed: 2 }
  ];

  const offerAcceptanceData = [
    { status: 'Accepted & Joined', count: candidates.filter(c => c.stage === 'Joined' || c.stage === 'Offer Released').length },
    { status: 'Declined / Withdrawn', count: 1 },
    { status: 'In Offer Negotiation', count: 2 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-400" /> Executive Recruitment Analytics & Sourcing KPIs
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics on candidate portal yields, offer acceptance rates, recruiter performance, and joining ratios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sourcing Channel Split */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-400" /> Applications by Sourcing Portal
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Recruiter Sourcing & Offer Performance */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> Recruiter Performance & Sourcing Yield
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruiterPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="recruiter" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="Sourced" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Interviews" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
