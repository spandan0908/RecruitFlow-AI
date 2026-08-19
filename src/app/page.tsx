'use client';

import React, { useState, useEffect } from 'react';
import { useRecruitFlowStore } from '../lib/store';
import { NavTab, Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { LoginPage } from '../components/Auth/LoginPage';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { CandidateList } from '../components/Candidates/CandidateList';
import { CandidateImport } from '../components/Candidates/CandidateImport';
import { KanbanBoard } from '../components/Pipeline/KanbanBoard';
import { JobList } from '../components/Jobs/JobList';
import { InterviewList } from '../components/Interviews/InterviewList';
import { DuplicateMergerModal } from '../components/Duplicates/DuplicateMergerModal';
import { ClientList } from '../components/Clients/ClientList';
import { AiToolsHub } from '../components/AiTools/AiToolsHub';
import { AnalyticsView } from '../components/Analytics/AnalyticsView';
import { IntegrationsHub } from '../components/Integrations/IntegrationsHub';
import { AuditLogTable } from '../components/AuditLogs/AuditLogTable';

// Modals
import { NewJobModal } from '../components/Jobs/NewJobModal';
import { ResumeParserModal } from '../components/Candidates/ResumeParserModal';
import { CandidateProfileModal } from '../components/Candidates/CandidateProfileModal';
import { ScheduleInterviewModal } from '../components/Interviews/ScheduleInterviewModal';
import { SmeFeedbackModal } from '../components/Interviews/SmeFeedbackModal';
import { Candidate, UserRole } from '../types';

export default function Home() {
  const store = useRecruitFlowStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('admin@recruitflow.ai');

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isResumeParserOpen, setIsResumeParserOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackCandidate, setFeedbackCandidate] = useState<Candidate | null>(null);

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('recruitflow_authenticated');
      const savedEmail = localStorage.getItem('recruitflow_user_email');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
        if (savedEmail) setUserEmail(savedEmail);
      }
    }
  }, []);

  const handleLogin = (email: string, role: UserRole) => {
    setUserEmail(email);
    store.setRole(role);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recruitflow_authenticated', 'true');
      localStorage.setItem('recruitflow_user_email', email);
    }
    store.addAuditLog('User Login', 'System', `User ${email} signed in with role ${role}.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recruitflow_authenticated');
      localStorage.removeItem('recruitflow_user_email');
    }
    store.addAuditLog('User Logout', 'System', `User ${userEmail} logged out.`);
  };

  if (!store.isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-semibold">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          <span>Loading RecruitFlow AI Engine...</span>
        </div>
      </div>
    );
  }

  // Render Login Page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const duplicates = store.detectDuplicates();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120] text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRole={store.role}
        onRoleChange={store.setRole}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) setActiveTab('candidates');
        }}
        onOpenImport={() => setActiveTab('import')}
        onOpenNewJob={() => setIsNewJobOpen(true)}
        duplicateCount={duplicates.length}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          candidateCount={store.candidates.length}
          duplicateCount={duplicates.length}
          jobCount={store.jobs.length}
          currentRole={store.role}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              candidates={store.candidates}
              jobs={store.jobs}
              interviews={store.interviews}
              currentRole={store.role}
              onNavigateTab={setActiveTab}
              onSelectCandidate={setSelectedCandidate}
              onOpenImport={() => setActiveTab('import')}
              onOpenNewJob={() => setIsNewJobOpen(true)}
            />
          )}

          {activeTab === 'pipeline' && (
            <KanbanBoard
              candidates={store.candidates}
              jobs={store.jobs}
              currentRole={store.role}
              onUpdateStage={store.updateCandidateStage}
              onSelectCandidate={setSelectedCandidate}
              onOpenImport={() => setActiveTab('import')}
            />
          )}

          {activeTab === 'import' && (
            <CandidateImport
              jobs={store.jobs}
              onImportCandidate={store.addCandidate}
              onOpenResumeParser={() => setIsResumeParserOpen(true)}
            />
          )}

          {activeTab === 'candidates' && (
            <CandidateList
              candidates={store.candidates}
              currentRole={store.role}
              onSelectCandidate={setSelectedCandidate}
              onOpenImport={() => setActiveTab('import')}
            />
          )}

          {activeTab === 'jobs' && (
            <JobList
              jobs={store.jobs}
              currentRole={store.role}
              onOpenNewJob={() => setIsNewJobOpen(true)}
              onSelectJob={(job) => {
                setSearchQuery(job.title);
                setActiveTab('candidates');
              }}
            />
          )}

          {activeTab === 'interviews' && (
            <InterviewList
              interviews={store.interviews}
              feedbacks={store.feedbacks}
              candidates={store.candidates}
              currentRole={store.role}
              onOpenSchedule={() => setIsScheduleOpen(true)}
              onOpenFeedback={(cand) => {
                setFeedbackCandidate(cand);
                setIsFeedbackOpen(true);
              }}
            />
          )}

          {activeTab === 'duplicates' && (
            <DuplicateMergerModal
              duplicatePairs={duplicates}
              onMerge={store.mergeCandidates}
            />
          )}

          {activeTab === 'aitools' && (
            <AiToolsHub
              candidates={store.candidates}
              jobs={store.jobs}
              feedbacks={store.feedbacks}
            />
          )}

          {activeTab === 'clients' && (
            <ClientList
              clients={store.clients}
              jobs={store.jobs}
              candidates={store.candidates}
              currentRole={store.role}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              candidates={store.candidates}
              jobs={store.jobs}
              interviews={store.interviews}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationsHub
              integrations={store.integrations}
              onToggleIntegration={store.toggleIntegration}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogTable logs={store.auditLogs} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewJobModal
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
        clients={store.clients}
        onSubmit={store.addJob}
      />

      <ResumeParserModal
        isOpen={isResumeParserOpen}
        onClose={() => setIsResumeParserOpen(false)}
        jobs={store.jobs}
        onImportCandidate={store.addCandidate}
      />

      <CandidateProfileModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        currentRole={store.role}
        feedbacks={store.feedbacks}
        onUpdateStage={store.updateCandidateStage}
        onAddNote={store.addCandidateNote}
        onOpenScheduleInterview={(cand) => {
          setSelectedCandidate(null);
          setIsScheduleOpen(true);
        }}
        onOpenSmeFeedback={(cand) => {
          setSelectedCandidate(null);
          setFeedbackCandidate(cand);
          setIsFeedbackOpen(true);
        }}
      />

      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        candidates={store.candidates}
        jobs={store.jobs}
        onSchedule={store.scheduleInterview}
      />

      <SmeFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => {
          setIsFeedbackOpen(false);
          setFeedbackCandidate(null);
        }}
        candidate={feedbackCandidate}
        onSubmitFeedback={store.submitSmeFeedback}
      />
    </div>
  );
}
