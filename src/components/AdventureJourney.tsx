import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  XCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Heart,
  Globe,
  MessageSquare,
  HeartHandshake,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { NAFHAM_ADVENTURE_STATIONS } from '../data/adventureData';
import { AdventureStation } from '../types/nafham';
import { loadUserProgress, completeStation } from '../utils/storage';
import { CertificateModal } from './CertificateModal';

interface AdventureJourneyProps {
  onBackToHome?: () => void;
  onExploreGames?: () => void;
}

export const AdventureJourney: React.FC<AdventureJourneyProps> = ({
  onBackToHome,
  onExploreGames,
}) => {
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [completedStations, setCompletedStations] = useState<number[]>([]);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [showCertPrompt, setShowCertPrompt] = useState(false);

  useEffect(() => {
    const progress = loadUserProgress();
    setCompletedStations(progress.completedStations);
  }, []);

  const currentStation: AdventureStation = NAFHAM_ADVENTURE_STATIONS[currentStationIdx];
  const isCurrentCompleted = completedStations.includes(currentStation.id);
  const allCompleted = NAFHAM_ADVENTURE_STATIONS.every((s) =>
    completedStations.includes(s.id)
  );

  const getStationIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return Globe;
      case 'Compass':
        return Compass;
      case 'MessageSquare':
        return MessageSquare;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Award':
      default:
        return Star;
    }
  };

  const handleSelectChoice = (index: number) => {
    if (isAnswered) return;
    setSelectedChoiceIdx(index);
    setIsAnswered(true);

    const choice = currentStation.interactiveChallenge.choices[index];
    if (choice.isCorrect) {
      const updated = completeStation(currentStation.id);
      setCompletedStations(updated.completedStations);
    }
  };

  const handleNextStation = () => {
    if (currentStationIdx < NAFHAM_ADVENTURE_STATIONS.length - 1) {
      setCurrentStationIdx((prev) => prev + 1);
      setSelectedChoiceIdx(null);
      setIsAnswered(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (allCompleted) {
      setShowCertPrompt(true);
    }
  };

  const handlePrevStation = () => {
    if (currentStationIdx > 0) {
      setCurrentStationIdx((prev) => prev - 1);
      setSelectedChoiceIdx(null);
      setIsAnswered(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectStation = (index: number) => {
    setCurrentStationIdx(index);
    setSelectedChoiceIdx(null);
    setIsAnswered(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim()) return;
    setIsCertModalOpen(true);
    setShowCertPrompt(false);
  };

  const IconComponent = getStationIcon(currentStation.iconName);

  return (
    <div className="space-y-8 py-6 text-right max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-l from-[#0a4d7a] to-[#0c6aa7] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white border border-white/20">
            <Compass className="w-4 h-4 text-[#2eb9df]" />
            <span>رحلة نفهم – مغامرة تفاعلية من ست محطات</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            المغامرة التوعوية: طريقك نحو الفهم والتقبل
          </h1>

          <p className="text-white/85 text-sm sm:text-base max-w-3xl leading-relaxed">
            بدلاً من قراءة صفحات تقليدية، خض رحلة شيقة من 6 محطات معرفية وتفاعلية. في كل محطة تتعلم
            حقيقة علمية وتخوض موقفاً حياتياً. عند إكمال المحطات الست تحصل على شهادة{' '}
            <strong className="text-[#2eb9df]">«سفير نفهم المعتمد»</strong>.
          </p>

          {/* Progress Tracker Bar */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-white/90">
              المحطات المنجزة: {completedStations.length} من {NAFHAM_ADVENTURE_STATIONS.length}
            </span>
            <div className="w-full sm:w-64 bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2eb9df] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(completedStations.length / NAFHAM_ADVENTURE_STATIONS.length) * 100}%`,
                }}
              />
            </div>
            {allCompleted && (
              <button
                onClick={() => setShowCertPrompt(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-[#0a4d7a] font-bold rounded-lg shadow-sm hover:bg-amber-300 transition-colors cursor-pointer text-xs"
              >
                <Award className="w-4 h-4" />
                <span>استلم شهادة السفير</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Stations Stepper Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {NAFHAM_ADVENTURE_STATIONS.map((station, idx) => {
          const isDone = completedStations.includes(station.id);
          const isCurrent = currentStationIdx === idx;
          const StIcon = getStationIcon(station.iconName);

          return (
            <button
              key={station.id}
              onClick={() => handleSelectStation(idx)}
              className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isCurrent
                  ? 'bg-white border-[#0c6aa7] shadow-md ring-2 ring-[#0c6aa7]/20'
                  : isDone
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-700 hover:bg-white'
                  : 'bg-white/70 border-slate-200 text-slate-500 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#0c6aa7] text-white'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <StIcon className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {idx + 1}/6
                </span>
              </div>
              <div>
                <p
                  className={`text-xs font-bold line-clamp-1 ${
                    isCurrent
                      ? 'text-[#0a4d7a]'
                      : isDone
                      ? 'text-emerald-800'
                      : 'text-slate-700'
                  }`}
                >
                  {station.title}
                </p>
                <span className="text-[10px] text-slate-400">
                  {isDone ? 'مكتملة ✓' : 'انقر للدخول'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Active Station Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        {/* Station Subheader */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e1eff8] text-[#0c6aa7] flex items-center justify-center shrink-0">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#0c6aa7] uppercase tracking-wider">
                {currentStation.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a4d7a]">
                {currentStation.title}
              </h2>
            </div>
          </div>

          {isCurrentCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>أنجزت هذه المحطة بنجاح</span>
            </span>
          )}
        </div>

        {/* Station Subtitle */}
        <p className="text-sm font-semibold text-slate-500">
          {currentStation.subtitle}
        </p>

        {/* Concept Box */}
        <div className="p-5 rounded-2xl bg-[#f2f8fc] border border-[#cbe3f3] space-y-2">
          <div className="flex items-center gap-2 text-[#0a4d7a] font-bold text-sm">
            <BookOpen className="w-4 h-4 text-[#0c6aa7]" />
            <span>المفهوم الأساسي للمحطة:</span>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {currentStation.conceptText}
          </p>
        </div>

        {/* Interactive Challenge Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-[#0a4d7a] font-extrabold text-base">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>الموقف التفاعلي: كيف تتصرف؟</span>
          </div>

          <p className="text-sm sm:text-base font-semibold text-slate-800 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 leading-relaxed">
            {currentStation.interactiveChallenge.prompt}
          </p>

          {/* Choices */}
          <div className="space-y-3">
            {currentStation.interactiveChallenge.choices.map((choice, cIdx) => {
              const isSelected = selectedChoiceIdx === cIdx;
              const showResult = isAnswered && isSelected;

              return (
                <div key={cIdx} className="space-y-2">
                  <button
                    onClick={() => handleSelectChoice(cIdx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? choice.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                          : 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                        : isAnswered
                        ? choice.isCorrect
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                        : 'bg-white border-slate-200 hover:border-[#0c6aa7] hover:bg-[#f2f8fc] text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full mt-0.5 shrink-0 flex items-center justify-center border ${
                        isSelected
                          ? choice.isCorrect
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-rose-500 border-rose-500 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected &&
                        (choice.isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        ))}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {choice.label}
                    </span>
                  </button>

                  {/* Feedback on selection */}
                  {showResult && (
                    <div
                      className={`p-3 rounded-xl text-xs sm:text-sm font-semibold leading-relaxed flex items-start gap-2 ${
                        choice.isCorrect
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {choice.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <span>{choice.feedback}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset button if answered incorrectly */}
          {isAnswered && selectedChoiceIdx !== null && !currentStation.interactiveChallenge.choices[selectedChoiceIdx].isCorrect && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedChoiceIdx(null);
                  setIsAnswered(false);
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0c6aa7] hover:text-[#0a4d7a] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة في هذا الموقف</span>
              </button>
            </div>
          )}
        </div>

        {/* Takeaway Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-900 block">
              الخلاصة الذهبية للمحطة:
            </span>
            <p className="text-xs sm:text-sm font-medium text-amber-800 leading-relaxed mt-0.5">
              {currentStation.takeaway}
            </p>
          </div>
        </div>

        {/* Navigation Buttons between stations */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrevStation}
            disabled={currentStationIdx === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>المحطة السابقة</span>
          </button>

          <div className="text-xs font-semibold text-slate-400 hidden sm:block">
            المحطة {currentStationIdx + 1} من {NAFHAM_ADVENTURE_STATIONS.length}
          </div>

          <button
            onClick={handleNextStation}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c6aa7] text-white text-xs sm:text-sm font-bold hover:bg-[#0a4d7a] shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>
              {currentStationIdx === NAFHAM_ADVENTURE_STATIONS.length - 1
                ? 'خاتمة المغامرة'
                : 'المحطة التالية'}
            </span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Ambassador Certificate Prompt Dialog if all completed */}
      {showCertPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-2xl font-extrabold text-[#0a4d7a]">
                مبارك! أنت الآن سفير معتمد لنفهم
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                لقد اجتزت جميع محطات الرحلة التوعوية الست بنجاح وأثبت استيعابك للاختلافات
                الحسية والتواصلية. أدخل اسمك للحصول على شهادتك المعتمدة.
              </p>
            </div>

            <form onSubmit={handleClaimCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الاسم الكريم (كما سيظهر على الشهادة الرسمية):
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سارة محمد القحطاني"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7] focus:ring-2 focus:ring-[#0c6aa7]/20"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0c6aa7] text-white font-bold text-sm hover:bg-[#0a4d7a] transition-all cursor-pointer shadow-md"
                >
                  إصدار الشهادة الآن
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertPrompt(false)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        recipientName={participantName}
        achievementTitle="سفير التوعية باضطراب طيف التوحد (المغامرة التفاعلية الكاملة)"
      />
    </div>
  );
};
