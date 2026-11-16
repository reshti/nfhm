import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  ZoomIn,
  X,
  Heart,
  Share2,
  CheckCircle2,
  Tag,
  Info,
} from 'lucide-react';
import { NAFHAM_CONTENT, IdentityCharacter } from '../data/nafhamData';
import {
  brandLogoDataUri,
  mascotHeaderDataUri,
  heroImageDataUri,
  char1DataUri,
  char2DataUri,
  char3DataUri,
  char4DataUri,
  char5DataUri,
  definitionBannerDataUri,
  careRule1DataUri,
  careRule2DataUri,
  careRule3DataUri,
  careRule4DataUri,
  careRule5DataUri,
} from '../data/embeddedImages';

interface GalleryItem {
  id: string;
  title: string;
  category: 'characters' | 'care_rules' | 'brand';
  categoryLabel: string;
  image: string;
  description: string;
  educationalMeaning: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'char-1',
    title: 'الهدوء والسكينة',
    category: 'characters',
    categoryLabel: 'شخصيات الهوية البصرية',
    image: char1DataUri,
    description: 'رمز السلام الداخلي والتوازن الحسي في البيئات الهادئة والمريحة.',
    educationalMeaning:
      'تمثل هذه الشخصية حاجة الكثير من الأشخاص على طيف التوحد إلى فترات سكون لتنظيم المدخلات الحسية وتفريغ الإجهاد العصبي، حيث تسهم الأركان الهادئة في دعم استقرارهم وتركيزهم.',
  },
  {
    id: 'char-2',
    title: 'التواصل والاهتمام',
    category: 'characters',
    categoryLabel: 'شخصيات الهوية البصرية',
    image: char2DataUri,
    description: 'رمز التركيز والشغف العميق في مجالات الاهتمام المتفردة والخاصة.',
    educationalMeaning:
      'يسلط الضوء على نقاط القوة المعرفية؛ إذ يتمتع ذوو التوحد بقدرات استثنائية على الغوص العميق في موضوعات اهتمامهم المتخصصة، مما يصنع منهم مبدعين وباحثين مميزين حين يجدون البيئة الحاضنة.',
  },
  {
    id: 'char-3',
    title: 'التفرد والتنوع',
    category: 'characters',
    categoryLabel: 'شخصيات الهوية البصرية',
    image: char3DataUri,
    description: 'رمز للطيف الواسع واختلاف القدرات والمواهب بين كل شخص وآخر.',
    educationalMeaning:
      'تذكير دائم بأن التوحد هو "طيف" واسع تتنوع فيه المهارات والاحتياجات، فلا يوجد شخصان على الطيف متطابقان، واحترام هذا التفرد هو أولى خطوات الاحتواء العادل.',
  },
  {
    id: 'char-4',
    title: 'الدفء والاحتواء',
    category: 'characters',
    categoryLabel: 'شخصيات الهوية البصرية',
    image: char4DataUri,
    description: 'رمز التقبل المجتمعي والدعم الإيجابي لنمو المهارات والاستقلالية.',
    educationalMeaning:
      'يجسد دور الأسرة والمدرسة والمجتمع في بناء بيئة دافئة خالية من التنمر أو الوصم، قائمة على المحبة غير المشروطة والمؤازرة الصادقة.',
  },
  {
    id: 'char-5',
    title: 'الإلهام والبهجة',
    category: 'characters',
    categoryLabel: 'شخصيات الهوية البصرية',
    image: char5DataUri,
    description: 'رمز الفرح والانطلاق في بيئة تقدر الاختلاف وتفتح آفاق المشاركة.',
    educationalMeaning:
      'يعبر عن حق كل طفل وإنسان على طيف التوحد في أن يعيش طفولته وحياته ببهجة وكرامة ومشاركة مجتمعية كاملة في الأنشطة المدرسية والترفيهية.',
  },
  {
    id: 'care-1',
    title: 'فهم السلوكيات والاحتياجات',
    category: 'care_rules',
    categoryLabel: 'قواعد الرعاية والدعم',
    image: careRule1DataUri,
    description: 'كل سلوك هو وسيلة تواصل تعبر عن رغبة أو حاجة أو رد فعل حسي.',
    educationalMeaning:
      'السلوك ليس مشكلة بحد ذاته بل رسالة تحثنا على البحث عما وراءه: هل هناك انزعاج حسي؟ أم صعوبة في التعبير؟ أم حاجة للاستراحة؟',
  },
  {
    id: 'care-2',
    title: 'التواصل الواضح المباشر',
    category: 'care_rules',
    categoryLabel: 'قواعد الرعاية والدعم',
    image: careRule2DataUri,
    description: 'استخدام جمل محددة وإعطاء وقت كافٍ لمعالجة الكلام.',
    educationalMeaning:
      'التواصل البسيط المباشر الخالي من المجازات المعقدة يمنح الأمان ويمنع سوء الفهم ويسهل التفاعل اليومي الإيجابي.',
  },
  {
    id: 'care-3',
    title: 'أهمية الروتين والتوقعات',
    category: 'care_rules',
    categoryLabel: 'قواعد الرعاية والدعم',
    image: careRule3DataUri,
    description: 'الجدول البصري والروتين الثابت يقللان القلق ويمنحان شعوراً بالسيطرة.',
    educationalMeaning:
      'معرفة ما سيحدث تالياً تمنح الفرد الطمأنينة وتقلل نوبات التوتر والارتباك التي قد تحدث عند التغيرات المفاجئة.',
  },
  {
    id: 'care-4',
    title: 'مراعاة الحساسية الحسية',
    category: 'care_rules',
    categoryLabel: 'قواعد الرعاية والدعم',
    image: careRule4DataUri,
    description: 'تعديل الإضاءة وخفض الضجيج وتوفير مساحات استرخاء آمنة.',
    educationalMeaning:
      'البيئة الحساسة هي بيئة ممكنة وداعمة تتيح للطفل والبالغ ذوي التوحد الاندماج والتعلم براحة تامة دون إجهاد حواسه.',
  },
  {
    id: 'care-5',
    title: 'الدمج والتقبل المجتمعي',
    category: 'care_rules',
    categoryLabel: 'قواعد الرعاية والدعم',
    image: careRule5DataUri,
    description: 'فتح فرص الصداقة والمشاركة في التعليم والعمل دون استبعاد.',
    educationalMeaning:
      'التقبل الحقيقي يعني إتاحة نفس الفرص لجميع الأفراد ليكونوا جزءاً فاعلاً ومقدراً في نسيج المجتمع والوطن.',
  },
  {
    id: 'brand-logo',
    title: 'شعار نفهم الرسمي',
    category: 'brand',
    categoryLabel: 'شعار وهوية المنصة',
    image: brandLogoDataUri,
    description: 'الشعار المعتمد لمنصة نفهم التوعوية برعاية جامعة الإمام عبدالرحمن بن فيصل.',
    educationalMeaning:
      'يمزج الشعار بين خطوط عربية رشيقة واللونين الأزرق والفيروزي، رمزاً للعمق المعرفي والنقاء والسكينة والتقبل الإنساني.',
  },
  {
    id: 'hero-banner',
    title: 'لوحة الترحيب والانطلاق',
    category: 'brand',
    categoryLabel: 'شعار وهوية المنصة',
    image: heroImageDataUri,
    description: 'اللوحة الفنية الرئيسية الترحيبية للرحلة التوعوية.',
    educationalMeaning:
      'تجسد بيئة مجتمعية محتضنة تجمع الطلاب والأسر والمعلمين في مساحة واحدة تسودها المحبة والتفاهم.',
  },
];

export const VisualGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-8 py-6 text-right max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-l from-[#0a4d7a] to-[#0c6aa7] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white border border-white/20">
            <Palette className="w-4 h-4 text-[#2eb9df]" />
            <span>معرض الرسومات والهوية البصرية</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            لوحات ورسومات تعبر عن عالم التقبل
          </h1>

          <p className="text-white/85 text-sm sm:text-base max-w-3xl leading-relaxed">
            احتفظنا بجميع رسومات وشخصيات نفهم الأصلية، وأضفنا لكل لوحة بعداً تعليمياً وتفسيراً
            حسياً واجتماعياً. انقر على أي لوحة لاستعراضها بحجم كبير والتعرف على دلالتها.
          </p>
        </div>
      </div>

      {/* 2. Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'جميع اللوحات والرسومات (12)' },
          { id: 'characters', label: 'شخصيات الهوية الخمس' },
          { id: 'care_rules', label: 'قواعد الرعاية والدعم' },
          { id: 'brand', label: 'الشعار والهوية' },
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#0c6aa7] text-white border-[#0c6aa7] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. Artwork Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setPreviewItem(item)}
            className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#0c6aa7]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-4"
          >
            {/* Image Preview Box */}
            <div className="relative rounded-2xl overflow-hidden bg-[#f2f8fc] aspect-4/3 flex items-center justify-center p-4 border border-slate-100 group-hover:scale-[1.02] transition-transform">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-full max-w-full object-contain drop-shadow-sm"
              />
              <div className="absolute inset-0 bg-[#0a4d7a]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#0a4d7a] text-xs font-bold shadow-md">
                  <ZoomIn className="w-4 h-4" />
                  <span>عرض الشرح الكامل</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#0c6aa7] bg-[#e1eff8] px-2 py-0.5 rounded-md">
                  {item.categoryLabel}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0a4d7a] group-hover:text-[#0c6aa7] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 4. High-Res Detail Modal */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-right">
                <span className="text-xs font-bold text-[#0c6aa7] bg-[#e1eff8] px-2.5 py-0.5 rounded-md">
                  {previewItem.categoryLabel}
                </span>
                <h3 className="text-xl font-extrabold text-[#0a4d7a] mt-1">
                  {previewItem.title}
                </h3>
              </div>
            </div>

            {/* High-res Image Center */}
            <div className="bg-[#f2f8fc] rounded-2xl p-6 border border-slate-100 flex items-center justify-center max-h-72">
              <img
                src={previewItem.image}
                alt={previewItem.title}
                className="max-h-60 max-w-full object-contain drop-shadow-md"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                الوصف والرمزية:
              </h4>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                {previewItem.description}
              </p>
            </div>

            {/* Educational Meaning Box */}
            <div className="p-4 rounded-2xl bg-[#f2f8fc] border-r-4 border-[#0c6aa7] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0a4d7a]">
                <Info className="w-4 h-4 text-[#0c6aa7]" />
                <span>الدلالة التربوية والحسية المعتمدة:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {previewItem.educationalMeaning}
              </p>
            </div>

            {/* Footer Tag */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>منصة نفهم التوعوية · جامعة الإمام عبدالرحمن بن فيصل</span>
              <span className="font-bold text-[#0c6aa7]">«لأن الفهم بداية التقبل»</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
