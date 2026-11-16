import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Award,
  Printer,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Film,
  QrCode,
} from 'lucide-react';
import { NAFHAM_CONTENT } from '../data/nafhamData';
import {
  CertificateTemplate,
  loadActiveCertificateTemplate,
} from '../data/certificateTemplates';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  achievementTitle: string;
  score?: number;
  total?: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  achievementTitle,
  score,
  total,
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<CertificateTemplate>(loadActiveCertificateTemplate());

  useEffect(() => {
    if (isOpen) {
      setTemplate(loadActiveCertificateTemplate());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayDate = new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const getThemeCanvasStyles = () => {
    switch (template.styleTheme) {
      case 'golden_honor':
        return {
          wrapper: 'bg-gradient-to-b from-[#fffefc] via-[#fdfaf3] to-[#fbf5e6] text-[#422006]',
          outerBorder: 'border-[#c59b27] shadow-[0_15px_40px_rgba(197,155,39,0.22)]',
          innerBorder: 'border-[#dfbd5d]/70',
          accentColor: '#b45309',
        };
      case 'kids_explorer':
        return {
          wrapper: 'bg-gradient-to-b from-[#f9fdfa] via-white to-[#edfbf4] text-[#064e3b]',
          outerBorder: 'border-[#059669] shadow-[0_15px_40px_rgba(5,150,105,0.18)]',
          innerBorder: 'border-[#34d399]/60',
          accentColor: '#059669',
        };
      case 'modern_ocean':
        return {
          wrapper: 'bg-gradient-to-b from-[#f8fbfe] via-white to-[#edf5fc] text-[#082f49]',
          outerBorder: 'border-[#0284c7] shadow-[0_15px_40px_rgba(2,132,199,0.2)]',
          innerBorder: 'border-[#38bdf8]/60',
          accentColor: '#0284c7',
        };
      case 'royal_iau':
      default:
        return {
          wrapper: 'bg-gradient-to-b from-[#fafcfe] via-white to-[#f0f6fa] text-[#0f2942]',
          outerBorder: 'border-[#0a4d7a] shadow-[0_20px_50px_rgba(10,77,122,0.25)]',
          innerBorder: 'border-[#c59b27]',
          accentColor: '#0a4d7a',
        };
    }
  };

  const themeStyles = getThemeCanvasStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto font-['Tajawal']"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[#0a4d7a]">
            <Award className="w-6 h-6 text-[#c59b27]" />
            <h3 className="font-bold text-lg">شهادة إتمام وتكريم ({template.name})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Canvas */}
        <div
          ref={certRef}
          className={`relative rounded-3xl p-6 sm:p-10 border-4 shadow-inner text-center space-y-6 transition-all duration-300 overflow-hidden ${themeStyles.wrapper} ${themeStyles.outerBorder}`}
        >
          {/* Inner Ornate Line Frame */}
          <div
            className={`absolute inset-3 sm:inset-4 rounded-2xl border-2 pointer-events-none ${themeStyles.innerBorder}`}
          />

          {/* Ornate Corner Arabesques */}
          <svg
            className="absolute top-5 right-5 w-8 h-8 text-[#c59b27] opacity-80 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M5,50 L5,5 L50,5" />
            <circle cx="20" cy="20" r="5" fill="currentColor" />
            <path d="M10,35 Q35,35 35,10" />
          </svg>
          <svg
            className="absolute top-5 left-5 w-8 h-8 text-[#c59b27] opacity-80 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M95,50 L95,5 L50,5" />
            <circle cx="80" cy="20" r="5" fill="currentColor" />
            <path d="M90,35 Q65,35 65,10" />
          </svg>
          <svg
            className="absolute bottom-5 right-5 w-8 h-8 text-[#c59b27] opacity-80 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M5,50 L5,95 L50,95" />
            <circle cx="20" cy="80" r="5" fill="currentColor" />
            <path d="M10,65 Q35,65 35,90" />
          </svg>
          <svg
            className="absolute bottom-5 left-5 w-8 h-8 text-[#c59b27] opacity-80 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M95,50 L95,95 L50,95" />
            <circle cx="80" cy="80" r="5" fill="currentColor" />
            <path d="M90,65 Q65,65 65,90" />
          </svg>

          {/* Header Logos & Accreditation */}
          <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3 text-right">
              <img
                src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
                alt="شعار جامعة الإمام عبدالرحمن بن فيصل"
                className="h-12 w-auto object-contain"
              />
              <div>
                <div className="text-[10px] text-[#c59b27] font-black tracking-wide">
                  المملكة العربية السعودية
                </div>
                <div className="text-[11px] font-extrabold text-[#0a4d7a]">
                  جامعة الإمام عبدالرحمن بن فيصل
                </div>
                <div className="text-[10px] text-slate-600 font-bold">
                  كلية الآداب
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center">
              <div className="text-xs sm:text-sm font-bold text-[#c59b27] tracking-wider font-['Cairo'] select-none">
                بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
              </div>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent mt-1" />
            </div>

            <div className="flex items-center gap-2.5 text-left">
              <div className="text-right">
                <div className="text-[12px] font-black text-[#0c6aa7]">مبادرة نفهم التوعوية</div>
                <div className="text-[10px] text-slate-500 font-medium">لأن الفهم بداية التقبل</div>
              </div>
              <img
                src={NAFHAM_CONTENT.brand.logo}
                alt="شعار نفهم"
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>

          {/* Certificate Titles (Clean & Regal - Without 'منطقة معتمدة') */}
          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4d7a] pt-1 font-['Cairo']">
              {template.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {template.subtitle}
            </p>
            {template.honoraryQuote && (
              <div className="text-[11px] font-bold text-[#c59b27] italic">
                {template.honoraryQuote}
              </div>
            )}
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="w-16 h-px bg-gradient-to-l from-[#c59b27] to-transparent" />
              <span className="text-[#c59b27] text-xs">✦</span>
              <div className="w-16 h-px bg-gradient-to-r from-[#c59b27] to-transparent" />
            </div>
          </div>

          {/* Recipient Name Box */}
          <div className="relative z-10 py-1">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              تُمنح هذه الشهادة بكل فخر واعتزاز إلى:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#0a4d7a] font-['Cairo'] tracking-wide border-b-2 border-[#c59b27] pb-2 inline-block px-8 bg-gradient-to-r from-transparent via-[#e1eff8]/40 to-transparent">
              {recipientName || 'سفير الوعي بطيف التوحد'}
            </div>
            <span className="text-[11px] font-bold text-[#0c6aa7] block mt-1">
              {template.recipientTitle}
            </span>
          </div>

          {/* Body Details */}
          <div className="relative z-10 max-w-lg mx-auto text-xs sm:text-sm text-[#304254] leading-relaxed">
            {template.bodyText}

            {template.showScore && score !== undefined && total !== undefined && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-bold text-[#0a4d7a] shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  النتيجة المحققة: {score} من {total} في بنك الأسئلة العلمي
                </span>
              </div>
            )}
          </div>

          {/* Signatures & Accreditation Info (Clean & Regal) */}
          <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-200 text-[12px] text-slate-600">
            <div className="text-right space-y-1">
              <div className="font-bold text-[#0a4d7a] text-xs">تاريخ الإصدار:</div>
              <div className="font-semibold text-slate-700">{todayDate}</div>
              {template.showRefId && (
                <div className="text-[10px] text-slate-400 font-mono">الرقم المرجعي: NFH-884912</div>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-center">
              <div className="p-1 rounded-lg bg-white border border-slate-200">
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
              <span className="text-[8px] text-slate-400 mt-0.5">تحقق رقمي</span>
            </div>

            <div className="text-left space-y-1">
              <div className="font-bold text-[#0a4d7a] text-xs">الجهة المانحة:</div>
              <div className="font-black text-[#0c6aa7] text-sm sm:text-base font-['Cairo']">
                مبادرة «نفهم» التوعوية
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب
              </div>
              <div className="w-28 h-0.5 bg-[#0a4d7a]/30 ml-auto mt-0.5" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs bg-[#0c6aa7] text-white hover:bg-[#0a4d7a] shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة أو حفظ الشهادة كـ PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
