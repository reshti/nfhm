import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Gamepad2,
  MapPin,
  Sparkles,
  Award,
  ChevronLeft,
  Flame,
  Star,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { NafhamView } from './Navbar';

interface GamificationDashboardProps {
  onNavigate: (view: NafhamView) => void;
  onOpenCertificate?: () => void;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  onNavigate,
  onOpenCertificate,
}) => {
  const [stats, setStats] = useState({
    gamesCompleted: 3,
    stationsVisited: 4,
    challengePoints: 120,
    totalGames: 7, // including the new maze game
    totalStations: 6,
  });

  // Read actual saved stats from localStorage if available
  useEffect(() => {
    try {
      const savedGames = localStorage.getItem('nafham_completed_games_count');
      const savedStations = localStorage.getItem('nafham_visited_stations_count');
      const savedScore = localStorage.getItem('nafham_challenge_score');

      setStats((prev) => ({
        ...prev,
        gamesCompleted: savedGames ? parseInt(savedGames, 10) : prev.gamesCompleted,
        stationsVisited: savedStations ? parseInt(savedStations, 10) : prev.stationsVisited,
        challengePoints: savedScore ? parseInt(savedScore, 10) : prev.challengePoints,
      }));
    } catch {
      // Fallback
    }
  }, []);

  const calculateRank = () => {
    const totalScore = stats.challengePoints + stats.gamesCompleted * 20 + stats.stationsVisited * 15;
    if (totalScore >= 200) {
      return { title: 'سفير الوعي المتميز', color: 'from-amber-500 to-amber-600', badge: 'رتبة ذهبية' };
    }
    if (totalScore >= 120) {
      return { title: 'بطل التقبل والدمج', color: 'from-[#0c6aa7] to-[#2eb9df]', badge: 'رتبة فضية' };
    }
    return { title: 'مستكشف عالم نفهم', color: 'from-emerald-500 to-teal-600', badge: 'رتبة برونزية' };
  };

  const rank = calculateRank();
  const overallPercentage = Math.min(
    100,
    Math.round(
      ((stats.gamesCompleted / stats.totalGames) * 0.4 +
        (stats.stationsVisited / stats.totalStations) * 0.4 +
        Math.min(1, stats.challengePoints / 150) * 0.2) *
        100
    )
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-10 relative overflow-hidden bg-gradient-to-br from-white via-[#f0f7fc] to-[#e6f2fa] rounded-3xl p-6 sm:p-8 border border-[#0c6aa7]/20 shadow-md"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#2eb9df]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#0c6aa7]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-[#0c6aa7]/15">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0a4d7a] to-[#0c6aa7] text-white flex items-center justify-center shadow-md">
            <Trophy className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#0a4d7a]">
                لوحة إنجازات وتحدي «نفهم»
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0c6aa7]/10 text-[#0a4d7a] border border-[#0c6aa7]/20">
                <Sparkles className="w-3 h-3 text-[#0c6aa7]" />
                <span>مستوى الوعي التفاعلي</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              تابع تقدمك في الألعاب التوعوية ومحطات المغامرة واكتسب نقاط التقبل الإنساني
            </p>
          </div>
        </div>

        {/* Current user badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#0c6aa7]/20 shadow-xs">
          <Award className="w-5 h-5 text-amber-500" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold">الرتبة الحالية:</div>
            <div className="text-xs font-black text-[#0a4d7a]">{rank.title}</div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            {rank.badge}
          </span>
        </div>
      </div>

      {/* 3 Metric Cards with Framer Motion hover */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Metric 1: Games Completed */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl p-5 border border-[#0c6aa7]/15 shadow-xs flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigate('games')}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">الألعاب التوعوية المنجزة</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Gamepad2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#0a4d7a]">{stats.gamesCompleted}</span>
            <span className="text-xs font-bold text-slate-400">/ {stats.totalGames} ألعاب مكتملة</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(stats.gamesCompleted / stats.totalGames) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold text-purple-600 group-hover:text-purple-700">
            <span>العب متاهة الوعي الآن</span>
            <ChevronLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Metric 2: Stations Visited */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl p-5 border border-[#0c6aa7]/15 shadow-xs flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigate('adventure')}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">محطات المغامرة المستكشفة</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#0a4d7a]">{stats.stationsVisited}</span>
            <span className="text-xs font-bold text-slate-400">/ {stats.totalStations} محطات زرّتها</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(stats.stationsVisited / stats.totalStations) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 group-hover:text-emerald-700">
            <span>أكمل رحلة المغامرة</span>
            <ChevronLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Metric 3: Challenge Points */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl p-5 border border-[#0c6aa7]/15 shadow-xs flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigate('challenge')}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">نقاط تحدي نفهم المعرفي</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#0a4d7a]">{stats.challengePoints}</span>
            <span className="text-xs font-bold text-slate-400">نقطة وعي مكتسبة</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.challengePoints / 150) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 group-hover:text-amber-700">
            <span>اختبر معلوماتك بالمسابقة</span>
            <ChevronLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </div>

      {/* Level Completion Bar & Certificate CTA */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#0c6aa7]/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0c6aa7]/10 flex items-center justify-center text-[#0c6aa7]">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0a4d7a]">
              معدل الإنجاز الإجمالي: {overallPercentage}% نحو التميز الكامل
            </div>
            <div className="text-[11px] text-slate-500">
              أكمل التحديات والألعاب لتأهيل شهادة وعي معتمدة باسمك من منصة نفهم
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenCertificate && (
            <button
              onClick={onOpenCertificate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>عرض شهادة الوعي</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('games')}
            className="px-4 py-2 rounded-xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>ابدأ اللعب الآن</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
};
