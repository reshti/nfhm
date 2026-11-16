import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Video,
  Play,
  Pause,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
  Tv,
  Film,
  Radio,
  Puzzle,
  Layers,
  ExternalLink,
  Save,
  AlertCircle,
  FileVideo,
  Check,
} from 'lucide-react';
import {
  VideoItem,
  VideoTheme,
  loadVideoHubConfig,
  saveVideoHubConfig,
  DEFAULT_VIDEOS,
} from '../../data/videoHubData';

export const AdminVideoManager: React.FC = () => {
  const [config, setConfig] = useState(loadVideoHubConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadedSuccess, setUploadedSuccess] = useState('');

  // Server disk video assets
  const [serverVideos, setServerVideos] = useState<
    { filename: string; url: string; sizeMb: string; modifiedAt: string }[]
  >([]);
  const [loadingServerVideos, setLoadingServerVideos] = useState(false);

  // Test player state
  const [previewUrl, setPreviewUrl] = useState<string>(config.videos[0]?.url || '');
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch server videos
  const fetchServerVideos = async () => {
    setLoadingServerVideos(true);
    try {
      const res = await fetch('/api/admin/list-videos');
      if (res.ok) {
        const data = await res.json();
        setServerVideos(data.videos || []);
      }
    } catch (e) {
      console.warn('Failed to fetch server videos:', e);
    } finally {
      setLoadingServerVideos(false);
    }
  };

  useEffect(() => {
    fetchServerVideos();
  }, []);

  // Handle local file selection and upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('video') && !file.name.endsWith('.mp4') && !file.name.endsWith('.webm')) {
      setUploadError('يرجى اختيار ملف فيديو صالح بصيغة MP4 أو WebM');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadedSuccess('');
    setUploadProgress(15);

    const reader = new FileReader();
    reader.onprogress = (evt) => {
      if (evt.lengthComputable) {
        setUploadProgress(Math.round((evt.loaded / evt.total) * 70));
      }
    };

    reader.onload = async () => {
      try {
        setUploadProgress(85);
        const base64Data = reader.result as string;
        const res = await fetch('/api/admin/upload-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setUploadProgress(100);
          setUploadedSuccess(`تم رفع الفيديو بنجاح: ${data.filename} (${data.sizeMb} ميجابايت)`);

          // Add to playlist
          const newVideoItem: VideoItem = {
            id: `uploaded_${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            subtitle: 'فيديو مرفوع حديثاً من لوحة التحكم',
            url: data.url,
            poster: '/assets/aistudio/nafham_video_poster.jpg',
            durationText: 'جديد',
            category: 'فيديو مخصص مرفوع',
            description: `تم رفعه بتاريخ ${new Date().toLocaleDateString('ar-SA')}`,
          };

          const updatedVideos = [newVideoItem, ...config.videos];
          const updatedConfig = {
            ...config,
            videos: updatedVideos,
            activeVideoId: newVideoItem.id,
          };
          setConfig(updatedConfig);
          saveVideoHubConfig(updatedConfig);
          setPreviewUrl(data.url);
          fetchServerVideos();
        } else {
          setUploadError(data.error || 'تعذر حفظ الفيديو في الخادم');
        }
      } catch (err: any) {
        setUploadError(`حدث خطأ أثناء الرفع: ${err.message || 'خطأ غير معروف'}`);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setUploading(false);
      setUploadError('فشل قراءة ملف الفيديو من جهازك.');
    };

    reader.readAsDataURL(file);
  };

  // Save changes
  const handleSaveConfig = () => {
    saveVideoHubConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Set active video
  const handleSetActiveVideo = (videoId: string, url: string) => {
    const updated = { ...config, activeVideoId: videoId };
    setConfig(updated);
    saveVideoHubConfig(updated);
    setPreviewUrl(url);
    if (previewVideoRef.current) {
      previewVideoRef.current.load();
    }
  };

  return (
    <div className="space-y-8 text-right font-['Tajawal']">
      {/* 1. Header & Save Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0c6aa7]">
            <Video className="w-6 h-6 text-[#2eb9df]" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0a4d7a]">
              إدارة ورفع الفيديوهات وصفحة عروض الفيديو
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            ارفع فيديوهات جديدة مباشرة، حدد الفيديو النشط بالمنصة، وتحكم بصفحة العروض وثيمات العرض المتنوعة.
          </p>
        </div>

        <button
          onClick={handleSaveConfig}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0c6aa7] to-[#2eb9df] hover:from-[#0a4d7a] hover:to-[#25a0c3] text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer hover:scale-102 transition-all"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'تم حفظ التعديلات!' : 'حفظ إعدادات الفيديو'}</span>
        </button>
      </div>

      {/* 2. Direct Video Uploader & Showcase Hub Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Uploader Card */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-[#0a4d7a] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2eb9df]" />
              <span>رفع فيديو جديد من جهازك مباشرة</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-bold">صيغ MP4 / WebM</span>
          </div>

          {/* Upload Area Box */}
          <label className="relative border-2 border-dashed border-[#0c6aa7]/30 hover:border-[#2eb9df] rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#f0f7fb]/60 hover:bg-[#e1eff8]/60 group">
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-3xl bg-white shadow-md text-[#0c6aa7] group-hover:text-[#2eb9df] flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <span className="text-sm font-black text-[#0a4d7a]">
              {uploading ? 'جاري رفع الفيديو وحفظه بالخادم...' : 'انقر هنا لاختيار ملف فيديو من جهازك'}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              سيتم حفظ الفيديو فورياً في مسار أصول المنصة وإضافته لقائمة الفيديوهات المعروضة.
            </span>
          </label>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#0c6aa7]">
                <span>جاري معالجة الرفع...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-[#0c6aa7] to-[#2eb9df] rounded-full transition-all duration-200"
                />
              </div>
            </div>
          )}

          {uploadError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadedSuccess}</span>
            </div>
          )}
        </div>

        {/* Right: Video Hub Settings (Enable/Disable & Default Theme) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-[#0a4d7a] flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-500" />
              <span>إعدادات صفحة عروض الفيديوهات</span>
            </h3>
          </div>

          {/* Master Enable / Disable Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f2f8fc] border border-[#0c6aa7]/20">
            <div>
              <span className="text-xs font-black text-[#0a4d7a] block">
                تفعيل صفحة عروض الفيديو (Video Hub)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                إظهار صفحة هبوط مستقلة متخصصة بعروض الفيديو
              </span>
            </div>
            <button
              onClick={() => {
                const updated = { ...config, isEnabled: !config.isEnabled };
                setConfig(updated);
                saveVideoHubConfig(updated);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                config.isEnabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {config.isEnabled ? 'مفعلة بالمنصة ✓' : 'معطلة'}
            </button>
          </div>

          {/* Default Viewing Theme Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block">
              الثيم الافتراضي لعرض الفيديو:
            </label>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                {
                  id: 'child_puzzle' as VideoTheme,
                  label: 'العرض الطفولي وبازل التوحد الملون 🧩',
                  desc: 'قطع بازل ملونة مبعثرة، أسلوب تفاعلي مبهج يناسب أطفال التوحد',
                  color: 'border-amber-400 bg-amber-50/50',
                },
                {
                  id: 'cinematic' as VideoTheme,
                  label: 'العرض السينمائي الفاخر 🎬',
                  desc: 'شاشة سينمائية عريضة بإضاءة ليلية داكنة وتأثيرات ضوئية أنيقة',
                  color: 'border-[#0c6aa7] bg-[#f0f7fb]',
                },
                {
                  id: 'theater' as VideoTheme,
                  label: 'العرض المسرحي الثقافي 🎭',
                  desc: 'ستائر مخملية مسرحية مع حزم ضوئية توجه الأنظار للمسرح',
                  color: 'border-rose-300 bg-rose-50/50',
                },
                {
                  id: 'retro_tv' as VideoTheme,
                  label: 'شاشة التلفزيون الكلاسيكي 📺',
                  desc: 'هيكل تلفزيون خشبي كلاسيكي مع هوائي وأزرار دوارة وفلتر CRT',
                  color: 'border-amber-600 bg-amber-50/40',
                },
                {
                  id: 'live_stream' as VideoTheme,
                  label: 'البث الحي المباشر 🔴',
                  desc: 'شارة مباشر نابضة مع عداد المشاهدين وتفاعلات حية طافية',
                  color: 'border-red-400 bg-red-50/50',
                },
              ].map((theme) => {
                const isSelected = config.defaultTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      const updated = { ...config, defaultTheme: theme.id };
                      setConfig(updated);
                      saveVideoHubConfig(updated);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-0.5 ${
                      isSelected
                        ? `${theme.color} ring-2 ring-[#0c6aa7] font-black shadow-xs`
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{theme.label}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#0c6aa7] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {theme.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Video Test Preview Player */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-[#2eb9df]" />
            <h3 className="text-base font-black text-[#0a4d7a]">
              المشغل التجريبي لاختبار الفيديو فورياً
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 font-bold truncate max-w-xs">
            {previewUrl}
          </span>
        </div>

        <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden bg-black aspect-video relative flex items-center justify-center border-2 border-slate-800 shadow-xl">
          <video
            ref={previewVideoRef}
            src={previewUrl}
            controls
            playsInline
            onPlay={() => setPreviewPlaying(true)}
            onPause={() => setPreviewPlaying(false)}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 4. Active Playlist & Server Videos on Disk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Playlist */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-[#0a4d7a] flex items-center gap-2">
              <Film className="w-5 h-5 text-[#0c6aa7]" />
              <span>قائمة الفيديوهات المعروضة بالمنصة ({config.videos.length})</span>
            </h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {config.videos.map((vid) => {
              const isActive = config.activeVideoId === vid.id;
              return (
                <div
                  key={vid.id}
                  className={`p-4 rounded-2xl border text-right transition-all flex items-start justify-between gap-3 ${
                    isActive
                      ? 'bg-[#f0f7fb] border-[#0c6aa7] ring-2 ring-[#2eb9df]/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#e1eff8] text-[#0c6aa7]">
                        {vid.category}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          الفيديو النشط الرئيسي
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-[#0a4d7a]">{vid.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                      {vid.url}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleSetActiveVideo(vid.id, vid.url)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0c6aa7] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isActive ? 'النشط حالياً ✓' : 'تعيين كنشط'}
                    </button>
                    <button
                      onClick={() => {
                        setPreviewUrl(vid.url);
                        if (previewVideoRef.current) previewVideoRef.current.load();
                      }}
                      className="text-[11px] font-bold text-[#0c6aa7] hover:underline text-center cursor-pointer"
                    >
                      معاينة بالمشغل
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Server Disk Assets */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-[#0a4d7a] flex items-center gap-2">
              <FileVideo className="w-5 h-5 text-emerald-500" />
              <span>ملفات الفيديو الفعلية على الخادم ({serverVideos.length})</span>
            </h3>
            <button
              onClick={fetchServerVideos}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0c6aa7] transition-colors"
              title="تحديث قائمة الملفات"
            >
              <RefreshCw className={`w-4 h-4 ${loadingServerVideos ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {serverVideos.map((sv) => (
              <div
                key={sv.filename}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800 truncate max-w-xs">{sv.filename}</div>
                  <div className="text-[11px] text-slate-400">
                    الحجم: <span className="font-bold text-slate-700">{sv.sizeMb} MB</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPreviewUrl(sv.url);
                    if (previewVideoRef.current) previewVideoRef.current.load();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#0c6aa7] font-bold cursor-pointer whitespace-nowrap"
                >
                  اختبار التشغيل
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
