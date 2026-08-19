'use client';

import React, { useState } from 'react';
import { Candidate, PipelineStage, SmeFeedback, UserRole } from '../../types';
import { 
  X, User, Sparkles, FileText, Calendar, MessageSquare, 
  Paperclip, Award, CheckCircle2, AlertTriangle, Send, Mail, ExternalLink, Shield 
} from 'lucide-react';
import { generateAiEmail } from '../../lib/ai';

interface CandidateProfileModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  currentRole: UserRole;
  feedbacks: SmeFeedback[];
  onUpdateStage: (candidateId: string, newStage: PipelineStage) => void;
  onAddNote: (candidateId: string, noteText: string) => void;
  onOpenScheduleInterview?: (candidate: Candidate) => void;
  onOpenSmeFeedback?: (candidate: Candidate) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  onClose,
  currentRole,
  feedbacks,
  onUpdateStage,
  onAddNote,
  onOpenScheduleInterview,
  onOpenSmeFeedback
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'aimatch' | 'documents' | 'feedback' | 'notes' | 'aiemail'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [emailTemplate, setEmailTemplate] = useState<'OUTREACH' | 'INTERVIEW_INVITE' | 'REJECTION' | 'OFFER_LETTER'>('OUTREACH');
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);

  if (!candidate) return null;

  const candidateFeedbacks = feedbacks.filter(f => f.candidateId === candidate.id);

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      onAddNote(candidate.id, newNoteText.trim());
      setNewNoteText('');
    }
  };

  const handleGenerateEmail = () => {
    const email = generateAiEmail(emailTemplate, candidate.name, candidate.jobTitle, 'Enterprise Staffing Client');
    setGeneratedEmail(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-2xl border border-slate-800 w-full max-w-5xl h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Profile Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/20">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{candidate.name}</h2>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {candidate.source} Source Tag
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {candidate.title} • {candidate.currentCompany} • {candidate.yearsExperience} Yrs Exp
              </p>
            </div>
          </div>

          {/* Header Action Bar */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Stage:</span>
              <select
                value={candidate.stage}
                onChange={(e) => onUpdateStage(candidate.id, e.target.value as PipelineStage)}
                className="bg-transparent text-xs font-bold text-blue-400 focus:outline-none cursor-pointer"
              >
                <option value="Applied" className="bg-slate-900 text-slate-200">Applied</option>
                <option value="Recruiter Review" className="bg-slate-900 text-slate-200">Recruiter Review</option>
                <option value="HR Review" className="bg-slate-900 text-slate-200">HR Review</option>
                <option value="SME Assigned" className="bg-slate-900 text-slate-200">SME Assigned</option>
                <option value="Interview Scheduled" className="bg-slate-900 text-slate-200">Interview Scheduled</option>
                <option value="Technical Round" className="bg-slate-900 text-slate-200">Technical Round</option>
                <option value="Client Round" className="bg-slate-900 text-slate-200">Client Round</option>
                <option value="Offer Released" className="bg-slate-900 text-slate-200">Offer Released</option>
                <option value="Joined" className="bg-slate-900 text-slate-200">Joined</option>
                <option value="Rejected" className="bg-slate-900 text-slate-200">Rejected</option>
              </select>
            </div>

            {onOpenScheduleInterview && (
              <button
                onClick={() => onOpenScheduleInterview(candidate)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule Interview
              </button>
            )}

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/60 flex space-x-6 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview & Profile', icon: User },
            { id: 'aimatch', label: `AI Match Score (${candidate.matchScore}%)`, icon: Sparkles },
            { id: 'documents', label: `Documents (${candidate.documents.length})`, icon: Paperclip },
            { id: 'feedback', label: `SME Scorecard (${candidateFeedbacks.length})`, icon: Award },
            { id: 'notes', label: `Collaboration Notes (${candidate.notes.length})`, icon: MessageSquare },
            { id: 'aiemail', label: 'AI Email Generator', icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 font-semibold border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                  isActive ? 'border-blue-500 text-blue-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive AI Summary Box */}
              <div className="glass-panel p-4 rounded-xl border border-blue-500/30 bg-blue-950/20">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Executive Candidate Summary</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{candidate.summary}"
                </p>
              </div>

              {/* Personal & Professional Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Contact Details</h4>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p><strong>Email:</strong> {candidate.email}</p>
                    <p><strong>Phone:</strong> {candidate.phone}</p>
                    <p><strong>Location:</strong> {candidate.location}</p>
                    <p><strong>Visa Status:</strong> <span className="text-emerald-400 font-semibold">{candidate.visaStatus}</span></p>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Compensation & Availability</h4>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p><strong>Expected Pay:</strong> {candidate.expectedSalary}</p>
                    <p><strong>Notice Period:</strong> {candidate.noticePeriod}</p>
                    <p><strong>Target Requisition:</strong> {candidate.jobTitle}</p>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400">External Profiles</h4>
                  <div className="text-xs text-blue-400 space-y-1">
                    {candidate.linkedinUrl && (
                      <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                        <ExternalLink className="w-3 h-3" /> LinkedIn Profile
                      </a>
                    )}
                    {candidate.githubUrl && (
                      <a href={candidate.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                        <ExternalLink className="w-3 h-3" /> GitHub Repository
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="glass-panel p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Verified Professional Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Education</h4>
                  <p className="text-xs text-slate-200">{candidate.education || 'B.S. Computer Science & Engineering'}</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Certifications</h4>
                  <p className="text-xs text-slate-200">
                    {candidate.certifications?.join(', ') || 'AWS Certified Professional'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Match Suite Tab */}
          {activeTab === 'aimatch' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Candidate Requisition Match Analytics</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Automated skill gap & experience score against {candidate.jobTitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-400">{candidate.matchScore}%</div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">High Fit Alignment</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Candidate Qualifications
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-200">
                    {candidate.strengths.map((st, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Identified Skill Gaps / Weaknesses
                  </h4>
                  {candidate.missingSkills.length > 0 ? (
                    <ul className="space-y-1 text-xs text-slate-200">
                      {candidate.missingSkills.map((ms, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          <span>Missing required skill: <strong>{ms}</strong></span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No critical missing skill gaps detected!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-400">Candidate Document Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidate.documents.map(doc => (
                  <div key={doc.id} className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{doc.name}</h4>
                        <p className="text-[10px] text-slate-400">{doc.type} • {doc.size} • Uploaded {doc.uploadDate}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert(`Opening preview for ${doc.name}`)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all cursor-pointer"
                    >
                      Preview Document
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SME Feedback Scorecard Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-slate-400">SME Structured Technical Scorecards</h3>
                {onOpenSmeFeedback && (
                  <button
                    onClick={() => onOpenSmeFeedback(candidate)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" /> Submit SME Evaluation
                  </button>
                )}
              </div>

              {candidateFeedbacks.length === 0 ? (
                <div className="glass-panel p-8 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
                  No SME evaluations submitted yet for this candidate.
                </div>
              ) : (
                candidateFeedbacks.map(fb => (
                  <div key={fb.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="font-bold text-white text-sm">{fb.smeName}</h4>
                        <p className="text-[11px] text-slate-400">{fb.jobTitle} • {fb.createdAt}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        fb.recommendation === 'Strong Hire' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {fb.recommendation}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Technical</span>
                        <span className="font-bold text-blue-400 text-sm">{fb.technicalScore}/5</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Communication</span>
                        <span className="font-bold text-indigo-400 text-sm">{fb.communicationScore}/5</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Problem Solving</span>
                        <span className="font-bold text-purple-400 text-sm">{fb.problemSolvingScore}/5</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Coding</span>
                        <span className="font-bold text-emerald-400 text-sm">{fb.codingScore}/5</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      "{fb.detailedComments}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Notes & Collaboration Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-400">Internal Collaboration Notes Timeline</h3>

              <form onSubmit={handleAddNoteSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder={`Add a note as ${currentRole}...`}
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Note</span>
                </button>
              </form>

              <div className="space-y-3">
                {candidate.notes.map(note => (
                  <div key={note.id} className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-200">{note.authorName} ({note.authorRole})</span>
                      <span className="text-slate-500">{note.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Email Generator Tab */}
          {activeTab === 'aiemail' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-400">AI Communication Assistant</h3>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-300 font-semibold">Select Email Template:</span>
                <select
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="OUTREACH">Initial Sourcing Outreach</option>
                  <option value="INTERVIEW_INVITE">SME Technical Interview Invitation</option>
                  <option value="OFFER_LETTER">Official Offer Letter Release</option>
                  <option value="REJECTION">Constructive Rejection Update</option>
                </select>

                <button
                  onClick={handleGenerateEmail}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate AI Draft
                </button>
              </div>

              {generatedEmail && (
                <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Subject:</span>
                    <h4 className="font-bold text-white text-sm">{generatedEmail.subject}</h4>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Email Body:</span>
                    <textarea
                      rows={10}
                      value={generatedEmail.body}
                      onChange={(e) => setGeneratedEmail({ ...generatedEmail, body: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => alert(`Email sent to ${candidate.email}!`)}
                      className="px-5 py-2 text-xs font-bold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Email via Connected Provider
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
