import { SmeFeedback } from '../types';

export function parseResumeText(rawText: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Extract Name (assume top non-empty line or keyword)
  let name = lines[0] || 'Imported Candidate';
  if (name.toLowerCase().includes('resume') || name.length > 30) {
    name = lines[1] || 'Imported Candidate';
  }

  // Extract Email
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : `candidate_${Date.now().toString().slice(-4)}@example.com`;

  // Extract Phone
  const phoneMatch = rawText.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '+1 (555) 019-2831';

  // Extract Experience Years heuristic
  const expMatch = rawText.match(/(\d+)\+?\s*(years|yrs)\s*(of)?\s*experience/i);
  const yearsExperience = expMatch ? parseInt(expMatch[1], 10) : 5;

  // Extract Skills from common dictionary
  const knownSkills = [
    'Python', 'Apache Spark', 'AWS', 'SQL', 'Snowflake', 'Airflow', 'Kafka', 'dbt',
    'Terraform', 'Kubernetes', 'Docker', 'Go', 'CI/CD Pipeline', 'Azure', 'Prometheus',
    'React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'GraphQL', 'Redis',
    'Java', 'Spring Boot', 'C++', 'Microservices', 'Git', 'Agile'
  ];

  const foundSkills = knownSkills.filter(skill => 
    new RegExp(`\\b${skill.replace('+', '\\+')}\\b`, 'i').test(rawText)
  );

  if (foundSkills.length === 0) {
    foundSkills.push('Python', 'SQL', 'AWS', 'Git');
  }

  // Extract LinkedIn & GitHub
  const linkedinMatch = rawText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedinUrl = linkedinMatch ? `https://${linkedinMatch[0]}` : `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`;

  const githubMatch = rawText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  const githubUrl = githubMatch ? `https://${githubMatch[0]}` : undefined;

  // Extract Company
  const companyMatch = rawText.match(/(formerly at|worked at|company:|at)\s+([A-Z][a-zA-Z0-9\s]{2,20})/i);
  const currentCompany = companyMatch ? companyMatch[2].trim() : 'Tech Solutions Inc';

  const titleMatch = rawText.match(/(Senior|Lead|Principal|Junior)?\s*(Data Engineer|DevOps Engineer|Cloud Architect|Software Engineer|Full Stack Developer|Frontend Engineer)/i);
  const title = titleMatch ? titleMatch[0] : 'Senior Software Engineer';

  const summary = `${title} with ${yearsExperience}+ years of experience in ${foundSkills.slice(0, 4).join(', ')}. Proven track record of delivering scalable solutions at ${currentCompany}.`;

  return {
    name,
    email,
    phone,
    title,
    yearsExperience,
    currentCompany,
    skills: foundSkills,
    summary,
    linkedinUrl,
    githubUrl,
    education: 'B.S. in Computer Science & Engineering',
    certifications: ['AWS Certified Solutions Architect']
  };
}

export function calculateMatchScore(candidateSkills: string[], candidateExp: number, jobSkills: string[], minExp: number) {
  if (!jobSkills || jobSkills.length === 0) {
    return {
      matchScore: 85,
      missingSkills: [],
      strengths: ['Relevant experience level'],
      weaknesses: [],
      recommendedLevel: 'Senior'
    };
  }

  const matchedSkills = candidateSkills.filter(cs => 
    jobSkills.some(js => js.toLowerCase() === cs.toLowerCase())
  );
  
  const missingSkills = jobSkills.filter(js => 
    !candidateSkills.some(cs => cs.toLowerCase() === js.toLowerCase())
  );

  const skillScore = (matchedSkills.length / jobSkills.length) * 70;
  const expScore = Math.min((candidateExp / (minExp || 1)), 1.5) * 30;

  const matchScore = Math.min(Math.round(skillScore + expScore), 99);

  const strengths: string[] = [];
  if (matchedSkills.length > 0) {
    strengths.push(`Strong proficiency in ${matchedSkills.slice(0, 3).join(', ')}`);
  }
  if (candidateExp >= minExp) {
    strengths.push(`${candidateExp} years experience exceeds role requirement (${minExp} yrs)`);
  }

  const weaknesses: string[] = [];
  if (missingSkills.length > 0) {
    weaknesses.push(`Lacks verified experience in ${missingSkills.join(', ')}`);
  }
  if (candidateExp < minExp) {
    weaknesses.push(`Total experience (${candidateExp} yrs) is below role target (${minExp} yrs)`);
  }

  let recommendedLevel = 'Mid-Level';
  if (candidateExp >= 7 && matchScore > 85) recommendedLevel = 'Staff / Lead';
  else if (candidateExp >= 4 && matchScore > 75) recommendedLevel = 'Senior';

  return {
    matchScore: Math.max(matchScore, 40),
    missingSkills,
    strengths,
    weaknesses,
    recommendedLevel
  };
}

export function generateInterviewQuestions(jobTitle: string, skills: string[]) {
  const techSkillsStr = skills.slice(0, 3).join(', ');
  return [
    {
      category: 'System Architecture & Design',
      question: `Can you walk us through how you would architect a high-throughput, fault-tolerant system using ${techSkillsStr || 'cloud microservices'}? What trade-offs would you consider?`
    },
    {
      category: 'Deep Tech & Skill Verification',
      question: `In your past projects utilizing ${skills[0] || 'core backend technologies'}, how did you handle performance bottlenecks, concurrency issues, or database query optimization?`
    },
    {
      category: 'Problem Solving & Recovery',
      question: `Describe a scenario where a critical pipeline or production service failed. How did you diagnose the root cause, mitigate immediate impact, and prevent regression?`
    },
    {
      category: 'Collaboration & SME Review',
      question: `How do you handle technical disagreements during code reviews or architectural RFC evaluations with cross-functional engineering teams?`
    }
  ];
}

export function generateSmeFeedbackSummary(feedbacks: SmeFeedback[]) {
  if (!feedbacks || feedbacks.length === 0) {
    return 'No SME structured evaluations submitted yet.';
  }

  const totalTech = feedbacks.reduce((acc, f) => acc + f.technicalScore, 0) / feedbacks.length;
  const totalComm = feedbacks.reduce((acc, f) => acc + f.communicationScore, 0) / feedbacks.length;
  const recommendations = feedbacks.map(f => f.recommendation);

  const strongHires = recommendations.filter(r => r === 'Strong Hire').length;
  const hires = recommendations.filter(r => r === 'Hire').length;

  return `Evaluated across ${feedbacks.length} SME round(s). Average Technical Rating: ${totalTech.toFixed(1)}/5, Communication Rating: ${totalComm.toFixed(1)}/5. Consensus: ${strongHires > 0 ? 'Strong Hire' : hires > 0 ? 'Favorable Hire' : 'Under Review'}. Key SME note: "${feedbacks[0].detailedComments.slice(0, 140)}..."`;
}

export function generateAiEmail(
  templateType: 'OUTREACH' | 'INTERVIEW_INVITE' | 'REJECTION' | 'OFFER_LETTER',
  candidateName: string,
  jobTitle: string,
  companyName: string,
  extra?: { date?: string; meetingLink?: string; salary?: string }
) {
  switch (templateType) {
    case 'OUTREACH':
      return {
        subject: `Exciting Career Opportunity: ${jobTitle} at ${companyName}`,
        body: `Hi ${candidateName},\n\nI reviewed your background and was exceptionally impressed by your engineering experience. At ${companyName}, we are currently building next-generation infrastructure for our ${jobTitle} position.\n\nGiven your expertise, I believe this role aligns perfectly with your career trajectory. Are you open for a brief 15-minute conversation this week?\n\nBest regards,\nRecruitFlow AI Talent Team`
      };
    case 'INTERVIEW_INVITE':
      return {
        subject: `Interview Invitation: Technical SME Round - ${jobTitle}`,
        body: `Dear ${candidateName},\n\nWe are pleased to invite you to the next stage of our evaluation process for the ${jobTitle} position at ${companyName}.\n\nInterview Details:\n- Date & Time: ${extra?.date || 'To be scheduled'}\n- Format: Virtual Technical SME Round (60 minutes)\n- Meeting Link: ${extra?.meetingLink || 'https://zoom.us/j/recruitflow-meeting'}\n\nPlease confirm if this time works for you.\n\nWarm regards,\nRecruitFlow Talent Acquisition`
      };
    case 'REJECTION':
      return {
        subject: `Update regarding your application for ${jobTitle}`,
        body: `Dear ${candidateName},\n\nThank you for taking the time to interview for the ${jobTitle} position at ${companyName}. We were genuinely impressed by your skill set and background.\n\nWhile our team has decided to proceed with another candidate whose experience matches our immediate requirements slightly closer, we will keep your profile in our RecruitFlow CRM for future high-priority roles.\n\nWe wish you all the best in your career search.\n\nSincerely,\nRecruitFlow HR Team`
      };
    case 'OFFER_LETTER':
      return {
        subject: `Official Offer Letter: ${jobTitle} at ${companyName}`,
        body: `Dear ${candidateName},\n\nOn behalf of ${companyName}, I am thrilled to extend an official offer of employment for the position of ${jobTitle}!\n\nOffer Overview:\n- Role: ${jobTitle}\n- Compensation: ${extra?.salary || '$160,000 / year'}\n- Start Date: Flexible (To be finalized)\n\nPlease review the attached offer documentation in your RecruitFlow portal and reply to confirm acceptance.\n\nCongratulations and welcome aboard!\n\nBest regards,\nHead of Recruiting`
      };
  }
}
