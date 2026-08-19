'use client';

import React, { useState } from 'react';
import { Candidate, CandidateSource, Job } from '../../types';
import { 
  UserPlus, FileText, Upload, Globe, Database, Mail, 
  CheckCircle2, Sparkles, AlertCircle, FileSpreadsheet 
} from 'lucide-react';
import { parseResumeText } from '../../lib/ai';

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

interface CandidateImportProps {
  jobs: Job[];
  onImportCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenResumeParser: () => void;
}

export const CandidateImport: React.FC<CandidateImportProps> = ({
  jobs,
  onImportCandidate,
  onOpenResumeParser
}) => {
  const [selectedSource, setSelectedSource] = useState<CandidateSource>('LinkedIn');
  const [targetJobId, setTargetJobId] = useState(jobs[0]?.id || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('Senior Data Engineer');
  const [company, setCompany] = useState('Google');
  const [yearsExp, setYearsExp] = useState(6);
  const [expectedSalary, setExpectedSalary] = useState('$165,000 / year');
  const [visaStatus, setVisaStatus] = useState<Candidate['visaStatus']>('US Citizen');
  const [skillsInput, setSkillsInput] = useState('Python, Apache Spark, AWS, SQL, Snowflake');
  const [summary, setSummary] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const sources: { id: CandidateSource; label: string; icon: any; color: string }[] = [
    { id: 'LinkedIn', label: 'LinkedIn Recruiter', icon: LinkedinIcon, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { id: 'Indeed', label: 'Indeed Portal', icon: Globe, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { id: 'Dice', label: 'Dice Tech Search', icon: Database, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { id: 'Glassdoor', label: 'Glassdoor Jobs', icon: Globe, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'Monster', label: 'Monster Board', icon: Globe, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'ZipRecruiter', label: 'ZipRecruiter', icon: Globe, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'Referral', label: 'Employee Referral', icon: UserPlus, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'Email', label: 'Direct Email Inbound', icon: Mail, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
    { id: 'Resume Upload', label: 'AI Resume Upload', icon: Upload, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { id: 'CSV Import', label: 'Bulk CSV Batch', icon: FileSpreadsheet, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
  ];

  const handleQuickImport = (e: React.FormEvent) => {
    e.preventDefault();
    const targetJob = jobs.find(j => j.id === targetJobId);
    const parsedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    onImportCandidate({
      name: name || 'Alex Rodriguez',
      email: email || `alex.r_${Date.now().toString().slice(-4)}@example.com`,
      phone: phone || '+1 (555) 431-8902',
      title,
      location: 'San Francisco, CA',
      yearsExperience: yearsExp,
      currentCompany: company,
      expectedSalary,
      noticePeriod: '2 Weeks',
      visaStatus,
      source: selectedSource,
      stage: 'Applied',
      jobId: targetJobId,
      jobTitle: targetJob?.title || 'Requisition Role',
      skills: parsedSkills.length > 0 ? parsedSkills : ['Python', 'SQL', 'AWS'],
      summary: summary || `${title} with ${yearsExp} years experience sifting big data architectures at ${company}.`,
      matchScore: 88,
      missingSkills: ['dbt'],
      strengths: ['Relevant domain experience', 'High portal match score'],
      weaknesses: [],
      education: 'B.S. in Computer Science',
      certifications: ['AWS Solution Architect'],
      linkedinUrl: `https://linkedin.com/in/${(name || 'alex-r').toLowerCase().replace(/\s+/g, '-')}`,
      notes: [
        {
          id: `note-${Date.now()}`,
          authorId: 'rec-1',
          authorName: 'System Sourcing Engine',
          authorRole: 'RECRUITER',
          text: `Auto-imported profile record tagged from source channel [${selectedSource}].`,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ],
      documents: [
        { id: `doc-${Date.now()}`, name: `${(name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`, type: 'Resume', url: '#', uploadDate: new Date().toISOString().slice(0, 10), size: '1.8 MB' }
      ]
    });

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Centralized Sourcing Hub
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">
            Multi-Source Candidate Sourcing & Parsing
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Import candidates seamlessly from 10+ job portals and resumes into RecruitFlow AI CRM database.
          </p>
        </div>

        <button
          onClick={onOpenResumeParser}
          className="px-5 py-2.5 text-xs font-bold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all cursor-pointer self-start"
        >
          <Upload className="w-4 h-4" />
          <span>Launch AI Resume Parser Tool</span>
        </button>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="glass-panel p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Candidate successfully imported into CRM database and tagged with source!</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Record Active</span>
        </div>
      )}

      {/* Sourcing Channel Selector */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Select Candidate Sourcing Channel</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {sources.map(src => {
            const Icon = src.icon;
            const isSelected = selectedSource === src.id;

            return (
              <button
                key={src.id}
                onClick={() => setSelectedSource(src.id)}
                className={`p-3.5 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                    : 'glass-panel border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <span className="text-xs font-bold mt-3 block">{src.label}</span>
                <span className="text-[10px] text-slate-500">Auto Source Tag</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Import Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-400" /> 
          2. Sourced Candidate Record Details ({selectedSource})
        </h2>

        <form onSubmit={handleQuickImport} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Requisition Job *</label>
              <select
                value={targetJobId}
                onChange={(e) => setTargetJobId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} ({j.clientName})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Candidate Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marcus Vance"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. marcus.vance@example.com"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Employer</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Experience (Years)</label>
              <input
                type="number"
                value={yearsExp}
                onChange={(e) => setYearsExp(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">US Work Authorization / Visa</label>
              <select
                value={visaStatus}
                onChange={(e) => setVisaStatus(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="US Citizen">US Citizen</option>
                <option value="Green Card">Green Card</option>
                <option value="H1B">H1B Visa</option>
                <option value="OPT/CPT">OPT/CPT</option>
                <option value="TN Visa">TN Visa</option>
                <option value="Need Sponsorship">Requires Sponsorship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (Comma-separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Candidate Summary</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter candidate background summary or notes..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-blue-400" /> Auto duplicate detection will check email & phone upon creation
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Import Candidate Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
