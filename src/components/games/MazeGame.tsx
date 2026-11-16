import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Star,
  Compass,
  Footprints,
} from 'lucide-react';
import { VictoryCelebrationModal } from '../common/VictoryCelebrationModal';

interface QuestionCheckpoint {
  id: number;
  r: number;
  c: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  solved: boolean;
}

// 0: path, 1: wall, 2: checkpoint question, 3: star collectible, 4: goal exit
const MAZE_GRID = [
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 1, 1, 0, 0, 4], // (9,9) is the goal
];

const INITIAL_CHECKPOINTS: QuestionCheckpoint[] = [
  {
    id: 1,
    r: 2,
    c: 3,
    question: 'ما هو اضطراب طيف التوحد من منظور علمي دقيق؟',
    options: [
      'اختلاف نمائي عصبي وطريقة فريدة لنمو الدماغ',
      'مرض نفسي ناتج عن العزلة وسوء التربية',
      'حالة مؤقتة تزول بالعقاقير الطبية فقط',
    ],
    correctIndex: 0,
    explanation: 'اضطراب طيف التوحد اختلاف عصبي نمائي فريد وليس ناتجاً عن سوء تربية.',
    solved: false,
  },
  {
    id: 2,
    r: 4,
    c: 5,
    question: 'عندما يغطي زميلك ذو التوحد أذنيه في مكان مزدحم، فذلك بسبب:',
    options: [
      'فرط الحساسية السمعية وإرهاق الأصوات العالية لجهازه العصبي',
      'العناد ورغبته في عدم سماع توجيهات الآخرين',
      'محاولة لفت الانتباه وتصنع الإزعاج',
    ],
    correctIndex: 0,
    explanation: 'تغطية الأذنين استجابة طبيعية لحماية الحواس من الإرهاق الصوتي المؤلم.',
    solved: false,
  },
  {
    id: 3,
    r: 6,
    c: 7,
    question: 'كيف نتصرف بإيجابية وإنسانية عند حدوث انهيار حسي (Meltdown)؟',
    options: [
      'نوفر الأمان، نخفض الأصوات والأضواء، ونعطيه وقتاً هادئاً دون ضغط',
      'نوبخه أمام الجميع ليوقف الصراخ فوراً',
      'نطرح عليه أسئلة كثيرة ونطلب منه تبرير تصرفه',
    ],
    correctIndex: 0,
    explanation: 'الانهيار الحسي يحتاج خفض المثيرات، توفير الأمان، والصبر التام دون لوم.',
    solved: false,
  },
  {
    id: 4,
    r: 8,
    c: 4,
    question: 'ما هي أفضل طريقة لتواصل ناجح مع زميل لا يستخدم الكلام المنطوق؟',
    options: [
      'استخدام الجداول البصرية، الصور، والإشارات (PECS / الأجهزة البديلة)',
      'تجاهله تماماً لأنه لا يتحدث',
      'إجباره على نطق الكلمات بصوت مرتفع',
    ],
    correctIndex: 0,
    explanation: 'وسائل التواصل البديلة والمعززة (AAC) تمنح كل إنسان وسيلة فعالة للتعبير.',
    solved: false,
  },
];

const INITIAL_STARS = [
  { r: 0, c: 4, collected: false },
  { r: 2, c: 7, collected: false },
  { r: 4, c: 1, collected: false },
  { r: 6, c: 2, collected: false },
  { r: 8, c: 7, collected: false },
];

export const MazeGame: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [playerPos, setPlayerPos] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [checkpoints, setCheckpoints] = useState<QuestionCheckpoint[]>(INITIAL_CHECKPOINTS);
  const [stars, setStars] = useState(INITIAL_STARS);
  const [score, setScore] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<QuestionCheckpoint | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [stepsCount, setStepsCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Check movement legality
  const canMoveTo = (r: number, c: number): boolean => {
    if (r < 0 || r >= MAZE_GRID.length || c < 0 || c >= MAZE_GRID[0].length) return false;
    if (MAZE_GRID[r][c] === 1) return false; // Wall

    // If checkpoint gate is unsolved, player can step on it to trigger question
    return true;
  };

  const handleMove = useCallback(
    (dr: number, dc: number) => {
      if (gameWon || activeQuestion) return;

      const newR = playerPos.r + dr;
      const newC = playerPos.c + dc;

      if (!canMoveTo(newR, newC)) return;

      // Check if entering an unsolved checkpoint
      const cp = checkpoints.find((item) => item.r === newR && item.c === newC && !item.solved);
      if (cp) {
        setPlayerPos({ r: newR, c: newC });
        setStepsCount((s) => s + 1);
        setActiveQuestion(cp);
        setSelectedOption(null);
        setFeedback(null);
        return;
      }

      // Check if star collectible
      const star = stars.find((s) => s.r === newR && s.c === newC && !s.collected);
      if (star) {
        setStars((prev) =>
          prev.map((s) => (s.r === newR && s.c === newC ? { ...s, collected: true } : s))
        );
        setScore((sc) => sc + 20);
      }

      setPlayerPos({ r: newR, c: newC });
      setStepsCount((s) => s + 1);

      // Check if goal reached
      if (newR === 9 && newC === 9) {
        setGameWon(true);
        setScore((sc) => sc + 50);
        try {
          const currentCount = parseInt(localStorage.getItem('nafham_completed_games_count') || '3', 10);
          localStorage.setItem('nafham_completed_games_count', (currentCount + 1).toString());
        } catch {}
      }
    },
    [playerPos, gameWon, activeQuestion, checkpoints, stars]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeQuestion || gameWon) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleMove(-1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleMove(1, 0);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        // in RTL, left arrow means move right in columns or left? Usually ArrowLeft moves left (c - 1)
        handleMove(0, -1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleMove(0, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, activeQuestion, gameWon]);

  const handleAnswerSubmit = (optionIdx: number) => {
    if (!activeQuestion) return;
    setSelectedOption(optionIdx);

    if (optionIdx === activeQuestion.correctIndex) {
      setFeedback({
        correct: true,
        msg: `إجابة صحيحة ورائعة! +30 نقطة. ${activeQuestion.explanation}`,
      });
      setScore((s) => s + 30);
      setCheckpoints((prev) =>
        prev.map((cp) => (cp.id === activeQuestion.id ? { ...cp, solved: true } : cp))
      );
      setTimeout(() => {
        setActiveQuestion(null);
        setFeedback(null);
      }, 1800);
    } else {
      setFeedback({
        correct: false,
        msg: 'حاول مجدداً، فكّر في المعنى الإنساني والدعم الشامل للاختلاف.',
      });
    }
  };

  const handleRestart = () => {
    setPlayerPos({ r: 0, c: 0 });
    setCheckpoints(INITIAL_CHECKPOINTS.map((c) => ({ ...c, solved: false })));
    setStars(INITIAL_STARS.map((s) => ({ ...s, collected: false })));
    setScore(0);
    setStepsCount(0);
    setGameWon(false);
    setActiveQuestion(null);
    setFeedback(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 font-['Tajawal']" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#0c6aa7]/20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0c6aa7]/10 text-[#0c6aa7] flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#0a4d7a]">
                متاهة الوعي باضطراب طيف التوحد
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                لعبة جديدة
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              تحرك عبر المتاهة، أجب عن الأسئلة التوعوية لفتح البوابات، واجمع النجوم حتى خط النهاية
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>النقاط: {score}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 text-[#0c6aa7] px-3 py-1.5 rounded-xl border border-blue-200">
            <Footprints className="w-4 h-4 text-[#0c6aa7]" />
            <span>الخطوات: {stepsCount}</span>
          </div>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="إعادة تشغيل المتاهة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Grid Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0c6aa7]/20 shadow-md flex flex-col items-center">
        {/* Instructions banner */}
        <div className="w-full flex items-center justify-between text-xs text-slate-600 mb-4 px-2">
          <span className="font-semibold">
            استخدم أزرار التحكم بالأسفل أو أسهم لوحة المفاتيح للتنقل:
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#0c6aa7]" /> البطل المستكشف
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-400" /> نجمة وعي (+20)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-purple-500" /> محطة سؤال (+30)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> بوابة الوصول
            </span>
          </div>
        </div>

        {/* 10x10 Maze Board */}
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 p-3 sm:p-4 bg-slate-100 rounded-3xl border-2 border-[#0c6aa7]/20 shadow-inner max-w-md w-full aspect-square">
          {MAZE_GRID.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isPlayer = playerPos.r === rIdx && playerPos.c === cIdx;
              const isWall = cell === 1;
              const isGoal = rIdx === 9 && cIdx === 9;
              const cp = checkpoints.find((item) => item.r === rIdx && item.c === cIdx);
              const star = stars.find((s) => s.r === rIdx && s.c === cIdx && !s.collected);

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`relative rounded-lg sm:rounded-xl flex items-center justify-center transition-all aspect-square ${
                    isWall
                      ? 'bg-gradient-to-br from-[#0a4d7a] to-[#0c6aa7] shadow-xs'
                      : isGoal
                      ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-600'
                      : 'bg-white border border-slate-200/60'
                  }`}
                >
                  {/* Goal Icon */}
                  {isGoal && !isPlayer && (
                    <Trophy className="w-4 h-4 text-emerald-600 animate-bounce" />
                  )}

                  {/* Star Collectible */}
                  {star && !isPlayer && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </motion.div>
                  )}

                  {/* Question Checkpoint */}
                  {cp && !isPlayer && (
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                        cp.solved
                          ? 'bg-emerald-500 text-white'
                          : 'bg-purple-600 text-white animate-pulse'
                      }`}
                    >
                      {cp.solved ? '✓' : '?'}
                    </div>
                  )}

                  {/* Player Avatar */}
                  {isPlayer && (
                    <motion.div
                      layoutId="playerToken"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-[#0a4d7a] to-[#2eb9df] text-white flex items-center justify-center shadow-md font-bold text-[10px] border-2 border-white ring-2 ring-[#0c6aa7]/50"
                    >
                      ★
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* On-screen Directional Touch Controls */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={() => handleMove(-1, 0)}
            className="w-12 h-12 rounded-2xl bg-white hover:bg-[#f0f7fc] border border-[#0c6aa7]/25 text-[#0a4d7a] shadow-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="تحرك للأعلى"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleMove(0, -1)}
              className="w-12 h-12 rounded-2xl bg-white hover:bg-[#f0f7fc] border border-[#0c6aa7]/25 text-[#0a4d7a] shadow-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title="تحرك لليمين"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-[#0c6aa7]/10 flex items-center justify-center text-xs font-bold text-[#0a4d7a]">
              تحكم
            </div>
            <button
              onClick={() => handleMove(0, 1)}
              className="w-12 h-12 rounded-2xl bg-white hover:bg-[#f0f7fc] border border-[#0c6aa7]/25 text-[#0a4d7a] shadow-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title="تحرك لليسار"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => handleMove(1, 0)}
            className="w-12 h-12 rounded-2xl bg-white hover:bg-[#f0f7fc] border border-[#0c6aa7]/25 text-[#0a4d7a] shadow-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="تحرك للأسفل"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* QUESTION MODAL POPUP */}
      <AnimatePresence>
        {activeQuestion && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#0c6aa7]/30 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-600 block">
                    بوابة توعوية للمتاهة (+30 نقطة)
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#0a4d7a]">
                    سؤال فتح المسار
                  </h3>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {activeQuestion.question}
              </p>

              <div className="space-y-2.5">
                {activeQuestion.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSubmit(idx)}
                      disabled={feedback?.correct}
                      className={`w-full p-4 rounded-2xl text-right text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                        isChosen
                          ? idx === activeQuestion.correctIndex
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : 'bg-rose-50 border-rose-500 text-rose-800'
                          : 'bg-slate-50 hover:bg-[#f0f7fc] border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2 ${
                    feedback.correct
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {feedback.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.msg}</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GAME VICTORY CELEBRATION MODAL WITH BALLOONS & FIREWORKS */}
      <VictoryCelebrationModal
        isOpen={gameWon}
        gameTitle="متاهة الوعي والدمج التفاعلية"
        score={score}
        moves={stepsCount}
        lesson="الفهم يبدأ بمعرفة خصائص طيف التوحد، وتخطي حواجز الفهم المغلوط يصنع مجتمعاً دامجاً."
        onReplay={handleRestart}
        onExit={onBack || handleRestart}
      />
    </div>
  );
};
