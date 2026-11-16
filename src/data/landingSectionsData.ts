/**
 * Landing Page Sections Configuration & Reordering System
 * Allows administrators in /admincp to re-order, toggle, and customize landing page sections
 */

export interface LandingSectionConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  order: number;
  visible: boolean;
  badge?: string;
}

export const INITIAL_LANDING_SECTIONS: LandingSectionConfig[] = [
  {
    id: 'hero',
    title: 'الترويسة الترحيبية وبطاقة الفيلم الوثائقي',
    subtitle: 'شعار نفهم، النبذة التقديمية، وأزرار الانطلاق السريع',
    description: 'القسم الافتتاحي الرئيسي لصفحة الهبوط مع زر مشاهدة الفيلم التعريفي والروابط السريعة.',
    iconName: 'Sparkles',
    order: 1,
    visible: true,
    badge: 'أساسي',
  },
  {
    id: 'gamification',
    title: 'لوحة إنجازات وتحدي نفهم (Gamification)',
    subtitle: 'نقاط المشارك، المحطات المكتملة، وإصدار الشهادة الفورية',
    description: 'لوحة تفاعلية تحفيزية تعرض للمستخدم إحصائيات تقدمه والشهادة المعتمدة.',
    iconName: 'Trophy',
    order: 2,
    visible: true,
    badge: 'تحفيزي',
  },
  {
    id: 'four_cards',
    title: 'كروت المحاور الأربعة الرئيسية',
    subtitle: 'المغامرة (6 محطات)، مكتبة المعرفة، مدينة الألعاب، وتحدي نفهم',
    description: 'البطاقات التفاعلية الأربع مع تأثيرات الحركة السلسة والانتقال المباشر.',
    iconName: 'Compass',
    order: 3,
    visible: true,
    badge: 'محتوى تفاعلي',
  },
  {
    id: 'tracks',
    title: 'بوابات المسارات والفئات المستهدفة',
    subtitle: 'الطلاب والأطفال · أولياء الأمور والأسر · المعلمون والمختصون',
    description: 'مسارات متخصصة تلائم احتياجات كل فئة من فئات المجتمع والأسرة والمدرسة.',
    iconName: 'Users',
    order: 4,
    visible: true,
    badge: 'مسارات',
  },
  {
    id: 'mission',
    title: 'رسالة ورؤية مبادرة نفهم السامية',
    subtitle: 'أهداف المنصة، المعرفة العلمية، والدمج المجتمعي الشامل',
    description: 'الركائز الاستراتيجية الأربع للمبادرة تحت إشراف جامعة الإمام عبدالرحمن بن فيصل.',
    iconName: 'HeartHandshake',
    order: 5,
    visible: true,
    badge: 'الرؤية',
  },
  {
    id: 'cinematic_video',
    title: 'مشغل الفيلم الوثائقي المدمج مباشرة بالصفحة',
    subtitle: '«الفيلم التعريفي لمنصة نفهم» مع التحكم بالتكبير والفصول',
    description: 'عرض مشغل الفيديو مباشرة في صفحة الهبوط لتسهيل المشاهدة الفورية للزوار.',
    iconName: 'Film',
    order: 6,
    visible: false, // can be toggled on by admin
    badge: 'فيديو مباشر',
  },
  {
    id: 'slides_switch',
    title: 'ممر الانتقال للعرض الشرائحي التقديمي الأصلي',
    subtitle: 'خيارات التبديل بين العرض الشرائحي والصفحة الكاملة',
    description: 'بطاقة إرشادية تتيح للزائر تجربة الشرائح التقديمية الثلاث للجامعة.',
    iconName: 'Layers',
    order: 7,
    visible: true,
    badge: 'شرائحي',
  },
  {
    id: 'team',
    title: 'صفحة هبوط فريق العمل وقائدة المبادرة (شهد حسن عبدالرحمن)',
    subtitle: 'عرض الأعضاء، التصاميم الهندسية، والتأثيرات التفاعلية',
    description: 'صفحة متكاملة فوق الفوتر تبرز الفريق والمشرفين بتصاميم متعددة يمكن التحكم بها.',
    iconName: 'UsersRound',
    order: 8,
    visible: true,
    badge: 'فريق العمل',
  },
];

const STORAGE_LANDING_SECTIONS_KEY = 'nafham_landing_sections_config';

export function loadLandingSections(): LandingSectionConfig[] {
  try {
    const saved = localStorage.getItem(STORAGE_LANDING_SECTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sort by order ascending
        return parsed.sort((a, b) => a.order - b.order);
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_LANDING_SECTIONS;
}

export function saveLandingSections(sections: LandingSectionConfig[]): void {
  try {
    localStorage.setItem(STORAGE_LANDING_SECTIONS_KEY, JSON.stringify(sections));
    // Trigger custom event so App.tsx updates immediately without refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nafham_landing_sections_updated'));
    }
  } catch {}
}

export function resetLandingSections(): LandingSectionConfig[] {
  saveLandingSections(INITIAL_LANDING_SECTIONS);
  return INITIAL_LANDING_SECTIONS;
}
