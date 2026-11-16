import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Gamepad2,
  Trophy,
  Bot,
  Palette,
  ShieldCheck,
  Lock,
  Layers,
  Menu,
  X,
  Share2,
  Sparkles,
  Heart,
  Type,
  Eye,
  Sliders,
  Building2,
  Users,
  Film,
} from 'lucide-react';
import { NAFHAM_CONTENT } from '../data/nafhamData';

export type NafhamView =
  | 'cinematic'
  | 'video_hub'
  | 'home'
  | 'tracks'
  | 'adventure'
  | 'library'
  | 'games'
  | 'challenge'
  | 'assistant'
  | 'gallery'
  | 'sources'
  | 'admin'
  | 'original_slides'
  | 'installer';

interface NavbarProps {
  activeView: NafhamView;
  onSelectView: (view: NafhamView) => void;
  onOpenShare: () => void;
  isOffline: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  reduceMotion: boolean;
  onToggleReduceMotion: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  onOpenShare,
  isOffline,
  fontSize,
  onChangeFontSize,
  reduceMotion,
  onToggleReduceMotion,
  highContrast,
  onToggleHighContrast,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  const navItems: { id: NafhamView; label: string; icon: React.ElementType }[] = [
    { id: 'video_hub', label: 'استوديو العروض 🎬', icon: Film },
    { id: 'cinematic', label: 'الفيلم التعريفي', icon: Film },
    { id: 'home', label: 'الرئيسية', icon: Heart },
    { id: 'tracks', label: 'المسارات', icon: Users },
    { id: 'adventure', label: 'المغامرة (6 محطات)', icon: Compass },
    { id: 'library', label: 'مكتبة المعرفة', icon: BookOpen },
    { id: 'games', label: 'مدينة الألعاب', icon: Gamepad2 },
    { id: 'challenge', label: 'تحدي نفهم', icon: Trophy },
    { id: 'assistant', label: 'اسأل نفهم', icon: Bot },
    { id: 'gallery', label: 'المعرض', icon: Palette },
    { id: 'sources', label: 'المصادر', icon: ShieldCheck },
    { id: 'admin', label: 'الإشراف', icon: Lock },
    { id: 'original_slides', label: 'العرض الشرائحي', icon: Layers },
  ];

  const handleNavClick = (viewId: NafhamView) => {
    onSelectView(viewId);
    if (viewId === 'admin') {
      try {
        window.history.pushState({}, '', '/admincp');
      } catch {}
    } else if (viewId === 'home') {
      try {
        window.history.pushState({}, '', '/');
      } catch {}
    }
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all text-right">
      {/* Top Academic Bar */}
      <div className="bg-[#0a4d7a] text-white py-1 px-4 sm:px-8 text-[11px] font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
            alt="جامعة الإمام عبدالرحمن بن فيصل"
            className="h-4.5 w-auto object-contain brightness-0 invert"
          />
          <span className="hidden sm:inline text-white/50">|</span>
          <span>إشراف: جامعة الإمام عبدالرحمن بن فيصل (IAU) · كلية الآداب</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-white/80">«لأن الفهم بداية التقبل»</span>
          {isOffline && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>أوفلاين بالكامل</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-right cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#0c6aa7] rounded-lg p-1 shrink-0"
        >
          <img
            src={NAFHAM_CONTENT.brand.logo}
            alt="شعار نفهم"
            className="w-10 h-10 object-contain drop-shadow-xs transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="h-8 w-px bg-slate-200 hidden md:block" />
          <img
            src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
            alt="شعار جامعة الإمام عبدالرحمن بن فيصل"
            className="h-7.5 w-auto object-contain hidden md:block opacity-90 group-hover:opacity-100 transition-opacity"
            title="جامعة الإمام عبدالرحمن بن فيصل"
          />
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors whitespace-nowrap">
                {NAFHAM_CONTENT.brand.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#e1eff8] text-[#0c6aa7] font-bold hidden sm:inline">
                منصة توعوية
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
              لأن الفهم بداية التقبل
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links (scrollable or clean row) */}
        <nav
          aria-label="أقسام منصة نفهم"
          className="hidden xl:flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto max-w-3xl"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#0c6aa7] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0a4d7a] hover:bg-white/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Medium-screen quick links */}
        <div className="hidden lg:flex xl:hidden items-center gap-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                  isActive
                    ? 'bg-[#0c6aa7] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right utility buttons: Accessibility + Share + Mobile toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleNavClick('cinematic')}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              activeView === 'cinematic'
                ? 'bg-[#0a4d7a] text-white ring-2 ring-[#2eb9df]'
                : 'bg-gradient-to-r from-[#0c6aa7] to-[#0a4d7a] hover:from-[#0a4d7a] hover:to-[#05528f] text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#2eb9df]" />
            <span>الفيلم الوثائقي</span>
          </button>

          {/* Accessibility toggle dropdown button */}
          <div className="relative">
            <button
              onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-[#0a4d7a] hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
              title="خيارات إمكانية الوصول والتصفح المريح"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {isAccessibilityOpen && (
              <div
                className="absolute left-0 sm:right-auto mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 text-right text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="font-bold text-[#0a4d7a] border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>إمكانية التيسير والتصفح</span>
                  <button
                    onClick={() => setIsAccessibilityOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 font-semibold block">حجم الخط:</label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl font-bold">
                    <button
                      onClick={() => onChangeFontSize('normal')}
                      className={`py-1 rounded-lg ${
                        fontSize === 'normal' ? 'bg-white text-[#0a4d7a] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      عادي
                    </button>
                    <button
                      onClick={() => onChangeFontSize('large')}
                      className={`py-1 rounded-lg ${
                        fontSize === 'large' ? 'bg-white text-[#0a4d7a] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      كبير
                    </button>
                    <button
                      onClick={() => onChangeFontSize('xlarge')}
                      className={`py-1 rounded-lg ${
                        fontSize === 'xlarge' ? 'bg-white text-[#0a4d7a] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      أكبر
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">تقليل الحركة:</span>
                  <button
                    onClick={onToggleReduceMotion}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                      reduceMotion
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {reduceMotion ? 'مفعل' : 'معطل'}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-700 font-bold block">نمط عالي التباين</span>
                      <span className="text-[10px] text-slate-400">لذوي التحديات البصرية</span>
                    </div>
                    <button
                      onClick={onToggleHighContrast}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        highContrast
                          ? 'bg-amber-400 text-black shadow-xs font-black ring-2 ring-amber-300'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {highContrast ? 'نشط (AAA)' : 'معطل'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-[#e1eff8] text-[#0a4d7a] hover:bg-[#0c6aa7] hover:text-white transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مشاركة</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 xl:hidden cursor-pointer"
            title="القائمة"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer text-right ${
                    isActive
                      ? 'bg-[#0c6aa7] text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
