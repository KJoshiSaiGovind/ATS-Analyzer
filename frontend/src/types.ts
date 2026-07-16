export type Screen = 'auth' | 'dashboard';
export type AuthTab = 'signin' | 'signup';

export interface User {
  name: string;
  email: string;
}

export interface ResumeData {
  fileName: string;
  fileSize: string;
  skills: string[];
  roles: string[];
  status: 'empty' | 'uploading' | 'parsed';
}

export interface AnalysisResult {
  score: number;
  parsability: number;
  matchedSkills: string[];
  missingSkills: string[];
  tip: string;
}
