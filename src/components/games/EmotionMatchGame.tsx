import React, { useState } from 'react';
import { Smile, Heart, CheckCircle2, RotateCcw, Award, Info, ArrowLeft } from 'lucide-react';
import { updateGameStars } from '../../utils/storage';
import { VictoryCelebrationModal } from '../common/VictoryCelebrationModal';

interface EmotionMatchGameProps {
  onBackToGames: () => void;
  reduceMotion?: boolean;
}

interface Scenario {
  id: number;
  title: string;
  situation: string;
  contextNote: string;
  choices: {
    label: string;
    isNuanced: boolean;
    explanation: string;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'الموقف الأول: في حفل النجاح الصاخب',
    situation:
      'أقام الفصل حفلاً كبيراً بموسيقى عالية وتصفيق. جلس زميلك في زاوية الغرفة بوجه هادئ دون ابتسامة وظل يقلّب صفحات كتاب.',
    contextNote:
      'تذكر: عدم إظهار الابتسامة لا يعني بالضرورة أنه حزين، بل قد يكون مستمتعاً بهدوء أو ينظم حواسه لتفادي الضوضاء.',
    choices: [
      {
        label: 'أقترب بهدوء، أبتسم له، وأقول: "مبارك نجاحك! إذا أردت الهدوء هنا فالأمر رائع".',
        isNuanced: true,
        explanation:
          'تصرف مثالي! قبلت طريقته في التعبير دون إجباره على الابتسام أو الرقص وسط الضجيج، واحترمت حاجته للتنظيم الحسي.',
      },
      {
        label: 'أسحبه إلى وسط الصف وأقول له بصوت عالٍ: "ابتسم وارقص، الجميع يفرح إلا أنت!".',
        isNuanced: false,
        explanation:
          'هذا التصرف قد يسبب إجهاداً حسياً شديداً. تعبير الوجه ليس المعيار الوحيد للفرح، وإجبار الآخرين على التعبير بنمط واحد يسبب ضيقاً كبيراً.',
      },
    ],
  },
  {
    id: 2,
    title: 'الموقف الثاني: إنجاز مجسم فلكي مميز',
    situation:
      'أنهى صديقك مجسماً كروياً رائعاً للمجموعة الشمسية. بدأ يرفرف بيديه سريعاً ويدور حول نفسه وهو يبتسم.',
    contextNote: 'تذكر: الحركات المتكررة (Stimming) قد تكون تعبيراً عفوياً وصادقاً عن الفرح الشديد والحماس.',
    choices: [
      {
        label: 'أشاركه الفرحة وأقول له: "ما أروعه من مجسم! عمل متقن ومبهر جداً يا صديقي".',
        isNuanced: true,
        explanation:
          'أحسنت! رفرفة اليدين هنا تعبير رائع عن الحماس الداخلي. تقبلك لسعادته بطريقته يعزز ثقته بنفسه.',
      },
      {
        label: 'أمسك يديه بقوة وأقول له: "توقف عن هذه الحركة العجيبة، الناس يراقبوننا!".',
        isNuanced: false,
        explanation:
          'إيقاف التعبير الحركي الطبيعي يسبب كبتاً وضيقاً. الحركة آمنة وتعبر عن البهجة، ولا داعي لمنعها على الإطلاق.',
      },
    ],
  },
  {
    id: 3,
    title: 'الموقف الثالث: تأخر بداية الدرس',
    situation:
      'تأخرت المعلمة 10 دقائق وتغير موعد الحصة. بدأ زميلك يظهر علامات توتر وضيق وتنفس سريع.',
    contextNote:
      'تذكر: التغييرات المفاجئة في الروتين قد تثير قلقاً حقيقياً يحتاج إلى تطمين وتوضيح الخطوات.',
    choices: [
      {
        label: 'أطمئنه بهدوء: "المعلمة قادمة في الطريق، وسنبدأ الدرس بعد قليل، كل شيء تحت السيطرة".',
        isNuanced: true,
        explanation:
          'إجابة واعية وداعمة! التطمين البسيط يمنح الدماغ التنبؤ والأمان ويخفف حدة القلق الناتج عن انقطاع الروتين.',
      },
      {
        label: 'أتجاهله وأقول: "أنت تكبّر الأمور، إنها مجرد عشر دقائق!".',
        isNuanced: false,
        explanation:
          'التقليل من مشاعر القلق لا يساعد في حلها. ما تراه أنت بسيطاً قد يشكل صدمة لجدول الفرد ذي التوحد.',
      },
    ],
  },
  {
    id: 4,
    title: 'الموقف الرابع: إهداء هدية مفاجئة',
    situation:
      'قدمت له هدية مغلفة جميلة. فتحها ونظر إليها بتركيز دقيق وصمت تام دون أن ينطق بكلمة شكر فورية.',
    contextNote: 'تذكر: بعض الأفراد يحتاجون وقتاً لمعالجة مشاعرهم قبل صياغة عبارة الشكر اللفظية.',
    choices: [
      {
        label: 'أعطيه وقته لتفحص الهدية، وأدرك أن تركيزه فيها يعكس اهتمامه وقيمتها لديه.',
        isNuanced: true,
        explanation:
          'فهم عميق! التركيز الصامت شكل من أشكال التقدير والاستيعاب، ولا يعني إهمال المشاعر أو قلة الذوق.',
      },
      {
        label: 'أغضب وآخذ الهدية منه قائلاً: "أنت غير ممتن ولا تستحق الهدايا!".',
        isNuanced: false,
        explanation:
          'الحكم السريع يهدم جسور الصداقة. احترام الفروق في معالجة المشاعر والتعبير عنها هو أساس التواصل الإيجابي.',
      },
    ],
  },
];

export const EmotionMatchGame: React.FC<EmotionMatchGameProps> = ({ onBackToGames }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  const handleSelectChoice = (choiceIdx: number) => {
    if (selectedChoiceIdx !== null) return;
    setSelectedChoiceIdx(choiceIdx);
    if (scenario.choices[choiceIdx].isNuanced) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedChoiceIdx(null);
    } else {
      setIsFinished(true);
      setShowCelebration(true);
      const stars = score >= 3 ? 3 : score >= 2 ? 2 : 1;
      updateGameStars('emotion', stars);
    }
  };

  const restartGame = () => {
    setCurrentIdx(0);
    setSelectedChoiceIdx(null);
    setScore(0);
    setIsFinished(false);
    setShowCelebration(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0c6aa7]">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#0a4d7a]">
              اللعبة 2: طابق المشاعر
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            استكشف المواقف اليومية وتعلم أن تعبير الوجه لا يكشف دائماً عن كل المشاعر!
          </p>
        </div>
        <button
          onClick={onBackToGames}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0a4d7a] transition-colors cursor-pointer"
        >
          العودة للمدينة
        </button>
      </div>

      {!isFinished ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Progress header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold text-slate-500">
            <span>
              الموقف {currentIdx + 1} من {SCENARIOS.length}
            </span>
            <span className="text-[#0c6aa7]">النقاط: {score}</span>
          </div>

          {/* Scenario Content */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1 rounded-md border border-[#cbe3f3]">
              {scenario.title}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0a4d7a] leading-relaxed">
              {scenario.situation}
            </h3>

            {/* Context awareness note */}
            <div className="flex items-start gap-2 p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{scenario.contextNote}</span>
            </div>
          </div>

          {/* Choices */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-600">ما هو التصرف الأكثر وعياً واحتراماً؟</span>
            {scenario.choices.map((choice, idx) => {
              const isSelected = selectedChoiceIdx === idx;
              return (
                <button
                  key={idx}
                  disabled={selectedChoiceIdx !== null}
                  onClick={() => handleSelectChoice(idx)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? choice.isNuanced
                        ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                        : 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-sm font-bold text-[#0a4d7a]">{choice.label}</span>

                  {selectedChoiceIdx !== null && isSelected && (
                    <div
                      className={`text-xs p-2.5 rounded-xl leading-relaxed ${
                        choice.isNuanced
                          ? 'bg-emerald-100/70 text-emerald-900'
                          : 'bg-rose-100/70 text-rose-900'
                      }`}
                    >
                      <strong className="block mb-0.5">التفسير التوعوي:</strong>
                      {choice.explanation}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {selectedChoiceIdx !== null && (
            <div className="flex justify-end pt-3">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] shadow-xs cursor-pointer transition-all"
              >
                <span>{currentIdx < SCENARIOS.length - 1 ? 'الموقف التالي' : 'عرض النتيجة'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results screen */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#0a4d7a]">أحسنت خوض تجربة المشاعر!</h3>
            <p className="text-sm text-slate-600">
              لقد سجلت <span className="font-bold text-[#0c6aa7]">{score}</span> من أصل{' '}
              <span className="font-bold">{SCENARIOS.length}</span> في فهم التنوع التعبيري.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-amber-500">
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
          </div>

          <div className="max-w-md mx-auto p-4 bg-[#f0f7fb] rounded-2xl border border-[#cbe3f3] text-xs text-[#0a4d7a] leading-relaxed font-medium">
            <strong>القاعدة الذهبية المستفادة:</strong> لكل إنسان طريقته في الشعور والتعبير، والتقبل
            يعني أن نمنح الآخرين حرية التعبير العفوي دون فرض قوالب جاهزة.
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

      {/* Victory celebration with 3-second rising balloons and fireworks */}
      <VictoryCelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onReplay={restartGame}
        onReturnToGames={onBackToGames}
        gameTitle="لعبة طابق المشاعر"
        stars={score >= 3 ? 3 : score >= 2 ? 2 : 1}
        customScoreText={`${score} من ${SCENARIOS.length}`}
        educationalMessage="تذكر دائماً أن تعبيرات الوجه لا تحكي كل القصة، واحترام مشاعر الآخرين بطريقتهم هو جوهر التقبل."
      />
    </div>
  );
};
