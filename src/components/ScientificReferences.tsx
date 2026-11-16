import React, { useState, useMemo } from 'react';
import {
  BookCheck,
  Search,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle,
  Filter,
  BookmarkCheck,
  GraduationCap,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { NAFHAM_SCIENTIFIC_SOURCES } from '../data/sourcesData';

export const ScientificReferences: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    NAFHAM_SCIENTIFIC_SOURCES.forEach((s) => set.add(s.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredSources = useMemo(() => {
    return NAFHAM_SCIENTIFIC_SOURCES.filter((s) => {
      const matchesCategory =
        selectedCategory === 'all' || s.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.publisher.toLowerCase().includes(query) ||
        s.topic.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0a4d7a] to-[#0c6aa7] rounded-3xl p-6 sm:p-10 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-cyan-300" />
            <span>المصداقية العلمية والاعتماد الأكاديمي</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
            <img
              src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
              alt="جامعة الإمام عبدالرحمن بن فيصل"
              className="h-6 w-auto object-contain brightness-0 invert"
            />
            <span className="text-[11px] font-bold text-white/90">جامعة الإمام عبدالرحمن بن فيصل</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          المراجع والمصادر العلمية المعتمدة
        </h1>
        <p className="text-blue-100 text-sm sm:text-base max-w-3xl leading-relaxed">
          انطلاقاً من الإشراف الأكاديمي لجامعة الإمام عبدالرحمن بن فيصل، تعتمد منصة «نفهم» على أرقى الأدلة العلمية المسندة والتصنيفات الطبية العالمية المعترف بها لضمان دقة المعلومة ومحاربة المفاهيم الخاطئة.
        </p>

        <div className="pt-2 flex flex-wrap gap-3 text-xs text-blue-100 font-bold">
          <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>مراجعة أكاديمية مستمرة</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg">
            <CheckCircle className="w-4 h-4 text-cyan-300" />
            <span>تحديث وفق أحدث دراسات 2026</span>
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، الناشر (IAU, WHO, DSM...)، الموضوع..."
              className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-300 focus:border-[#0c6aa7] focus:ring-2 focus:ring-[#0c6aa7]/20 text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="text-xs font-bold text-slate-500 flex items-center gap-2 self-start md:self-auto">
            <BookmarkCheck className="w-4 h-4 text-[#0c6aa7]" />
            <span>
              عرض {filteredSources.length} من {NAFHAM_SCIENTIFIC_SOURCES.length} مصدراً معتمداً
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 ml-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>التصنيف:</span>
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === 'all' ? 'جميع المراجع' : cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#0a4d7a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sources Grid */}
      <div className="space-y-4">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#0c6aa7]/60 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0c6aa7] text-[11px] font-extrabold border border-blue-200">
                    {source.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>آخر مراجعة: {source.lastReviewed}</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0a4d7a]">
                  {source.name}
                </h2>
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>الجهة المصدرة: {source.publisher}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyLink(source.id, source.url)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="نسخ رابط المرجع"
                >
                  {copiedId === source.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>زيارة المصدر الرسمي</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Scope / Topic */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
              <span className="font-extrabold text-slate-800">مجال الاستناد والدراسة: </span>
              <span className="text-slate-600 font-medium">{source.topic}</span>
            </div>

            {/* Scientific Summary */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {source.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
