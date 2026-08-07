'use client';

import React, { useState } from 'react';
import { Candidate, Job } from '../../types';
import { X, Sparkles, Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { parseResumeText } from '../../lib/ai';

interface ResumeParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  onImportCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const ResumeParserModal: React.FC<ResumeParserModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onImportCandidate
}) => {
  const [rawText, setRawText] = useState(`MARCUS VANCE
Senior Data Engineer | PySpark & AWS Cloud Specialist
Email: marcus.vance@example.com | Phone: +1 (555) 341-9821
San Jose, CA | LinkedIn: linkedin.com/in/marcus-vance-data | GitHub: github.com/marcusvance-dev

PROFESSIONAL SUMMARY
Senior Data Engineer with 6+ years of experience building petabyte-scale data pipelines, real-time streaming architectures, and cloud data warehouses using Python, PySpark, AWS Glue, SQL, Snowflake, and Apache Airflow. Previously led data engineering initiatives at Amazon Web Services and Deloitte Consulting.

SKILLS & CERTIFICATIONS
Programming: Python, SQL, Scala, Bash
Data Engineering: Apache Spark, PySpark, Snowflake, Airflow, Kafka, AWS EMR, Glue, S3, Redshift, dbt
Database: PostgreSQL, MongoDB, Redis
Certifications: AWS Certified Big Data Specialist, Snowflake SnowPro Core

EXPERIENCE
Senior Data Engineer | Amazon Web Services | 2022 - Present
- Engineered PySpark distributed ETL pipelines processing over 2.5 PB daily for AWS Analytics customers.
- Reduced snowflake data warehouse query latencies by 45% via automated cluster clustering keys and SQL tuning.

Data Engineer | Deloitte Consulting | 2020 - 2022
- Migrated legacy Oracle data warehouse to AWS Redshift and Snowflake for Fortune 500 financial clients.

EDUCATION
B.S. in Computer Science - UC Berkeley (2020)`);

  const [targetJobId, setTargetJobId] = useState(jobs[0]?.id || '');
  const [parsedResult, setParsedResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunParser = () => {
    if (!rawText.trim()) return;
    const result = parseResumeText(rawText);
    setParsedResult(result);
  };

  const handleConfirmImport = () => {
    if (!parsedResult) return;
    const targetJob = jobs.find(j => j.id === targetJobId);

    onImportCandidate({
      name: parsedResult.name,
      email: parsedResult.email,
      phone: parsedResult.phone,
      title: parsedResult.title,
      location: 'San Jose, CA',
      yearsExperience: parsedResult.yearsExperience,
      currentCompany: parsedResult.currentCompany,
      expectedSalary: '$170,000 / year',
      noticePeriod: '2 Weeks',
      visaStatus: 'US Citizen',
      source: 'Resume Upload',
      stage: 'Applied',
      jobId: targetJobId,
      jobTitle: targetJob?.title || 'Senior Data Engineer',
      skills: parsedResult.skills,
      summary: parsedResult.summary,
      matchScore: 92,
      missingSkills: ['dbt'],
      strengths: ['Parsed PySpark & AWS Glue', 'High experience match', 'Clean CV structure'],
      weaknesses: [],
      education: parsedResult.education,
      certifications: parsedResult.certifications,
      linkedinUrl: parsedResult.linkedinUrl,
      githubUrl: parsedResult.githubUrl,
      notes: [
        {
          id: `note-${Date.now()}`,
          authorId: 'rec-1',
          authorName: 'AI Resume Engine',
          authorRole: 'RECRUITER',
          text: 'Parsed and structured automatically via AI Resume Parser Tool.',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ],
      documents: [
        { id: `doc-${Date.now()}`, name: `${parsedResult.name.replace(/\s+/g, '_')}_Resume_Parsed.pdf`, type: 'Resume', url: '#', uploadDate: new Date().toISOString().slice(0, 10), size: '2.1 MB' }
      ]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal rounded-2xl border border-slate-800 w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">AI Resume Parser & Entity Extraction</h2>
              <p className="text-[11px] text-slate-400">Paste raw resume text or select sample file to extract structured fields</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1">
          {/* Left Panel: Raw Resume Input */}
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" /> Raw Resume Document Text
              </label>
              <span className="text-[10px] text-slate-500">Supports PDF/DOCX text</span>
            </div>

            <textarea
              rows={16}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste candidate resume text here..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 resize-none flex-1"
            />

            <button
              onClick={handleRunParser}
              className="w-full py-2.5 text-xs font-bold text-white gradient-bg hover:opacity-90 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run AI Parser & Extract Candidate Fields</span>
            </button>
          </div>

          {/* Right Panel: Extracted Fields Preview */}
          <div className="space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracted Structured Profile
              </label>
              <span className="text-[10px] text-slate-400">Target Job Requisition:</span>
            </div>

            <select
              value={targetJobId}
              onChange={(e) => setTargetJobId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} ({j.clientName})</option>
              ))}
            </select>

            {parsedResult ? (
              <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-white text-sm">{parsedResult.name}</h3>
                    <p className="text-xs text-blue-400 font-medium">{parsedResult.title}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {parsedResult.yearsExperience} Yrs Exp
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <p><strong>Email:</strong> {parsedResult.email}</p>
                  <p><strong>Phone:</strong> {parsedResult.phone}</p>
                  <p><strong>Current Company:</strong> {parsedResult.currentCompany}</p>
                  <p><strong>Education:</strong> {parsedResult.education}</p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Extracted Skill Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {parsedResult.skills.map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] rounded font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Generated AI Summary:</span>
                  <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    "{parsedResult.summary}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center text-center flex-1 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600 animate-bounce" />
                <p className="text-xs font-medium text-slate-400">Click "Run AI Parser" to generate structured profile fields</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!parsedResult}
                onClick={handleConfirmImport}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-lg flex items-center space-x-1.5 cursor-pointer ${
                  parsedResult ? 'gradient-bg hover:opacity-90 shadow-blue-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Save Candidate to CRM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
