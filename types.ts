export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  university: string;
  branch: string;
  year: number;
  skills: string[];
  interests: string[];
  bio?: string;
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    universityDomain: string;
  };
  stats: {
    xp: number;
    level: number;
    completedProjects: number;
    rating: number;
    connections: number;
  };
  badges: string[];
  availability: 'available' | 'busy' | 'away';
  github?: string;
  createdAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  ownerId: string;
  requiredRoles: {
    role: string;
    count: number;
    skills: string[];
  }[];
  techStack: string[];
  status: 'recruiting' | 'active' | 'completed' | 'cancelled';
  teamMembers: string[];
  applications: string[];
  collaborationType: 'remote' | 'hybrid' | 'in-person';
  timeline: {
    start: Date;
    end: Date;
  };
  vibe: 'serious' | 'casual' | 'learning';
  university: string;
  githubRepo?: string;
  createdAt: Date;
}

export interface Message {
  _id: string;
  projectId: string;
  userId: string;
  content: string;
  type: 'text' | 'code' | 'file';
  codeSnippet?: {
    language: string;
    code: string;
  };
  file?: {
    name: string;
    url: string;
    size: number;
  };
  timestamp: Date;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate?: Date;
  createdAt: Date;
}
