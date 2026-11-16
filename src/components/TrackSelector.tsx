import React, { useState } from 'react';
import {
  Users,
  Smile,
  Heart,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { NAFHAM_TRACKS } from '../data/tracksData';
import { EducationalTrack, TargetAudience } from '../types/nafham';

interface TrackSelectorProps {
  onSelectTrackTopic?: (topicId: string) => void;
  onSelectTrackGame?: (gameId: string) => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
  onSelectTrackTopic,
  onSelectTrackGame,
}) => {
  const [activeTrackId, setActiveTrackId] = useState<TargetAudience>('children');
  const activeTrack = NAFHAM_TRACKS.find((t) => t.id === activeTrackId) || NAFHAM_TRACKS[0];

  const getIcon = (id: TargetAudience) => {
    switch (id) {
      case 'children':
        return Smile;
      case 'parents':
        return Heart;
      case 'teachers':
        return GraduationCap;
      case 'community':
        return Users;
    }
  };

  return (
    <div className="space-y-8 py-6 text-right">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e1eff8] rounded-full text-xs font-bold text-[#0c6aa7]">
          <Sparkles className="w-4 h-4 text-[#2eb9df]" />
          <span>بوابة: من أنت؟ اختر رحلتك في نفهم</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4d7a]">
          مسارات توعوية مخصصة لجميع أفراد المجتمع
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          منصة نفهم موجهة للجميع. اختر الفئة التي تنتمي إليها للاطلاع على النصائح والأنشطة الأنسب
          لك، مع إمكانية تصفح جميع المسارات بحرية تامة في أي وقت.
        </p>
      </div>

      {/* 4 Interactive Track Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {NAFHAM_TRACKS.map((track) => {
          const Icon = getIcon(track.id);
          const isSelected = activeTrackId === track.id;
          return (
            <div
              key={track.id}
              onClick={() => setActiveTrackId(track.id)}
              className={`rounded-3xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group ${
                isSelected
                  ? 'bg-white border-[#0c6aa7] shadow-md ring-2 ring-[#0c6aa7]/20 -translate-y-1'
                  : 'bg-white/90 hover:bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="space-y-3">
                {/* Track visual image */}
                <div className="w-full aspect-16/10 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      if (track.id === 'children') {
                        (e.target as HTMLImageElement).src = '/assets/aistudio/nafham_children_students.jpg';
                      } else if (track.id === 'parents') {
                        (e.target as HTMLImageElement).src = '/assets/aistudio/nafham_parents_families.jpg';
                      } else if (track.id === 'teachers') {
                        (e.target as HTMLImageElement).src = '/assets/aistudio/nafham_teachers_specialists.jpg';
                      } else {
                        (e.target as HTMLElement).style.display = 'none';
                      }
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl shadow-xs text-[#0a4d7a]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#0c6aa7] bg-[#f0f7fb] px-2 py-0.5 rounded-md inline-block">
                    {track.badge}
                  </span>
                  <h3 className="text-base font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors">
                    {track.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {track.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-[#0c6aa7]' : 'text-slate-400'}>
                  {isSelected ? 'المسار النشط' : 'استكشف المسار'}
                </span>
                <ArrowLeft
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-[#0c6aa7] -translate-x-1' : 'text-slate-300'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Track Detailed Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
        {/* Banner image for the selected track */}
        <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-slate-900 aspect-16/9 sm:aspect-21/9 max-h-80 w-full relative group">
          <img
            src={activeTrack.image}
            alt={activeTrack.title}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            onError={(e) => {
              if (activeTrack.id === 'children') {
                (e.target as HTMLImageElement).src = '/assets/aistudio/nafham_children_students.jpg';
              } else if (activeTrack.id === 'parents') {
                (e.target as HTMLImageElement).src = '/assets/aistudio/nafham_parents_families.jpg';
              } else if (activeTrack.id === 'teachers') {
                (e.target as HTMLImageElement).src = '/assets/aistudio/nafham_teachers_specialists.jpg';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 right-4 left-4 flex items-center justify-between text-white text-xs font-bold drop-shadow-md">
            <span>{activeTrack.title} · {activeTrack.badge}</span>
            <span className="text-[11px] text-white/80 hidden sm:inline">جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0c6aa7] bg-[#f0f7fb] px-3 py-1 rounded-md border border-[#cbe3f3]">
              تفاصيل مسار: {activeTrack.title}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0a4d7a]">
              {activeTrack.subtitle}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            برعاية جامعة الإمام عبدالرحمن بن فيصل
          </span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-normal">
          {activeTrack.description}
        </p>

        {/* Key Educational Advice for this audience */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-[#0a4d7a] uppercase tracking-wider">
            أهم الإرشادات والنصائح المخصصة لهذه الفئة:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeTrack.keyAdvice.map((advice, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#fafcfe] border border-[#e1eff8] text-xs sm:text-sm text-[#0a4d7a] font-medium leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2eb9df] shrink-0 mt-0.5" />
                <span>{advice}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
