'use client';

import React, { useState } from 'react';
import { Candidate, Interview, Job } from '../../types';
import { X, Calendar, Video, Clock } from 'lucide-react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  jobs: Job[];
  onSchedule: (interview: Omit<Interview, 'id'>) => void;
  preselectedCandidate?: Candidate | null;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  candidates,
  jobs,
  onSchedule,
  preselectedCandidate
}) => {
  const [candidateId, setCandidateId] = useState(preselectedCandidate?.id || candidates[0]?.id || '');
  const [round, setRound] = useState<Interview['round']>('Technical SME Round');
  const [date, setDate] = useState('2026-08-10');
  const [time, setTime] = useState('14:00 EST');
  const [duration, setDuration] = useState(60);
  const [interviewerName, setInterviewerName] = useState('Dr. Michael Vance (Chief Architect)');
  const [meetingLink, setMeetingLink] = useState('https://zoom.us/j/991029384');
  const [notes, setNotes] = useState('Focus on system design, PySpark performance, and SQL optimization.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cand = candidates.find(c => c.id === candidateId);
    const targetJob = jobs.find(j => j.id === cand?.jobId);

    onSchedule({
      candidateId,
      candidateName: cand?.name || 'Selected Candidate',
      jobId: cand?.jobId || jobs[0]?.id || '',
      jobTitle: cand?.jobTitle || targetJob?.title || 'Senior Position',
      interviewerId: 'sme-1',
      interviewerName,
      date,
      time,
      durationMinutes: duration,
      round,
      meetingLink,
      status: 'Scheduled',
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal rounded-2xl border border-slate-800 w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white text-base">Schedule Candidate Interview</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Candidate *</label>
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.jobTitle})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Interview Round</label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Recruiter Screen">Recruiter Screen</option>
                <option value="Technical SME Round">Technical SME Round</option>
                <option value="HR Interview">HR Interview</option>
                <option value="Client Discussion">Client Discussion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned SME / Interviewer</label>
              <select
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Dr. Michael Vance (Chief Architect)">Dr. Michael Vance (Chief Architect)</option>
                <option value="Kevin Patel (Principal DevOps SME)">Kevin Patel (Principal DevOps SME)</option>
                <option value="Amanda Lin (Frontend SME)">Amanda Lin (Frontend SME)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="14:00 EST"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Zoom / Teams Meeting Link</label>
            <input
              type="text"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Interview Agenda / Focus Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-xs font-bold text-white gradient-bg rounded-xl shadow-lg cursor-pointer">
              Confirm & Dispatch Invites
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
