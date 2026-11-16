import React, { useState } from 'react';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Award,
  Send,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { NAFHAM_CONTENT } from '../data/nafhamData';

interface SlideThreeCelebrationProps {
  onRestartJourney: () => void;
  onOpenShareModal: () => void;
}

export const SlideThreeCelebration: React.FC<SlideThreeCelebrationProps> = ({
  onRestartJourney,
  onOpenShareModal,
}) => {
  const { celebration } = NAFHAM_CONTENT.slide3;
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState('');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://nafham.awareness.app';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'مبادرة نفهم | رحلة توعوية حول طيف التوحد',
          text: 'أدعوك لخوض رحلة توعوية تفاعلية مميزة للتعرف على اضطراب طيف التوحد وقواعد التعامل الإيجابي مع مبادرة نفهم.',
          url: currentUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      onOpenShareModal();
    }
  };

  const shareTextEncoded = encodeURIComponent(
    'أدعوك لخوض رحلة توعوية تفاعلية مميزة للتعرف على اضطراب طيف التوحد وقواعد التعامل الإيجابي مع مبادرة نفهم:\n' +
      currentUrl
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareTextEncoded}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareTextEncoded}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(
    'مبادرة نفهم للوعي بطيف التوحد'
  )}`;

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto space-y-12">
      {/* 1. Main Celebration Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#f0f7fb] to-[#e4f1f9] border border-[#cbe3f3] shadow-md p-8 sm:p-12 text-center space-y-8">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2eb9df]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot / Logo celebration icon */}
        <div className="relative z-10 flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white p-4 shadow-lg border border-[#d2e8f6] flex items-center justify-center animate-bounce duration-1000">
              <img
                src={NAFHAM_CONTENT.brand.logo}
                alt="شعار نفهم للاحتفال"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-[#2eb9df] text-white p-2 rounded-full shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Headings */}
        <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black text-[#0a4d7a] tracking-tight">
            {celebration.title}
          </h1>

          <p className="text-lg sm:text-2xl font-bold text-[#0c6aa7] leading-relaxed">
            {celebration.message}
          </p>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            {celebration.subMessage}
          </p>
        </div>

        {/* 2. Personalized Digital Awareness Card */}
        <div className="relative z-10 max-w-md mx-auto bg-white rounded-2xl p-6 border border-[#cbe3f3] shadow-sm text-right space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-[#0a4d7a]">
              <Award className="w-5 h-5 text-[#2eb9df]" />
              <span className="font-bold text-sm">{celebration.badgeTitle}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              {celebration.badgeSubtitle}
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600">
              اكتب اسمك لتخصيص بطاقة السفير:
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="مثال: سارة محمد أو مهتم بالوعي"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c6aa7] bg-[#fafcfe] text-right"
              maxLength={40}
            />
          </div>

          {userName.trim() && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#0a4d7a] to-[#0c6aa7] text-white text-center space-y-1.5 shadow-xs">
              <div className="text-[11px] opacity-80">شهادة إتمام الرحلة التوعوية</div>
              <div className="text-lg font-bold">{userName}</div>
              <div className="text-xs text-[#2eb9df] font-semibold">
                سفير معتمد لنشر الوعي بطيف التوحد 🌟
              </div>
            </div>
          )}
        </div>

        {/* 3. Action Buttons (Web Share, Copy, Social) */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Primary Share Button */}
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#0c6aa7] to-[#0a4d7a] hover:from-[#0a4d7a] hover:to-[#05528f] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>{celebration.shareText}</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-[#0a4d7a] bg-white hover:bg-slate-50 border border-[#cbe3f3] shadow-2xs transition-colors cursor-pointer text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{celebration.copiedSuccessText}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#0c6aa7]" />
                <span>{celebration.copyText}</span>
              </>
            )}
          </button>

          {/* Restart Journey Button */}
          <button
            onClick={onRestartJourney}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{celebration.replayText}</span>
          </button>
        </div>

        {/* 4. Quick Social Channels */}
        <div className="relative z-10 pt-4 border-t border-slate-200/60 max-w-md mx-auto space-y-2">
          <span className="text-xs font-semibold text-slate-500">
            مشاركة سريعة عبر التطبيقات:
          </span>
          <div className="flex items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>تويتر (X)</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>تيليجرام</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
