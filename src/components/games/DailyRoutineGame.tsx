import React, { useState } from 'react';
import { Calendar, ArrowUp, ArrowDown, CheckCircle2, RotateCcw, Award, Sparkles } from 'lucide-react';
import { updateGameStars } from '../../utils/storage';
import { VictoryCelebrationModal } from '../common/VictoryCelebrationModal';

interface DailyRoutineGameProps {
  onBackToGames: () => void;
  reduceMotion?: boolean;
}

interface RoutineLevel {
  id: number;
  title: string;
  context: string;
  correctOrder: string[];
  explanation: string;
}

const ROUTINE_LEVELS: RoutineLevel[] = [
  {
    id: 1,
    title: 'المستوى الأول: صباح الاستعداد للمدرسة',
    context: 'رتّب خطوات الصباح الباكر ليكون الانتقال إلى المدرسة سلساً ومريحاً للأعصاب.',
    correctOrder: [
      '1. الاستيقاظ مع إضاءة الغرفة تدريجياً وإيقاف المنبه',
      '2. غسل الوجه وتفريش الأسنان وارتداء الزي المدرسي المريح',
      '3. تناول وجبة الإفطار الهادئة وتناول الماء',
      '4. مراجعة الجدول البصري وتجهيز الحقيبة المدرسية',
      '5. ركوب الحافلة المدرسية مع الاستماع لحديث هادئ',
    ],
    explanation:
      'الجدول البصري الصباحي المتسلسل يقلل مفاجآت الصباح ويساعد الدماغ على الاستعداد لليوم الدراسي دون استعجال أو توتر.',
  },
  {
    id: 2,
    title: 'المستوى الثاني: العودة من المدرسة وتنظيم المساء',
    context: 'رتّب أنشطة ما بعد المدرسة لإعادة شحن الطاقة الحسية وإنجاز المهام.',
    correctOrder: [
      '1. العودة للمنزل وخلع الحذاء والملابس المدرسية',
      '2. استراحة حسية هادئة لمدة 20 دقيقة في ركن مريح',
      '3. تناول وجبة خفيفة مع العائلة والحديث باطمئنان',
      '4. إنجاز الواجبات المدرسية بمساعدة مؤقت زمني مرئي',
      '5. ممارسة الهواية المفضلة (الرسم أو ترتيب المكعبات)',
    ],
    explanation:
      'الاستراحة الحسية بعد يوم مدرسي مليء بالأصوات ضرورية جداً لإفراغ التوتر قبل البدء في المذاكرة والواجبات.',
  },
];

export const DailyRoutineGame: React.FC<DailyRoutineGameProps> = ({ onBackToGames }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = ROUTINE_LEVELS[levelIdx];

  // Helper to shuffle items
  const shuffle = (arr: string[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const [items, setItems] = useState<string[]>(() => shuffle(level.correctOrder));
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Move item up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
    setChecked(false);
  };

  // Move item down
  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
    setChecked(false);
  };

  const verifyOrder = () => {
    const isMatched = items.every((item, idx) => item === level.correctOrder[idx]);
    setIsCorrect(isMatched);
    setChecked(true);
    if (isMatched) {
      updateGameStars('routine', 3);
      setShowCelebration(true);
    }
  };

  const nextLevel = () => {
    if (levelIdx < ROUTINE_LEVELS.length - 1) {
      const nextIdx = levelIdx + 1;
      setLevelIdx(nextIdx);
      setItems(shuffle(ROUTINE_LEVELS[nextIdx].correctOrder));
      setChecked(false);
      setIsCorrect(false);
      setShowCelebration(false);
    }
  };

  const restartCurrent = () => {
    setItems(shuffle(level.correctOrder));
    setChecked(false);
    setIsCorrect(false);
    setShowCelebration(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0c6aa7]">
            <Calendar className="w-5 h-5 text-[#2eb9df]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#0a4d7a]">
              اللعبة 3: رتّب يومك
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            رتّب خطوات الروتين اليومي بالترتيب المنطقي لاكتشاف أثر الجداول البصرية في خفض القلق!
          </p>
        </div>
        <button
          onClick={onBackToGames}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0a4d7a] transition-colors cursor-pointer"
        >
          العودة للمدينة
        </button>
      </div>

      {/* Main Game Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1 rounded-md border border-[#cbe3f3]">
            {level.title}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            المستوى {levelIdx + 1} من {ROUTINE_LEVELS.length}
          </span>
        </div>

        <p className="text-sm font-medium text-slate-700 leading-relaxed">
          {level.context}
        </p>

        {/* Routine Cards List (with easy accessible move up/down buttons) */}
        <div className="space-y-2.5">
          {items.map((item, idx) => {
            const isItemCorrect = item === level.correctOrder[idx];
            return (
              <div
                key={item}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                  checked
                    ? isItemCorrect
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-amber-50/70 border-amber-300'
                    : 'bg-[#fafcfe] hover:bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#e1eff8] text-[#0a4d7a] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#0a4d7a]">{item}</span>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
                    title="تحريك لأعلى"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
                    title="تحريك لأسفل"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <button
            onClick={restartCurrent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة خلط الخطوات</span>
          </button>

          <button
            onClick={verifyOrder}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] shadow-xs cursor-pointer transition-all"
          >
            تحقق من الترتيب
          </button>
        </div>

        {/* Feedback Area */}
        {checked && (
          <div
            className={`p-5 rounded-2xl border text-center space-y-3 animate-in fade-in ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold text-base">رائع جداً! الترتيب متقن ومنطقي تماماً.</span>
                </>
              ) : (
                <span className="font-bold text-sm text-amber-800">
                  بعض الخطوات تحتاج لإعادة ترتيب! راجع الأرقام واقترب من التسلسل الطبيعي لليوم.
                </span>
              )}
            </div>

            {isCorrect && (
              <>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  <strong>الفائدة التربوية:</strong> {level.explanation}
                </p>

                <div className="flex items-center justify-center gap-1 text-amber-500 pt-1">
                  <Award className="w-5 h-5 fill-amber-400" />
                  <Award className="w-5 h-5 fill-amber-400" />
                  <Award className="w-5 h-5 fill-amber-400" />
                </div>

                {levelIdx < ROUTINE_LEVELS.length - 1 ? (
                  <button
                    onClick={nextLevel}
                    className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                  >
                    <span>الانتقال للمستوى التالي</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 block">
                    أكملت جميع مستويات لعبة رتّب يومك بنجاح!
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Victory Celebration Modal */}
      <VictoryCelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onReplay={restartCurrent}
        onReturnToGames={onBackToGames}
        gameTitle="لعبة رتّب يومك"
        stars={3}
        customScoreText={`المستوى ${levelIdx + 1} مكتمل`}
        educationalMessage={level.explanation}
      />
    </div>
  );
};
