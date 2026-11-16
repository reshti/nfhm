import React, { useState } from 'react';
import { MessageSquare, Tablet, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { updateGameStars } from '../../utils/storage';
import { VictoryCelebrationModal } from '../common/VictoryCelebrationModal';

interface CommunicationChoiceGameProps {
  onBackToGames: () => void;
  reduceMotion?: boolean;
}

interface CommScenario {
  id: number;
  situation: string;
  needDescription: string;
  modalities: {
    name: string;
    description: string;
    iconName: string;
    isAppropriate: boolean;
    feedback: string;
  }[];
}

const COMM_SCENARIOS: CommScenario[] = [
  {
    id: 1,
    situation: 'في المطعم أو المقصف المدرسي',
    needDescription: 'الطفل يشعر بالعطش الشديد ولكنه في لحظة إجهاد حسي تجعل الكلام اللفظي صعباً عليه.',
    modalities: [
      {
        name: 'بطاقة مصورة (PECS)',
        description: 'إعطاء بطاقة مرسوم عليها كوب ماء للمشرف أو المعلم.',
        iconName: 'Image',
        isAppropriate: true,
        feedback: 'وسيلة ممتازة ومباشرة! نظام تبادل الصور وسيلة تواصل رسمية معتمدة تنقل الطلب فوراً وتخفف التوتر.',
      },
      {
        name: 'جهاز توليد النطق اللوحي (AAC)',
        description: 'الضغط على زر أيقونة "أريد ماء" في تطبيق التواصل الصوتي.',
        iconName: 'Tablet',
        isAppropriate: true,
        feedback: 'رائع جداً! الصوت الرقمي وسيلة تواصل حديثة ودقيقة تمكن الفرد من إيصال رسالته بوضوح تام.',
      },
      {
        name: 'الإشارة والإيماءة الهادئة',
        description: 'الإشارة بإصبعه نحو زجاجة الماء وإيماءة بالرأس.',
        iconName: 'Hand',
        isAppropriate: true,
        feedback: 'طبيعي ومقبول تماماً! لغة الجسد والإيماءات وسيلة تواصل إنسانية أساسية يجب الاستجابة لها فوراً.',
      },
      {
        name: 'إجباره على الصراخ اللفظي',
        description: 'منعه من الشرب حتى ينطق الكلمة بصوت جهوري مسموع.',
        iconName: 'XCircle',
        isAppropriate: false,
        feedback: 'خطأ تربوي فادح! حرمان الشخص من احتياجه الأساسي يسبب صدمة نفسية ويزيد من حدة المشكلة.',
      },
    ],
  },
  {
    id: 2,
    situation: 'في المعمل أو حصة العلوم',
    needDescription: 'طالب ذو توحد يريد التعبير عن فكرة علمية دقيقة حول سرعة الضوء والتفاعل الكيميائي.',
    modalities: [
      {
        name: 'الكتابة على لوحة المفاتيح أو الشاشة',
        description: 'كتابة شرح مفصل ونقاط علمية على حاسوبه المحمول.',
        iconName: 'Keyboard',
        isAppropriate: true,
        feedback: 'وسيلة قوية ومثالية! الكثير من ذوي التوحد يمتلكون فصاحة وبلاغة فائقة عند الكتابة تفوق النطق اللفظي السريع.',
      },
      {
        name: 'الرسم والمخطط البصري (Mind Map)',
        description: 'رسم رسم بياني يوضح خطوات التجربة الكيميائية.',
        iconName: 'PenTool',
        isAppropriate: true,
        feedback: 'إبداع علمي حقيقي! التفكير البصري لغة عالمية للتعبير عن الأفكار المعقدة والابتكارات.',
      },
      {
        name: 'مطالبته بالتحدث أمام الجميع بارتجال',
        description: 'إجباره على الوقوف والتحدث المرتجل دون أي وسيلة مساعدة.',
        iconName: 'AlertTriangle',
        isAppropriate: false,
        feedback: 'قد يسبب هذا إحراجاً وتعثراً، بينما توفير بدائل العرض المكتوب أو المرئي يطلق العنان لعبقريته الحقيقية.',
      },
    ],
  },
];

export const CommunicationChoiceGame: React.FC<CommunicationChoiceGameProps> = ({ onBackToGames }) => {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedModalities, setSelectedModalities] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const scenario = COMM_SCENARIOS[currentScenarioIdx];

  const handleSelectModality = (idx: number) => {
    if (selectedModalities.includes(idx)) {
      setSelectedModalities(selectedModalities.filter((i) => i !== idx));
    } else {
      setSelectedModalities([...selectedModalities, idx]);
    }
  };

  const handleNextScenario = () => {
    if (currentScenarioIdx < COMM_SCENARIOS.length - 1) {
      setCurrentScenarioIdx((prev) => prev + 1);
      setSelectedModalities([]);
    } else {
      setIsFinished(true);
      setShowCelebration(true);
      updateGameStars('communication', 3);
    }
  };

  const restartGame = () => {
    setCurrentScenarioIdx(0);
    setSelectedModalities([]);
    setIsFinished(false);
    setShowCelebration(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0c6aa7]">
            <Tablet className="w-5 h-5 text-[#2eb9df]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#0a4d7a]">
              اللعبة 5: اختر طريقة التواصل
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تعرف على وسائل التواصل المعززة والبديلة (AAC) واكتشف أن التعبير لا ينحصر في الكلام!
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
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
            <span className="text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1 rounded-md border border-[#cbe3f3]">
              {scenario.situation}
            </span>
            <span className="text-slate-500">
              الموقف {currentScenarioIdx + 1} من {COMM_SCENARIOS.length}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-[#0a4d7a] block">سياق الموقف:</span>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {scenario.needDescription}
            </p>
          </div>

          {/* Modalities Selection */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-600">
              اختر الوسائل التواصلية الملائمة والداعمة (يمكنك اختيار أكثر من وسيلة صحيحة):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenario.modalities.map((mod, idx) => {
                const isSelected = selectedModalities.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectModality(idx)}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? mod.isAppropriate
                          ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                          : 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#0a4d7a]">{mod.name}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected
                              ? mod.isAppropriate
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'bg-rose-500 border-rose-500 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div
                        className={`text-[11px] p-2 rounded-xl mt-2 leading-relaxed ${
                          mod.isAppropriate
                            ? 'bg-emerald-100/70 text-emerald-900'
                            : 'bg-rose-100/70 text-rose-900'
                        }`}
                      >
                        {mod.feedback}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedModalities.length > 0 && (
            <div className="flex justify-end pt-3">
              <button
                onClick={handleNextScenario}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] shadow-xs cursor-pointer transition-all"
              >
                {currentScenarioIdx < COMM_SCENARIOS.length - 1 ? 'الموقف التالي' : 'عرض النتيجة'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#0a4d7a]">أحسنت فهم وسائل التواصل المتعددة!</h3>
            <p className="text-sm text-slate-600">
              التواصل البشري واسع ومتنوع، واحترام وسيلة الفرد هو حجر الأساس في كرامته الإنسانية.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-amber-500">
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
          </div>

          <div className="max-w-md mx-auto p-4 bg-[#f0f7fb] rounded-2xl border border-[#cbe3f3] text-xs text-[#0a4d7a] leading-relaxed font-medium">
            <strong>قاعدة نفهم:</strong> لا تحصر التواصل في الصوت اللفظي وحده؛ فالصورة، والرمز، والإشارة،
            والحرف، والنبض الرقمي كلها جسور تفاهم متكافئة وجميلة.
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
        gameTitle="لعبة اختر طريقة التواصل"
        stars={3}
        customScoreText="إتقان وسائل AAC"
        educationalMessage="لا تحصر التواصل في الصوت اللفظي وحده؛ فالصورة، والرمز، والإشارة، والحرف، والنبض الرقمي كلها جسور تفاهم متكافئة وجميلة."
      />
    </div>
  );
};
