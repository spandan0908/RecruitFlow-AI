'use client';

import React from 'react';
import { Interview, SmeFeedback, UserRole, Candidate } from '../../types';
import { Calendar, Clock, Video, Award, Plus, CheckCircle2, UserCheck, ExternalLink } from 'lucide-react';

interface InterviewListProps {
  interviews: Interview[];
  feedbacks: SmeFeedback[];
  candidates: Candidate[];
  currentRole: UserRole;
  onOpenSchedule: () => void;
  onOpenFeedback: (candidate: Candidate) => void;
}

export const InterviewList: React.FC<InterviewListProps> = ({
  interviews,
  feedbacks,
  candidates,
  currentRole,
  onOpenSchedule,
  onOpenFeedback
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" /> Interview Management & SME Scorecards
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized interview scheduling, automated Zoom/Teams video links, and SME technical evaluations
          </p>
        </div>

        {(currentRole === 'ADMIN' || currentRole === 'HR_MANAGER' || currentRole === 'RECRUITER') && (
          <button
            onClick={onOpenSchedule}
            className="px-4 py-2 text-xs font-semibold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Interview</span>
          </button>
        )}
      </div>

      {/* Interview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map(int => {
          const cand = candidates.find(c => c.id === int.candidateId);
          const hasFeedback = feedbacks.some(f => f.candidateId === int.candidateId);

          return (
            <div key={int.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {int.round}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    int.status === 'Scheduled' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {int.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mt-3">{int.candidateName}</h3>
                <p className="text-xs text-slate-300 font-medium">{int.jobTitle}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Date & Time: <strong>{int.date} @ {int.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Assigned SME: <strong>{int.interviewerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <a href={int.meetingLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                      Video Meeting Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {hasFeedback ? (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SME Feedback Submitted
                  </span>
                ) : (
                  <button
                    disabled={!cand}
                    onClick={() => cand && onOpenFeedback(cand)}
                    className="w-full py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Submit SME Evaluation Scorecard</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
