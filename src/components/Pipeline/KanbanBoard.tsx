'use client';

import React, { useState } from 'react';
import { Candidate, PipelineStage, Job, UserRole } from '../../types';
import { 
  Kanban, Filter, Sparkles, ChevronRight, User, MapPin, 
  Clock, CheckCircle2, ArrowRight, Layers 
} from 'lucide-react';

interface KanbanBoardProps {
  candidates: Candidate[];
  jobs: Job[];
  currentRole: UserRole;
  onUpdateStage: (candidateId: string, newStage: PipelineStage) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenImport: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  jobs,
  currentRole,
  onUpdateStage,
  onSelectCandidate,
  onOpenImport
}) => {
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('ALL');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('ALL');
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [activeDropStage, setActiveDropStage] = useState<PipelineStage | null>(null);

  const STAGES: { stage: PipelineStage; label: string; color: string }[] = [
    { stage: 'Applied', label: 'Applied', color: 'border-slate-700 bg-slate-900/60' },
    { stage: 'Recruiter Review', label: 'Recruiter Review', color: 'border-blue-500/30 bg-blue-950/20' },
    { stage: 'HR Review', label: 'HR Review', color: 'border-cyan-500/30 bg-cyan-950/20' },
    { stage: 'SME Assigned', label: 'SME Assigned', color: 'border-amber-500/30 bg-amber-950/20' },
    { stage: 'Interview Scheduled', label: 'Interview Scheduled', color: 'border-indigo-500/30 bg-indigo-950/20' },
    { stage: 'Technical Round', label: 'Technical Round', color: 'border-purple-500/30 bg-purple-950/20' },
    { stage: 'Client Round', label: 'Client Round', color: 'border-pink-500/30 bg-pink-950/20' },
    { stage: 'Offer Released', label: 'Offer Released', color: 'border-emerald-500/30 bg-emerald-950/20' },
    { stage: 'Joined', label: 'Joined', color: 'border-teal-500/40 bg-teal-950/30' },
    { stage: 'Rejected', label: 'Rejected', color: 'border-rose-500/30 bg-rose-950/20' },
  ];

  const filteredCandidates = candidates.filter(c => {
    const matchesJob = selectedJobFilter === 'ALL' || c.jobId === selectedJobFilter;
    const matchesSource = selectedSourceFilter === 'ALL' || c.source === selectedSourceFilter;
    return matchesJob && matchesSource;
  });

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    setDraggedCandidateId(candidateId);
    e.dataTransfer.setData('text/plain', candidateId);
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    setActiveDropStage(stage);
  };

  const handleDragLeave = () => {
    setActiveDropStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('text/plain') || draggedCandidateId;
    if (candidateId) {
      onUpdateStage(candidateId, targetStage);
    }
    setDraggedCandidateId(null);
    setActiveDropStage(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Kanban Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-blue-400" /> Interactive Candidate Pipeline Kanban
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag and drop candidates across 10 stages or use quick stage progression
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Job Filter */}
          <div className="flex items-center space-x-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Requisition:</span>
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Jobs ({jobs.length})</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id} className="bg-slate-900">{j.title}</option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center space-x-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Source Portal:</span>
            <select
              value={selectedSourceFilter}
              onChange={(e) => setSelectedSourceFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Sources</option>
              <option value="LinkedIn" className="bg-slate-900">LinkedIn</option>
              <option value="Indeed" className="bg-slate-900">Indeed</option>
              <option value="Dice" className="bg-slate-900">Dice</option>
              <option value="Glassdoor" className="bg-slate-900">Glassdoor</option>
              <option value="Resume Upload" className="bg-slate-900">Resume Upload</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="flex space-x-4 overflow-x-auto pb-6 pt-1 min-h-[600px] scrollbar-thin">
        {STAGES.map(stageObj => {
          const stageCandidates = filteredCandidates.filter(c => c.stage === stageObj.stage);
          const isDropActive = activeDropStage === stageObj.stage;

          return (
            <div
              key={stageObj.stage}
              onDragOver={(e) => handleDragOver(e, stageObj.stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stageObj.stage)}
              className={`w-72 shrink-0 glass-panel rounded-2xl border ${stageObj.color} flex flex-col p-3 transition-all ${
                isDropActive ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-200 tracking-tight">{stageObj.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stageCandidates.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-center p-3">
                    <p className="text-[11px] text-slate-600 font-medium">No candidates in {stageObj.label}</p>
                  </div>
                ) : (
                  stageCandidates.map(cand => (
                    <div
                      key={cand.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cand.id)}
                      onClick={() => onSelectCandidate(cand)}
                      className="glass-panel p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-900/90 shadow-md cursor-grab active:cursor-grabbing transition-all hover:scale-[1.01] group space-y-2.5"
                    >
                      {/* Top Row: Source & Match Score */}
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {cand.source}
                        </span>

                        <div className="flex items-center space-x-1" title="AI Skill Match Score">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span className={`text-xs font-bold ${cand.matchScore >= 90 ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {cand.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      {/* Candidate Name & Title */}
                      <div>
                        <h4 className="font-bold text-white text-xs group-hover:text-blue-400 transition-colors">
                          {cand.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">{cand.title}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-600 shrink-0" /> {cand.location} • {cand.yearsExperience} yrs exp
                        </p>
                      </div>

                      {/* Job Requisition Tag */}
                      <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 text-[10px] text-slate-300 flex items-center justify-between">
                        <span className="truncate max-w-[140px] font-medium">{cand.jobTitle}</span>
                        <span className="text-slate-500 font-semibold">{cand.visaStatus}</span>
                      </div>

                      {/* Quick Move Next Stage Button */}
                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 text-[9px]">Click for full profile</span>

                        <select
                          onClick={(e) => e.stopPropagation()}
                          value={cand.stage}
                          onChange={(e) => onUpdateStage(cand.id, e.target.value as PipelineStage)}
                          className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-medium rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          {STAGES.map(s => (
                            <option key={s.stage} value={s.stage}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
