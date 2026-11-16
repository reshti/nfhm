import { UserProgress, QuizQuestionItem } from '../types/nafham';

const STORAGE_KEY_PROGRESS = 'nafham_user_progress_v2';
const STORAGE_KEY_CUSTOM_QUESTIONS = 'nafham_custom_questions_v1';

export const initialProgress: UserProgress = {
  completedStations: [],
  gamesStars: {
    puzzle: 0,
    emotion: 0,
    routine: 0,
    sensory: 0,
    communication: 0,
    factmyth: 0,
  },
  quizScores: [],
  earnedCertificates: [],
  accessibilitySettings: {
    reduceMotion: false,
    highContrast: false,
    fontSize: 'normal',
  },
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return initialProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return initialProgress;
    return { ...initialProgress, ...JSON.parse(raw) };
  } catch {
    return initialProgress;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function updateGameStars(gameId: string, stars: number): UserProgress {
  const progress = loadUserProgress();
  const current = progress.gamesStars[gameId] || 0;
  if (stars > current) {
    progress.gamesStars[gameId] = stars;
    saveUserProgress(progress);
  }
  return progress;
}

export function completeStation(stationId: number): UserProgress {
  const progress = loadUserProgress();
  if (!progress.completedStations.includes(stationId)) {
    progress.completedStations.push(stationId);
    saveUserProgress(progress);
  }
  return progress;
}

export function saveCertificate(certificate: {
  id: string;
  name: string;
  title: string;
  date: string;
  score?: number;
}): UserProgress {
  const progress = loadUserProgress();
  progress.earnedCertificates.push(certificate);
  saveUserProgress(progress);
  return progress;
}

export function loadCustomQuestions(): QuizQuestionItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomQuestion(question: QuizQuestionItem): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadCustomQuestions();
    existing.push(question);
    localStorage.setItem(STORAGE_KEY_CUSTOM_QUESTIONS, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save custom question', e);
  }
}
