import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Award,
  GraduationCap,
  Sparkles,
  Heart,
  BookOpen,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  specialty: string;
  bio: string;
  avatar?: string;
  badge?: string;
  isLeader?: boolean;
}

export interface TeamSettings {
  layout:
    | 'glass_cards'
    | 'academic_grid'
    | 'spotlight'
    | 'creative_minimal'
    | 'interactive_carousel'
    | 'orbit_badges';
  animationEffect: 'fade_up' | 'scale_in' | 'stagger';
  sectionTitle: string;
  sectionSubtitle: string;
  members: TeamMember[];
}

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'shahad',
    name: 'شهد حسن عبدالرحمن',
    role: 'قائدة ومؤسسة مبادرة «نفهم»',
    affiliation: 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب',
    specialty: 'التربية الخاصة والوعي باضطراب طيف التوحد',
    bio: 'صاحبة الرؤية والمبادرة لتطوير منصة تفاعلية وطنية تمزج بين العلم النظري والتعاطف الإنساني لتعزيز الدمج والتقبل الشامل.',
    badge: 'قائدة المشروع والرؤية',
    isLeader: true,
  },
  {
    id: 'academic_supervision',
    name: 'لجنة الإشراف الأكاديمي والتحكيم',
    role: 'الإشراف العلمي والتربوي',
    affiliation: 'جامعة الإمام عبدالرحمن بن فيصل',
    specialty: 'كلية الآداب وأقسام التربية وعلم النفس',
    bio: 'مراجعة وتدقيق المحتوى المعرفي، بنك الأسئلة، واستراتيجيات التعامل مع الانهيار الحسي وفق أحدث الأدلة المعرفية.',
    badge: 'إشراف أكاديمي معتمد',
    isLeader: false,
  },
  {
    id: 'creative_media',
    name: 'فريق الإنتاج الإبداعي والموشن جرافيكس',
    role: 'التصميم والوسائط التفاعلية',
    affiliation: 'منصة نفهم التوعوية',
    specialty: 'الرسوم التوضيحية وتجربة المستخدم والإخراج الرقمي',
    bio: 'تصميم الهوية البصرية اللطيفة والفيلم التعريفي والبيئات التفاعلية الميسرة لذوي التحديات البصرية والحسية.',
    badge: 'إنتاج وإخراج فني',
    isLeader: false,
  },
];

export const DEFAULT_TEAM_SETTINGS: TeamSettings = {
  layout: 'glass_cards',
  animationEffect: 'fade_up',
  sectionTitle: 'فريق العمل والقيادة الإشرافية',
  sectionSubtitle: 'نخبة مخلصة من الكفاءات الأكاديمية والإبداعية تقود مبادرة «نفهم» نحو مجتمعٍ واعٍ ومتقبل',
  members: DEFAULT_TEAM_MEMBERS,
};

export const TeamSection: React.FC = () => {
  const [settings, setSettings] = useState<TeamSettings>(DEFAULT_TEAM_SETTINGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nafham_team_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.members) && parsed.members.length > 0) {
          setSettings(parsed);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  const leader = settings.members.find((m) => m.isLeader) || settings.members[0];
  const otherMembers = settings.members.filter((m) => m.id !== leader?.id);

  return (
    <section className="my-16 relative overflow-hidden font-['Tajawal']" dir="rtl">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#0c6aa7]/10 via-[#2eb9df]/10 to-[#0a4d7a]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c6aa7]/10 text-[#0a4d7a] border border-[#0c6aa7]/20 text-xs font-bold shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#0c6aa7]" />
            <span>صنّاع الأثر والوعي</span>
            <span className="text-slate-300">·</span>
            <span>جامعة الإمام عبدالرحمن بن فيصل</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0a4d7a] tracking-tight">
            {settings.sectionTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {settings.sectionSubtitle}
          </p>
        </div>

        {/* 1. GLASS CARDS LAYOUT (Default & Modern) */}
        {settings.layout === 'glass_cards' && (
          <div className="space-y-6">
            {/* Featured Leader Card */}
            {leader && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden bg-gradient-to-br from-white via-[#f0f7fc] to-[#e6f2fa] rounded-3xl p-6 sm:p-10 border-2 border-[#0c6aa7]/30 shadow-lg"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
                  {/* Leader Avatar & Badge */}
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-[#0a4d7a] via-[#0c6aa7] to-[#2eb9df] p-1 shadow-xl">
                      <div className="w-full h-full rounded-[22px] bg-white flex flex-col items-center justify-center p-3 text-center overflow-hidden relative">
                        <GraduationCap className="w-12 h-12 text-[#0c6aa7] mb-1" />
                        <span className="text-[11px] font-black text-[#0a4d7a] line-clamp-1">
                          قائدة المبادرة
                        </span>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{leader.badge || 'القيادة'}</span>
                    </div>
                  </div>

                  {/* Leader Info */}
                  <div className="flex-1 text-center lg:text-right space-y-3">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                      <h3 className="text-2xl sm:text-3xl font-black text-[#0a4d7a]">
                        {leader.name}
                      </h3>
                      <span className="bg-[#0c6aa7]/15 text-[#0a4d7a] text-xs font-bold px-3 py-1 rounded-full border border-[#0c6aa7]/20">
                        {leader.role}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-[#0c6aa7] flex flex-wrap items-center justify-center lg:justify-start gap-2">
                      <span>{leader.affiliation}</span>
                      <span>·</span>
                      <span className="text-slate-600">{leader.specialty}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-3xl">
                      {leader.bio}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0c6aa7]/20 text-[#0a4d7a] font-bold shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>إشراف وتأسيس معتمد</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0c6aa7]/20 text-[#0a4d7a] font-bold shadow-xs">
                        <BookOpen className="w-4 h-4 text-[#0c6aa7]" />
                        <span>رؤية أكاديمية وإنسانية</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other Members Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {otherMembers.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0c6aa7]/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0a4d7a]/10 to-[#2eb9df]/20 text-[#0c6aa7] flex items-center justify-center shrink-0 border border-[#0c6aa7]/20">
                      <Users className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-black text-[#0a4d7a]">{member.name}</h4>
                        {member.badge && (
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                            {member.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#0c6aa7]">{member.role}</div>
                      <div className="text-[11px] text-slate-500">{member.affiliation}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {member.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-[#0a4d7a] font-bold flex items-center justify-between">
                    <span>{member.specialty}</span>
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ACADEMIC GRID LAYOUT */}
        {settings.layout === 'academic_grid' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-3xl p-6 border text-right space-y-4 shadow-sm flex flex-col justify-between ${
                  member.isLeader ? 'border-[#0c6aa7] ring-2 ring-[#0c6aa7]/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0a4d7a]/10 text-[#0a4d7a]">
                      {member.badge || 'عضو الفريق'}
                    </span>
                    <GraduationCap className="w-5 h-5 text-[#0c6aa7]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#0a4d7a]">{member.name}</h4>
                    <div className="text-xs font-bold text-[#0c6aa7] mt-0.5">{member.role}</div>
                    <div className="text-[11px] text-slate-500">{member.affiliation}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {member.bio}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-[#0a4d7a]">
                  {member.specialty}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 3. SPOTLIGHT SHOWCASE */}
        {settings.layout === 'spotlight' && (
          <div className="space-y-8">
            {leader && (
              <div className="bg-gradient-to-r from-[#0a4d7a] to-[#0c6aa7] text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-4">
                <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-cyan-200">
                  {leader.badge || 'القيادة والتأسيس'}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black">{leader.name}</h3>
                <p className="text-base sm:text-lg text-cyan-100 font-bold">{leader.role} · {leader.affiliation}</p>
                <p className="text-xs sm:text-sm text-cyan-50 max-w-3xl mx-auto leading-relaxed">
                  {leader.bio}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherMembers.map((m) => (
                <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <h4 className="text-base font-black text-[#0a4d7a]">{m.name}</h4>
                  <div className="text-xs font-bold text-[#0c6aa7]">{m.role}</div>
                  <p className="text-xs text-slate-600">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CREATIVE MINIMAL */}
        {settings.layout === 'creative_minimal' && (
          <div className="divide-y divide-slate-200 bg-white rounded-3xl border border-[#0c6aa7]/20 shadow-sm p-4 sm:p-6">
            {settings.members.map((m) => (
              <div key={m.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#0a4d7a]">{m.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0c6aa7]">
                      {m.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{m.affiliation} · {m.specialty}</p>
                </div>
                <div className="text-xs text-slate-500 max-w-md">{m.bio}</div>
              </div>
            ))}
          </div>
        )}

        {/* 5. INTERACTIVE CAROUSEL / HORIZONTAL TILES */}
        {settings.layout === 'interactive_carousel' && (
          <div className="flex gap-5 overflow-x-auto pb-4 pt-2 snap-x scrollbar-thin scrollbar-thumb-[#0c6aa7]/30">
            {settings.members.map((m, idx) => (
              <motion.div
                key={m.id}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`min-w-[300px] sm:min-w-[340px] flex-1 bg-white rounded-3xl p-6 border shadow-sm transition-all flex flex-col justify-between space-y-4 snap-center ${
                  m.isLeader ? 'border-[#0c6aa7] bg-gradient-to-b from-white to-[#f0f7fb] ring-2 ring-[#0c6aa7]/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0a4d7a] to-[#2eb9df] text-white flex items-center justify-center font-bold shadow-xs">
                      {m.isLeader ? <GraduationCap className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#0c6aa7]/10 text-[#0a4d7a]">
                      {m.badge || (m.isLeader ? 'القيادة والتأسيس' : 'فريق العمل')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-[#0a4d7a]">{m.name}</h4>
                    <div className="text-xs font-bold text-[#0c6aa7] mt-0.5">{m.role}</div>
                    <div className="text-[11px] text-slate-500">{m.affiliation}</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-4">
                    {m.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-[#0a4d7a] flex items-center justify-between">
                  <span>{m.specialty}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 6. ORBIT BADGES (LUMINOUS VISUAL MOSAIC) */}
        {settings.layout === 'orbit_badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.members.map((m, idx) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-[#f0f7fb] rounded-3xl p-6 border-2 border-[#2eb9df]/30 shadow-md text-right space-y-4"
              >
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#0c6aa7]/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0a4d7a] to-[#2eb9df] text-white flex items-center justify-center shadow-md shrink-0 border-2 border-white">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#c59b27] uppercase tracking-wider block">
                      {m.badge || 'عضو معتمد'}
                    </span>
                    <h4 className="text-base font-black text-[#0a4d7a]">{m.name}</h4>
                    <div className="text-xs font-bold text-[#0c6aa7]">{m.role}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {m.bio}
                </p>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span>{m.affiliation}</span>
                  <span className="text-[#0c6aa7]">{m.specialty}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
