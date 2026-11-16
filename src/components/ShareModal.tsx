import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, ExternalLink, Share2 } from 'lucide-react';
import { NAFHAM_CONTENT } from '../data/nafhamData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://nafham.awareness.app';
  const shareText = 'أدعوك لخوض رحلة توعوية تفاعلية مميزة للتعرف على اضطراب طيف التوحد وقواعد التعامل الإيجابي مع مبادرة نفهم:\n' + currentUrl;
  const shareTextEncoded = encodeURIComponent(shareText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 text-right shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[#0a4d7a]">
            <Share2 className="w-5 h-5 text-[#2eb9df]" />
            <h3 className="font-bold text-base">مشاركة مبادرة نفهم</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          ساهم في نشر الوعي وبناء مجتمع متفهم وداعم لذوي طيف التوحد من خلال مشاركة هذه الرحلة التوعوية.
        </p>

        {/* Copy link box */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500">رابط الموقع المباشر</label>
          <div className="flex items-center gap-2 p-1.5 bg-[#f0f7fb] rounded-xl border border-[#cbe3f3]">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent text-xs text-[#0a4d7a] font-mono px-2 w-full focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0c6aa7] hover:bg-[#0a4d7a] rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Share grid */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-500">مشاركة عبر:</span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <a
              href={`https://api.whatsapp.com/send?text=${shareTextEncoded}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors flex flex-col items-center gap-1"
            >
              <MessageCircle className="w-5 h-5" />
              <span>واتساب</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTextEncoded}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors flex flex-col items-center gap-1"
            >
              <Send className="w-5 h-5" />
              <span>تويتر (X)</span>
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('مبادرة نفهم للوعي بطيف التوحد')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors flex flex-col items-center gap-1"
            >
              <ExternalLink className="w-5 h-5" />
              <span>تيليجرام</span>
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};
