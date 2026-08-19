'use client';

import React, { useState } from 'react';
import { Candidate, PipelineStage, UserRole } from '../../types';
import { Users, Search, Filter, Sparkles, UserPlus, Eye, MapPin, Building2, Tag } from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
  currentRole: UserRole;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenImport: () => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  currentRole,
  onSelectCandidate,
  onOpenImport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [visaFilter, setVisaFilter] = useState<string>('ALL');

  const filteredCandidates = candidates.filter(c => {
    const matchesStage = stageFilter === 'ALL' || c.stage === stageFilter;
    const matchesSource = sourceFilter === 'ALL' || c.source === sourceFilter;
    const matchesVisa = visaFilter === 'ALL' || c.visaStatus === visaFilter;

    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || 
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.currentCompany.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q));

    return matchesStage && matchesSource && matchesVisa && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" /> Enterprise Candidate Central Database
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Single source of truth replacing Excel sheets and lost email resumes
          </p>
        </div>

        {(currentRole === 'ADMIN' || currentRole === 'RECRUITER' || currentRole === 'HR_MANAGER') && (
          <button
            onClick={onOpenImport}
            className="px-4 py-2 text-xs font-semibold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all cursor-pointer self-start"
          >
            <UserPlus className="w-4 h-4" />
            <span>Import New Candidate</span>
          </button>
        )}
      </div>

      {/* Deep Filter Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by candidate name, skill (e.g. PySpark, React), title, employer..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
            >
              <option value="ALL">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Recruiter Review">Recruiter Review</option>
              <option value="SME Assigned">SME Assigned</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Technical Round">Technical Round</option>
              <option value="Client Round">Client Round</option>
              <option value="Offer Released">Offer Released</option>
              <option value="Joined">Joined</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
            >
              <option value="ALL">All Sources</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Indeed">Indeed</option>
              <option value="Dice">Dice</option>
              <option value="Glassdoor">Glassdoor</option>
              <option value="Monster">Monster</option>
              <option value="Resume Upload">Resume Upload</option>
            </select>

            <select
              value={visaFilter}
              onChange={(e) => setVisaFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none"
            >
              <option value="ALL">All Visas</option>
              <option value="US Citizen">US Citizen</option>
              <option value="Green Card">Green Card</option>
              <option value="H1B">H1B Visa</option>
              <option value="OPT/CPT">OPT/CPT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/60">
                <th className="py-3 px-4">Candidate Profile</th>
                <th className="py-3 px-4">Target Job</th>
                <th className="py-3 px-4">Portal Source</th>
                <th className="py-3 px-4">AI Match</th>
                <th className="py-3 px-4">Key Skills</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    No candidate records found matching current query filters.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(cand => (
                  <tr key={cand.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100 text-sm">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.title} • {cand.yearsExperience} yrs exp</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{cand.email}</span>
                        <span>•</span>
                        <span>{cand.visaStatus}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {cand.jobTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {cand.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {cand.skills.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-900 text-slate-300 text-[10px] rounded border border-slate-800">
                            {s}
                          </span>
                        ))}
                        {cand.skills.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{cand.skills.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {cand.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectCandidate(cand)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all flex items-center space-x-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile Drawer</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
