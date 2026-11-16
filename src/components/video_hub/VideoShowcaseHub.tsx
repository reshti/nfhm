import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Film,
  Tv,
  Radio,
  Sparkles,
  Puzzle,
  ChevronLeft,
  Heart,
  Share2,
  ListVideo,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Smile,
  Compass,
} from 'lucide-react';
import {
  VideoTheme,
  VideoItem,
  loadVideoHubConfig,
  saveVideoHubConfig,
} from '../../data/videoHubData';
import { NafhamView } from '../Navbar';

interface VideoShowcaseHubProps {
  onNavigateHome: (targetView?: NafhamView) => void;
  onOpenGames?: () => void;
}

// Autism Awareness Puzzle Piece SVG Component
const AutismPuzzlePiece: React.FC<{
  color: string;
  className?: string;
  style?: React.CSSProperties;
  tip?: string;
}> = ({ color, className = '', style = {}, tip }) => {
  const [isPopped, setIsPopped] = useState(false);

  return (
    <div
      style={style}
      onClick={() => {
        setIsPopped(true);
        setTimeout(() => setIsPopped(false), 800);
      }}
      title={tip || 'قطعة من بازل طيف التوحد: كل فرد يمثل جزءاً فريداً من لوحة المجتمع الدامج'}
      className={`absolute cursor-pointer transition-transform duration-300 select-none group ${
        isPopped ? 'scale-125 rotate-12' : 'hover:scale-115'
      } ${className}`}
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 100 100"
        fill={color}
        className="drop-shadow-md filter group-hover:brightness-110"
      >
        <path d="M30,10 L45,10 C45,18 55,18 55,10 L70,10 C75,10 80,15 80,20 L80,35 C88,35 88,45 80,45 L80,60 C80,65 75,70 70,70 L55,70 C55,62 45,62 45,70 L30,70 C25,70 20,65 20,60 L20,45 C12,45 12,35 20,35 L20,20 C20,15 25,10 30,10 Z" />
      </svg>
      {tip && (
        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 rounded-lg bg-black/85 text-white text-[10px] whitespace-nowrap shadow-xl pointer-events-none z-50 font-bold border border-white/20">
          {tip}
        </div>
      )}
    </div>
  );
};

export const VideoShowcaseHub: React.FC<VideoShowcaseHubProps> = ({
  onNavigateHome,
  onOpenGames,
}) => {
  const config = loadVideoHubConfig();
  const [activeTheme, setActiveTheme] = useState<VideoTheme>(config.defaultTheme || 'child_puzzle');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(
    config.videos.find((v) => v.id === config.activeVideoId) || config.videos[0]
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(399);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(true);
  const [liveReactions, setLiveReactions] = useState<{ id: number; icon: string; left: number }[]>([]);
  const [liveViewerCount, setLiveViewerCount] = useState(1482);
  const [scanlinesActive, setScanlinesActive] = useState(false);

  // Autoplay muted when video loads
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [selectedVideo]);

  // Switch video handler
  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setHasStarted(true);
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Start watching with unmuted sound on gesture
  const handleStartWatching = (startMuted: boolean = false) => {
    if (!videoRef.current) return;
    setHasStarted(true);

    if (startMuted) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume > 0 ? volume : 1;
    }

    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Playback notice:', err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      handleStartWatching(false);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    videoRef.current.muted = next;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Add a live reaction (heart, clap, star) in Live Stream theme
  const addReaction = (symbol: string) => {
    const id = Date.now() + Math.random();
    const left = 20 + Math.random() * 60;
    setLiveReactions((prev) => [...prev, { id, icon: symbol, left }]);
    setTimeout(() => {
      setLiveReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  // Random fluctuation for live viewers
  useEffect(() => {
    if (activeTheme !== 'live_stream') return;
    const interval = setInterval(() => {
      setLiveViewerCount((prev) => Math.floor(prev + (Math.random() * 6 - 3)));
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTheme]);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen text-slate-100 font-['Tajawal'] selection:bg-[#2eb9df]/30 selection:text-white transition-colors duration-500 overflow-x-hidden"
      style={{
        backgroundColor:
          activeTheme === 'child_puzzle'
            ? '#082b47'
            : activeTheme === 'theater'
            ? '#21080d'
            : activeTheme === 'retro_tv'
            ? '#1b1b1b'
            : activeTheme === 'live_stream'
            ? '#091f33'
            : '#05131f', // cinematic
      }}
    >
      {/* 1. TOP HEADER & THEME SELECTOR BAR */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
              alt="جامعة الإمام عبدالرحمن بن فيصل"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div>
              <span className="text-[10px] font-bold text-[#2eb9df] block">
                جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب
              </span>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>استوديو ومنطقة عروض الفيديو المتنوعة</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h1>
            </div>
          </div>

          {/* Theme Selector Pills */}
          <div className="flex items-center gap-1 p-1 bg-black/50 rounded-2xl border border-white/15 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTheme('child_puzzle')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTheme === 'child_puzzle'
                  ? 'bg-gradient-to-r from-amber-400 to-[#2eb9df] text-[#061e31] font-black shadow-md scale-102'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>العرض الطفولي وبازل التوحد 🧩</span>
            </button>

            <button
              onClick={() => setActiveTheme('cinematic')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTheme === 'cinematic'
                  ? 'bg-[#0c6aa7] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>العرض السينمائي</span>
            </button>

            <button
              onClick={() => setActiveTheme('theater')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTheme === 'theater'
                  ? 'bg-rose-700 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>العرض المسرحي</span>
            </button>

            <button
              onClick={() => setActiveTheme('retro_tv')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTheme === 'retro_tv'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>التلفزيون الكلاسيكي</span>
            </button>

            <button
              onClick={() => setActiveTheme('live_stream')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTheme === 'live_stream'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>البث الحي المباشر</span>
            </button>
          </div>

          {/* Quick Exit */}
          <button
            onClick={() => onNavigateHome('home')}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1"
          >
            <span>المنصة الرئيسية</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN STAGE CONTAINER WITH THEMED DECORATIONS */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 relative">
        {/* ======================================================== */}
        {/* THEME 1: CHILD & AUTISM PUZZLE THEME (SCATTERED PUZZLES) */}
        {/* ======================================================== */}
        {activeTheme === 'child_puzzle' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
            {/* Scattered Colorful Autism Puzzle Pieces */}
            <AutismPuzzlePiece
              color="#2eb9df" // Cyan
              style={{ top: '8%', left: '4%' }}
              className="animate-puzzle-float pointer-events-auto"
              tip="التوحد اختلاف عصبي نمائي وليس مرضاً"
            />
            <AutismPuzzlePiece
              color="#f59e0b" // Yellow
              style={{ top: '15%', right: '5%', animationDelay: '1.2s' }}
              className="animate-puzzle-float pointer-events-auto"
              tip="لكل فرد طيفه وبصمته ونقاط قوته الفريدة"
            />
            <AutismPuzzlePiece
              color="#ef4444" // Red
              style={{ top: '48%', left: '2%', animationDelay: '2.4s' }}
              className="animate-puzzle-float pointer-events-auto"
              tip="الدمج الإنساني يبدأ بالفهم والاحتواء"
            />
            <AutismPuzzlePiece
              color="#10b981" // Emerald
              style={{ top: '65%', right: '3%', animationDelay: '0.8s' }}
              className="animate-puzzle-float pointer-events-auto"
              tip="البيئة الهادئة الصديقة للحواس تصنع الأمان"
            />
            <AutismPuzzlePiece
              color="#8b5cf6" // Purple
              style={{ bottom: '12%', left: '8%', animationDelay: '1.8s' }}
              className="animate-puzzle-float pointer-events-auto"
              tip="التواصل لا ينحصر في الكلمات المنطوقة"
            />
            <AutismPuzzlePiece
              color="#3b82f6" // Cobalt Blue
              style={{ bottom: '8%', right: '12%', animationDelay: '3s' }}
              className="animate-puzzle-float pointer-events-auto"
              tip="اضغط على أي قطعة بازل لاكتشاف رسالتها!"
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* THEME 2: THEATER CURTAINS DECORATION                    */}
        {/* ======================================================== */}
        {activeTheme === 'theater' && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 -z-0 flex justify-between overflow-hidden opacity-85">
            {/* Left Velvet Curtain */}
            <div className="w-24 sm:w-40 h-full bg-gradient-to-r from-rose-950 via-rose-900 to-transparent border-r-4 border-amber-400/40 transform -skew-x-3 shadow-2xl" />
            {/* Center Stage Light Cone */}
            <div className="w-72 sm:w-96 h-full bg-gradient-to-b from-amber-200/15 via-amber-100/5 to-transparent blur-md" />
            {/* Right Velvet Curtain */}
            <div className="w-24 sm:w-40 h-full bg-gradient-to-l from-rose-950 via-rose-900 to-transparent border-l-4 border-amber-400/40 transform skew-x-3 shadow-2xl" />
          </div>
        )}

        {/* Video Title Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/15 shadow-sm">
            {activeTheme === 'child_puzzle' ? (
              <span className="text-amber-300">🧩 نمط العرض الصديق للطفل وطيف التوحد</span>
            ) : activeTheme === 'theater' ? (
              <span className="text-rose-300">🎭 منصة العرض المسرحي الثقافي</span>
            ) : activeTheme === 'retro_tv' ? (
              <span className="text-amber-400">📺 شاشة التلفزيون الكلاسيكي المعتمدة</span>
            ) : activeTheme === 'live_stream' ? (
              <span className="text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>بث حي ومباشر · {liveViewerCount} مشاهد الآن</span>
              </span>
            ) : (
              <span className="text-[#2eb9df]">🎬 استوديو العرض السينمائي الفاخر</span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            {selectedVideo.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-medium">
            {selectedVideo.subtitle}
          </p>
        </div>

        {/* ======================================================== */}
        {/* 3. DYNAMIC VIDEO PLAYER STAGE WRAPPER                    */}
        {/* ======================================================== */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* THE RETRO TV FRAME WRAPPER IF ACTIVE */}
          <div
            ref={containerRef}
            className={`relative mx-auto transition-all duration-300 ${
              activeTheme === 'retro_tv'
                ? 'p-6 sm:p-8 bg-gradient-to-b from-[#402715] via-[#2c1a0e] to-[#1c0f07] rounded-[42px] border-8 border-[#52331c] shadow-[0_30px_70px_rgba(0,0,0,0.8)]'
                : activeTheme === 'theater'
                ? 'p-4 sm:p-6 bg-gradient-to-b from-[#3b0b13] via-[#1a0509] to-black rounded-3xl border-4 border-amber-500/40 shadow-[0_25px_60px_rgba(180,20,40,0.35)]'
                : activeTheme === 'child_puzzle'
                ? 'p-3 sm:p-4 bg-gradient-to-tr from-[#0c6aa7]/60 via-[#2eb9df]/40 to-amber-400/40 rounded-[36px] border-4 border-white/30 shadow-[0_25px_65px_rgba(46,185,223,0.35)]'
                : 'rounded-3xl bg-black border border-white/20 shadow-[0_25px_60px_rgba(12,106,167,0.4)]'
            }`}
          >
            {/* Retro TV Antenna & Knobs */}
            {activeTheme === 'retro_tv' && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-12 pointer-events-none">
                <div className="w-1 h-12 bg-slate-400 rotate-[-25deg] origin-bottom shadow-md" />
                <div className="w-1 h-12 bg-slate-400 rotate-[25deg] origin-bottom shadow-md" />
              </div>
            )}

            {/* Live Stream Reaction Floating Icons */}
            {activeTheme === 'live_stream' && (
              <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                {liveReactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.left}%` }}
                    className="absolute bottom-12 text-2xl animate-balloon-rise"
                  >
                    {r.icon}
                  </div>
                ))}
              </div>
            )}

            {/* THE VIDEO SCREEN CONTAINER */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center group">
              <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                playsInline
                preload="auto"
                poster={selectedVideo.poster}
                onTimeUpdate={() => {
                  if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) setDuration(videoRef.current.duration || 399);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlayPause}
              >
                <source src={selectedVideo.url} type="video/mp4" />
                <source src="/assets/aistudio/nafham_5b6451e6.mp4?v=nafham_2026_v2" type="video/mp4" />
                <source src="/assets/aistudio/nafham_documentary.mp4?v=nafham_2026_v2" type="video/mp4" />
                <source src="/api/video/documentary?v=nafham_2026_v2" type="video/mp4" />
              </video>

              {/* Scanlines Effect for Retro TV */}
              {activeTheme === 'retro_tv' && scanlinesActive && (
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-70 z-20" />
              )}

              {/* FLOATING PROMINENT UNMUTE BUTTON (تفعيل التعليق الصوتي) */}
              {isMuted && (
                <div className="absolute top-4 left-4 z-30 pointer-events-auto">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = false;
                        setIsMuted(false);
                        videoRef.current.volume = 1;
                      }
                    }}
                    className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#0c6aa7] to-[#2eb9df] hover:from-[#0a4d7a] hover:to-[#209ec1] text-white text-xs font-black shadow-xl border border-white/30 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all animate-pulse"
                  >
                    <Volume2 className="w-4 h-4 text-amber-300" />
                    <span>تفعيل الصوت (التعليق الصوتي) 🔊</span>
                  </button>
                </div>
              )}

              {/* CENTER PLAY/PAUSE OVERLAY BUTTON */}
              {hasStarted && !isPlaying && (
                <button
                  onClick={togglePlayPause}
                  className="absolute z-25 p-5 rounded-full bg-[#0c6aa7]/90 hover:bg-[#0c6aa7] text-white shadow-2xl border-2 border-white/40 cursor-pointer transform hover:scale-110 active:scale-95 transition-all"
                >
                  <Play className="w-8 h-8 fill-white translate-x-[-2px]" />
                </button>
              )}

              {/* BOTTOM CONTROLS BAR */}
              <div className="absolute bottom-0 inset-x-0 z-25 p-3.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Timeline Scrubber */}
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1.5 accent-[#2eb9df] cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlayPause}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="text-[11px] font-mono font-bold text-slate-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTheme === 'retro_tv' && (
                      <button
                        onClick={() => setScanlinesActive(!scanlinesActive)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          scanlinesActive ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        فلتر CRT
                      </button>
                    )}

                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Reaction Buttons (When Live Stream Theme) */}
            {activeTheme === 'live_stream' && (
              <div className="pt-3 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-300 font-bold">تفاعل مع البث المباشر:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addReaction('❤️')}
                    className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 cursor-pointer transform hover:scale-110 active:scale-95 transition-all"
                  >
                    ❤️ محبة
                  </button>
                  <button
                    onClick={() => addReaction('👏')}
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 cursor-pointer transform hover:scale-110 active:scale-95 transition-all"
                  >
                    👏 تصفيق
                  </button>
                  <button
                    onClick={() => addReaction('🌟')}
                    className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 cursor-pointer transform hover:scale-110 active:scale-95 transition-all"
                  >
                    🌟 تميز
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. PLAYLIST & AVAILABLE VIDEOS GRID */}
        <section className="space-y-4 relative z-10 max-w-5xl mx-auto pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListVideo className="w-5 h-5 text-[#2eb9df]" />
              <h3 className="text-sm sm:text-base font-black text-white">
                قائمة الفيديوهات المتاحة في الاستوديو:
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              اختر أي فيديو لتغيير العرض فوراً
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.videos.map((vid) => {
              const isSelected = selectedVideo.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#0c6aa7] to-[#0a4d7a] border-[#2eb9df] shadow-lg ring-2 ring-[#2eb9df]/50 scale-102'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <img
                      src={vid.poster}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 text-[10px] font-mono text-white font-bold">
                      {vid.durationText}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#2eb9df] text-[10px] font-bold text-[#061e31]">
                        يعمل حالياً
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#2eb9df] block">
                      {vid.category}
                    </span>
                    <h4 className="text-xs font-black text-white line-clamp-1">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {vid.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. QUICK LINK TO AUTISM PUZZLE GAME */}
        {onOpenGames && (
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0c6aa7]/40 via-amber-500/20 to-[#2eb9df]/30 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-[#061e31] flex items-center justify-center shrink-0 shadow-md">
                <Puzzle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 text-right">
                <h4 className="text-sm sm:text-base font-black text-white">
                  جرّب لعبة بازل طيف التوحد التفاعلية!
                </h4>
                <p className="text-xs text-slate-300">
                  رتّب قطع البازل الملونة، أوقف الوقت، واحتفل ببالونات الفوز والألعاب النارية.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenGames}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#2eb9df] hover:from-amber-500 hover:to-[#25a0c3] text-[#061e31] text-xs font-black transition-all shadow-md cursor-pointer whitespace-nowrap hover:scale-105"
            >
              العب البازل الآن 🧩
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
