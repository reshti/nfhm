export interface GameItemConfig {
  id: string;
  name: string;
  tag: string;
  enabled: boolean;
  order: number;
}

export interface GamesSystemConfig {
  celebrationEnabled: boolean;
  balloonAnimationSeconds: number; // default 3 seconds as requested
  fireworksEnabled: boolean;
  games: Record<string, boolean>;
}

export const DEFAULT_GAMES_SYSTEM_CONFIG: GamesSystemConfig = {
  celebrationEnabled: true,
  balloonAnimationSeconds: 3,
  fireworksEnabled: true,
  games: {
    puzzle: true, // لعبة ركّب الصورة (بازل التوحد)
    maze: true, // لعبة متاهة الوعي والدمج
    emotion: true, // لعبة طابق المشاعر
    routine: true, // لعبة رتّب يومك
    sensory: true, // لعبة اكتشف العالم الحسي
    communication: true, // لعبة اختر طريقة التواصل
    factmyth: true, // لعبة حقيقة أم خرافة
  },
};

export const GAME_DETAILS: { id: string; name: string; tag: string; description: string }[] = [
  {
    id: 'puzzle',
    name: 'لعبة ركّب الصورة (بازل التوحد التفاعلي)',
    tag: 'أحاجي بصرية وتفكير',
    description: 'تركيب قطع بازل طيف التوحد بـ 3 مستويات تعزز التركيز والتعرف على الرسائل التربوية.',
  },
  {
    id: 'maze',
    name: 'متاهة الوعي والدمج',
    tag: 'استكشاف ومحطات تفاعلية',
    description: 'تخطي المتاهة والإجابة عن محطات المعرفة لفتح البوابات وجمع النجوم حتى النهاية.',
  },
  {
    id: 'emotion',
    name: 'طابق المشاعر وتنوع التعبير',
    tag: 'ذكاء انفعالي وتقبل',
    description: 'مواقف يومية تستكشف تنوع التعبير وتقبل الفروق في إظهار المشاعر دون تنميط.',
  },
  {
    id: 'routine',
    name: 'رتّب يومك والجداول البصرية',
    tag: 'روتين وتنظيم يومي',
    description: 'ترتيب متسلسل لأنشطة اليوم لاكتشاف أثر الجداول البصرية في تعزيز الأمان والهدوء.',
  },
  {
    id: 'sensory',
    name: 'اكتشف العالم الحسي',
    tag: 'بيئات حسية صديقة',
    description: 'محاكاة تفاعلية لتعديل الصوت والضوء والبيئة لتكون متوافقة مع الحواس.',
  },
  {
    id: 'communication',
    name: 'اختر طريقة التواصل (وسائل AAC)',
    tag: 'تواصل معزز وبديل',
    description: 'استكشاف وسائل التواصل البديلة كالبطاقات البصرية والإشارات والأجهزة الناطقة.',
  },
  {
    id: 'factmyth',
    name: 'حقيقة أم خرافة؟',
    tag: 'تصحيح المفاهيم وتفنيد الشائعات',
    description: 'تحدي معرفي لتفنيد المفاهيم المغلوطة بالاستناد إلى مراجع علمية موثوقة.',
  },
];

const STORAGE_KEY_GAMES_CONFIG = 'nafham_games_system_config_v2';

export function loadGamesConfig(): GamesSystemConfig {
  if (typeof window === 'undefined') return DEFAULT_GAMES_SYSTEM_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GAMES_CONFIG);
    if (!raw) return DEFAULT_GAMES_SYSTEM_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_GAMES_SYSTEM_CONFIG,
      ...parsed,
      games: {
        ...DEFAULT_GAMES_SYSTEM_CONFIG.games,
        ...(parsed.games || {}),
      },
    };
  } catch {
    return DEFAULT_GAMES_SYSTEM_CONFIG;
  }
}

export function saveGamesConfig(config: GamesSystemConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_GAMES_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save games system config:', e);
  }
}

export function isGameEnabled(gameId: string): boolean {
  const config = loadGamesConfig();
  return config.games[gameId] ?? true;
}
