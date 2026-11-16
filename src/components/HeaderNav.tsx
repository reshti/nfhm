import React from 'react';
import { Sparkles, Share2 } from 'lucide-react';
import { NAFHAM_CONTENT } from '../data/nafhamData';

interface HeaderNavProps {
  currentSlide: number;
  totalSlides: number;
  onSelectSlide: (slideIndex: number) => void;
  onOpenShare: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentSlide,
  totalSlides,
  onSelectSlide,
  onOpenShare,
}) => {
  const navItems = [
    { id: 0, label: '01. البداية والترحيب' },
    { id: 1, label: '02. دليل طيف التوحد' },
    { id: 2, label: '03. التهنئة والمشاركة' },
  ];

  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onSelectSlide(0)}
          className="flex items-center gap-2.5 text-right cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#0c6aa7] rounded-lg p-1"
        >
          <img
            src={NAFHAM_CONTENT.brand.logo}
            alt="شعار نفهم"
            className="w-9 h-9 object-contain drop-shadow-xs transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col text-right">
            <span className="text-xl font-bold tracking-tight text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors whitespace-nowrap shrink-0">
              {NAFHAM_CONTENT.brand.name}
            </span>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline whitespace-nowrap">
              رحلة توعوية حول طيف التوحد
            </span>
          </div>
        </button>

        {/* Zone 2: 3 clean single-line nav links */}
        <nav
          aria-label="أقسام الموقع التوعوي"
          className="hidden md:flex items-center gap-1 sm:gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60"
        >
          {navItems.map((item) => {
            const isActive = currentSlide === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSlide(item.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0a4d7a] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-[#0a4d7a] hover:bg-white/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#0c6aa7] to-[#0a4d7a] hover:from-[#0a4d7a] hover:to-[#05528f] rounded-lg transition-all shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap shrink-0 active:scale-98"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>شارك الوعي</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-100 h-1 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#2eb9df] via-[#0c6aa7] to-[#05528f] h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
