import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OfflineToastProps {
  isOffline: boolean;
  onDismiss?: () => void;
}

export const OfflineToast: React.FC<OfflineToastProps> = ({ isOffline }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBackOnlineToast, setShowBackOnlineToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setIsDismissed(false);
      setWasOffline(true);
    } else if (wasOffline) {
      // Just came back online
      setShowBackOnlineToast(true);
      const timer = setTimeout(() => {
        setShowBackOnlineToast(false);
        setWasOffline(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  return (
    <div
      dir="rtl"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {isOffline && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="pointer-events-auto bg-[#0a2540] text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-amber-400/50 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Ambient amber glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0">
                <WifiOff className="w-5 h-5 animate-pulse" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">
                    أنت الآن في وضع عدم الاتصال (أوفلاين)
                  </h4>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                    محلي 100%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  لا تقلق! منصة «نفهم» صُممت لتعمل بكامل طاقتها دون إنترنت. جميع الألعاب، ومكتبة المعرفة، وتحديات الوعي، ومغامرة السفير متوفرة وتعمل محلياً بالكامل.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>جميع البيانات والتقدم محفوظة محلياً</span>
                  </div>

                  <button
                    onClick={() => setIsDismissed(true)}
                    className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    حسناً، فهمت
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="إغلاق التنبيه"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {showBackOnlineToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="pointer-events-auto bg-[#063321] text-white p-4 rounded-3xl shadow-2xl border-2 border-emerald-400/60 backdrop-blur-xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-black text-white">
                  تم استعادة الاتصال بالإنترنت بنجاح!
                </h5>
                <p className="text-[11px] text-emerald-200">
                  متصل الآن بالسيرفر، ويمكنك الاستفادة من المساعد الذكي المباشر.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBackOnlineToast(false)}
              className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
