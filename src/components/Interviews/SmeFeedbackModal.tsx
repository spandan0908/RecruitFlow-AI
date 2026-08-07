'use client';

import React, { useState } from 'react';
import { Candidate, SmeFeedback } from '../../types';
import { X, Award, Star, CheckCircle2 } from 'lucide-react';

interface SmeFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onSubmitFeedback: (feedback: Omit<SmeFeedback, 'id' | 'createdAt'>) => void;
}

export const SmeFeedbackModal: React.FC<SmeFeedbackModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSubmitFeedback
}) => {
  const [technicalScore, setTechnicalScore] = useState(5);
  const [communicationScore, setCommunicationScore] = useState(4);
  const [problemSolvingScore, setProblemSolvingScore] = useState(5);
  const [codingScore, setCodingScore] = useState(5);
  const [recommendation, setRecommendation] = useState<SmeFeedback['recommendation']>('Strong Hire');
  const [comments, setComments] = useState(
    'Demonstrated excellent grasp of distributed PySpark data pipelines and SQL query optimization. Solved the live technical architecture problem efficiently and articulated trade-offs clearly.'
  );

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback({
      candidateId: candidate.id,
      candidateName: candidate.name,
      jobId: candidate.jobId,
      jobTitle: candidate.jobTitle,
      smeId: 'sme-1',
      smeName: 'Dr. Michael Vance (Chief Architect)',
      technicalScore,
      communicationScore,
      problemSolvingScore,
      codingScore,
      recommendation,
      detailedComments: comments
    });

    onClose();
  };

  const renderStars = (score: number, setScore: (val: number) => void) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          type="button"
          key={star}
          onClick={() => setScore(star)}
          className={`p-1 transition-all cursor-pointer ${star <= score ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'}`}
        >
          <Star className="w-5 h-5 fill-current" />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal rounded-2xl border border-slate-800 w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Structured SME Technical Evaluation</h2>
              <p className="text-[11px] text-slate-400">Candidate: <strong className="text-white">{candidate.name}</strong> ({candidate.jobTitle})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Technical Skills ({technicalScore}/5)</label>
              {renderStars(technicalScore, setTechnicalScore)}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Communication ({communicationScore}/5)</label>
              {renderStars(communicationScore, setCommunicationScore)}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Solving ({problemSolvingScore}/5)</label>
              {renderStars(problemSolvingScore, setProblemSolvingScore)}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Coding Execution ({codingScore}/5)</label>
              {renderStars(codingScore, setCodingScore)}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Final SME Recommendation *</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'Strong Hire', label: 'Strong Hire', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                { id: 'Hire', label: 'Hire', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
                { id: 'Neutral', label: 'Neutral', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                { id: 'Reject', label: 'Reject', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setRecommendation(opt.id as any)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    recommendation === opt.id ? `${opt.color} ring-2 ring-blue-500` : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Technical Comments & SME Observations *</label>
            <textarea
              rows={4}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback on candidate technical performance..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-xs font-bold text-white gradient-bg rounded-xl shadow-lg cursor-pointer">
              Submit Scorecard & Advance Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
