'use client';

import React, { useState } from 'react';
import { Candidate, Job, SmeFeedback } from '../../types';
import { Bot, Sparkles, HelpCircle, FileText, Send, Copy, CheckCircle2 } from 'lucide-react';
import { generateInterviewQuestions, generateSmeFeedbackSummary, generateAiEmail } from '../../lib/ai';

interface AiToolsHubProps {
  candidates: Candidate[];
  jobs: Job[];
  feedbacks: SmeFeedback[];
}

export const AiToolsHub: React.FC<AiToolsHubProps> = ({
  candidates,
  jobs,
  feedbacks
}) => {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [summarizedFeedback, setSummarizedFeedback] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const handleGenerateQuestions = () => {
    if (!selectedJob) return;
    const questions = generateInterviewQuestions(selectedJob.title, selectedJob.requiredSkills);
    setGeneratedQuestions(questions);
  };

  const handleSummarizeFeedbacks = () => {
    const summary = generateSmeFeedbackSummary(feedbacks);
    setSummarizedFeedback(summary);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> OpenAI Powered Recruitment Intelligence
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">
            AI Copilot Suite for Talent Acquisition
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Generate tailored technical interview questions, aggregate multi-round SME feedback into executive summaries, and write personalized candidate outreach.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: AI Interview Question Generator */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AI Technical Question Generator</h3>
              <p className="text-[11px] text-slate-400">Contextual architecture & coding questions based on job skills</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Select Job Requisition:</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} ({j.clientName})</option>
              ))}
            </select>

            <button
              onClick={handleGenerateQuestions}
              className="w-full py-2.5 text-xs font-bold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Customized Interview Questions</span>
            </button>
          </div>

          {generatedQuestions.length > 0 && (
            <div className="space-y-3 pt-2">
              {generatedQuestions.map((q, idx) => (
                <div key={idx} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1 relative group">
                  <div className="flex items-center justify-between text-[10px] font-bold text-blue-400">
                    <span>{q.category}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(q.question);
                        setCopiedIndex(idx);
                        setTimeout(() => setCopiedIndex(null), 2000);
                      }}
                      className="text-slate-500 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === idx ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200">{q.question}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tool 2: AI SME Feedback Summarizer */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">SME Feedback Aggregator</h3>
              <p className="text-[11px] text-slate-400">Synthesize technical notes across SME evaluation rounds</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSummarizeFeedbacks}
              className="w-full py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Summarize Active SME Feedback Records ({feedbacks.length})</span>
            </button>
          </div>

          {summarizedFeedback && (
            <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
              <h4 className="text-xs font-bold uppercase text-amber-400">Executive Synthesis</h4>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{summarizedFeedback}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
