import React, { useState } from 'react';
import { HelpCircle, Check, X, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { updateGameStars } from '../../utils/storage';
import { VictoryCelebrationModal } from '../common/VictoryCelebrationModal';

interface FactOrMythGameProps {
  onBackToGames: () => void;
  reduceMotion?: boolean;
}

interface Statement {
  id: number;
  statement: string;
  isFact: boolean;
  explanation: string;
  source: string;
}

const STATEMENTS: Statement[] = [
  {
    id: 1,
    statement: 'اللقاحات الروتينية للأطفال تسبب الإصابة باضطراب طيف التوحد.',
    isFact: false,
    explanation:
      'خرافة باطلة دحضتها مئات الدراسات العلمية العالمية على ملايين الأطفال. الدراسة القديمة لـ ويكفيلد كانت مزورة وسحبت منها الرخص الطبية.',
    source: 'منظمة الصحة العالمية WHO ومراكز CDC',
  },
  {
    id: 2,
    statement: 'التوحد اختلاف نمائي عصبي يستمر مدى الحياة ولا يقتصر على مرحلة الطفولة فقط.',
    isFact: true,
    explanation:
      'حقيقة علمية مؤكدة. التوحد يلازم الفرد طوال حياته (طفولة، مراهقة، ورشد)، ويتطور الأداء مع التدخلات المبكرة والدعم البيئي المستمر.',
    source: 'الدليل التشخيصي DSM-5',
  },
  {
    id: 3,
    statement: 'الأشخاص ذوو التوحد لا يشعرون بالعواطف ولا يرغبون في تكوين صداقات.',
    isFact: false,
    explanation:
      'خرافة شائعة وغير عادلة. ذوو التوحد يشعرون بعواطف عميقة وصادقة ويرغبون في الصداقة، لكنهم قد يجدون صعوبة في بدء المحادثة أو يعبرون بهدوء.',
    source: 'أبحاث التربية الخاصة - جامعة الإمام عبدالرحمن بن فيصل',
  },
  {
    id: 4,
    statement: 'لا توجد حميات غذائية سحرية أو جلسات أكسجين تشفي التوحد تماماً.',
    isFact: true,
    explanation:
      'حقيقة علمية. لا يوجد علاج دوائي سحري للتوحد، والتدخلات السلوكية والتربوية والتخاطب هي السبيل الوحيد المثبت علمياً لتحسين المهارات.',
    source: 'إدارة الغذاء والدواء الأمريكية FDA والمعهد البريطاني NICE',
  },
  {
    id: 5,
    statement: 'جميع الأشخاص ذوي التوحد يمتلكون عبقرية خارقة متطابقة في الرياضيات والموسيقى.',
    isFact: false,
    explanation:
      'خرافة نمطية متأثرة بالأفلام. التوحد طيف واسع تتفاوت فيه القدرات؛ فبينهم الموهوب والرياضي والفنان والمبرمج ومن يمتلك قدرات عادية كبقية البشر.',
    source: 'الجمعية الأمريكية للطب النفسي APA',
  },
  {
    id: 6,
    statement: 'الأصوات العالية والإضاءة القوية قد تسبب ألماً حسياً حقيقياً لبعض ذوي التوحد.',
    isFact: true,
    explanation:
      'حقيقة مثبتة عصبياً. فرط الاستجابة الحسية يجعل المدخلات البيئية العادية شديدة الإجهاد للجهاز العصبي، وتستوجب المراعاة البيئية.',
    source: 'كلية الطب والتربية - جامعة الإمام عبدالرحمن بن فيصل',
  },
];

export const FactOrMythGame: React.FC<FactOrMythGameProps> = ({ onBackToGames }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const statement = STATEMENTS[currentIdx];

  const handleAnswer = (choice: boolean) => {
    if (userChoice !== null) return;
    setUserChoice(choice);
    if (choice === statement.isFact) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < STATEMENTS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setUserChoice(null);
    } else {
      setIsFinished(true);
      setShowCelebration(true);
      const earnedStars = score >= 5 ? 3 : score >= 4 ? 2 : 1;
      updateGameStars('factmyth', earnedStars);
    }
  };

  const restartGame = () => {
    setCurrentIdx(0);
    setUserChoice(null);
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
            <HelpCircle className="w-5 h-5 text-[#2eb9df]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#0a4d7a]">
              اللعبة 6: حقيقة أم خرافة؟
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            اختبر معلوماتك وتصدَّ للمفاهيم الخاطئة المنتشرة حول طيف التوحد بالدليل العلمي!
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
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold text-slate-500">
            <span>
              العبارة {currentIdx + 1} من {STATEMENTS.length}
            </span>
            <span className="text-[#0c6aa7]">النقاط: {score}</span>
          </div>

          {/* Statement Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#f0f7fb] to-[#e4f1f9] border border-[#cbe3f3] text-center space-y-3">
            <span className="text-xs font-bold text-[#0c6aa7] uppercase tracking-wider">
              هل هذه العبارة صحيحة أم خاطئة؟
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#0a4d7a] leading-relaxed">
              "{statement.statement}"
            </h3>
          </div>

          {/* Action Buttons: Fact vs Myth */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              disabled={userChoice !== null}
              onClick={() => handleAnswer(true)}
              className={`p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                userChoice !== null
                  ? statement.isFact
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                    : userChoice === true
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs hover:shadow-sm'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>حقيقة علمية</span>
            </button>

            <button
              disabled={userChoice !== null}
              onClick={() => handleAnswer(false)}
              className={`p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                userChoice !== null
                  ? !statement.isFact
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                    : userChoice === false
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300 shadow-xs hover:shadow-sm'
              }`}
            >
              <X className="w-5 h-5" />
              <span>خرافة غير صحيحة</span>
            </button>
          </div>

          {/* Feedback & Scientific Explanation */}
          {userChoice !== null && (
            <div
              className={`p-5 rounded-2xl border text-right space-y-2 animate-in fade-in ${
                userChoice === statement.isFact
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {userChoice === statement.isFact ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>إجابة صحيحة! أحسنت تمييز الحقيقة.</span>
                  </>
                ) : (
                  <span>انتبه! هذه العبارة في الحقيقة: {statement.isFact ? 'حقيقة علمية' : 'خرافة غير صحيحة'}.</span>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {statement.explanation}
              </p>

              <div className="text-[11px] text-slate-500 border-t border-current/10 pt-1.5">
                المصدر العلمي: {statement.source}
              </div>
            </div>
          )}

          {userChoice !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] shadow-xs cursor-pointer transition-all"
              >
                {currentIdx < STATEMENTS.length - 1 ? 'العبارة التالية' : 'عرض النتيجة النهائية'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Results */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#0a4d7a]">أحسنت فحص الحقائق والخرافات!</h3>
            <p className="text-sm text-slate-600">
              حققت <span className="font-bold text-[#0c6aa7]">{score}</span> من أصل{' '}
              <span className="font-bold">{STATEMENTS.length}</span> إجابات صحيحة موثقة.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-amber-500">
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
            <Award className="w-7 h-7 fill-amber-400 text-amber-500" />
          </div>

          <div className="max-w-md mx-auto p-4 bg-[#f0f7fb] rounded-2xl border border-[#cbe3f3] text-xs text-[#0a4d7a] leading-relaxed font-medium">
            <strong>رسالة نفهم:</strong> تصحيح المفاهيم الخاطئة في المجتمع هو الخطوة الحاسمة لإزالة الوصمة
            وبناء بيئة تحتضن ذوي التوحد وتضمن حقوقهم الإنسانية.
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
        gameTitle="لعبة حقيقة أم خرافة"
        stars={score >= 5 ? 3 : score >= 4 ? 2 : 1}
        customScoreText={`${score} من ${STATEMENTS.length} إجابات صحيحة`}
        educationalMessage="تصحيح المفاهيم الخاطئة في المجتمع هو الخطوة الحاسمة لإزالة الوصمة وبناء بيئة تحتضن ذوي التوحد وتضمن حقوقهم الإنسانية."
      />
    </div>
  );
};
