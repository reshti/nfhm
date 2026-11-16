/**
 * Data contracts and types for Nafham Awareness Platform
 * Imam Abdulrahman Bin Faisal University
 */

export type TargetAudience = 'children' | 'parents' | 'teachers' | 'community';

export interface EducationalTrack {
  id: TargetAudience;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  image: string;
  accentColor: string;
  iconName: string;
  recommendedTopics: string[];
  recommendedGames: string[];
  keyAdvice: string[];
}

export interface LibraryTopic {
  id: string;
  title: string;
  category: string;
  readingTimeMinutes: number;
  iconName: string;
  summary: string;
  fullContent: string[];
  practicalExamples: { situation: string; bestPractice: string }[];
  reviewQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  sources: { title: string; publisher: string; link?: string }[];
}

export interface QuizQuestionItem {
  id: number;
  topic: string;
  audience?: TargetAudience | 'all';
  difficulty?: 'easy' | 'medium' | 'advanced' | 'hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
}

export interface ScientificSourceItem {
  id: string;
  name: string;
  publisher: string;
  category: string;
  topic: string;
  summary: string;
  url: string;
  lastReviewed: string;
}

export interface AdventureStation {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  badge: string;
  conceptText: string;
  interactiveChallenge: {
    prompt: string;
    choices: { label: string; isCorrect: boolean; feedback: string }[];
  };
  takeaway: string;
}

export interface UserProgress {
  completedStations: number[];
  gamesStars: Record<string, number>;
  quizScores: {
    date: string;
    score: number;
    total: number;
    topic: string;
  }[];
  earnedCertificates: {
    id: string;
    name: string;
    title: string;
    date: string;
    score?: number;
  }[];
  accessibilitySettings: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'xlarge';
  };
}
