import React, { useState } from 'react';
import { Volume2, Sun, Sparkles, CheckCircle2, RotateCcw, Award, Sliders, Shield } from 'lucide-react';
import { updateGameStars } from '../../utils/storage';
import { VictoryCelebrationModal } from '../common/VictoryCelebrationModal';

interface SensoryWorldGameProps {
  onBackToGames: () => void;
  reduceMotion?: boolean;
}

interface SensoryRoom {
  id: string;
  name: string;
  environmentDescription: string;
  sensoryTriggers: {
    type: 'sound' | 'light' | 'crowd' | 'texture';
    currentProblem: string;
    options: {
      action: string;
      isSupportive: boolean;
      feedback: string;
    }[];
  }[];
}

const SENSORY_ROOMS: SensoryRoom[] = [
  {
    id: 'classroom',
    name: 'بيئة الفصل الدراسي',
    environmentDescription:
      'فصل دراسي به مصابيح فلورسنت شديدة الوميض، وأصوات احتكاك الكراسي بالأرضية، وجدران مغطاة بمئات الملصقات الملونة المعلقة بشكل فوضوي.',
    sensoryTriggers: [
      {
        type: 'light',
        currentProblem: 'إضاءة الفلورسنت الوهاجة تصدر طنيناً خفيفاً ووميضاً سريعاً يرهق العينين.',
        options: [
          {
            action: 'استبدالها بإضاءة دافئة هادئة أو الاعتماد على ضوء النافذة الطبيعي المخفف بستائر شفافة.',
            isSupportive: true,
            feedback: 'ممتاز! الإضاءة الطبيعية الناعمة تمنع الصداع الحسي وتساعد في استمرار التركيز.',
          },
          {
            action: 'إضافة المزيد من المصابيح الملونة الساطعة لزيادة الانتباه.',
            isSupportive: false,
            feedback: 'هذا يزيد من التشتت الحسي والإجهاد العصبي للطالب.',
          },
        ],
      },
      {
        type: 'sound',
        currentProblem: 'أصوات احتكاك أرجل الكراسي بالأرضية تصدر صريراً متكرراً وحاداً.',
        options: [
          {
            action: 'وضع كرات تنس مقصوصة أو لباد ناعم أسفل أرجل الطاولات والكراسي لامتصاص الصوت.',
            isSupportive: true,
            feedback: 'حل عملي وذكي جداً معتمد في المدارس الصديقة للحواس لتقليل الصرير المفاجئ.',
          },
          {
            action: 'تجاهل الأمر والطلب من الطلاب رفع الكراسي بحذر دائماً.',
            isSupportive: false,
            feedback: 'الحلول البيئية التيسيرية أكثر فاعلية واستدامة من إلقاء العبء على الطلاب.',
          },
        ],
      },
    ],
  },
  {
    id: 'home',
    name: 'غرفة النوم والراحة في المنزل',
    environmentDescription:
      'غرفة نوم بجوار غرفة المعيشة، ذات أقمشة مفارش خشنة نوعاً ما، وجهاز تكييف يصدر صوتاً مفاجئاً بين الحين والآخر.',
    sensoryTriggers: [
      {
        type: 'texture',
        currentProblem: 'ملمس أقمشة الفراش وبطاقات الملابس يسبب حكة وانزعاجاً شديداً يمنع النوم.',
        options: [
          {
            action: 'استخدام أقمشة قطنية ناعمة خالية من الخياطة البارزة وقص بطاقات الملابس الداخلية تماماً.',
            isSupportive: true,
            feedback: 'أحسنت! اللمس العميق المريح يمنح إحساساً بالأمان ويساعد على الاسترخاء والنوم.',
          },
          {
            action: 'إجباره على النوم بنفس الأقمشة حتى يعتاد عليها بالقوة.',
            isSupportive: false,
            feedback: 'الحساسية اللمسية حس حقيقي بالألم، وإجبار الفرد يزيد القلق والأرق.',
          },
        ],
      },
      {
        type: 'crowd',
        currentProblem: 'الحاجة لملاذ آمن لتفريغ التوتر بعد يوم طويل خارج المنزل.',
        options: [
          {
            action: 'تخصيص ركن هادئ (خيمة صغيرة أو وسائد ناعمة) متاح للطفل في أي وقت لاستعادة التوازن.',
            isSupportive: true,
            feedback: 'رائع! زوايا التهدئة الحسية المنزلية من أنجح وسائل التنظيم الذاتي واستعادة السكينة.',
          },
          {
            action: 'منعه من الانعزال وإبقائه في الصالة المزدحمة بالضيوف.',
            isSupportive: false,
            feedback: 'العزلة الاختيارية المؤقتة حاجة صحية لإفراغ الحمل الحسي الزائد.',
          },
        ],
      },
    ],
  },
];

export const SensoryWorldGame: React.FC<SensoryWorldGameProps> = ({ onBackToGames }) => {
  const [roomIdx, setRoomIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const room = SENSORY_ROOMS[roomIdx];

  const handleSelectOption = (triggerIdx: number, optionIdx: number) => {
    if (selectedOptions[triggerIdx] !== undefined) return;
    const isSupportive = room.sensoryTriggers[triggerIdx].options[optionIdx].isSupportive;
    setSelectedOptions((prev) => ({ ...prev, [triggerIdx]: optionIdx }));
    if (isSupportive) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextRoom = () => {
    if (roomIdx < SENSORY_ROOMS.length - 1) {
      setRoomIdx((prev) => prev + 1);
      setSelectedOptions({});
    } else {
      setIsCompleted(true);
      setShowCelebration(true);
      updateGameStars('sensory', 3);
    }
  };

  const restartGame = () => {
    setRoomIdx(0);
    setSelectedOptions({});
    setScore(0);
    setIsCompleted(false);
    setShowCelebration(false);
  };

  const allTriggersAnswered =
    Object.keys(selectedOptions).length === room.sensoryTriggers.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0c6aa7]">
            <Sliders className="w-5 h-5 text-[#2eb9df]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#0a4d7a]">
              اللعبة 4: اكتشف العالم الحسي
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            عدّل البيئات المحيطة لتصبح أماكن صديقة للحواس توفر الراحة والأمان!
          </p>
        </div>
        <button
          onClick={onBackToGames}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0a4d7a] transition-colors cursor-pointer"
        >
          العودة للمدينة
        </button>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
            <span className="text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1 rounded-md border border-[#cbe3f3]">
              {room.name}
            </span>
            <span className="text-slate-500">
              البيئة {roomIdx + 1} من {SENSORY_ROOMS.length}
            </span>
          </div>

          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 leading-relaxed">
            <strong>وصف البيئة الحالية:</strong> {room.environmentDescription}
          </p>

          {/* Triggers & Modifications */}
          <div className="space-y-6">
            {room.sensoryTriggers.map((trigger, tIdx) => {
              const chosen = selectedOptions[tIdx];
              return (
                <div
                  key={tIdx}
                  className="p-5 rounded-2xl border border-slate-200 bg-[#fafcfe] space-y-3"
                >
                  <div className="flex items-center gap-2 text-[#0a4d7a] text-sm font-bold">
                    {trigger.type === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
                    {trigger.type === 'sound' && <Volume2 className="w-4 h-4 text-cyan-600" />}
                    {trigger.type === 'texture' && <Sparkles className="w-4 h-4 text-emerald-600" />}
                    {trigger.type === 'crowd' && <Shield className="w-4 h-4 text-indigo-600" />}
                    <span>التحدي الحسي: {trigger.currentProblem}</span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-slate-600">اختر التعديل البيئي الداعم:</span>
                    {trigger.options.map((opt, oIdx) => {
                      const isSelected = chosen === oIdx;
                      return (
                        <button
                          key={oIdx}
                          disabled={chosen !== undefined}
                          onClick={() => handleSelectOption(tIdx, oIdx)}
                          className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex flex-col gap-1.5 ${
                            isSelected
                              ? opt.isSupportive
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : 'bg-rose-50 border-rose-300 text-rose-950'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <span>{opt.action}</span>
                          {chosen !== undefined && isSelected && (
                            <div className="text-xs font-normal opacity-90 pt-1 border-t border-current/10">
                              {opt.feedback}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {allTriggersAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextRoom}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] shadow-xs cursor-pointer transition-all"
              >
                {roomIdx < SENSORY_ROOMS.length - 1 ? 'الانتقال للبيئة التالية' : 'عرض نتائج التعديل الحسي'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#0a4d7a]">أحسنت صنع بيئات صديقة للحواس!</h3>
            <p className="text-sm text-slate-600">
              لقد أثبتت مهارة واعية في تحويل الفصول والمنازل إلى بيئات تراعي الاحتياجات الحسية.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-amber-500">
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
          </div>

          <div className="max-w-md mx-auto p-4 bg-[#f0f7fb] rounded-2xl border border-[#cbe3f3] text-xs text-[#0a4d7a] leading-relaxed font-medium">
            <strong>حقيقة علمية:</strong> تعديل البيئة الفيزيقية (الصوت، الضوء، التهدئة) يقلل من نوبات
            التوتر بنسبة تزيد عن 60% ويفتح آفاقاً رحبة للمشاركة الأكاديمية والاجتماعية.
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={restartGame}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة اللعبة</span>
            </button>
            <button
              onClick={onBackToGames}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              العودة لمدينة الألعاب
            </button>
          </div>
        </div>
      )}

      {/* Victory Celebration Modal */}
      <VictoryCelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onReplay={restartGame}
        onReturnToGames={onBackToGames}
        gameTitle="لعبة المستكشف الحسي"
        stars={3}
        customScoreText={`${score} حلول داعمة`}
        educationalMessage="تعديل البيئة الفيزيقية وتقليل الإجهاد الحسي يصنع بيئة مريحة وداعمة للأفراد ذوي التوحد."
      />
    </div>
  );
};
