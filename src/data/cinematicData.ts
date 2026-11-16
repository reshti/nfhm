/**
 * Documentary Video Chapters & Cinematic Data for «الفيلم التعريفي لمنصة نفهم»
 * Synchronized with the official Nafham Documentary Video (7:18)
 */

export interface VideoChapter {
  id: number;
  chapterNumber?: number;
  title: string;
  subtitle: string;
  startTime: number; // in seconds
  endTime: number;
  headlineQuote: string;
  summary: string;
  keyPoints: string[];
  badge: string;
  iconName: string;
}

export interface SupportStep {
  number: number;
  title: string;
  description: string;
  iconName: string;
}

export interface CinematicSubtitle {
  startTime: number;
  endTime: number;
  text: string;
}

export interface CinematicScene {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
  startTime?: number;
  endTime?: number;
  bgImage: string;
  fallbackImage: string;
  headlineQuote: string;
  narrativeText: string;
  displaySubtitles: CinematicSubtitle[];
  subtitles: CinematicSubtitle[];
  educationalPoints?: string[];
  supportSteps?: SupportStep[];
}

export const NAFHAM_DOCUMENTARY_INFO = {
  videoSrc: '/api/video/documentary',
  fallbackSrc: '/assets/aistudio/nafham_documentary.mp4',
  title: 'الفيلم التعريفي لمنصة «نفهم»',
  subtitle: 'الفهم بداية التقبل · رحلة وعي وتعاطف شاملة لاضطراب طيف التوحد',
  slogan: 'لأن الفهم بداية التقبل',
  totalDurationSeconds: 399, // 6 mins 39 secs
  supervision: 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب',
};

export const NAFHAM_VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 0,
    title: 'المقدمة: رحلة الوعي والتعاطف',
    subtitle: 'منصة نفهم: الفهم بداية التقبل',
    startTime: 0,
    endTime: 46,
    badge: 'البداية والتأمل',
    iconName: 'Sparkles',
    headlineQuote: '«مو كل اختلاف نشوفه.. يعني مشكلة، وراء كل سلوك إنسان يستحق الفهم»',
    summary:
      'نمر جميعاً بمواقف نرى فيها طفلاً أو شخصاً يتصرف بطريقة مختلفة قليلاً عما اعتدنا عليه. التوقف عن الحكم والتأمل الصادق هو الخطوة الأولى لاكتشاف عالمه الفريد.',
    keyPoints: [
      'التوقف عن الحكم الظاهري المتعجل على سلوكيات الآخرين.',
      'السلوك غير المألوف قد يكون وسيلة للتعامل مع بيئة حسية مجهدة.',
      'كل إنسان له طريقته الخاصة في استيعاب العالم والتعبير عنه.',
    ],
  },
  {
    id: 1,
    chapterNumber: 1,
    title: 'القسم الأول: طبيعة طيف التوحد',
    subtitle: 'اختلاف نمائي عصبي فريد وبصمة خاصة',
    startTime: 46,
    endTime: 93,
    badge: 'التنوع النمائي',
    iconName: 'Brain',
    headlineQuote: '«طيف التوحد اختلاف نمائي عصبي.. نظام تشغيل فريد لدماغ متميز»',
    summary:
      'اضطراب طيف التوحد يرتبط بطريقة نمو الدماغ ومعالجة المعلومات. وسمي طيفاً لعدم وجود قالب واحد؛ فلكل فرد قدراته واحتياجاته وبصمته المتفردة.',
    keyPoints: [
      'اختلاف عصبي نمائي وليس مرضاً أو عدوى أو نتيجة لسوء تربية.',
      'تنوع واسع في القدرات والاهتمامات ومستويات الدعم المطلوبة.',
      'نقاط قوة مدهشة في التركيز والدقة والذاكرة وحل المشكلات.',
    ],
  },
  {
    id: 2,
    chapterNumber: 2,
    title: 'القسم الثاني: التواصل والاختلافات',
    subtitle: 'تنوع طرق التعبير وأهمية الروتين',
    startTime: 93,
    endTime: 140,
    badge: 'طرق التعبير',
    iconName: 'Layers',
    headlineQuote: '«عدم الكلام لا يعني عدم الفهم.. طرق التعبير تتعدد وتتكامل»',
    summary:
      'التواصل لا يقتصر على الكلمات المنطوقة. الصور والجداول البصرية والإشارات والأجهزة المعززة (AAC) تصنع جسوراً متينة للتواصل الصادق والفعال.',
    keyPoints: [
      'احترام وتفعيل وسائل التواصل البديلة والمعززة (PECS / الأجهزة اللوحية).',
      'إعطاء وقت كافٍ للاستجابة ومعالجة الرسائل اللفظية.',
      'استخدام لغة واضحة ومباشرة وتجنب المجازات المبهمة.',
    ],
  },
  {
    id: 3,
    chapterNumber: 3,
    title: 'القسم الثالث: المعالجة الحسية والبيئة',
    subtitle: 'الأصوات والأضواء ومصادر الأمان والراحة',
    startTime: 140,
    endTime: 195,
    badge: 'العالم الحسي',
    iconName: 'Compass',
    headlineQuote: '«المثيرات الحسية العادية قد تعاش كألم حقيقي.. والبيئة المريحة تصنع الأمان»',
    summary:
      'الدماغ قد يستقبل الأصوات أو الإضاءة أو الروائح أو الملامس بشدة مضاعفة. توفير زوايا هادئة وسماعات ملغية للضوضاء وجدول روتيني منظم يقلل التوتر بصورة كبيرة.',
    keyPoints: [
      'مراعاة فرط الحساسية السمعية والبصرية وتكييف الإضاءة والضوضاء.',
      'أهمية الروتين اليومي والجداول المتوقعة في بث الطمأنينة والأمان.',
      'احترام السلوكيات النمطية المنظمة للذات (Stimming) طالما أنها آمنة.',
    ],
  },
  {
    id: 4,
    chapterNumber: 4,
    title: 'القسم الرابع: التعامل مع الانهيار الحسي',
    subtitle: 'خطوات المساعدة الآمنة والدعم الإنساني',
    startTime: 195,
    endTime: 260,
    badge: 'دعم لا لوم',
    iconName: 'HeartHandshake',
    headlineQuote: '«الانهيار استجابة لفرط الإثارة وليس نوبة عناد.. يحتاج احتواءً وهدوءاً»',
    summary:
      'حين تتراكم المؤثرات ويحدث الانهيار الحسي (Meltdown)، فالمطلوب 3 خطوات حاسمة: الحفاظ على السلامة أولاً، خفض المؤثرات وإبعاد الزحام، وتوفير وقت ومساحة آمنة دون لوم أو أسئلة.',
    keyPoints: [
      'توفير الأمان الجسدي ومنع الأذى دون تقييد غير مبرر.',
      'إبعاد الفضوليين وخفض الإضاءة والأصوات في المكان فوراً.',
      'تقليل الكلام والأسئلة ومنح الفرد وقتاً كافياً للتعافي التدريجي.',
    ],
  },
  {
    id: 5,
    chapterNumber: 5,
    title: 'القسم الخامس: تصحيح المفاهيم وبناء التقبل',
    subtitle: 'تفنيد الخرافات واستكشاف نقاط القوة',
    startTime: 260,
    endTime: 311,
    badge: 'حقائق علمية',
    iconName: 'Users',
    headlineQuote: '«الدمج مشاركة حقيقية وتعلم متبادل، وليس مجرد حضور في المكان»',
    summary:
      'تفنيد الخرافات الشائعة: ذوو التوحد يملكون عواطف نبيلة ومشاعر صادقة، ولا صلة بين اللقاحات والتوحد علمياً. الدمج المدرسي والمجتمعي يصنع بيئة غنية للجميع.',
    keyPoints: [
      'تفنيد خرافة البرود العاطفي: يملكون مشاعر فياضة ويعبرون بطرقهم الخاصة.',
      'التأكيد على براءة اللقاحات علمياً وإثبات المنشأ النمائي العصبي.',
      'الدمج الفعال يتطلب تهيئة الأقران والمعلمين والبيئة المحيطة.',
    ],
  },
  {
    id: 6,
    chapterNumber: 6,
    title: 'القسم السادس: منصة نفهم التفاعلية',
    subtitle: 'بوابات التعلم والألعاب التوعوية والمكتبة',
    startTime: 311,
    endTime: 373,
    badge: 'بوابات المنصة',
    iconName: 'Sparkles',
    headlineQuote: '«منصة نفهم.. أربعة مسارات متكاملة وألعاب تفاعلية تصنع وعياً حياً»',
    summary:
      'مساحة وطنية رائدة تحت إشراف جامعة الإمام عبدالرحمن بن فيصل تضم مسارات للطلاب والأسر والمعلمين والمجتمع، بالإضافة إلى مدينة الألعاب ومساعد نفهم الذكي.',
    keyPoints: [
      'مسارات موجهة لكل فئة مع أدوات تطبيقية وقصص مواقف يومية.',
      'مدينة ألعاب تفاعلية ومتاهة الوعي لترسيخ المفاهيم باللعب الهادف.',
      'شهادات وعي رقمية فورية مع إمكانية الإرسال عبر الواتساب.',
    ],
  },
  {
    id: 7,
    chapterNumber: 7,
    title: 'الخاتمة: لأن الفهم بداية التقبل',
    subtitle: 'دعوة مجتمعية للاحتواء ونشر الوعي والأمل',
    startTime: 373,
    endTime: 399,
    badge: 'الرسالة الخالدة',
    iconName: 'Heart',
    headlineQuote: '«لأن الفهم بداية التقبل.. معاً نفتح الأبواب ونصنع مجتمعاً يحتضن الجميع»',
    summary:
      'دعوة صادقة من فريق منصة نفهم وجامعة الإمام عبدالرحمن بن فيصل لنكون جميعاً سفراء للوعي بالتقبل والاحتواء وفتح الآفاق أمام كل موهبة وقدرة.',
    keyPoints: [
      'المعرفة الصادقة هي البوابة الأولى لبناء مجتمع دامج وشامل.',
      'كل خطوة دعم صغيرة تصنع أثراً عميقاً وممتداً في حياة الفرد وأسرته.',
      'رعاية وإشراف علمي موثوق من كلية الآداب بجامعة الإمام عبدالرحمن بن فيصل.',
    ],
  },
];

// Backwards-compatible scenes list matching video chapters
export const CINEMATIC_SCENES: CinematicScene[] = NAFHAM_VIDEO_CHAPTERS.map(
  (chap, idx) => ({
    id: chap.id === 0 ? 1 : chap.id + 1,
    key: `chapter_${chap.id}`,
    title: chap.title,
    subtitle: chap.subtitle,
    durationSeconds: chap.endTime - chap.startTime,
    startTime: chap.startTime,
    endTime: chap.endTime,
    bgImage: '/assets/aistudio/nafham_video_poster.jpg',
    fallbackImage: '/assets/aistudio/image_05133fa1.png',
    headlineQuote: chap.headlineQuote,
    narrativeText: chap.summary,
    displaySubtitles: [
      {
        startTime: 0,
        endTime: Math.round((chap.endTime - chap.startTime) / 2),
        text: chap.headlineQuote,
      },
      {
        startTime: Math.round((chap.endTime - chap.startTime) / 2),
        endTime: chap.endTime - chap.startTime,
        text: chap.summary,
      },
    ],
    get subtitles() {
      return this.displaySubtitles;
    },
    educationalPoints: chap.keyPoints,
  })
);

export interface PortalDoor {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  targetView: 'games' | 'library' | 'adventure' | 'assistant';
  badge: string;
  image: string;
  accentColor: string;
  description: string;
}

export const CINEMATIC_PORTALS: PortalDoor[] = [
  {
    id: 'games',
    title: 'مدينة الألعاب التفاعلية',
    subtitle: 'عش تجربة وتعلم باللعب الهادف',
    category: 'مدينة الألعاب',
    targetView: 'games',
    badge: '6 ألعاب هادفة',
    image: '/assets/aistudio/image_ebab93db.png',
    accentColor: '#f59e0b',
    description: 'أحاجي بصرية، المشاعر، تنظيم الروتين، ومحاكي الحواس لتعليم باللعب.',
  },
  {
    id: 'library',
    title: 'مكتبة المعرفة والتوثيق',
    subtitle: 'دليل علمي محكم وشامل',
    category: 'المعرفة والفهم',
    targetView: 'library',
    badge: '10 موضوعات محكمة',
    image: '/assets/aistudio/image_ff4eaba6.png',
    accentColor: '#0c6aa7',
    description: 'دليل علمي شامل يغطي التعريف، الاختلافات الحسية، الدمج، وطرائق الدعم.',
  },
  {
    id: 'adventure',
    title: 'مغامرة نفهم الاستكشافية',
    subtitle: 'رحلة المحطات الست وسفير الوعي',
    category: 'المغامرة التفاعلية',
    targetView: 'adventure',
    badge: 'شهادة سفير معتمدة',
    image: '/assets/aistudio/image_2885b67b.png',
    accentColor: '#2eb9df',
    description: 'خض رحلة تفاعلية من 6 محطات واكسب شهادة سفير معتمد من المبادرة.',
  },
  {
    id: 'assistant',
    title: 'رفيق نفهم الذكي',
    subtitle: 'اسأل رفيق نفهم واستشر الذكاء الاصطناعي',
    category: 'المساعد الأكاديمي',
    targetView: 'assistant',
    badge: 'استجابة علمية فورية',
    image: '/assets/aistudio/image_ff4eaba6.png',
    accentColor: '#0a4d7a',
    description: 'حاور المساعد الذكي المعتمد المدرب على مصادر WHO وCDC والجامعة.',
  },
];
