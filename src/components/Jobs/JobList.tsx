'use client';

import React, { useState } from 'react';
import { Job, UserRole } from '../../types';
import { Briefcase, Plus, Filter, MapPin, DollarSign, Users, UserCheck, Sparkles, Building2 } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  currentRole: UserRole;
  onOpenNewJob: () => void;
  onSelectJob: (job: Job) => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  currentRole,
  onOpenNewJob,
  onSelectJob
}) => {
  const [filterContract, setFilterContract] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('Active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredJobs = jobs.filter(j => {
    const matchesContract = filterContract === 'ALL' || j.contractType === filterContract;
    const matchesStatus = filterStatus === 'ALL' || j.status === filterStatus;
    const matchesQuery = !searchQuery || 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesContract && matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" /> Client Requisitions & Job Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active staffing job orders, candidate pipeline assignments, and assigned SME interviewers
          </p>
        </div>

        {(currentRole === 'ADMIN' || currentRole === 'HR_MANAGER') && (
          <button
            onClick={onOpenNewJob}
            className="px-4 py-2 text-xs font-semibold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Requisition</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1 min-w-[220px]">
          <Filter className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job title, skills, client name..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Contract:</span>
            <select
              value={filterContract}
              onChange={(e) => setFilterContract(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Contract (C2C)">Contract (C2C)</option>
              <option value="Contract (W2)">Contract (W2)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="glass-panel rounded-2xl border border-slate-800 p-5 hover:border-blue-500/40 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {job.contractType}
                  </span>
                  <h3 className="font-bold text-slate-100 text-base mt-2 group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" /> {job.clientName}
                  </p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  job.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {job.status}
                </span>
              </div>

              {/* Salary & Location Info */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.location} {job.remote && '(Remote Eligible)'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-emerald-300">{job.salaryRange}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Target Experience: <strong>{job.minExperience} - {job.maxExperience} Yrs</strong></span>
                </div>
              </div>

              {/* Required Skills Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 text-[10px] rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Team Assignments & Candidates Count */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" /> Recruiter: <span className="text-slate-200 font-medium">{job.assignedRecruiterName}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> SME: <span className="text-slate-200 font-medium">{job.assignedSmeName}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Applicants</span>
                <span className="font-bold text-blue-400 text-sm">{job.candidateCount} Candidates</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
