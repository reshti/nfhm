import React, { useState } from 'react';
import { ArrowLeft, Heart, Compass, Eye, Sparkles } from 'lucide-react';
import { NAFHAM_CONTENT, IdentityCharacter } from '../data/nafhamData';
import { ImageWithFallback } from './ImageWithFallback';

interface SlideOneHeroProps {
  onStartJourney: () => void;
}

export const SlideOneHero: React.FC<SlideOneHeroProps> = ({ onStartJourney }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<IdentityCharacter | null>(null);

  const { hero, about, identityArt } = NAFHAM_CONTENT.slide1;

  return (
    <div className="space-y-16 lg:space-y-24 py-8 md:py-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#f0f7fb] to-[#e4f1f9] border border-[#d2e8f6] shadow-sm p-6 sm:p-10 lg:p-14">
        {/* Decorative subtle background shapes */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#2eb9df]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#0c6aa7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Right column (Text in RTL) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Header Mascot Graphic */}
            <div className="inline-flex items-center gap-3">
              <img
                src={hero.headerMascot}
                alt="شخصية نفهم الترحيبية"
                className="h-14 sm:h-16 w-auto object-contain animate-float drop-shadow-sm"
              />
              <span className="text-xs font-bold text-[#0c6aa7] tracking-wider uppercase bg-[#e1eff8] px-3 py-1 rounded-md">
                مبادرة تطوعية توعوية
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a4d7a] tracking-tight leading-[1.25]">
              {hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#304254] leading-relaxed max-w-2xl font-medium">
              {hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartJourney}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#0c6aa7] to-[#0a4d7a] hover:from-[#0a4d7a] hover:to-[#05528f] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-base"
              >
                <span>{hero.primaryCta}</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>

              <a
                href="#about-section"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-[#0a4d7a] bg-white/80 hover:bg-white border border-[#cbe3f3] transition-colors text-sm"
              >
                <Compass className="w-4 h-4 text-[#0c6aa7]" />
                <span>تعرف على المبادرة</span>
              </a>
            </div>
          </div>

          {/* Left column (Visual Showcase) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white aspect-4/3 sm:aspect-16/10">
                <ImageWithFallback
                  src={hero.heroImage}
                  alt="مبادرة نفهم التوعوية"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Floating logo badge */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-[#d2e8f6] flex items-center gap-3">
                <img
                  src={hero.logoMark}
                  alt="ختم نفهم"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
                <div className="text-right pl-2">
                  <div className="text-xs font-bold text-[#0a4d7a]">نفهم للوعي</div>
                  <div className="text-[10px] text-slate-500">بداية الفرق هو الفهم</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Us Section ("نبذة عنا..") */}
      <section
        id="about-section"
        className="relative rounded-3xl bg-white border border-slate-200/90 shadow-xs p-6 sm:p-10 lg:p-12 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 bg-gradient-to-tr from-[#f0f7fb] to-[#e4f1f9] rounded-2xl p-4 flex items-center justify-center border border-[#d2e8f6]">
              <img
                src={NAFHAM_CONTENT.brand.logo}
                alt="شعار مبادرة نفهم"
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-md animate-float"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-right">
            <div className="inline-flex items-center gap-2 text-[#0c6aa7]">
              <Heart className="w-5 h-5 text-[#2eb9df]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#0c6aa7]">
                رسالة المبادرة
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4d7a]">
              {about.title}
            </h2>

            <p className="text-base sm:text-lg text-[#304254] leading-relaxed font-normal">
              {about.description}
            </p>

            <div className="pt-3 flex flex-wrap gap-3 text-xs text-slate-600 font-medium">
              <span className="bg-[#f0f7fb] text-[#0a4d7a] px-3 py-1.5 rounded-lg border border-[#d2e8f6]">
                نشر الوعي الصحي
              </span>
              <span className="bg-[#f0f7fb] text-[#0a4d7a] px-3 py-1.5 rounded-lg border border-[#d2e8f6]">
                تعزيز الدمج المجتمعي
              </span>
              <span className="bg-[#f0f7fb] text-[#0a4d7a] px-3 py-1.5 rounded-lg border border-[#d2e8f6]">
                تصحيح المفاهيم الخاطئة
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visual Identity Art Showcase ("رسومات الهوية البصرية") */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#0c6aa7] text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#2eb9df]" />
            <span>الهوية البصرية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4d7a]">
            {identityArt.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {identityArt.subtitle}
          </p>
        </div>

        {/* 5 Artwork Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {identityArt.characters.map((char, idx) => (
            <div
              key={char.id}
              onClick={() => setSelectedCharacter(char)}
              className="group relative bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1"
            >
              <div className="w-full aspect-square relative rounded-xl bg-gradient-to-b from-[#f2f8fc] to-[#e8f4fa] p-3 flex items-center justify-center overflow-hidden mb-3">
                <ImageWithFallback
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#0a4d7a]/0 group-hover:bg-[#0a4d7a]/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#0a4d7a] p-1.5 rounded-full shadow-xs">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors mb-1">
                {char.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {char.description}
              </p>
            </div>
          ))}
        </div>

        {/* Character Detail Modal */}
        {selectedCharacter && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedCharacter(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-44 h-44 mx-auto rounded-2xl bg-gradient-to-b from-[#f2f8fc] to-[#e2eff7] p-4 flex items-center justify-center">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-[#0a4d7a]">
                {selectedCharacter.name}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedCharacter.description}
              </p>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="w-full py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-[#0a4d7a] transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Bottom Transition Banner */}
      <div className="text-center pt-4">
        <button
          onClick={onStartJourney}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-[#0c6aa7] via-[#0a4d7a] to-[#05528f] hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
        >
          <span>المتابعة إلى دليل طيف التوحد والأسئلة الشائعة</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
