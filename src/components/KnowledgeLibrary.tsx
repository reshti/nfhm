import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Tag,
  Share2,
  X,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { NAFHAM_LIBRARY_TOPICS } from '../data/libraryData';
import { LibraryTopic } from '../types/nafham';

interface KnowledgeLibraryProps {
  onBackToHome?: () => void;
  initialTopicId?: string;
}

export const KnowledgeLibrary: React.FC<KnowledgeLibraryProps> = ({
  onBackToHome,
  initialTopicId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTopic, setActiveTopic] = useState<LibraryTopic | null>(() => {
    if (initialTopicId) {
      return NAFHAM_LIBRARY_TOPICS.find((t) => t.id === initialTopicId) || null;
    }
    return null;
  });

  // State for review questions inside active topic modal
  const [userQuestionAnswers, setUserQuestionAnswers] = useState<{
    [qIdx: number]: number;
  }>({});

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(NAFHAM_LIBRARY_TOPICS.map((t) => t.category));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return NAFHAM_LIBRARY_TOPICS.filter((topic) => {
      const matchCat =
        selectedCategory === 'all' || topic.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        topic.title.includes(searchQuery) ||
        topic.summary.includes(searchQuery) ||
        topic.fullContent.some((p) => p.includes(searchQuery));
      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenTopic = (topic: LibraryTopic) => {
    setActiveTopic(topic);
    setUserQuestionAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseTopic = () => {
    setActiveTopic(null);
    setUserQuestionAnswers({});
  };

  return (
    <div className="space-y-8 py-6 text-right max-w-6xl mx-auto">
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-l from-[#0a4d7a] to-[#0c6aa7] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white border border-white/20">
            <BookOpen className="w-4 h-4 text-[#2eb9df]" />
            <span>مكتبة المعرفة والوعي العلمي</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            دليلك المعرفي الشامل لطيف التوحد
          </h1>

          <p className="text-white/85 text-sm sm:text-base max-w-3xl leading-relaxed">
            عشرة موضوعات تعليمية منظمة وموثقة علمياً بأحدث دراسات جامعة الإمام عبدالرحمن بن فيصل
            ومنظمة الصحة العالمية، مع أمثلة حياتية وتطبيقات عملية وأسئلة للمراجعة.
          </p>

          {/* Search Bar inside Hero */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن أي مفهوم أو مهارة أو موضوع (مثال: الحواس، الروتين، الدمج)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-11 pl-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm shadow-md focus:outline-hidden focus:ring-2 focus:ring-[#2eb9df]"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const label = cat === 'all' ? 'جميع الموضوعات (10)' : cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#0c6aa7] text-white border-[#0c6aa7] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 3. Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic, idx) => (
          <div
            key={topic.id}
            onClick={() => handleOpenTopic(topic)}
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0c6aa7]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#e1eff8] text-[#0c6aa7] text-[11px] font-bold">
                  <Tag className="w-3 h-3" />
                  <span>{topic.category}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{topic.readingTimeMinutes} دقائق قراءة</span>
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors leading-snug">
                {topic.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {topic.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0c6aa7]">
              <span>اقرأ وتفاعل مع الموضوع</span>
              <div className="w-7 h-7 rounded-full bg-[#f2f8fc] group-hover:bg-[#0c6aa7] group-hover:text-white flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">
            لم نجد موضوعات تطابق بحثك: &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-slate-400">
            جرب البحث بكلمات أخرى أو اختر &quot;جميع الموضوعات&quot;.
          </p>
        </div>
      )}

      {/* 4. Active Topic Detail Modal / View */}
      {activeTopic && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={handleCloseTopic}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <button
                onClick={handleCloseTopic}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                title="إغلاق"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#e1eff8] text-[#0c6aa7] text-xs font-bold">
                    {activeTopic.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    · {activeTopic.readingTimeMinutes} دقائق قراءة
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a4d7a]">
                  {activeTopic.title}
                </h2>
              </div>
            </div>

            {/* Summary Highlight Box */}
            <div className="p-4 rounded-2xl bg-[#f2f8fc] border-r-4 border-[#0c6aa7] text-slate-700 text-sm font-semibold leading-relaxed">
              {activeTopic.summary}
            </div>

            {/* Full Content Paragraphs */}
            <div className="space-y-3.5 text-slate-700 text-sm sm:text-base leading-relaxed">
              {activeTopic.fullContent.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Practical Real-World Examples */}
            {activeTopic.practicalExamples.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-base font-extrabold text-[#0a4d7a] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>مواقف واقعية وتصرفات مثلى:</span>
                </h3>

                <div className="space-y-3">
                  {activeTopic.practicalExamples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2 text-xs sm:text-sm"
                    >
                      <div className="font-bold text-amber-900">
                        <span className="text-amber-600 ml-1">📍 الموقف:</span>
                        {ex.situation}
                      </div>
                      <div className="font-medium text-slate-700 leading-relaxed">
                        <span className="text-emerald-700 font-bold ml-1">
                          ✓ التصرف الأمثل والموصى به:
                        </span>
                        {ex.bestPractice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Questions */}
            {activeTopic.reviewQuestions.length > 0 && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <h3 className="text-base font-extrabold text-[#0a4d7a] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#0c6aa7]" />
                  <span>اختبر فهمك السريع لهذا الموضوع:</span>
                </h3>

                <div className="space-y-4">
                  {activeTopic.reviewQuestions.map((q, qIdx) => {
                    const chosen = userQuestionAnswers[qIdx];
                    const hasAnswered = chosen !== undefined;

                    return (
                      <div
                        key={qIdx}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                      >
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = chosen === optIdx;
                            const isCorrect = optIdx === q.correctIndex;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  if (hasAnswered) return;
                                  setUserQuestionAnswers((prev) => ({
                                    ...prev,
                                    [qIdx]: optIdx,
                                  }));
                                }}
                                disabled={hasAnswered}
                                className={`w-full p-3 rounded-xl border text-right text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                                  hasAnswered
                                    ? isCorrect
                                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                                      : isChosen
                                      ? 'bg-rose-100 border-rose-300 text-rose-900'
                                      : 'bg-white border-slate-200 text-slate-400 opacity-60'
                                    : 'bg-white border-slate-200 hover:border-[#0c6aa7] hover:bg-[#f2f8fc] text-slate-700'
                                }`}
                              >
                                <span>{opt}</span>
                                {hasAnswered && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                {hasAnswered && isChosen && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {hasAnswered && (
                          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#0a4d7a] font-semibold">
                            <span>💡 التفسير: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scientific Sources Cited */}
            {activeTopic.sources.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">
                  المصادر والمراجع العلمية المعتمدة لهذا المقال:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeTopic.sources.map((src, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#0c6aa7]" />
                      <strong>{src.publisher}:</strong> {src.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={handleCloseTopic}
                className="px-6 py-2.5 bg-[#0c6aa7] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#0a4d7a] transition-all cursor-pointer shadow-xs"
              >
                تمت القراءة والمتابعة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
