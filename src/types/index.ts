export interface User {
  id: string;
  email: string;
  name: string;
  role: 'job_seeker' | 'employer';
}

export interface Profile {
  id: string;
  userId: string;
  professionalHeadline?: string;
  bio?: string;
  skills?: string[];
  experience?: any;
  education?: any;
  location?: string;
  phone?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  description?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  logoUrl?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  isRemote: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    logoUrl?: string;
    location?: string;
    description?: string;
    website?: string;
  };
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  coverLetter?: string;
  appliedAt: string;
  updatedAt: string;
  job?: Job;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: string;
  job?: Job;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

