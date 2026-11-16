/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  Layout,
  Layers,
  Heart,
  Compass,
  Rocket,
  Gamepad2,
  Trophy,
  Bot,
  BookOpen,
  Palette,
  ShieldCheck,
  Building2,
  Users,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  Film,
} from 'lucide-react';
import { Navbar, NafhamView } from './components/Navbar';
import { SlideOneHero } from './components/SlideOneHero';
import { SlideTwoKnowledge } from './components/SlideTwoKnowledge';
import { SlideThreeCelebration } from './components/SlideThreeCelebration';
import { ShareModal } from './components/ShareModal';
import { TrackSelector } from './components/TrackSelector';
import { AdventureJourney } from './components/AdventureJourney';
import { KnowledgeLibrary } from './components/KnowledgeLibrary';
import { GamesCity } from './components/games/GamesCity';
import { NafhamChallenge } from './components/NafhamChallenge';
import { AskNafhamChat } from './components/AskNafhamChat';
import { VisualGallery } from './components/VisualGallery';
import { ScientificReferences } from './components/ScientificReferences';
import { AdminDashboard } from './components/AdminDashboard';
import { CinematicLanding } from './components/cinematic/CinematicLanding';
import { VideoShowcaseHub } from './components/video_hub/VideoShowcaseHub';
import { OfflineToast } from './components/OfflineToast';
import { GamificationDashboard } from './components/GamificationDashboard';
import { TeamSection } from './components/TeamSection';
import { CertificateModal } from './components/CertificateModal';
import { NAFHAM_CONTENT } from './data/nafhamData';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import {
  LandingSectionConfig,
  loadLandingSections,
} from './data/landingSectionsData';
import { UniversalInstaller } from './components/installer/UniversalInstaller';
import { getRelativeRoute, resolveAppUrl } from './utils/pathResolver';

export default function App() {
  const [activeView, setActiveView] = useState<NafhamView>(() => {
    if (typeof window !== 'undefined') {
      const relRoute = getRelativeRoute();
      if (relRoute === '/install' || relRoute.startsWith('/install')) {
        return 'installer';
      }
      if (
        relRoute === '/admincp' ||
        relRoute.startsWith('/admincp') ||
        relRoute === '/admin' ||
        window.location.hash === '#admincp'
      ) {
        return 'admin';
      }
      const hasSeen = localStorage.getItem('nafham_seen_cinematic');
      if (!hasSeen) return 'cinematic';
    }
    return 'home';
  });
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [slideViewMode, setSlideViewMode] = useState<'slide' | 'continuous'>('slide');
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  // Dynamic Landing Page Sections configuration (configurable via /admincp)
  const [landingSections, setLandingSections] = useState<LandingSectionConfig[]>(() =>
    loadLandingSections()
  );

  useEffect(() => {
    const handleSectionsUpdate = () => {
      setLandingSections(loadLandingSections());
    };
    window.addEventListener('nafham_landing_sections_updated', handleSectionsUpdate);
    window.addEventListener('storage', handleSectionsUpdate);
    return () => {
      window.removeEventListener('nafham_landing_sections_updated', handleSectionsUpdate);
      window.removeEventListener('storage', handleSectionsUpdate);
    };
  }, []);

  // Accessibility state
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Secret 5-clicks trigger on "مجرد أثر بصمة" to navigate to admincp
  const [fingerprintClicks, setFingerprintClicks] = useState(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleFingerprintClick = () => {
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }
    const nextCount = fingerprintClicks + 1;
    if (nextCount >= 5) {
      setFingerprintClicks(0);
      window.history.pushState({}, '', resolveAppUrl('/admincp'));
      setActiveView('admin');
    } else {
      setFingerprintClicks(nextCount);
      clickTimeoutRef.current = window.setTimeout(() => {
        setFingerprintClicks(0);
      }, 3000);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for /admincp or /install in URL
    const checkUniversalRoute = () => {
      const relRoute = getRelativeRoute();
      if (relRoute === '/install' || relRoute.startsWith('/install')) {
        setActiveView('installer');
      } else if (
        relRoute === '/admincp' ||
        relRoute.startsWith('/admincp') ||
        relRoute === '/admin' ||
        window.location.hash === '#admincp'
      ) {
        setActiveView('admin');
      }
    };
    window.addEventListener('popstate', checkUniversalRoute);
    window.addEventListener('hashchange', checkUniversalRoute);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('popstate', checkUniversalRoute);
      window.removeEventListener('hashchange', checkUniversalRoute);
    };
  }, []);

  const handleToggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      const progress = loadUserProgress();
      progress.accessibilitySettings.highContrast = next;
      saveUserProgress(progress);
      return next;
    });
  };

  const handleToggleReduceMotion = () => {
    setReduceMotion((prev) => {
      const next = !prev;
      const progress = loadUserProgress();
      progress.accessibilitySettings.reduceMotion = next;
      saveUserProgress(progress);
      return next;
    });
  };

  const handleChangeFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    const progress = loadUserProgress();
    progress.accessibilitySettings.fontSize = size;
    saveUserProgress(progress);
  };

  const totalSlides = 3;

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSlide = (index: number) => {
    setCurrentSlide(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'original_slides' || slideViewMode !== 'slide') return;
      if (e.key === 'ArrowLeft') {
        goToNextSlide();
      } else if (e.key === 'ArrowRight') {
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slideViewMode, activeView]);

  const fontClass =
    fontSize === 'xlarge'
      ? 'text-lg [&_h1]:text-3xl [&_h2]:text-2xl [&_p]:text-base'
      : fontSize === 'large'
      ? 'text-base [&_h1]:text-2xl [&_h2]:text-xl [&_p]:text-sm'
      : 'text-sm';

  if (activeView === 'installer') {
    return (
      <UniversalInstaller
        onInstallationComplete={() => {}}
        onNavigateHome={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateAdmin={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (activeView === 'cinematic') {
    return (
      <CinematicLanding
        onEnterPlatform={(targetView) => {
          setActiveView(targetView || 'home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        initialCalmMode={reduceMotion}
      />
    );
  }

  if (activeView === 'video_hub') {
    return (
      <VideoShowcaseHub
        onNavigateHome={(targetView) => {
          setActiveView(targetView || 'home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGames={() => {
          setActiveView('games');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col bg-[#f2f8fc] text-[#304254] selection:bg-[#2eb9df]/20 selection:text-[#0a4d7a] ${fontClass} ${
        highContrast ? 'high-contrast-mode' : ''
      }`}
    >
      {/* 1. Universal Academic & Platform Navigation Bar */}
      <Navbar
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenShare={() => setIsShareModalOpen(true)}
        isOffline={isOffline}
        fontSize={fontSize}
        onChangeFontSize={handleChangeFontSize}
        reduceMotion={reduceMotion}
        onToggleReduceMotion={handleToggleReduceMotion}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleHighContrast}
      />

      {/* 2. Main Content Router */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* VIEW A: HOME (Dynamic sections ordered & configured via /admincp) */}
        {activeView === 'home' && (
          <div className="space-y-12 py-8 text-right">
            {landingSections
              .filter((sec) => sec.visible)
              .map((sec) => {
                switch (sec.id) {
                  case 'hero':
                    return (
                      <section
                        key="hero"
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#f0f7fb] to-[#e4f1f9] border border-[#d2e8f6] shadow-sm p-6 sm:p-10 lg:p-12"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                          <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#e1eff8] rounded-full text-xs font-bold text-[#0a4d7a] border border-[#0c6aa7]/20 shadow-xs">
                              <img
                                src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
                                alt="شعار جامعة الإمام عبدالرحمن بن فيصل"
                                className="h-4.5 w-auto object-contain"
                              />
                              <span className="text-slate-300">|</span>
                              <span>إشراف: جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a4d7a] leading-tight">
                              منصة «نفهم» التفاعلية
                              <span className="block text-[#0c6aa7] text-2xl sm:text-3xl mt-1 font-bold">
                                لأن الفهم بداية التقبل
                              </span>
                            </h1>

                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                              مرحباً بكم في منصة نفهم التعليمية والتوعوية المتكاملة باضطراب طيف التوحد. نهدف
                              إلى نشر المعرفة العلمية الموثقة، ومساندة الأسر والمعلمين، وتعزيز دمج الأفراد ذوي
                              التوحد بروح من الاحترام والتقدير لتفردهم واحتياجاتهم.
                            </p>

                            {/* Cinematic Documentary Feature Card */}
                            <div className="p-4 bg-gradient-to-l from-[#061e31] via-[#093554] to-[#0c6aa7] rounded-2xl border border-[#2eb9df]/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#2eb9df]/20 border border-[#2eb9df]/40 flex items-center justify-center text-[#2eb9df] shrink-0">
                                  <Film className="w-5 h-5" />
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-extrabold text-white block">
                                      الفيلم التعريفي الوثائقي: «منصة نفهم»
                                    </span>
                                    <span className="text-[10px] bg-[#2eb9df]/25 text-[#2eb9df] px-2 py-0.5 rounded-full font-bold">
                                      7 فصول تفاعلية
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-300">
                                    الفيلم الرسمي التوعوي المتكامل (7 دقائق) مع فهرس الفصول ونقاط التعلم وروابط المنصة.
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => setActiveView('cinematic')}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2eb9df] hover:bg-[#25a0c3] text-[#061e31] text-xs font-black shrink-0 transition-all cursor-pointer shadow-sm hover:scale-102"
                              >
                                <span>مشاهدة الفيلم</span>
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* 4 Primary Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              <button
                                onClick={() => setActiveView('adventure')}
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0c6aa7] text-white text-sm font-bold shadow-md hover:bg-[#0a4d7a] hover:shadow-lg transition-all cursor-pointer animate-pulse hover:animate-none"
                              >
                                <span className="w-4 h-4 text-[#2eb9df] inline-flex items-center justify-center">
                                  <Rocket className="w-4 h-4" />
                                </span>
                                <span>ابدأ رحلتك (المغامرة)</span>
                              </button>

                              <button
                                onClick={() => setActiveView('games')}
                                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-[#0a4d7a] border border-[#0c6aa7]/30 text-sm font-bold shadow-xs hover:bg-[#f2f8fc] hover:border-[#0c6aa7] transition-all cursor-pointer"
                              >
                                <Gamepad2 className="w-4 h-4 text-[#0c6aa7]" />
                                <span>استكشف الألعاب</span>
                              </button>

                              <button
                                onClick={() => setActiveView('challenge')}
                                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-[#0a4d7a] border border-[#0c6aa7]/30 text-sm font-bold shadow-xs hover:bg-[#f2f8fc] hover:border-[#0c6aa7] transition-all cursor-pointer"
                              >
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <span>اختبر معلوماتك</span>
                              </button>

                              <button
                                onClick={() => setActiveView('assistant')}
                                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#2eb9df]/15 text-[#0a4d7a] border border-[#2eb9df]/40 text-sm font-bold hover:bg-[#2eb9df]/25 transition-all cursor-pointer"
                              >
                                <Bot className="w-4 h-4 text-[#0c6aa7]" />
                                <span>اسأل نفهم</span>
                              </button>
                            </div>
                          </div>

                          <div className="lg:col-span-5 flex justify-center">
                            <div className="relative p-4 bg-white/80 rounded-3xl border border-[#cbe3f3] shadow-md max-w-sm w-full">
                              <img
                                src={NAFHAM_CONTENT.slide1.hero.heroImage}
                                alt="لوحة نفهم الترحيبية"
                                className="w-full h-auto object-contain rounded-2xl drop-shadow-sm"
                              />
                              <div className="mt-3 text-center">
                                <span className="text-xs font-bold text-[#0a4d7a]">
                                  «معاً ننشر الوعي ونَصنع فرقاً يبدأ بالفهم»
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    );

                  case 'gamification':
                    return (
                      <GamificationDashboard
                        key="gamification"
                        onNavigate={(view) => {
                          setActiveView(view);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onOpenCertificate={() => setIsCertModalOpen(true)}
                      />
                    );

                  case 'four_cards':
                    return (
                      <section key="four_cards" className="space-y-4">
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#0c6aa7] uppercase tracking-wider">
                            أقسام المنصة
                          </span>
                          <h2 className="text-2xl font-extrabold text-[#0a4d7a]">
                            استكشف محاور منصة نفهم التعليمية
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* 1. Adventure Card */}
                          <motion.div
                            onClick={() => setActiveView('adventure')}
                            initial={reduceMotion ? false : { opacity: 0, y: 25 }}
                            whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.05, ease: 'easeOut' }}
                            whileHover={reduceMotion ? {} : { y: -8, scale: 1.025 }}
                            whileTap={reduceMotion ? {} : { scale: 0.98 }}
                            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#0c6aa7] transition-all cursor-pointer space-y-3 relative overflow-hidden"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-[#e1eff8] text-[#0c6aa7] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c6aa7] group-hover:text-white transition-all duration-300">
                              <Compass className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors">
                              المغامرة التفاعلية (6 محطات)
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              رحلة استكشافية من 6 محطات تتضمن مواقف تفاعلية وشهادة سفير معتمد.
                            </p>
                            <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0c6aa7] opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>انطلق في المغامرة</span>
                              <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                            </div>
                          </motion.div>

                          {/* 2. Library Card */}
                          <motion.div
                            onClick={() => setActiveView('library')}
                            initial={reduceMotion ? false : { opacity: 0, y: 25 }}
                            whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
                            whileHover={reduceMotion ? {} : { y: -8, scale: 1.025 }}
                            whileTap={reduceMotion ? {} : { scale: 0.98 }}
                            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#0c6aa7] transition-all cursor-pointer space-y-3 relative overflow-hidden"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-[#e1eff8] text-[#0c6aa7] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c6aa7] group-hover:text-white transition-all duration-300">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors">
                              مكتبة المعرفة (10 موضوعات)
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              دليل علمي شامل يغطي التعريف، الحواس، الروتين، والتواصل البديل.
                            </p>
                            <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0c6aa7] opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>تصفح المقالات العلمية</span>
                              <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                            </div>
                          </motion.div>

                          {/* 3. Games Card */}
                          <motion.div
                            onClick={() => setActiveView('games')}
                            initial={reduceMotion ? false : { opacity: 0, y: 25 }}
                            whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.19, ease: 'easeOut' }}
                            whileHover={reduceMotion ? {} : { y: -8, scale: 1.025 }}
                            whileTap={reduceMotion ? {} : { scale: 0.98 }}
                            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-[#0c6aa7] transition-all cursor-pointer space-y-3 relative overflow-hidden"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-[#e1eff8] text-[#0c6aa7] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c6aa7] group-hover:text-white transition-all duration-300">
                              <Gamepad2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors">
                              مدينة ألعاب نفهم (6 ألعاب)
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              ألعاب أحاجي بصرية، المشاعر، الجدول اليومي، ومحاكي الحواس.
                            </p>
                            <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0c6aa7] opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>العب وتعلم الآن</span>
                              <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                            </div>
                          </motion.div>

                          {/* 4. Challenge Card */}
                          <motion.div
                            onClick={() => setActiveView('challenge')}
                            initial={reduceMotion ? false : { opacity: 0, y: 25 }}
                            whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.26, ease: 'easeOut' }}
                            whileHover={reduceMotion ? {} : { y: -8, scale: 1.025 }}
                            whileTap={reduceMotion ? {} : { scale: 0.98 }}
                            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-amber-500 transition-all cursor-pointer space-y-3 relative overflow-hidden"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                              <Trophy className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-[#0a4d7a] group-hover:text-amber-600 transition-colors">
                              تحدي نفهم (105+ أسئلة)
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              اختبار وعي ذكي بأسئلة أكاديمية محكمة وإصدار شهادات إتمام فورية.
                            </p>
                            <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>ابدأ الاختبار الرقمي</span>
                              <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                            </div>
                          </motion.div>
                        </div>
                      </section>
                    );

                  case 'tracks':
                    return (
                      <section
                        key="tracks"
                        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs"
                      >
                        <TrackSelector
                          onSelectTrackTopic={(topicId) => {
                            setSelectedTopicId(topicId);
                            setActiveView('library');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onSelectTrackGame={() => {
                            setActiveView('games');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        />
                      </section>
                    );

                  case 'mission':
                    return (
                      <section
                        key="mission"
                        className="bg-gradient-to-l from-[#0a4d7a] to-[#0c6aa7] text-white rounded-3xl p-6 sm:p-10 shadow-md space-y-6"
                      >
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-[#2eb9df] uppercase tracking-wider">
                            رسالة نفهم السامية
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-extrabold">
                            أهداف المنصة ورؤيتها المجتمعية
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-[#2eb9df] text-[#0a4d7a] flex items-center justify-center font-bold text-sm">
                              1
                            </div>
                            <h3 className="font-bold text-sm text-white">نشر المعرفة العلمية</h3>
                            <p className="text-xs text-white/80 leading-relaxed">
                              تقديم مفاهيم طيف التوحد المبنية على براهين طبية ونمائية معتمدة داحضة للخرافات.
                            </p>
                          </div>

                          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-[#2eb9df] text-[#0a4d7a] flex items-center justify-center font-bold text-sm">
                              2
                            </div>
                            <h3 className="font-bold text-sm text-white">الدمج والتقبل الشامل</h3>
                            <p className="text-xs text-white/80 leading-relaxed">
                              تمكين المدارس والمراكز العامة من توفير بيئات مريحة تحترم الاختلاف الحسي.
                            </p>
                          </div>

                          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-[#2eb9df] text-[#0a4d7a] flex items-center justify-center font-bold text-sm">
                              3
                            </div>
                            <h3 className="font-bold text-sm text-white">مساندة الأسر والمربين</h3>
                            <p className="text-xs text-white/80 leading-relaxed">
                              تزويد أولياء الأمور والمعلمين بأدوات التواصل المعززة والجداول البصرية العملية.
                            </p>
                          </div>

                          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-[#2eb9df] text-[#0a4d7a] flex items-center justify-center font-bold text-sm">
                              4
                            </div>
                            <h3 className="font-bold text-sm text-white">التعليم باللعب التفاعلي</h3>
                            <p className="text-xs text-white/80 leading-relaxed">
                              تبسيط المفاهيم للأطفال والناشئة عبر 6 ألعاب هادفة تزرع الصداقة والتفهم.
                            </p>
                          </div>
                        </div>
                      </section>
                    );

                  case 'cinematic_video':
                    return (
                      <section
                        key="cinematic_video"
                        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <Film className="w-5 h-5 text-[#0c6aa7]" />
                            <h3 className="text-base font-black text-[#0a4d7a]">
                              الفيلم التعريفي الوثائقي لمنصة نفهم
                            </h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setActiveView('video_hub');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#2eb9df] hover:from-amber-500 hover:to-[#25a0c3] text-[#061e31] text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-102"
                            >
                              <span>استوديو عروض الفيديو والأنماط المتنوعة 🎬</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setActiveView('cinematic')}
                              className="text-xs font-bold text-[#0c6aa7] hover:underline flex items-center gap-1 cursor-pointer hidden sm:flex"
                            >
                              <span>واجهة السينما الكاملة</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <CinematicLanding
                          onEnterPlatform={(targetView) => {
                            if (targetView) setActiveView(targetView);
                          }}
                        />
                      </section>
                    );

                  case 'slides_switch':
                    return (
                      <section
                        key="slides_switch"
                        className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[#0a4d7a] font-bold text-sm">
                            <Layers className="w-4 h-4 text-[#0c6aa7]" />
                            <span>تفضل تجربة العرض التقديمي الشرائحي الأصلي؟</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            يمكنك استعراض الشرائح الثلاث الأصلية الكاملة مع التبديل بين العرض الشرائحي والصفحة الكاملة.
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveView('original_slides')}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c6aa7] text-white text-xs font-bold hover:bg-[#0a4d7a] transition-all cursor-pointer shrink-0 shadow-xs"
                        >
                          <span>الانتقال للعرض الشرائحي</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </section>
                    );

                  case 'team':
                    return <TeamSection key="team" />;

                  default:
                    return null;
                }
              })}
          </div>
        )}

        {/* VIEW B: TRACKS */}
        {activeView === 'tracks' && (
          <div className="py-6">
            <TrackSelector
              onSelectTrackTopic={(topicId) => {
                setSelectedTopicId(topicId);
                setActiveView('library');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectTrackGame={() => {
                setActiveView('games');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* VIEW C: ADVENTURE (6 Stations) */}
        {activeView === 'adventure' && (
          <AdventureJourney
            onBackToHome={() => setActiveView('home')}
            onExploreGames={() => setActiveView('games')}
          />
        )}

        {/* VIEW D: KNOWLEDGE LIBRARY (10 Topics) */}
        {activeView === 'library' && (
          <KnowledgeLibrary
            initialTopicId={selectedTopicId}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {/* VIEW E: GAMES CITY (6 Games) */}
        {activeView === 'games' && (
          <GamesCity
            onNavigateHome={() => setActiveView('home')}
            reduceMotion={reduceMotion}
          />
        )}

        {/* VIEW F: NAFHAM CHALLENGE (105+ Bank) */}
        {activeView === 'challenge' && (
          <NafhamChallenge onBackToHome={() => setActiveView('home')} />
        )}

        {/* VIEW G: ASK NAFHAM ASSISTANT */}
        {activeView === 'assistant' && (
          <div className="py-6">
            <AskNafhamChat />
          </div>
        )}

        {/* VIEW H: VISUAL GALLERY */}
        {activeView === 'gallery' && (
          <div className="py-6">
            <VisualGallery />
          </div>
        )}

        {/* VIEW I: SCIENTIFIC REFERENCES */}
        {activeView === 'sources' && (
          <div className="py-6">
            <ScientificReferences />
          </div>
        )}

        {/* VIEW J: ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <div className="py-6">
            <AdminDashboard />
          </div>
        )}

        {/* VIEW K: ORIGINAL 3-SLIDE JOURNEY */}
        {activeView === 'original_slides' && (
          <div className="space-y-6 py-6">
            {/* Top Navigation banner for Slides */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0c6aa7]" />
                <span className="text-xs font-bold text-[#0a4d7a]">
                  العرض الشرائحي الأصلي: الشريحة {currentSlide + 1} من {totalSlides}
                </span>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setSlideViewMode('slide')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    slideViewMode === 'slide'
                      ? 'bg-white text-[#0a4d7a] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>عرض شرائحي</span>
                </button>
                <button
                  onClick={() => setSlideViewMode('continuous')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    slideViewMode === 'continuous'
                      ? 'bg-white text-[#0a4d7a] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>صفحة متصلة</span>
                </button>
              </div>
            </div>

            {/* Slide Stage */}
            {slideViewMode === 'slide' ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {currentSlide === 0 && (
                    <SlideOneHero onStartJourney={goToNextSlide} />
                  )}
                  {currentSlide === 1 && (
                    <SlideTwoKnowledge
                      onFinishReading={goToNextSlide}
                      onPrevSlide={goToPrevSlide}
                    />
                  )}
                  {currentSlide === 2 && (
                    <SlideThreeCelebration
                      onRestartJourney={() => handleSelectSlide(0)}
                      onOpenShareModal={() => setIsShareModalOpen(true)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              /* Continuous Scroll Mode */
              <div className="space-y-16 py-6">
                <SlideOneHero onStartJourney={() => handleSelectSlide(1)} />
                <div className="border-t-2 border-dashed border-[#cbe3f3] my-8" />
                <SlideTwoKnowledge
                  onFinishReading={() => handleSelectSlide(2)}
                  onPrevSlide={() => handleSelectSlide(0)}
                />
                <div className="border-t-2 border-dashed border-[#cbe3f3] my-8" />
                <SlideThreeCelebration
                  onRestartJourney={() => handleSelectSlide(0)}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                />
              </div>
            )}

            {/* Slide Navigation Floating Pill */}
            {slideViewMode === 'slide' && (
              <aside
                aria-label="أدوات التنقل بين الشرائح"
                className="fixed bottom-6 right-1/2 translate-x-1/2 z-30 flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-lg"
              >
                <button
                  onClick={goToPrevSlide}
                  disabled={currentSlide === 0}
                  className="p-2 rounded-xl text-slate-600 hover:text-[#0a4d7a] hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="الشريحة السابقة"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 px-1">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSlide(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        currentSlide === idx
                          ? 'w-6 h-2.5 bg-[#0c6aa7]'
                          : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      title={`الانتقال إلى الشريحة ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={goToNextSlide}
                  disabled={currentSlide === totalSlides - 1}
                  className="p-2 rounded-xl text-slate-600 hover:text-[#0a4d7a] hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="الشريحة التالية"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </aside>
            )}
          </div>
        )}
      </main>

      {/* 3. Global Comprehensive Footer */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white/80 py-10 text-right text-xs text-slate-500 space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & IAU */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src={NAFHAM_CONTENT.brand.logo}
                alt="شعار نفهم"
                className="w-7 h-7 object-contain"
              />
              <span className="font-extrabold text-[#0a4d7a] text-base">
                منصة نفهم التوعوية
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              مبادرة توعوية تفاعلية متكاملة حول اضطراب طيف التوحد تحت إشراف جامعة الإمام عبدالرحمن بن
              فيصل.
            </p>
            <div className="text-[#0c6aa7] font-bold text-xs">
              «لأن الفهم بداية التقبل»
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <span className="font-bold text-[#0a4d7a] text-xs block">أقسام المنصة</span>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li>
                <button
                  onClick={() => setActiveView('cinematic')}
                  className="hover:text-[#0c6aa7] cursor-pointer text-[#0c6aa7] font-bold flex items-center gap-1.5"
                >
                  <Film className="w-3.5 h-3.5 text-[#2eb9df]" />
                  <span>الفيلم السينمائي (ما وراء الاختلاف حكاية)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('tracks')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  مسارات الفئات المستهدفة
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('adventure')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  المغامرة التفاعلية (6 محطات)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('library')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  مكتبة المعرفة (10 موضوعات)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('games')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  مدينة ألعاب نفهم
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tools & References */}
          <div className="space-y-2">
            <span className="font-bold text-[#0a4d7a] text-xs block">الأدوات والمراجع</span>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li>
                <button
                  onClick={() => setActiveView('challenge')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  تحدي واختبار نفهم (105+ أسئلة)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('assistant')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  رفيق نفهم الذكي (اسأل نفهم)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('gallery')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  معرض الرسومات والهوية البصرية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('sources')}
                  className="hover:text-[#0c6aa7] cursor-pointer"
                >
                  المصادر والمراجع الأكاديمية
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    window.history.pushState({}, '', '/admincp');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#0c6aa7] cursor-pointer text-[#0c6aa7] font-bold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>لوحة التحكم والأتمتة (/admincp)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Academic Supervision & Rights */}
          <div className="space-y-3">
            <span className="font-bold text-[#0a4d7a] text-xs block">الجهة المشرفة</span>
            <div className="p-3.5 bg-[#e1eff8]/70 rounded-2xl border border-[#cbe3f3] text-[11px] text-slate-700 leading-relaxed space-y-2">
              <img
                src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
                alt="شعار جامعة الإمام عبدالرحمن بن فيصل"
                className="h-9 w-auto object-contain"
              />
              <div>
                <strong className="text-[#0a4d7a] block">جامعة الإمام عبدالرحمن بن فيصل</strong>
                <p className="text-[10px] text-slate-500">
                  كلية الآداب · المملكة العربية السعودية
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              جميع المحتويات والأصول مدمجة ومحفوظة لتعمل في أي وقت أوفلاين.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="space-y-1 text-center sm:text-right">
            <p>جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب · مبادرة «نفهم» التوعوية باضطراب طيف التوحد © {new Date().getFullYear()}</p>
            <button
              type="button"
              onClick={handleFingerprintClick}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
              title="انقر 5 مرات للدخول المباشر إلى لوحة التحكم الإدارية"
            >
              <span className="text-amber-500 text-xs">🐾</span>
              <span className="text-xs font-bold text-amber-800 font-serif">مجرد أثر بصمة</span>
              {fingerprintClicks > 0 ? (
                <span className="text-[10px] text-amber-700 font-bold px-2 py-0.5 rounded-full bg-amber-200/80 animate-pulse">
                  {fingerprintClicks === 4 ? 'تبقى نقرة واحدة 🚀' : `النقرة ${fingerprintClicks} من 5`}
                </span>
              ) : (
                <span className="text-[10px] text-amber-600/90 font-sans">(بصمة وعي وأثر إنساني مستدام)</span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span>صُنعت بكل</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>من أجل مجتمع أكثر تقبلاً واحتواءً لأفراد طيف التوحد</span>
          </div>
        </div>
      </footer>

      {/* Offline Toast Notification for Connection Lost/Restored */}
      <OfflineToast isOffline={isOffline} />

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Certificate Modal Dialog (Without center stamp) */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        recipientName="بطل مبادرة نفهم"
        achievementTitle="إتمام تحدي الوعي باضطراب طيف التوحد والدمج الشامل"
        score={15}
        total={15}
      />
    </div>
  );
}
