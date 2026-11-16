import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Calendar,
  Layers,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { NAFHAM_QUIZ_BANK } from '../data/quizBank';
import { loadCustomQuestions, saveUserProgress, loadUserProgress } from '../utils/storage';
import { QuizQuestionItem } from '../types/nafham';
import { CertificateModal } from './CertificateModal';

interface NafhamChallengeProps {
  onBackToHome: () => void;
}

export const NafhamChallenge: React.FC<NafhamChallengeProps> = ({ onBackToHome }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [isDailyMode, setIsDailyMode] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [userName, setUserName] = useState('');

  // Combine static bank with custom questions
  const fullBank = useMemo(() => {
    return [...NAFHAM_QUIZ_BANK, ...loadCustomQuestions()];
  }, []);

  // Filter topics
  const availableTopics = useMemo(() => {
    const set = new Set(fullBank.map((q) => q.topic));
    return ['all', ...Array.from(set)];
  }, [fullBank]);

  // Pick 10 questions randomly from filtered pool
  const activeQuestions = useMemo(() => {
    let pool = fullBank;
    if (selectedTopic !== 'all') {
      pool = fullBank.filter((q) => q.topic === selectedTopic);
    }
    // Simple deterministic daily seed or random shuffle
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [fullBank, selectedTopic, isDailyMode]);

  const currentQ = activeQuestions[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !currentQ) return;
    setSelectedOption(idx);
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate score
      const finalScore = activeQuestions.reduce((acc, q) => {
        return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
      }, 0);

      // Save score in user progress
      const progress = loadUserProgress();
      progress.quizScores.push({
        date: new Date().toLocaleDateString('ar-SA'),
        score: finalScore,
        total: activeQuestions.length,
        topic: selectedTopic === 'all' ? 'المسابقة العامة الشاملة' : selectedTopic,
      });
      saveUserProgress(progress);

      setIsQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setUserAnswers({});
    setIsQuizCompleted(false);
  };

  const scoreCount = activeQuestions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 text-right">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a4d7a] to-[#0c6aa7] p-6 sm:p-10 text-white shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-cyan-200">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>مسابقة تحدي نفهم المعرفية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              اختبر معلوماتك من بنك يضم أكثر من 100 سؤال علمي
            </h1>
            <p className="text-xs sm:text-sm text-cyan-50">
              10 أسئلة مختارة بدقة بإشراف جامعة الإمام عبدالرحمن بن فيصل مع شهادة إلكترونية معتمدة.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>

      {!isQuizCompleted ? (
        <div className="space-y-6">
          {/* Controls: Mode & Topic Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">اختر موضوع التحدي:</span>
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  restartQuiz();
                }}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0c6aa7] cursor-pointer"
              >
                <option value="all">جميع الموضوعات (شامل - 100+ سؤال)</option>
                {availableTopics
                  .filter((t) => t !== 'all')
                  .map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
            </div>

            <div className="text-xs font-bold text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1 rounded-lg border border-[#cbe3f3]">
              السؤال {currentQuestionIdx + 1} من {activeQuestions.length}
            </div>
          </div>

          {/* Active Question Card */}
          {currentQ && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1 rounded-md border border-[#cbe3f3]">
                  {currentQ.topic}
                </span>
                <span className="text-xs text-slate-400">
                  المستوى: {currentQ.difficulty === 'easy' ? 'سهل' : currentQ.difficulty === 'medium' ? 'متوسط' : 'متقدم'}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#0a4d7a] leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQ.correctIndex;
                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-right p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        selectedOption !== null
                          ? isCorrectAnswer
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : isSelected
                            ? 'bg-rose-50 border-rose-400 text-rose-950'
                            : 'bg-white border-slate-200 text-slate-400 opacity-60'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs ${
                          selectedOption !== null && isCorrectAnswer
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : selectedOption !== null && isSelected
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedOption !== null && isCorrectAnswer && '✓'}
                        {selectedOption !== null && isSelected && !isCorrectAnswer && '✕'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback */}
              {selectedOption !== null && (
                <div
                  className={`p-4 rounded-2xl border space-y-1.5 animate-in fade-in ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {selectedOption === currentQ.correctIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      {selectedOption === currentQ.correctIndex
                        ? 'إجابة صحيحة ومتقنة!'
                        : 'إجابة غير صحيحة. الإجابة الصحيحة موضحة أدناه:'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed font-normal">{currentQ.explanation}</p>
                  <span className="text-[11px] text-slate-500 block pt-1 border-t border-current/10">
                    المصدر: {currentQ.source}
                  </span>
                </div>
              )}

              {/* Next Question CTA */}
              {selectedOption !== null && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] shadow-xs cursor-pointer transition-all"
                  >
                    <span>{currentQuestionIdx < activeQuestions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة النهائية'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Final Quiz Results & Certificate Claim */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-12 text-center space-y-6 animate-in fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#0a4d7a]">أحسنت إتمام مسابقة تحدي نفهم!</h2>
            <p className="text-base text-slate-600">
              نتيجتك النهائية: <span className="text-2xl font-black text-[#0c6aa7]">{scoreCount}</span> من أصل{' '}
              <span className="font-bold">{activeQuestions.length}</span>
            </p>
          </div>

          {/* Certificate Generation Form */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-b from-[#f0f7fb] to-[#e4f1f9] border border-[#cbe3f3] text-right space-y-3">
            <div className="flex items-center gap-2 text-[#0a4d7a] font-bold text-sm">
              <Award className="w-5 h-5 text-amber-500" />
              <span>إصدار شهادتك الرقمية المعتمدة:</span>
            </div>
            <p className="text-xs text-slate-600">
              اكتب اسمك الثلاثي لتحميل وطباعة شهادة إتمام التحدي برعاية جامعة الإمام عبدالرحمن بن فيصل:
            </p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="مثال: عبدالله بن صالح العتيبي"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-right focus:outline-none focus:ring-2 focus:ring-[#0c6aa7]"
            />
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>معاينة وتحميل الشهادة الرسمية</span>
            </button>
          </div>

          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={restartQuiz}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>خوض مسابقة جديدة</span>
            </button>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        recipientName={userName || 'سفير الوعي بطيف التوحد'}
        achievementTitle="مسابقة تحدي نفهم المعرفية"
        score={scoreCount}
        total={activeQuestions.length}
      />
    </div>
  );
};
