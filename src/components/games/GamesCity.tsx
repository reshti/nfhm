import React, { useState } from 'react';
import {
  Gamepad2,
  Puzzle,
  Heart,
  Calendar,
  Sliders,
  Tablet,
  HelpCircle,
  Star,
  Play,
  RotateCcw,
} from 'lucide-react';
import { loadUserProgress } from '../../utils/storage';
import { PuzzleGame } from './PuzzleGame';
import { EmotionMatchGame } from './EmotionMatchGame';
import { DailyRoutineGame } from './DailyRoutineGame';
import { SensoryWorldGame } from './SensoryWorldGame';
import { CommunicationChoiceGame } from './CommunicationChoiceGame';
import { FactOrMythGame } from './FactOrMythGame';
import { MazeGame } from './MazeGame';
import { Compass, Lock } from 'lucide-react';
import { loadGamesConfig } from '../../data/gamesConfigData';

interface GamesCityProps {
  onNavigateHome: () => void;
  reduceMotion?: boolean;
}

type ActiveGame = 'puzzle' | 'emotion' | 'routine' | 'sensory' | 'communication' | 'factmyth' | 'maze' | null;

export const GamesCity: React.FC<GamesCityProps> = ({ onNavigateHome, reduceMotion }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const progress = loadUserProgress();
  const systemGamesConfig = loadGamesConfig();

  const gamesConfig = [
    {
      id: 'puzzle',
      title: 'ركّب الصورة',
      icon: Puzzle,
      color: 'from-[#0c6aa7] to-[#2eb9df]',
      tag: 'أحاجي بصرية',
      stars: progress.gamesStars.puzzle || 0,
      description: 'أحجية تفاعلية بـ 3 مستويات تعتمد على رسومات نفهم لتعزيز التركيز واكتشاف الرسائل التربوية.',
    },
    {
      id: 'emotion',
      title: 'طابق المشاعر',
      icon: Heart,
      color: 'from-rose-500 to-amber-500',
      tag: 'ذكاء انفعالي',
      stars: progress.gamesStars.emotion || 0,
      description: 'مواقف يومية تستكشف تنوع التعبير وتقبل الفروق في إظهار المشاعر دون تنميط لوجه الشخص.',
    },
    {
      id: 'routine',
      title: 'رتّب يومك',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-600',
      tag: 'روتين وجداول',
      stars: progress.gamesStars.routine || 0,
      description: 'ترتيب متسلسل لأنشطة اليوم لاكتشاف أثر الجداول البصرية في تعزيز الأمان والهدوء.',
    },
    {
      id: 'sensory',
      title: 'اكتشف العالم الحسي',
      icon: Sliders,
      color: 'from-purple-600 to-indigo-600',
      tag: 'بيئات داعمة',
      stars: progress.gamesStars.sensory || 0,
      description: 'محاكاة تفاعلية لتعديل البيئة الفيزيقية (الصوت، الضوء، الملمس) لجعلها صديقة للحواس.',
    },
    {
      id: 'communication',
      title: 'اختر طريقة التواصل',
      icon: Tablet,
      color: 'from-blue-600 to-cyan-500',
      tag: 'وسائل AAC',
      stars: progress.gamesStars.communication || 0,
      description: 'استكشاف لوسائل التواصل المعززة والبديلة (صور، إشارات، أجهزة لوحية ناطقة) لتعزيز التفاهم.',
    },
    {
      id: 'factmyth',
      title: 'حقيقة أم خرافة؟',
      icon: HelpCircle,
      color: 'from-amber-500 to-orange-600',
      tag: 'تصحيح مفاهيم',
      stars: progress.gamesStars.factmyth || 0,
      description: 'تحدي معرفي سريع لتفنيد الشائعات والأساطير حول طيف التوحد بالاستناد إلى مراجع علمية.',
    },
    {
      id: 'maze',
      title: 'متاهة الوعي والدمج',
      icon: Compass,
      color: 'from-[#0a4d7a] to-[#2eb9df]',
      tag: 'لعبة جديدة · استكشاف',
      stars: 3,
      description: 'متاهة تفاعلية ممتعة: تخطَّ الحواجز، أجب عن أسئلة الوعي في المحطات لفتح البوابات وجمع النجوم حتى خط النهاية.',
    },
  ];

  // Render active game if selected
  if (activeGame === 'maze') {
    return <MazeGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'puzzle') {
    return <PuzzleGame onBackToGames={() => setActiveGame(null)} reduceMotion={reduceMotion} />;
  }
  if (activeGame === 'emotion') {
    return <EmotionMatchGame onBackToGames={() => setActiveGame(null)} reduceMotion={reduceMotion} />;
  }
  if (activeGame === 'routine') {
    return <DailyRoutineGame onBackToGames={() => setActiveGame(null)} reduceMotion={reduceMotion} />;
  }
  if (activeGame === 'sensory') {
    return <SensoryWorldGame onBackToGames={() => setActiveGame(null)} reduceMotion={reduceMotion} />;
  }
  if (activeGame === 'communication') {
    return <CommunicationChoiceGame onBackToGames={() => setActiveGame(null)} reduceMotion={reduceMotion} />;
  }
  if (activeGame === 'factmyth') {
    return <FactOrMythGame onBackToGames={() => setActiveGame(null)} reduceMotion={reduceMotion} />;
  }

  const totalEarnedStars = Object.values(progress.gamesStars).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 py-8 text-right">
      {/* City Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a4d7a] via-[#0c6aa7] to-[#05528f] p-8 sm:p-12 text-white shadow-md">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-bold text-cyan-200">
            <Gamepad2 className="w-4 h-4" />
            <span>مدينة ألعاب نفهم التعليمية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            تعلم وامرح واكتشف أسرار طيف التوحد
          </h1>

          <p className="text-sm sm:text-base text-cyan-50 leading-relaxed font-normal">
            ست ألعاب تفاعلية مصممة بعناية لتعزيز الفهم والتقبل، متوافقة مع معايير الوصول، تعمل بالكامل
            دون اتصال بالإنترنت، وخالية من أي أصوات مزعجة أو مؤقتات إجبارية.
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs font-semibold">
            <span className="bg-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>مجموع نجومك: {totalEarnedStars} من 18</span>
            </span>
          </div>
        </div>
      </div>

      {/* Games Grid (6 Games) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesConfig.map((game) => {
          const Icon = game.icon;
          const isEnabled = systemGamesConfig.games[game.id] ?? true;

          return (
            <div
              key={game.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                isEnabled
                  ? 'border-slate-200/90 hover:shadow-md'
                  : 'border-slate-200 opacity-65 bg-slate-50/70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.color} text-white flex items-center justify-center shadow-xs ${
                      !isEnabled ? 'grayscale' : ''
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {isEnabled ? (
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3].map((starNum) => (
                        <Star
                          key={starNum}
                          className={`w-4 h-4 ${
                            game.stars >= starNum ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>معطلة مؤقتاً</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#0c6aa7] bg-[#f0f7fb] px-2.5 py-0.5 rounded-md inline-block">
                    {game.tag}
                  </span>
                  <h3 className="text-lg font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors">
                    {game.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {game.description}
                </p>
              </div>

              {isEnabled ? (
                <button
                  onClick={() => setActiveGame(game.id as ActiveGame)}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-[#0c6aa7] text-[#0a4d7a] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>ابدأ اللعبة الآن</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>تم إيقاف اللعبة من لوحة التحكم</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
