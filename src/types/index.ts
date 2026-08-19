export type UserRole = 'ADMIN' | 'HR_MANAGER' | 'RECRUITER' | 'SME' | 'CLIENT';

export type CandidateSource = 
  | 'LinkedIn' 
  | 'Indeed' 
  | 'Dice' 
  | 'Glassdoor' 
  | 'Monster' 
  | 'ZipRecruiter' 
  | 'Referral' 
  | 'Email' 
  | 'Resume Upload' 
  | 'CSV Import';

export type PipelineStage = 
  | 'Applied' 
  | 'Recruiter Review' 
  | 'HR Review' 
  | 'SME Assigned' 
  | 'Interview Scheduled' 
  | 'Technical Round' 
  | 'Client Round' 
  | 'Offer Released' 
  | 'Joined' 
  | 'Rejected';

export type VisaStatus = 'US Citizen' | 'Green Card' | 'H1B' | 'OPT/CPT' | 'TN Visa' | 'Need Sponsorship';

export type ContractType = 'Full-Time' | 'Contract (C2C)' | 'Contract (W2)' | 'Part-Time';

export interface Note {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'Resume' | 'Passport' | 'Visa' | 'Offer Letter' | 'NDA' | 'Certificate';
  url: string;
  uploadDate: string;
  size: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  location: string;
  yearsExperience: number;
  currentCompany: string;
  expectedSalary: string;
  noticePeriod: string;
  visaStatus: VisaStatus;
  source: CandidateSource;
  stage: PipelineStage;
  jobId: string;
  jobTitle: string;
  skills: string[];
  summary: string;
  resumeUrl?: string;
  resumeText?: string;
  matchScore: number;
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  education: string;
  certifications: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  notes: Note[];
  documents: DocumentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  contractType: ContractType;
  minExperience: number;
  maxExperience: number;
  location: string;
  remote: boolean;
  salaryRange: string;
  requiredSkills: string[];
  preferredSkills: string[];
  assignedRecruiterId: string;
  assignedRecruiterName: string;
  assignedSmeId: string;
  assignedSmeName: string;
  status: 'Active' | 'Draft' | 'Closed';
  candidateCount: number;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  activeJobsCount: number;
  totalCandidatesCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewerId: string;
  interviewerName: string;
  date: string;
  time: string;
  durationMinutes: number;
  round: 'Recruiter Screen' | 'Technical SME Round' | 'HR Interview' | 'Client Discussion';
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface SmeFeedback {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  smeId: string;
  smeName: string;
  technicalScore: number; // 1-5
  communicationScore: number; // 1-5
  problemSolvingScore: number; // 1-5
  codingScore: number; // 1-5
  recommendation: 'Strong Hire' | 'Hire' | 'Neutral' | 'Reject';
  detailedComments: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetType: 'Candidate' | 'Job' | 'Interview' | 'SME Feedback' | 'Client' | 'System';
  details: string;
}

export interface IntegrationProvider {
  id: string;
  name: string;
  category: 'Sourcing Portal' | 'Communication' | 'Calendar & Video';
  status: 'Connected' | 'Disconnected' | 'Pending';
  description: string;
  lastSync?: string;
  iconName: string;
}
