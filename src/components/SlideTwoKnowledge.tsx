import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';
import { NAFHAM_CONTENT } from '../data/nafhamData';
import { ImageWithFallback } from './ImageWithFallback';

interface SlideTwoKnowledgeProps {
  onFinishReading: () => void;
  onPrevSlide: () => void;
}

export const SlideTwoKnowledge: React.FC<SlideTwoKnowledgeProps> = ({
  onFinishReading,
  onPrevSlide,
}) => {
  const { definition, faq, careGuide, quiz } = NAFHAM_CONTENT.slide2;

  // FAQ accordion state: open first item by default
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleSelectQuizOption = (questionId: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const quizScore = quiz.questions.reduce((acc, q) => {
    return quizAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-16 lg:space-y-24 py-8 md:py-12">
      {/* 1. Scientific Definition Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e1eff8] rounded-md text-[#0c6aa7] text-xs font-bold">
              <BookOpen className="w-4 h-4 text-[#2eb9df]" />
              <span>المفهوم العلمي المعتمد</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a4d7a] leading-tight">
              {definition.title}
            </h2>

            <p className="text-base sm:text-lg text-[#304254] leading-relaxed font-normal">
              {definition.body}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {definition.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f8fbfe] border border-[#e2eff7] text-xs sm:text-sm text-[#0a4d7a] font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#2eb9df] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-50 aspect-16/10 lg:aspect-4/3">
              <ImageWithFallback
                src={definition.bannerImage}
                alt="ما هو طيف التوحد"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Frequently Asked Questions ("تعرف على أكثر الأسئلة الشائعة عن طيف التوحد") */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-4 text-right">
            <img
              src={faq.mascot}
              alt="شخصية الأسئلة الشائعة"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xs"
            />
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4d7a]">
                {faq.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {faq.subtitle}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1.5 rounded-lg border border-[#d2e8f6]">
            {faq.items.length} أسئلة أساسية
          </span>
        </div>

        {/* Accordion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faq.items.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#0c6aa7]/40 shadow-md ring-1 ring-[#0c6aa7]/20'
                    : 'bg-white/80 hover:bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0c6aa7]"
                >
                  <span className="font-bold text-sm sm:text-base text-[#0a4d7a] flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#2eb9df] shrink-0" />
                    <span>{item.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#0c6aa7]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#304254] leading-relaxed border-t border-slate-100 bg-[#fafcfe]">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Actionable Care Guide ("كيف تتعامل مع المصاب بطيف التوحد ؟") */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#0c6aa7] text-xs font-bold">
            <HeartHandshake className="w-4 h-4 text-[#2eb9df]" />
            <span>دليل التعامل الإيجابي</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4d7a]">
            {careGuide.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {careGuide.subtitle}
          </p>
        </div>

        {/* 5 Rules Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careGuide.rules.map((rule) => (
            <div
              key={rule.number}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                {/* Header with Number and Image */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#0c6aa7] bg-[#f0f7fb] w-12 h-12 rounded-2xl flex items-center justify-center border border-[#d2e8f6]">
                    .{rule.number}
                  </span>
                  {rule.image && (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-[#f2f8fc] to-[#e4f1f9] p-2 flex items-center justify-center">
                      <ImageWithFallback
                        src={rule.image}
                        alt={rule.title}
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors">
                  {rule.title}
                </h3>

                <p className="text-sm text-[#304254] leading-relaxed">
                  {rule.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-[#0c6aa7] bg-[#f0f7fb] px-2.5 py-1 rounded-md block text-center">
                  {rule.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Quick Awareness Quiz (Requested Feature) */}
      <section className="bg-gradient-to-br from-white via-[#f0f7fb] to-[#e8f4fa] rounded-3xl border border-[#cbe3f3] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cbe3f3] pb-4">
          <div className="space-y-1 text-right">
            <div className="inline-flex items-center gap-1.5 text-[#0c6aa7] text-xs font-bold">
              <Award className="w-4 h-4 text-[#2eb9df]" />
              <span>اختبار وعي سريع</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0a4d7a]">
              {quiz.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {quiz.subtitle}
            </p>
          </div>
          {Object.keys(quizAnswers).length === quiz.questions.length && (
            <button
              onClick={() => setShowQuizResults(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] transition-colors cursor-pointer self-start sm:self-auto"
            >
              عرض النتيجة
            </button>
          )}
        </div>

        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => {
            const chosenOption = quizAnswers[q.id];
            const isAnswered = chosenOption !== undefined;
            const isCorrect = chosenOption === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#e1eff8] text-[#0a4d7a] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#0a4d7a] leading-snug">
                    {q.question}
                  </h4>
                </div>

                <div className="space-y-2 pr-9">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = chosenOption === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizOption(q.id, optIdx)}
                        className={`w-full text-right p-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#f0f7fb] border-[#0c6aa7] text-[#0a4d7a] font-bold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#0c6aa7] bg-[#0c6aa7] text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isAnswered && (
                  <div
                    className={`mt-2 p-3 rounded-xl text-xs flex items-start gap-2 mr-9 ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showQuizResults && (
          <div className="p-4 rounded-2xl bg-white border border-[#2eb9df]/50 text-center space-y-2">
            <span className="text-xs font-bold text-slate-500">نتيجتك في اختبار الوعي</span>
            <div className="text-2xl font-black text-[#0a4d7a]">
              {quizScore} من {quiz.questions.length}
            </div>
            <p className="text-xs text-[#0c6aa7] font-semibold">
              {quizScore === 3
                ? 'رائع جداً! استيعابك للمفاهيم ممتاز وتستحق شهادة سفير الوعي.'
                : 'أداء طيب! الوعي يبدأ بالمعرفة المستمرة والتفهم.'}
            </p>
          </div>
        )}
      </section>

      {/* 5. Navigation Controls (CTA Button: "انتهيت من القراءة") */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
        <button
          onClick={onPrevSlide}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-sm order-2 sm:order-1"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للبداية</span>
        </button>

        <button
          onClick={onFinishReading}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-[#0c6aa7] via-[#0a4d7a] to-[#05528f] hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-base order-1 sm:order-2 w-full sm:w-auto"
        >
          <span>{careGuide.ctaText}</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
