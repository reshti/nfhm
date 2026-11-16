import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, RotateCcw, ArrowRight, Sparkles, Trophy } from 'lucide-react';
import { loadGamesConfig } from '../../data/gamesConfigData';

interface VictoryCelebrationModalProps {
  isOpen: boolean;
  gameTitle: string;
  score?: number | string;
  stars?: number;
  customScoreText?: string;
  timeSeconds?: number;
  moves?: number;
  lesson?: string;
  educationalMessage?: string;
  onReplay: () => void;
  onExit?: () => void;
  onClose?: () => void;
  onReturnToGames?: () => void;
}

interface BalloonItem {
  id: number;
  color: string;
  leftPct: number;
  sizePx: number;
  delayMs: number;
  durationMs: number;
  swayPx: number;
}

interface FireworkBurst {
  id: number;
  topPct: number;
  leftPct: number;
  color: string;
  delayMs: number;
}

const BALLOON_COLORS = [
  '#2eb9df', // Cyan
  '#0c6aa7', // Deep IAU Blue
  '#f59e0b', // Amber/Yellow
  '#ef4444', // Red
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Teal
];

export const VictoryCelebrationModal: React.FC<VictoryCelebrationModalProps> = ({
  isOpen,
  gameTitle,
  score,
  stars,
  customScoreText,
  timeSeconds,
  moves,
  lesson,
  educationalMessage,
  onReplay,
  onExit,
  onClose,
  onReturnToGames,
}) => {
  const gamesConfig = loadGamesConfig();
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [fireworks, setFireworks] = useState<FireworkBurst[]>([]);

  const handleExit = onExit || onReturnToGames || onClose || (() => {});
  const effectiveLesson = lesson || educationalMessage;
  const effectiveScore = customScoreText !== undefined ? customScoreText : score;

  useEffect(() => {
    if (!isOpen) {
      setBalloons([]);
      setFireworks([]);
      return;
    }

    // Generate 22 floating celebratory balloons
    const newBalloons: BalloonItem[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      leftPct: 3 + (i * 4.3) + (Math.random() * 3 - 1.5),
      sizePx: Math.floor(45 + Math.random() * 28),
      delayMs: Math.floor(Math.random() * 600),
      durationMs: Math.floor((gamesConfig.balloonAnimationSeconds || 3) * 1000 + (Math.random() * 400)),
      swayPx: Math.floor(15 + Math.random() * 25),
    }));
    setBalloons(newBalloons);

    // Generate 8 firework burst centers
    const newFireworks: FireworkBurst[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      topPct: 15 + Math.random() * 45,
      leftPct: 10 + Math.random() * 80,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      delayMs: i * 350,
    }));
    setFireworks(newFireworks);
  }, [isOpen, gamesConfig.balloonAnimationSeconds]);

  if (!isOpen) return null;

  const formatTime = (secs?: number) => {
    if (secs === undefined || isNaN(secs)) return null;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
    >
      {/* Dark Ambient Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300" />

      {/* 1. RISING CELEBRATORY BALLOONS (Active for ~3 seconds) */}
      {gamesConfig.celebrationEnabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {balloons.map((b) => (
            <div
              key={b.id}
              style={{
                left: `${b.leftPct}%`,
                animationDelay: `${b.delayMs}ms`,
                animationDuration: `${b.durationMs}ms`,
                width: `${b.sizePx}px`,
                height: `${Math.round(b.sizePx * 1.25)}px`,
              }}
              className="absolute -bottom-24 animate-balloon-rise flex flex-col items-center"
            >
              {/* Balloon Body */}
              <div
                style={{ backgroundColor: b.color }}
                className="w-full h-full rounded-full shadow-lg relative flex items-center justify-center overflow-hidden transform hover:scale-105"
              >
                {/* Glossy light reflection */}
                <div className="absolute top-2 left-2 w-3 h-4 bg-white/45 rounded-full rotate-[-25deg]" />
                {/* Tiny Autism puzzle stamp watermark on some balloons */}
                {b.id % 2 === 0 && (
                  <Sparkles className="w-3.5 h-3.5 text-white/60 animate-pulse" />
                )}
              </div>
              {/* Balloon knot */}
              <div
                style={{ borderTopColor: b.color }}
                className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px]"
              />
              {/* Balloon String */}
              <div className="w-[1.5px] h-14 bg-white/60 shadow-xs" />
            </div>
          ))}
        </div>
      )}

      {/* 2. FIREWORKS & CONFETTI SPARKS DISPLAY */}
      {gamesConfig.fireworksEnabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
          {fireworks.map((fw) => (
            <div
              key={fw.id}
              style={{
                top: `${fw.topPct}%`,
                left: `${fw.leftPct}%`,
                animationDelay: `${fw.delayMs}ms`,
              }}
              className="absolute w-2 h-2 animate-firework-burst"
            >
              {/* 12 Radiant Spark Rays */}
              {Array.from({ length: 12 }).map((_, rayIdx) => {
                const angle = (rayIdx * 360) / 12;
                return (
                  <div
                    key={rayIdx}
                    style={{
                      transform: `rotate(${angle}deg) translateY(-40px)`,
                      backgroundColor: fw.color,
                    }}
                    className="absolute w-1.5 h-4 rounded-full shadow-md animate-ping"
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* 3. GRAND CONGRATULATIONS CARD (Centered Modal) */}
      <div className="relative z-30 max-w-lg w-full bg-gradient-to-b from-white via-slate-50 to-[#f0f7fb] rounded-3xl p-6 sm:p-8 border-2 border-[#2eb9df]/50 shadow-[0_25px_60px_rgba(12,106,167,0.35)] text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Top Trophy & Crown Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0c6aa7] to-[#2eb9df] text-white flex items-center justify-center shadow-xl border-4 border-white transform hover:scale-105 transition-transform">
          <Trophy className="w-10 h-10 text-amber-300" />
          <div className="absolute -top-2 -right-2 p-1.5 bg-amber-400 text-[#061e31] rounded-full shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Victory Heading */}
        <div className="space-y-1.5">
          <span className="text-xs font-black text-[#0c6aa7] bg-[#e1eff8] px-3.5 py-1 rounded-full inline-block">
            {gameTitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0a4d7a] tracking-tight">
            🎉 مبارك! حققت الفوز بجدارة!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            أحسنت إتمام التحدي التوعوي بنجاح فائق وتوقف الوقت تقديراً لإنجازك!
          </p>
        </div>

        {/* Victory Badges Row */}
        <div className="flex items-center justify-center gap-1.5 text-amber-500 py-1">
          <Award className="w-7 h-7 fill-amber-400 text-amber-500 animate-bounce" />
          <Award className="w-8 h-8 fill-amber-400 text-amber-500 animate-bounce delay-100" />
          <Award className="w-7 h-7 fill-amber-400 text-amber-500 animate-bounce delay-200" />
        </div>

        {/* Stats Grid: Time, Moves, Score */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-xs">
          {timeSeconds !== undefined && (
            <div className="p-2 rounded-xl bg-slate-50">
              <span className="text-slate-400 block text-[11px] font-bold">الوقت المستغرق</span>
              <span className="text-base font-black text-[#0c6aa7] font-mono">
                {formatTime(timeSeconds)}
              </span>
            </div>
          )}

          {moves !== undefined && (
            <div className="p-2 rounded-xl bg-slate-50">
              <span className="text-slate-400 block text-[11px] font-bold">عدد الحركات</span>
              <span className="text-base font-black text-[#0a4d7a] font-mono">{moves}</span>
            </div>
          )}

          {effectiveScore !== undefined && (
            <div className="p-2 rounded-xl bg-slate-50 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[11px] font-bold">النتيجة والإنجاز</span>
              <span className="text-base font-black text-emerald-600 font-mono">
                {typeof effectiveScore === 'number' ? `+${effectiveScore} ⭐` : effectiveScore}
              </span>
            </div>
          )}
        </div>

        {/* Educational Takeaway Quote */}
        {effectiveLesson && (
          <div className="p-4 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 rounded-2xl border border-cyan-200 text-right space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0c6aa7]">
              <CheckCircle2 className="w-4 h-4 text-[#2eb9df]" />
              <span>الرسالة التربوية المستفادة:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#0a4d7a] leading-relaxed font-medium">
              «{effectiveLesson}»
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onReplay}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-[#0c6aa7] to-[#2eb9df] hover:from-[#0a4d7a] hover:to-[#25a0c3] text-white transition-all shadow-md hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة اللعب والتحدي</span>
          </button>

          <button
            onClick={handleExit}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>العودة لمدينة الألعاب</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
