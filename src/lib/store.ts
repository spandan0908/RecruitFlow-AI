'use client';

import { useState, useEffect } from 'react';
import { 
  Candidate, Job, Client, Interview, SmeFeedback, 
  AuditLog, IntegrationProvider, UserRole, PipelineStage, Note 
} from '../types';
import { 
  INITIAL_CANDIDATES, INITIAL_JOBS, INITIAL_CLIENTS, 
  INITIAL_INTERVIEWS, INITIAL_FEEDBACKS, INITIAL_INTEGRATIONS, INITIAL_AUDIT_LOGS 
} from '../data/seedData';
import { calculateMatchScore } from './ai';

export interface DuplicatePair {
  primary: Candidate;
  duplicate: Candidate;
  reason: string;
  similarityScore: number;
}

const STORAGE_KEY = 'recruitflow_ai_state_v1';

export function useRecruitFlowStore() {
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [feedbacks, setFeedbacks] = useState<SmeFeedback[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationProvider[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage or Seed Data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCandidates(parsed.candidates || INITIAL_CANDIDATES);
        setJobs(parsed.jobs || INITIAL_JOBS);
        setClients(parsed.clients || INITIAL_CLIENTS);
        setInterviews(parsed.interviews || INITIAL_INTERVIEWS);
        setFeedbacks(parsed.feedbacks || INITIAL_FEEDBACKS);
        setIntegrations(parsed.integrations || INITIAL_INTEGRATIONS);
        setAuditLogs(parsed.auditLogs || INITIAL_AUDIT_LOGS);
        if (parsed.role) setRole(parsed.role);
      } else {
        setCandidates(INITIAL_CANDIDATES);
        setJobs(INITIAL_JOBS);
        setClients(INITIAL_CLIENTS);
        setInterviews(INITIAL_INTERVIEWS);
        setFeedbacks(INITIAL_FEEDBACKS);
        setIntegrations(INITIAL_INTEGRATIONS);
        setAuditLogs(INITIAL_AUDIT_LOGS);
      }
    } catch {
      setCandidates(INITIAL_CANDIDATES);
      setJobs(INITIAL_JOBS);
      setClients(INITIAL_CLIENTS);
      setInterviews(INITIAL_INTERVIEWS);
      setFeedbacks(INITIAL_FEEDBACKS);
      setIntegrations(INITIAL_INTEGRATIONS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage
  const saveState = (
    cands = candidates, 
    jbs = jobs, 
    cls = clients, 
    ints = interviews, 
    fbs = feedbacks, 
    itgs = integrations, 
    logs = auditLogs, 
    r = role
  ) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        candidates: cands,
        jobs: jbs,
        clients: cls,
        interviews: ints,
        feedbacks: fbs,
        integrations: itgs,
        auditLogs: logs,
        role: r
      }));
    }
  };

  const addAuditLog = (action: string, targetType: AuditLog['targetType'], details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userName: role === 'ADMIN' ? 'Admin User' : role === 'HR_MANAGER' ? 'Rachel Green (HR)' : role === 'RECRUITER' ? 'Alex Mercer (Recruiter)' : role === 'SME' ? 'Dr. Vance (SME)' : 'Sarah Jenkins (Client)',
      userRole: role,
      action,
      targetType,
      details
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    saveState(candidates, jobs, clients, interviews, feedbacks, integrations, updated, role);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    saveState(candidates, jobs, clients, interviews, feedbacks, integrations, auditLogs, newRole);
  };

  // Candidate Actions
  const addCandidate = (newCand: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const targetJob = jobs.find(j => j.id === newCand.jobId);
    const match = targetJob 
      ? calculateMatchScore(newCand.skills, newCand.yearsExperience, targetJob.requiredSkills, targetJob.minExperience)
      : { matchScore: 80, missingSkills: [], strengths: [], weaknesses: [], recommendedLevel: 'Mid' };

    const candidate: Candidate = {
      ...newCand,
      id: `cand-${Date.now()}`,
      matchScore: match.matchScore,
      missingSkills: match.missingSkills,
      strengths: match.strengths,
      weaknesses: match.weaknesses,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    const updated = [candidate, ...candidates];
    setCandidates(updated);
    addAuditLog('Imported Candidate', 'Candidate', `Imported ${candidate.name} via ${candidate.source} for ${candidate.jobTitle}.`);
    return candidate;
  };

  const updateCandidateStage = (candidateId: string, newStage: PipelineStage) => {
    const updated = candidates.map(c => {
      if (c.id === candidateId) {
        return { ...c, stage: newStage, updatedAt: new Date().toISOString().slice(0, 10) };
      }
      return c;
    });
    const cand = candidates.find(c => c.id === candidateId);
    setCandidates(updated);
    saveState(updated);
    if (cand) {
      addAuditLog('Updated Stage', 'Candidate', `Moved ${cand.name} to stage "${newStage}".`);
    }
  };

  const addCandidateNote = (candidateId: string, noteText: string) => {
    const note: Note = {
      id: `note-${Date.now()}`,
      authorId: role.toLowerCase(),
      authorName: role === 'ADMIN' ? 'Admin' : role === 'HR_MANAGER' ? 'Rachel Green' : role === 'RECRUITER' ? 'Alex Mercer' : role === 'SME' ? 'Amanda Lin' : 'Sarah Jenkins',
      authorRole: role,
      text: noteText,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const updated = candidates.map(c => {
      if (c.id === candidateId) {
        return { ...c, notes: [note, ...c.notes] };
      }
      return c;
    });
    setCandidates(updated);
    saveState(updated);
    const cand = candidates.find(c => c.id === candidateId);
    if (cand) {
      addAuditLog('Added Note', 'Candidate', `Added collaboration note to candidate ${cand.name}.`);
    }
  };

  // Job Actions
  const addJob = (newJob: Omit<Job, 'id' | 'createdAt' | 'candidateCount'>) => {
    const job: Job = {
      ...newJob,
      id: `job-${Date.now()}`,
      candidateCount: 0,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const updated = [job, ...jobs];
    setJobs(updated);
    saveState(candidates, updated);
    addAuditLog('Created Job', 'Job', `Created job "${job.title}" for client ${job.clientName}.`);
  };

  // Duplicate Detection Algorithm
  const detectDuplicates = (): DuplicatePair[] => {
    const pairs: DuplicatePair[] = [];
    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const c1 = candidates[i];
        const c2 = candidates[j];

        let isMatch = false;
        let reason = '';
        let score = 0;

        if (c1.email.toLowerCase() === c2.email.toLowerCase()) {
          isMatch = true;
          reason = 'Matching Email Address';
          score = 100;
        } else if (c1.phone && c2.phone && c1.phone.replace(/\D/g, '') === c2.phone.replace(/\D/g, '')) {
          isMatch = true;
          reason = 'Matching Phone Number';
          score = 95;
        } else if (c1.linkedinUrl && c2.linkedinUrl && c1.linkedinUrl.toLowerCase() === c2.linkedinUrl.toLowerCase()) {
          isMatch = true;
          reason = 'Matching LinkedIn Profile URL';
          score = 98;
        } else if (c1.name.toLowerCase() === c2.name.toLowerCase()) {
          isMatch = true;
          reason = 'Identical Candidate Name';
          score = 85;
        }

        if (isMatch) {
          pairs.push({
            primary: c1,
            duplicate: c2,
            reason,
            similarityScore: score
          });
        }
      }
    }
    return pairs;
  };

  // Merge Duplicate Candidates
  const mergeCandidates = (primaryId: string, duplicateId: string) => {
    const primary = candidates.find(c => c.id === primaryId);
    const duplicate = candidates.find(c => c.id === duplicateId);

    if (!primary || !duplicate) return;

    // Merge notes, skills, documents
    const mergedNotes = [...primary.notes, ...duplicate.notes];
    const mergedSkills = Array.from(new Set([...primary.skills, ...duplicate.skills]));
    const mergedDocs = [...primary.documents, ...duplicate.documents];

    const updatedCandidates = candidates
      .filter(c => c.id !== duplicateId)
      .map(c => {
        if (c.id === primaryId) {
          return {
            ...c,
            skills: mergedSkills,
            notes: mergedNotes,
            documents: mergedDocs,
            summary: `${c.summary}\n\n[Merged Record Note]: Merged profile data from source ${duplicate.source}.`,
            updatedAt: new Date().toISOString().slice(0, 10)
          };
        }
        return c;
      });

    setCandidates(updatedCandidates);
    saveState(updatedCandidates);
    addAuditLog('Merged Duplicates', 'Candidate', `Merged candidate record ${duplicate.name} (${duplicate.id}) into primary record ${primary.name} (${primary.id}).`);
  };

  // Schedule Interview
  const scheduleInterview = (newInt: Omit<Interview, 'id'>) => {
    const interview: Interview = {
      ...newInt,
      id: `int-${Date.now()}`
    };
    const updated = [interview, ...interviews];
    setInterviews(updated);

    // Automatically progress stage to 'Interview Scheduled' if in earlier stage
    const candUpdated = candidates.map(c => {
      if (c.id === interview.candidateId && (c.stage === 'Applied' || c.stage === 'Recruiter Review' || c.stage === 'HR Review' || c.stage === 'SME Assigned')) {
        return { ...c, stage: 'Interview Scheduled' as PipelineStage };
      }
      return c;
    });

    setCandidates(candUpdated);
    saveState(candUpdated, jobs, clients, updated);
    addAuditLog('Scheduled Interview', 'Interview', `Scheduled ${interview.round} for ${interview.candidateName} with ${interview.interviewerName}.`);
  };

  // Submit SME Feedback
  const submitSmeFeedback = (newFb: Omit<SmeFeedback, 'id' | 'createdAt'>) => {
    const feedback: SmeFeedback = {
      ...newFb,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    const updatedFbs = [feedback, ...feedbacks];
    setFeedbacks(updatedFbs);

    // Update candidate stage to Technical Round or Client Round based on feedback
    const candUpdated = candidates.map(c => {
      if (c.id === feedback.candidateId) {
        return { 
          ...c, 
          stage: feedback.recommendation === 'Strong Hire' || feedback.recommendation === 'Hire' 
            ? ('Technical Round' as PipelineStage) 
            : c.stage 
        };
      }
      return c;
    });

    setCandidates(candUpdated);
    saveState(candUpdated, jobs, clients, interviews, updatedFbs);
    addAuditLog('Submitted SME Feedback', 'SME Feedback', `Submitted feedback for ${feedback.candidateName}: ${feedback.recommendation} (${feedback.technicalScore}/5 Technical).`);
  };

  // Toggle Integration Status
  const toggleIntegration = (id: string) => {
    const updated = integrations.map(i => {
      if (i.id === id) {
        return { 
          ...i, 
          status: i.status === 'Connected' ? ('Disconnected' as const) : ('Connected' as const),
          lastSync: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return i;
    });
    setIntegrations(updated);
    saveState(candidates, jobs, clients, interviews, feedbacks, updated);
    const item = integrations.find(i => i.id === id);
    if (item) {
      addAuditLog('Updated Integration', 'System', `Toggled integration status for ${item.name}.`);
    }
  };

  return {
    isLoaded,
    role,
    setRole: handleRoleChange,
    candidates,
    jobs,
    clients,
    interviews,
    feedbacks,
    integrations,
    auditLogs,
    addCandidate,
    updateCandidateStage,
    addCandidateNote,
    addJob,
    detectDuplicates,
    mergeCandidates,
    scheduleInterview,
    submitSmeFeedback,
    toggleIntegration,
    addAuditLog
  };
}
