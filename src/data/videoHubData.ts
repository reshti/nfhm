export type VideoTheme =
  | 'cinematic'
  | 'theater'
  | 'retro_tv'
  | 'live_stream'
  | 'child_puzzle';

export interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  poster: string;
  durationText: string;
  category: string;
  description: string;
}

export interface VideoHubConfig {
  isEnabled: boolean;
  defaultTheme: VideoTheme;
  activeVideoId: string;
  videos: VideoItem[];
  allowThemeSwitching: boolean;
  autoplaySoundPrompt: boolean;
}

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'doc_main',
    title: 'الفيلم التعريفي لمنصة «نفهم»',
    subtitle: '«الفهم بداية التقبل» · رحلة وعي شاملة باضطراب طيف التوحد (6:39 د)',
    url: '/assets/aistudio/nafham_5b6451e6.mp4?v=nafham_2026_v2',
    poster: '/assets/aistudio/nafham_video_poster.jpg',
    durationText: '06:39',
    category: 'الفيلم الوثائقي الرسمي',
    description:
      'الفيلم الرسمي لمبادرة نفهم برعاية جامعة الإمام عبدالرحمن بن فيصل (كلية الآداب) لاستكشاف طيف التوحد وتعزيز الدمج الإنساني.',
  },
  {
    id: 'doc_alt',
    title: 'العرض التعريفي التفاعلي البديل',
    subtitle: 'مبادرة نفهم التوعوية · نسخة تدفقية بديلة',
    url: '/assets/aistudio/nafham_documentary.mp4?v=nafham_2026_v2',
    poster: '/assets/aistudio/nafham_children_students.jpg',
    durationText: '06:39',
    category: 'نسخة البث الاحتياطية',
    description:
      'نسخة فيديو بديلة متوافقة مع كافة الأجهزة والمتصفحات لضمان استمرارية المشاهدة بدون أي انقطاع.',
  },
  {
    id: 'school_inclusion',
    title: 'دليل الدمج المدرسي للمعلمين والطلاب',
    subtitle: 'استراتيجيات التواصل والتهيئة الصفية والبيئة الصديقة للحواس',
    url: '/api/video/documentary?v=nafham_2026_v2',
    poster: '/assets/aistudio/nafham_teachers_specialists.jpg',
    durationText: '05:12',
    category: 'المعلمون والمدارس',
    description:
      'إرشادات تطبيقية للمعلمين والكوادر التربوية لخلق بيئة صفية داعمة تلبي الاحتياجات الحسية والتواصلية.',
  },
  {
    id: 'family_support',
    title: 'قصة دعم أسري: الفهم يصنع الفرق',
    subtitle: 'تجارب واقعية ونقاط قوة ملهمة في رحلة أسر التوحد',
    url: '/assets/aistudio/nafham_video.mp4?v=nafham_2026_v2',
    poster: '/assets/aistudio/nafham_parents_families.jpg',
    durationText: '04:45',
    category: 'الأسر وأولياء الأمور',
    description:
      'رسائل دعم وتشجيع لأولياء الأمور للتعرف على نقاط القوة وبناء جسور تواصل صادقة مع الأبناء.',
  },
];

export const DEFAULT_VIDEO_HUB_CONFIG: VideoHubConfig = {
  isEnabled: true,
  defaultTheme: 'child_puzzle', // Default theme as requested with scattered puzzle pieces
  activeVideoId: 'doc_main',
  videos: DEFAULT_VIDEOS,
  allowThemeSwitching: true,
  autoplaySoundPrompt: true,
};

const STORAGE_KEY_VIDEO_HUB = 'nafham_video_hub_config_v5';

export function loadVideoHubConfig(): VideoHubConfig {
  if (typeof window === 'undefined') return DEFAULT_VIDEO_HUB_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VIDEO_HUB);
    if (!raw) return DEFAULT_VIDEO_HUB_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_VIDEO_HUB_CONFIG,
      ...parsed,
      videos: parsed.videos && parsed.videos.length > 0 ? parsed.videos : DEFAULT_VIDEOS,
    };
  } catch {
    return DEFAULT_VIDEO_HUB_CONFIG;
  }
}

export function saveVideoHubConfig(config: VideoHubConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_VIDEO_HUB, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save video hub config:', e);
  }
}

export function resetVideoHubConfig(): VideoHubConfig {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_VIDEO_HUB);
  }
  return DEFAULT_VIDEO_HUB_CONFIG;
}
