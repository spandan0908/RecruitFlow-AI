import { Candidate, Job, Client, Interview, SmeFeedback, IntegrationProvider, AuditLog } from '../types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Apex Tech Solutions',
    industry: 'Enterprise Software & Cloud',
    contactPerson: 'Sarah Jenkins (VP of Talent)',
    email: 's.jenkins@apextech.io',
    phone: '+1 (555) 234-8900',
    location: 'San Francisco, CA',
    activeJobsCount: 3,
    totalCandidatesCount: 14,
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'client-2',
    name: 'CloudScale Systems',
    industry: 'DevOps & Data Infrastructure',
    contactPerson: 'David Ross (Head of Engineering)',
    email: 'dross@cloudscale.com',
    phone: '+1 (555) 432-1099',
    location: 'Austin, TX',
    activeJobsCount: 2,
    totalCandidatesCount: 9,
    status: 'Active',
    createdAt: '2026-02-01'
  },
  {
    id: 'client-3',
    name: 'FinTech Dynamics',
    industry: 'Financial SASS & AI Trading',
    contactPerson: 'Elena Rostova (Recruiting Lead)',
    email: 'elena@fintechdynamics.com',
    phone: '+1 (555) 876-5432',
    location: 'New York, NY',
    activeJobsCount: 2,
    totalCandidatesCount: 11,
    status: 'Active',
    createdAt: '2026-02-10'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Data Engineer',
    clientId: 'client-1',
    clientName: 'Apex Tech Solutions',
    contractType: 'Full-Time',
    minExperience: 5,
    maxExperience: 9,
    location: 'San Francisco, CA (Hybrid)',
    remote: true,
    salaryRange: '$155,000 - $185,000 / year',
    requiredSkills: ['Python', 'Apache Spark', 'AWS', 'SQL', 'Snowflake', 'Airflow'],
    preferredSkills: ['Kafka', 'Kubernetes', 'dbt'],
    assignedRecruiterId: 'rec-1',
    assignedRecruiterName: 'Alex Mercer',
    assignedSmeId: 'sme-1',
    assignedSmeName: 'Dr. Michael Vance (Chief Architect)',
    status: 'Active',
    candidateCount: 8,
    createdAt: '2026-07-10'
  },
  {
    id: 'job-2',
    title: 'Lead Cloud Infrastructure Architect',
    clientId: 'client-2',
    clientName: 'CloudScale Systems',
    contractType: 'Contract (C2C)',
    minExperience: 7,
    maxExperience: 12,
    location: 'Austin, TX',
    remote: true,
    salaryRange: '$95 - $115 / hr',
    requiredSkills: ['Terraform', 'AWS', 'Kubernetes', 'Docker', 'Go', 'CI/CD Pipeline'],
    preferredSkills: ['Azure', 'Istio', 'Prometheus'],
    assignedRecruiterId: 'rec-2',
    assignedRecruiterName: 'Jessica Taylor',
    assignedSmeId: 'sme-2',
    assignedSmeName: 'Kevin Patel (Principal DevOps SME)',
    status: 'Active',
    candidateCount: 5,
    createdAt: '2026-07-14'
  },
  {
    id: 'job-3',
    title: 'Senior React / Next.js Full Stack Engineer',
    clientId: 'client-3',
    clientName: 'FinTech Dynamics',
    contractType: 'Full-Time',
    minExperience: 4,
    maxExperience: 8,
    location: 'New York, NY',
    remote: false,
    salaryRange: '$140,000 - $170,000 / year',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    preferredSkills: ['GraphQL', 'Redis', 'Docker'],
    assignedRecruiterId: 'rec-1',
    assignedRecruiterName: 'Alex Mercer',
    assignedSmeId: 'sme-3',
    assignedSmeName: 'Amanda Lin (Frontend SME)',
    status: 'Active',
    candidateCount: 7,
    createdAt: '2026-07-20'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '+1 (555) 341-9821',
    title: 'Senior Data Engineer',
    location: 'San Jose, CA',
    yearsExperience: 6,
    currentCompany: 'Amazon Web Services',
    expectedSalary: '$170,000 / year',
    noticePeriod: '2 Weeks',
    visaStatus: 'US Citizen',
    source: 'LinkedIn',
    stage: 'SME Assigned',
    jobId: 'job-1',
    jobTitle: 'Senior Data Engineer',
    skills: ['Python', 'Apache Spark', 'AWS', 'SQL', 'Snowflake', 'Airflow', 'Kafka'],
    summary: 'Senior Data Engineer with 6 years of experience building large-scale ETL pipelines, streaming architectures, and data warehouses using Python, Spark, AWS, and SQL. Ex-Amazon and Deloitte.',
    matchScore: 94,
    missingSkills: ['dbt'],
    strengths: ['Expert in PySpark & AWS Glue', 'Delivered petabyte-scale data migration', 'Strong system design'],
    weaknesses: ['Limited hands-on dbt experience'],
    education: 'B.S. in Computer Science - UC Berkeley (2020)',
    certifications: ['AWS Certified Big Data Specialist', 'Snowflake SnowPro Core'],
    githubUrl: 'https://github.com/marcusvance-dev',
    linkedinUrl: 'https://linkedin.com/in/marcus-vance-data',
    portfolioUrl: 'https://marcusvance.io',
    notes: [
      {
        id: 'note-1',
        authorId: 'rec-1',
        authorName: 'Alex Mercer',
        authorRole: 'RECRUITER',
        text: 'Initial screening went great! Marcus demonstrated deep expertise in PySpark and pipeline optimization at AWS. Enthusiastic about the Apex Tech role.',
        createdAt: '2026-08-01 10:15'
      },
      {
        id: 'note-2',
        authorId: 'hr-1',
        authorName: 'Rachel Green',
        authorRole: 'HR_MANAGER',
        text: 'Salary expectation is well within $155k-$185k band. Approved for SME Technical Round.',
        createdAt: '2026-08-02 14:30'
      }
    ],
    documents: [
      { id: 'doc-1', name: 'Marcus_Vance_Resume_2026.pdf', type: 'Resume', url: '#', uploadDate: '2026-08-01', size: '2.4 MB' },
      { id: 'doc-2', name: 'AWS_Big_Data_Cert.pdf', type: 'Certificate', url: '#', uploadDate: '2026-08-01', size: '1.1 MB' }
    ],
    createdAt: '2026-08-01',
    updatedAt: '2026-08-05'
  },
  {
    id: 'cand-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@techcloud.io',
    phone: '+1 (555) 902-1144',
    title: 'DevOps & Cloud Architect',
    location: 'Austin, TX',
    yearsExperience: 8,
    currentCompany: 'Red Hat / IBM',
    expectedSalary: '$105 / hr',
    noticePeriod: 'Immediate',
    visaStatus: 'Green Card',
    source: 'Indeed',
    stage: 'Interview Scheduled',
    jobId: 'job-2',
    jobTitle: 'Lead Cloud Infrastructure Architect',
    skills: ['Terraform', 'AWS', 'Kubernetes', 'Docker', 'Go', 'CI/CD Pipeline', 'Prometheus'],
    summary: 'Cloud Architect with 8+ years designing zero-downtime Kubernetes clusters, Terraform infrastructure-as-code modules, and multi-region AWS environments.',
    matchScore: 91,
    missingSkills: ['Istio'],
    strengths: ['Production Kubernetes at scale', 'Terraform modular design expert', 'Strong security compliance'],
    weaknesses: ['Prefers remote over full onsite'],
    education: 'M.S. in Software Engineering - UT Austin (2018)',
    certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Solutions Architect Professional'],
    githubUrl: 'https://github.com/psharma-cloud',
    linkedinUrl: 'https://linkedin.com/in/priyasharma-devops',
    notes: [
      {
        id: 'note-3',
        authorId: 'rec-2',
        authorName: 'Jessica Taylor',
        authorRole: 'RECRUITER',
        text: 'Sourced from Indeed. High fit for CloudScale. Available immediately for C2C contract.',
        createdAt: '2026-08-03 09:00'
      }
    ],
    documents: [
      { id: 'doc-3', name: 'Priya_Sharma_CV.pdf', type: 'Resume', url: '#', uploadDate: '2026-08-03', size: '1.8 MB' }
    ],
    createdAt: '2026-08-03',
    updatedAt: '2026-08-06'
  },
  {
    id: 'cand-3',
    name: 'David Chen',
    email: 'dchen.dev@gmail.com',
    phone: '+1 (555) 671-4490',
    title: 'Senior Full Stack Engineer',
    location: 'New York, NY',
    yearsExperience: 5,
    currentCompany: 'Stripe',
    expectedSalary: '$160,000 / year',
    noticePeriod: '1 Month',
    visaStatus: 'H1B',
    source: 'Dice',
    stage: 'Technical Round',
    jobId: 'job-3',
    jobTitle: 'Senior React / Next.js Full Stack Engineer',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'GraphQL', 'Redis'],
    summary: 'Full Stack Engineer with 5 years experience specializing in high-throughput React/Next.js UI design systems, TypeScript API endpoints, and SQL query tuning at Stripe.',
    matchScore: 98,
    missingSkills: [],
    strengths: ['Pixel-perfect UI design execution', 'Deep Next.js App Router knowledge', 'GraphQL & Caching expert'],
    weaknesses: ['Requires H1B transfer sponsorship'],
    education: 'B.S. in CS - Columbia University (2021)',
    certifications: ['Meta Certified Front-End Developer'],
    githubUrl: 'https://github.com/dchendev',
    linkedinUrl: 'https://linkedin.com/in/davidchen-fullstack',
    notes: [
      {
        id: 'note-4',
        authorId: 'rec-1',
        authorName: 'Alex Mercer',
        authorRole: 'RECRUITER',
        text: 'Exceptional portfolio. Worked on Stripe dashboard UI. High priority candidate for FinTech Dynamics.',
        createdAt: '2026-08-02 11:20'
      }
    ],
    documents: [
      { id: 'doc-4', name: 'David_Chen_Resume.pdf', type: 'Resume', url: '#', uploadDate: '2026-08-02', size: '2.1 MB' },
      { id: 'doc-5', name: 'H1B_Approval_Notice.pdf', type: 'Visa', url: '#', uploadDate: '2026-08-02', size: '850 KB' }
    ],
    createdAt: '2026-08-02',
    updatedAt: '2026-08-06'
  },
  {
    id: 'cand-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@datadrive.net',
    phone: '+1 (555) 441-2099',
    title: 'Data Engineer',
    location: 'Denver, CO',
    yearsExperience: 4,
    currentCompany: 'Snowflake Inc',
    expectedSalary: '$150,000 / year',
    noticePeriod: '2 Weeks',
    visaStatus: 'US Citizen',
    source: 'Glassdoor',
    stage: 'Client Round',
    jobId: 'job-1',
    jobTitle: 'Senior Data Engineer',
    skills: ['Python', 'SQL', 'Snowflake', 'Airflow', 'AWS'],
    summary: 'Data Engineer focused on cloud data warehousing, SQL query acceleration, and Airflow orchestration.',
    matchScore: 82,
    missingSkills: ['Apache Spark'],
    strengths: ['Snowflake expert certified', 'Fast SQL optimizer'],
    weaknesses: ['Less experience with PySpark distributed clusters'],
    education: 'B.S. Information Systems - University of Colorado',
    certifications: ['Snowflake Core Advanced'],
    notes: [],
    documents: [{ id: 'doc-6', name: 'Elena_Rostova_Resume.pdf', type: 'Resume', url: '#', uploadDate: '2026-07-28', size: '1.5 MB' }],
    createdAt: '2026-07-28',
    updatedAt: '2026-08-04'
  },
  {
    id: 'cand-5',
    name: 'Robert Miller',
    email: 'robert.miller@cloudarch.com',
    phone: '+1 (555) 998-1234',
    title: 'DevOps Specialist',
    location: 'Dallas, TX',
    yearsExperience: 7,
    currentCompany: 'Capital One',
    expectedSalary: '$100 / hr',
    noticePeriod: 'Immediate',
    visaStatus: 'US Citizen',
    source: 'ZipRecruiter',
    stage: 'Offer Released',
    jobId: 'job-2',
    jobTitle: 'Lead Cloud Infrastructure Architect',
    skills: ['Terraform', 'AWS', 'Kubernetes', 'Docker', 'CI/CD Pipeline'],
    summary: 'DevOps specialist with 7 years implementing GitOps pipelines, AWS Elastic Kubernetes Service (EKS), and compliance guardrails.',
    matchScore: 88,
    missingSkills: ['Go'],
    strengths: ['FinTech security compliance', 'AWS EKS master'],
    weaknesses: ['Basic Go scripting'],
    education: 'B.S. CS - UT Dallas',
    certifications: ['AWS DevOps Engineer Professional'],
    notes: [
      {
        id: 'note-5',
        authorId: 'hr-1',
        authorName: 'Rachel Green',
        authorRole: 'HR_MANAGER',
        text: 'Offer letter generated & released to candidate. Awaiting candidate e-signature.',
        createdAt: '2026-08-06 16:00'
      }
    ],
    documents: [
      { id: 'doc-7', name: 'Robert_Miller_CV.pdf', type: 'Resume', url: '#', uploadDate: '2026-07-25', size: '1.9 MB' },
      { id: 'doc-8', name: 'Offer_Letter_Robert_Miller.pdf', type: 'Offer Letter', url: '#', uploadDate: '2026-08-06', size: '420 KB' }
    ],
    createdAt: '2026-07-25',
    updatedAt: '2026-08-06'
  },
  {
    id: 'cand-dup-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com', // Intentional duplicate email for merger demo
    phone: '+1 (555) 341-9821',
    title: 'Data Engineer / PySpark Specialist',
    location: 'San Jose, CA',
    yearsExperience: 6,
    currentCompany: 'Amazon',
    expectedSalary: '$175,000 / year',
    noticePeriod: '2 Weeks',
    visaStatus: 'US Citizen',
    source: 'Monster',
    stage: 'Applied',
    jobId: 'job-1',
    jobTitle: 'Senior Data Engineer',
    skills: ['Python', 'Apache Spark', 'SQL', 'AWS'],
    summary: 'PySpark & AWS Data Engineer with experience at Amazon.',
    matchScore: 85,
    missingSkills: ['Snowflake', 'Airflow'],
    strengths: ['Duplicate record candidate imported via Monster portal'],
    weaknesses: [],
    education: 'UC Berkeley',
    certifications: [],
    notes: [],
    documents: [{ id: 'doc-dup', name: 'M_Vance_Resume_Monster.pdf', type: 'Resume', url: '#', uploadDate: '2026-08-07', size: '1.2 MB' }],
    createdAt: '2026-08-07',
    updatedAt: '2026-08-07'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    candidateId: 'cand-1',
    candidateName: 'Marcus Vance',
    jobId: 'job-1',
    jobTitle: 'Senior Data Engineer',
    interviewerId: 'sme-1',
    interviewerName: 'Dr. Michael Vance (Chief Architect)',
    date: '2026-08-08',
    time: '14:00 EST',
    durationMinutes: 60,
    round: 'Technical SME Round',
    meetingLink: 'https://zoom.us/j/98210394819',
    status: 'Scheduled',
    notes: 'Focus on PySpark architecture and distributed SQL query optimization.'
  },
  {
    id: 'int-2',
    candidateId: 'cand-2',
    candidateName: 'Priya Sharma',
    jobId: 'job-2',
    jobTitle: 'Lead Cloud Infrastructure Architect',
    interviewerId: 'sme-2',
    interviewerName: 'Kevin Patel (Principal DevOps SME)',
    date: '2026-08-08',
    time: '16:00 EST',
    durationMinutes: 45,
    round: 'Technical SME Round',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/cloudscale-priya',
    status: 'Scheduled',
    notes: 'Evaluate Terraform state management and Kubernetes disaster recovery strategies.'
  },
  {
    id: 'int-3',
    candidateId: 'cand-3',
    candidateName: 'David Chen',
    jobId: 'job-3',
    jobTitle: 'Senior React / Next.js Full Stack Engineer',
    interviewerId: 'sme-3',
    interviewerName: 'Amanda Lin (Frontend SME)',
    date: '2026-08-06',
    time: '11:00 EST',
    durationMinutes: 60,
    round: 'Technical SME Round',
    meetingLink: 'https://zoom.us/j/1192837491',
    status: 'Completed',
    notes: 'Live coding session completed. SME feedback submitted.'
  }
];

export const INITIAL_FEEDBACKS: SmeFeedback[] = [
  {
    id: 'fb-1',
    candidateId: 'cand-3',
    candidateName: 'David Chen',
    jobId: 'job-3',
    jobTitle: 'Senior React / Next.js Full Stack Engineer',
    smeId: 'sme-3',
    smeName: 'Amanda Lin (Frontend SME)',
    technicalScore: 5,
    communicationScore: 5,
    problemSolvingScore: 5,
    codingScore: 5,
    recommendation: 'Strong Hire',
    detailedComments: 'David performed remarkably during the live coding exercise. He structured Next.js Server Components with elegant state management and demonstrated mastery of TypeScript generics and SQL query caching with Redis. Highly articulate communicator. Strongly recommend progressing to Client Round.',
    createdAt: '2026-08-06 12:30'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationProvider[] = [
  { id: 'intg-1', name: 'LinkedIn Recruiter', category: 'Sourcing Portal', status: 'Connected', description: 'Auto-sync job posts & candidate applicants directly into CRM pipeline', iconName: 'Linkedin', lastSync: '2026-08-07 20:00' },
  { id: 'intg-2', name: 'Indeed Apply', category: 'Sourcing Portal', status: 'Connected', description: 'Streamline candidate inbound applications and parsing', iconName: 'Globe', lastSync: '2026-08-07 19:45' },
  { id: 'intg-3', name: 'Dice Portal', category: 'Sourcing Portal', status: 'Connected', description: 'Import specialized tech & engineering candidate resumes', iconName: 'Database', lastSync: '2026-08-07 18:30' },
  { id: 'intg-4', name: 'Gmail / Google Workspace', category: 'Communication', status: 'Connected', description: 'Sync recruiter candidate emails and outbound outreach', iconName: 'Mail', lastSync: '2026-08-07 21:10' },
  { id: 'intg-5', name: 'Microsoft Outlook 365', category: 'Communication', status: 'Connected', description: 'Enterprise email calendar sync and candidate messaging', iconName: 'Mail', lastSync: '2026-08-07 21:00' },
  { id: 'intg-6', name: 'Google Calendar', category: 'Calendar & Video', status: 'Connected', description: 'Automated interview scheduling and calendar invite dispatch', iconName: 'Calendar', lastSync: '2026-08-07 21:15' },
  { id: 'intg-7', name: 'Zoom Meetings', category: 'Calendar & Video', status: 'Connected', description: 'Auto-generate secure Zoom video links for SME technical interviews', iconName: 'Video', lastSync: '2026-08-07 21:15' },
  { id: 'intg-8', name: 'Microsoft Teams', category: 'Calendar & Video', status: 'Connected', description: 'Teams meeting links for internal interviews & client reviews', iconName: 'Video', lastSync: '2026-08-07 15:00' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-08-07 21:30', userName: 'Alex Mercer', userRole: 'RECRUITER', action: 'Imported Candidate', targetType: 'Candidate', details: 'Imported Marcus Vance from LinkedIn for Senior Data Engineer job.' },
  { id: 'log-2', timestamp: '2026-08-07 21:15', userName: 'Rachel Green', userRole: 'HR_MANAGER', action: 'Assigned SME', targetType: 'Candidate', details: 'Assigned Dr. Michael Vance as SME for candidate Marcus Vance.' },
  { id: 'log-3', timestamp: '2026-08-07 20:45', userName: 'Amanda Lin', userRole: 'SME', action: 'Submitted Feedback', targetType: 'SME Feedback', details: 'Submitted 5/5 Strong Hire feedback for David Chen.' },
  { id: 'log-4', timestamp: '2026-08-07 19:20', userName: 'Sarah Jenkins', userRole: 'CLIENT', action: 'Approved Shortlist', targetType: 'Candidate', details: 'Approved candidate David Chen for Client Final Discussion round.' }
];
