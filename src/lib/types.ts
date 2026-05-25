export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F';

export interface FeatureGrade {
  id: string;
  name: string;
  grade: Grade;
  score: number; // 0-100
  description: string;
  icon: string;
  tips: string[];
  category: 'harmony' | 'dimorphism' | 'angularity' | 'miscellaneous';
  idealRange?: string;
}

export interface Assessment {
  id: string;
  date: string;
  overallGrade: Grade;
  overallScore: number;
  pslTier: string;
  features: FeatureGrade[];
  photoUrl?: string;
}

export interface ImprovementTip {
  id: string;
  featureId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  category: 'skincare' | 'exercise' | 'lifestyle' | 'grooming' | 'nutrition';
}

export interface ProgressEntry {
  date: string;
  score: number;
}

export interface UserProfile {
  name: string;
  assessmentCount: number;
  streakDays: number;
  joinedDate: string;
  bestFeature: string;
  focusArea: string;
}
