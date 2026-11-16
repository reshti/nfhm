import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  ChevronLeft,
  Sparkles,
  Heart,
  Shield,
  Layers,
  Brain,
  Users,
  Compass,
  HeartHandshake,
  BookOpen,
  Gamepad2,
  Award,
  CheckCircle2,
  Clock,
  Film,
  ListOrdered,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Tv,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import {
  NAFHAM_DOCUMENTARY_INFO,
  NAFHAM_VIDEO_CHAPTERS,
  CINEMATIC_PORTALS,
  VideoChapter,
} from '../../data/cinematicData';
import { NafhamView } from '../Navbar';
import { loadVideoHubConfig } from '../../data/videoHubData';

interface CinematicLandingProps {
  onEnterPlatform: (targetView?: NafhamView) => void;
  initialCalmMode?: boolean;
}

type SizePreset = 'compact' | 'standard' | 'expanded';
type PlayerEngine = 'cinematic' | 'native';

export const CinematicLanding: React.FC<CinematicLandingProps> = ({
  onEnterPlatform,
}) => {
  // Video element and container references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const hubConfig = loadVideoHubConfig();
  const configuredActiveVideo = hubConfig.videos.find((v) => v.id === hubConfig.activeVideoId) || hubConfig.videos[0];

  // Available video stream sources with automatic fallback and cache-busting
  const VIDEO_SOURCES = [
    { label: 'الملف المعتمد الجديد', src: '/assets/aistudio/nafham_5b6451e6.mp4?v=nafham_2026_v2' },
    { label: 'الملف المعتمد (Documentary)', src: '/assets/aistudio/nafham_documentary.mp4?v=nafham_2026_v2' },
    { label: 'بث الخادم المباشر', src: '/api/video/documentary?v=nafham_2026_v2' },
    { label: 'ملف الفيديو الاحتياطي', src: '/assets/aistudio/nafham_video.mp4?v=nafham_2026_v2' },
    { label: 'بث تدفقي بديل', src: '/api/video/stream?v=nafham_2026_v2' },
  ];

  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const currentVideoUrl = VIDEO_SOURCES[currentSourceIndex].src;
  const [errorRetries, setErrorRetries] = useState(0);

  // Player engine: Cinematic custom controls vs Native browser controls
  const [playerEngine, setPlayerEngine] = useState<PlayerEngine>('cinematic');

  // Video playback states - default to muted autoplay for 100% browser compatibility
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(NAFHAM_DOCUMENTARY_INFO.totalDurationSeconds);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'chapters' | 'portals'>('summary');
  const [mutedAutoplayNotice, setMutedAutoplayNotice] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  // Secret 5-clicks trigger on "مجرد أثر بصمة" to open admincp directly
  const [fingerprintClicks, setFingerprintClicks] = useState(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleFingerprintClick = () => {
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }
    const nextCount = fingerprintClicks + 1;
    if (nextCount >= 5) {
      setFingerprintClicks(0);
      window.history.pushState({}, '', '/admincp');
      onEnterPlatform('admin');
    } else {
      setFingerprintClicks(nextCount);
      clickTimeoutRef.current = window.setTimeout(() => {
        setFingerprintClicks(0);
      }, 3000);
    }
  };

  // Autoplay video with audio when permitted, with graceful fallback to muted
  useEffect(() => {
    if (videoRef.current) {
      // Attempt unmuted audio first
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = 1;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStartedPlaying(true);
            setBuffering(false);
            setMutedAutoplayNotice(false);
          })
          .catch((err) => {
            console.log('Unmuted autoplay prevented by browser policy, falling back to muted:', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  setHasStartedPlaying(true);
                  setBuffering(false);
                  setMutedAutoplayNotice(true);
                })
                .catch(() => {});
            }
          });
      }
    }
  }, []);

  // Video sizing & zoom controls
  const [sizePreset, setSizePreset] = useState<SizePreset>('standard');
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  // Controls auto-hide timer
  const controlsTimeoutRef = useRef<number | null>(null);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine current active chapter based on video current time
  const currentChapter: VideoChapter =
    NAFHAM_VIDEO_CHAPTERS.find(
      (chap) => currentTime >= chap.startTime && currentTime < chap.endTime
    ) || NAFHAM_VIDEO_CHAPTERS[0];

  // User gesture handler: "ابدأ المشاهدة"
  // Ensures video and audio start simultaneously without browser policy blocking
  const handleStartWatch = (startMuted: boolean = false) => {
    if (!videoRef.current) return;
    setPlaybackError(null);
    setHasStartedPlaying(true);
    setIsEnded(false);
    setBuffering(true);

    if (startMuted) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume > 0 ? volume : 1;
      setVolume(volume > 0 ? volume : 1);
    }

    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setBuffering(false);
          setMutedAutoplayNotice(false);
        })
        .catch((err) => {
          console.warn('Unmuted autoplay prevented by browser policy, attempting muted fallback:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                setBuffering(false);
                setMutedAutoplayNotice(true);
              })
              .catch((err2) => {
                console.warn('Video play attempt notice:', err2);
                setBuffering(false);
                setPlaybackError('تعذر بدء تشغيل الفيديو. يرجى الضغط على زر إعادة المحاولة.');
              });
          }
        });
    }
  };

  // Safe error handler with automatic fallback across available video sources
  const handleVideoError = () => {
    if (!hasStartedPlaying) return;
    const mediaError = videoRef.current?.error;
    if (mediaError && mediaError.code === 1) return; // MEDIA_ERR_ABORTED

    // Automatic failover to next source before alarming user
    if (errorRetries < VIDEO_SOURCES.length - 1) {
      setErrorRetries((prev) => prev + 1);
      const nextIdx = (currentSourceIndex + 1) % VIDEO_SOURCES.length;
      setCurrentSourceIndex(nextIdx);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = VIDEO_SOURCES[nextIdx].src;
          videoRef.current.load();
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setBuffering(false);
              setPlaybackError(null);
            })
            .catch(() => {
              // Try muted failover
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                    setBuffering(false);
                    setPlaybackError(null);
                    setMutedAutoplayNotice(true);
                  })
                  .catch(() => {});
              }
            });
        }
      }, 150);
      return;
    }

    setBuffering(false);
    setPlaybackError('تعذر بدء تشغيل الفيديو مؤقتاً.');
  };

  // Clean manual retry on user action
  const handleRetryPlayback = () => {
    setPlaybackError(null);
    setBuffering(true);
    setErrorRetries(0);
    const nextIdx = (currentSourceIndex + 1) % VIDEO_SOURCES.length;
    setCurrentSourceIndex(nextIdx);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setBuffering(false);
            setPlaybackError(null);
          })
          .catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  setBuffering(false);
                  setPlaybackError(null);
                  setMutedAutoplayNotice(true);
                })
                .catch(() => {
                  setBuffering(false);
                  setPlaybackError('تعذر بدء تشغيل الفيديو مؤقتاً.');
                });
            }
          });
      }
    }, 150);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      // User gesture: enable audio when playing
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume > 0 ? volume : 1;
      setVolume(volume > 0 ? volume : 1);

      if (!hasStartedPlaying) {
        handleStartWatch(false);
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setMutedAutoplayNotice(false);
          })
          .catch((err) => {
            console.warn('Play attempt failed, resuming muted:', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsEnded(false);
    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  // Seek handler
  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(newTime, duration));
    videoRef.current.currentTime = clamped;
    setCurrentTime(clamped);
    setIsEnded(false);
  };

  // Jump to specific chapter
  const handleJumpToChapter = (chapter: VideoChapter) => {
    setHasStartedPlaying(true);
    handleSeek(chapter.startTime);
    if (videoRef.current && videoRef.current.paused) {
      handleStartWatch(isMuted);
    }
  };

  // Skip -10s or +10s
  const handleSkipSeconds = (delta: number) => {
    if (!videoRef.current) return;
    handleSeek(videoRef.current.currentTime + delta);
  };

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVol;
    setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    setMutedAutoplayNotice(false);
    if (!nextMuted && volume === 0) {
      handleVolumeChange(0.7);
    }
  };

  // Speed change
  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  // Fullscreen toggle
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

  // Zoom In / Out Handlers
  const handleZoomIn = () => {
    setZoomPercent((prev) => Math.min(prev + 10, 130));
  };

  const handleZoomOut = () => {
    setZoomPercent((prev) => Math.max(prev - 10, 70));
  };

  const handleResetZoom = () => {
    setZoomPercent(100);
    setSizePreset('standard');
  };

  const handleSelectPreset = (preset: SizePreset) => {
    setSizePreset(preset);
    if (preset === 'compact') setZoomPercent(80);
    else if (preset === 'standard') setZoomPercent(100);
    else if (preset === 'expanded') setZoomPercent(120);
  };

  // Cycle stream source on error or manual request
  const handleCycleStreamSource = () => {
    setPlaybackError(null);
    const nextIdx = (currentSourceIndex + 1) % VIDEO_SOURCES.length;
    setCurrentSourceIndex(nextIdx);
    const savedTime = currentTime;
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.currentTime = savedTime;
        if (hasStartedPlaying) {
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    }, 150);
  };

  // Fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  // Controls auto-hide on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleSkipToPlatform = (targetView?: NafhamView) => {
    try {
      localStorage.setItem('nafham_seen_cinematic', 'true');
    } catch {}
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onEnterPlatform(targetView || 'home');
  };

  const calculateMaxWidthPx = () => {
    if (isFullscreen) return '100%';
    // Increased base width to 880px: at 16:9, height is ~495px (taller and grander as requested)
    const base = 880;
    return `${Math.round(base * (zoomPercent / 100))}px`;
  };

  // Chapter icon mapper
  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Brain':
        return <Brain className="w-4 h-4" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4" />;
      case 'Shield':
        return <Shield className="w-4 h-4" />;
      case 'Users':
        return <Users className="w-4 h-4" />;
      case 'Award':
        return <Award className="w-4 h-4" />;
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      default:
        return <Film className="w-4 h-4" />;
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#061e31] via-[#093554] to-[#041523] text-white font-['Tajawal'] selection:bg-[#2eb9df]/30 selection:text-white"
    >
      {/* 1. TOP ACADEMIC & SUPERVISION BRANDING BAR */}
      <header className="border-b border-white/10 bg-[#061e31]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
              alt="جامعة الإمام عبدالرحمن بن فيصل"
              className="h-9 w-auto object-contain brightness-0 invert drop-shadow-sm"
            />
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div>
              <span className="text-[11px] font-bold text-[#2eb9df] block">
                جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب
              </span>
              <h1 className="text-sm sm:text-base font-black tracking-wide text-white">
                «منصة نفهم» التوعوية · العرض السينمائي التفاعلي
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mode Switcher: Cinematic vs Native */}
            <button
              onClick={() =>
                setPlayerEngine((prev) => (prev === 'cinematic' ? 'native' : 'cinematic'))
              }
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#2eb9df] border border-white/15 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="التبديل بين المشغل السينمائي والمشغل القياسي"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>
                {playerEngine === 'cinematic' ? 'المشغل السينمائي' : 'المشغل القياسي'}
              </span>
            </button>

            {/* Direct stream link */}
            <a
              href="/api/video/documentary"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer hidden md:flex items-center gap-1"
              title="فتح الفيديو في علامة تبويب جديدة"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="text-[11px]">رابط مباشر</span>
            </a>

            {/* Skip to Platform button */}
            <button
              onClick={() => handleSkipToPlatform('home')}
              className="px-4 py-2 rounded-xl bg-[#2eb9df] hover:bg-[#25a0c3] text-[#061e31] text-xs font-black transition-all cursor-pointer shadow-md hover:scale-102 flex items-center gap-1.5"
            >
              <span>دخول المنصة الرئيسية</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN DOCUMENTARY STAGE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* VIDEO TITLE & HERO INTRO */}
        <section className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#2eb9df] text-xs font-bold border border-white/15 shadow-sm">
            <Film className="w-3.5 h-3.5" />
            <span>الفيلم الوثائقي التوعوي الرسمي · مدة العرض: 6:39 دقيقة</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide">
            {NAFHAM_DOCUMENTARY_INFO.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            {NAFHAM_DOCUMENTARY_INFO.subtitle}
          </p>
        </section>

        {/* 3. CENTERED DYNAMIC VIDEO PLAYER CARD */}
        <div className="space-y-3">
          {/* Top Video Toolbar: Zoom Presets & Stream Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs px-2 max-w-5xl mx-auto text-slate-300">
            {/* Sizing & Zoom */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
              <span className="text-[11px] font-bold text-slate-400">حجم العرض:</span>
              {(['compact', 'standard', 'expanded'] as SizePreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    sizePreset === preset
                      ? 'bg-[#0c6aa7] text-white shadow-xs'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {preset === 'compact' ? 'مدمج (80%)' : preset === 'standard' ? 'قياسي' : 'موسع (120%)'}
                </button>
              ))}

              <div className="h-3.5 w-px bg-white/20 mx-1" />

              <button
                onClick={handleZoomIn}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="تكبير المشغل"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="تصغير المشغل"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="text-[10px] text-[#2eb9df] hover:underline pr-1 font-bold"
              >
                {zoomPercent}%
              </button>
            </div>

            {/* Stream source selector and Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCycleStreamSource}
                className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-[#2eb9df] flex items-center gap-1.5 cursor-pointer transition-colors"
                title={`المسار الحالي: ${VIDEO_SOURCES[currentSourceIndex].label}`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>تبديل المسار ({VIDEO_SOURCES[currentSourceIndex].label})</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                title="ملء الشاشة"
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">ملء الشاشة</span>
              </button>
            </div>
          </div>

          {/* THE REAL VIDEO STAGE */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            style={{
              maxWidth: calculateMaxWidthPx(),
              maxHeight: isFullscreen ? '100vh' : 'calc(100vh - 160px)',
            }}
            className={`mx-auto relative rounded-3xl overflow-hidden bg-black shadow-[0_25px_60px_rgba(12,106,167,0.45)] border border-white/20 group aspect-video w-full max-h-[60vh] sm:max-h-[66vh] flex items-center justify-center transition-all duration-300 ease-out ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none max-w-full !max-h-screen h-screen' : ''
            }`}
          >
            {/* HTML5 VIDEO ELEMENT - Responsive, smooth streaming with multi-source fallback */}
            <video
              ref={videoRef}
              autoPlay
              muted={isMuted}
              playsInline
              preload="auto"
              poster="/assets/aistudio/nafham_video_poster.jpg"
              controls={playerEngine === 'native'}
              onWaiting={() => setBuffering(true)}
              onPlaying={() => {
                setBuffering(false);
                setIsPlaying(true);
                setHasStartedPlaying(true);
                setPlaybackError(null);
              }}
              onCanPlay={() => setBuffering(false)}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration || NAFHAM_DOCUMENTARY_INFO.totalDurationSeconds);
                }
              }}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                setIsEnded(true);
                setActiveTab('portals');
              }}
              onError={handleVideoError}
              onClick={playerEngine === 'cinematic' ? togglePlayPause : undefined}
              className="w-full h-full object-contain cursor-pointer bg-black"
            >
              <source src="/assets/aistudio/nafham_5b6451e6.mp4?v=nafham_2026_v2" type="video/mp4" />
              <source src="/assets/aistudio/nafham_documentary.mp4?v=nafham_2026_v2" type="video/mp4" />
              <source src="/api/video/documentary?v=nafham_2026_v2" type="video/mp4" />
              <source src="/assets/aistudio/nafham_video.mp4?v=nafham_2026_v2" type="video/mp4" />
              <source src="/api/video/stream?v=nafham_2026_v2" type="video/mp4" />
            </video>

            {/* Buffering Indicator */}
            {buffering && isPlaying && !playbackError && (
              <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-xs">
                <div className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-md text-[#2eb9df] border border-white/20 flex items-center gap-2.5 text-xs font-bold shadow-2xl">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#2eb9df]" />
                  <span>جاري تحميل بيانات البث...</span>
                </div>
              </div>
            )}

            {/* Error Notification with Poster Background & Immediate Recovery Actions */}
            {playbackError && (
              <div className="absolute inset-0 z-35 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <img
                  src="/assets/aistudio/nafham_video_poster.jpg"
                  alt="بوستر الفيلم التعريفي"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-25 blur-xs"
                />
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="relative z-10 space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {playbackError}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md">
                    يمكنك إعادة المحاولة أو تجربة مسار بث بديل أو تشغيل الفيديو عبر المشغل الأصلي للمتصفح.
                  </p>
                </div>
                <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRetryPlayback}
                    className="px-5 py-2.5 rounded-xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white text-xs font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>إعادة محاولة التشغيل</span>
                  </button>
                  <button
                    onClick={() => {
                      setPlayerEngine('native');
                      setPlaybackError(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#2eb9df]/20 hover:bg-[#2eb9df]/30 text-[#2eb9df] text-xs font-bold border border-[#2eb9df]/40 transition-all cursor-pointer"
                  >
                    <span>المشغل المباشر (Native)</span>
                  </button>
                  <a
                    href="/assets/aistudio/nafham_documentary.mp4"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all"
                  >
                    فتح ملف MP4 مباشرة
                  </a>
                </div>
              </div>
            )}

            {/* FLOATING PROMINENT UNMUTE BUTTON (تفعيل التعليق الصوتي) */}
            {isMuted && !playbackError && (
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-30 pointer-events-auto">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = false;
                      setIsMuted(false);
                      videoRef.current.volume = 1;
                      setVolume(1);
                      setMutedAutoplayNotice(false);
                    }
                  }}
                  className="px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#0c6aa7] via-[#1ba3cb] to-[#2eb9df] hover:from-[#0a4d7a] hover:to-[#209ec1] text-white text-xs sm:text-sm font-black shadow-[0_10px_30px_rgba(46,185,223,0.5)] border border-white/40 flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 transition-all animate-pulse"
                  title="انقر لتشغيل التعليق الصوتي للفيلم"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>انقر لتفعيل الصوت (التعليق الصوتي) 🔊</span>
                </button>
              </div>
            )}

            {/* BIG CENTER PLAY / REPLAY BUTTON WHEN PAUSED (CINEMATIC MODE) */}
            {hasStartedPlaying && !isPlaying && playerEngine === 'cinematic' && !playbackError && (
              <button
                onClick={isEnded ? handleReplay : togglePlayPause}
                className="absolute z-20 p-5 sm:p-6 rounded-full bg-[#0c6aa7]/90 hover:bg-[#0c6aa7] text-white shadow-2xl backdrop-blur-md border-2 border-white/40 cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-300"
                title={isEnded ? 'إعادة تشغيل الفيلم من البداية' : 'استئناف تشغيل الفيلم'}
              >
                {isEnded ? (
                  <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                ) : (
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-[-2px]" />
                )}
              </button>
            )}

            {/* TOP OVERLAY: ACTIVE CHAPTER INDICATOR (CINEMATIC MODE) */}
            {playerEngine === 'cinematic' && hasStartedPlaying && (
              <div
                className={`absolute top-0 inset-x-0 z-20 p-4 sm:p-5 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-[#2eb9df] border border-white/15">
                    {getChapterIcon(currentChapter.iconName)}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-[#2eb9df] block">
                      {currentChapter.title}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white">
                      {currentChapter.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                  <Clock className="w-3.5 h-3.5 text-[#2eb9df]" />
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* BOTTOM CONTROLS & TIMELINE (CINEMATIC MODE) */}
            {playerEngine === 'cinematic' && hasStartedPlaying && (
              <div
                className={`absolute bottom-0 inset-x-0 z-20 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/75 to-transparent space-y-2.5 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Timeline Scrubber */}
                <div className="relative group/timeline py-2 cursor-pointer">
                  <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#0c6aa7] to-[#2eb9df] rounded-full transition-all duration-100"
                      style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.5}
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="التقديم والتأخير في الفيديو"
                  />

                  {/* Chapter tick dots */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex justify-between px-1">
                    {NAFHAM_VIDEO_CHAPTERS.map((chap) => {
                      const posPct = (chap.startTime / (duration || 1)) * 100;
                      return (
                        <div
                          key={chap.id}
                          style={{ left: `${posPct}%` }}
                          className="absolute -translate-x-1/2 w-1.5 h-3 bg-white/70 rounded-full"
                          title={chap.title}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  {/* Left: Play / Pause / Replay / 10s Skips / Volume */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={isEnded ? handleReplay : togglePlayPause}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                      title={isEnded ? 'إعادة التشغيل' : isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                    >
                      {isEnded ? (
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : isPlaying ? (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSkipSeconds(-10)}
                      className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                      title="رجوع 10 ثوانٍ"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="text-[10px] hidden sm:inline">10 ث</span>
                    </button>

                    <button
                      onClick={() => handleSkipSeconds(10)}
                      className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                      title="تقديم 10 ثوانٍ"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="text-[10px] hidden sm:inline">10 ث</span>
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-1.5 relative">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        ) : volume > 0.5 ? (
                          <Volume2 className="w-3.5 h-3.5" />
                        ) : (
                          <Volume1 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-16 h-1.5 accent-[#2eb9df] cursor-pointer hidden sm:block"
                        title="مستوى الصوت"
                      />
                    </div>
                  </div>

                  {/* Right: Speeds / Fullscreen */}
                  <div className="flex items-center gap-2">
                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-xl border border-white/10 text-[11px] font-bold">
                      {[0.75, 1, 1.25, 1.5].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedChange(spd)}
                          className={`px-1.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                            playbackSpeed === spd
                              ? 'bg-[#2eb9df] text-[#061e31] font-black'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
                    >
                      {isFullscreen ? (
                        <Minimize className="w-4 h-4" />
                      ) : (
                        <Maximize className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. CHAPTERS HORIZONTAL CAROUSEL (DIRECT JUMP TO ANY CHAPTER) */}
        <section className="space-y-3 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-[#2eb9df]" />
              <h3 className="text-sm sm:text-base font-black text-white">
                فهرس فصول الفيلم الوثائقي (8 محطات تفاعلية):
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-bold">
              اضغط على أي فصل للانتقال إليه مباشرة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NAFHAM_VIDEO_CHAPTERS.map((chap) => {
              const isActive = currentChapter.id === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => handleJumpToChapter(chap)}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between space-y-2 group ${
                    isActive
                      ? 'bg-gradient-to-b from-[#0a4d7a] to-[#0c6aa7] border-[#2eb9df] text-white shadow-lg ring-2 ring-[#2eb9df]/50 scale-102'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        isActive ? 'bg-white/20 text-white' : 'bg-black/40 text-slate-400'
                      }`}
                    >
                      {formatTime(chap.startTime)}
                    </span>
                    <div
                      className={`p-1.5 rounded-lg ${
                        isActive ? 'bg-[#2eb9df] text-[#061e31]' : 'text-[#2eb9df] bg-white/5'
                      }`}
                    >
                      {getChapterIcon(chap.iconName)}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div
                      className={`text-xs font-black line-clamp-1 ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {chap.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 font-medium">
                      {chap.subtitle}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[10px] flex items-center justify-between text-[#2eb9df]">
                    <span className="line-clamp-1">{chap.badge}</span>
                    <ChevronLeft className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. INTERACTIVE INSIGHTS & PLATFORM PORTALS TABS */}
        <section className="bg-white/5 rounded-3xl border border-white/10 p-5 sm:p-7 space-y-6 max-w-5xl mx-auto shadow-md backdrop-blur-md">
          {/* Tabs Navigation Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('summary')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'summary'
                    ? 'bg-[#2eb9df] text-[#061e31] shadow-md font-black'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>إضاءات الفصل الحالي ونقاط التعلم</span>
              </button>

              <button
                onClick={() => setActiveTab('chapters')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'chapters'
                    ? 'bg-[#2eb9df] text-[#061e31] shadow-md font-black'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>الفهرس التفصيلي</span>
              </button>

              <button
                onClick={() => setActiveTab('portals')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'portals'
                    ? 'bg-[#2eb9df] text-[#061e31] shadow-md font-black'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>بوابات المنصة الأربع</span>
              </button>
            </div>

            <span className="text-xs text-[#2eb9df] font-bold hidden md:inline">
              جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب
            </span>
          </div>

          {/* TAB 1: CURRENT CHAPTER SUMMARY & LEARNING POINTS */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[#2eb9df] text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>المقولة المحورية للفصل:</span>
                </div>
                <blockquote className="text-sm sm:text-base font-extrabold text-white italic">
                  «{currentChapter.headlineQuote}»
                </blockquote>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium pt-1">
                  {currentChapter.summary}
                </p>
              </div>

              {/* Key takeaways bullet points */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">
                  النقاط المعرفية المستخلصة من هذا الفصل:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentChapter.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2eb9df] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 leading-relaxed font-medium">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED CHAPTERS DIRECTORY */}
          {activeTab === 'chapters' && (
            <div className="space-y-3">
              {NAFHAM_VIDEO_CHAPTERS.map((chap) => (
                <div
                  key={chap.id}
                  onClick={() => handleJumpToChapter(chap)}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-xl bg-[#0c6aa7] text-white text-xs font-bold font-mono">
                      {formatTime(chap.startTime)}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{chap.title}</div>
                      <div className="text-xs text-slate-400">{chap.subtitle}</div>
                    </div>
                  </div>

                  <span className="text-xs text-[#2eb9df] font-bold flex items-center gap-1">
                    <span>انتقال للمشهد</span>
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PLATFORM PORTALS (ENTER ADVENTURE, LIBRARY, GAMES, CHALLENGE) */}
          {activeTab === 'portals' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CINEMATIC_PORTALS.map((portal) => (
                <button
                  key={portal.id}
                  onClick={() => handleSkipToPlatform(portal.targetView as NafhamView)}
                  className="p-5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#2eb9df]/50 text-right space-y-3 transition-all cursor-pointer group shadow-sm hover:scale-102"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0c6aa7]/30 text-[#2eb9df] flex items-center justify-center group-hover:bg-[#2eb9df] group-hover:text-[#061e31] transition-colors">
                    {portal.id === 'adventure' ? (
                      <Compass className="w-6 h-6" />
                    ) : portal.id === 'library' ? (
                      <BookOpen className="w-6 h-6" />
                    ) : portal.id === 'games' ? (
                      <Gamepad2 className="w-6 h-6" />
                    ) : (
                      <Award className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#2eb9df] transition-colors">
                      {portal.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#2eb9df]">
                    <span>{portal.badge}</span>
                    <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-7 text-center text-xs text-slate-400 space-y-3">
        <p className="text-slate-300 text-xs sm:text-sm font-medium">
          جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب · مبادرة «نفهم» التوعوية باضطراب طيف التوحد © {new Date().getFullYear()}
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          <button
            type="button"
            onClick={handleFingerprintClick}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/30 shadow-[0_2px_15px_rgba(245,158,11,0.2)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
            title="انقر 5 مرات للدخول المباشر إلى لوحة التحكم الإدارية"
          >
            <span className="text-amber-400 text-sm">🐾</span>
            <span className="text-sm sm:text-base font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-serif">
              مجرد أثر بصمة
            </span>
            {fingerprintClicks > 0 ? (
              <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 animate-pulse">
                {fingerprintClicks === 4 ? 'تبقى نقرة واحدة 🚀' : `النقرة ${fingerprintClicks} من 5`}
              </span>
            ) : (
              <span className="text-[10px] text-amber-200/80 font-sans font-medium px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 hidden sm:inline">
                بصمة وعي وأثر إنساني مستدام
              </span>
            )}
          </button>
          <span className="h-px w-12 bg-gradient-to-l from-transparent via-amber-400/50 to-transparent" />
        </div>
      </footer>
    </div>
  );
};
