/**
 * Certificate Templates Data & Storage
 * Includes:
 * - Beautiful aesthetic layouts with ornate academic frames
 * - Academic Supervision & Arbitration Committee (لجنة الإشراف الأكاديمي والتحكيم)
 * - Creative Production & Motion Graphics Team (فريق الإنتاج الإبداعي والموشن جرافيكس)
 * - Complete removal of the "منطقة معتمدة" badge / stamp
 */

export interface AcademicCommitteeInfo {
  enabled: boolean;
  committeeTitle: string;
  members: string;
  department: string;
  notes?: string;
}

export interface CreativeTeamInfo {
  enabled: boolean;
  teamTitle: string;
  leadName: string;
  specialists: string;
  productionYear?: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  category: 'challenge' | 'adventure' | 'volunteer' | 'workshop' | 'general';
  title: string;
  subtitle: string;
  honoraryQuote?: string; // عبارة فخر وتقدير جمالية
  recipientTitle: string;
  bodyText: string;
  supervisor: string;
  supervisorDepartment: string;
  signatoryName: string;
  signatoryRole: string;
  styleTheme: 'royal_iau' | 'modern_ocean' | 'golden_honor' | 'kids_explorer';
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  showScore: boolean;
  showRefId: boolean;
  isDefault?: boolean;
  academicCommittee: AcademicCommitteeInfo;
  creativeTeam: CreativeTeamInfo;
}

export const INITIAL_CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'template_challenge',
    name: 'شهادة التميز في تحدي نفهم العلمي',
    category: 'challenge',
    title: 'شهادة تميز وإنجاز معرفي',
    subtitle: 'تقديراً للاجتياز المتميز لبنك الأسئلة العلمي حول اضطراب طيف التوحد',
    honoraryQuote: '«الفهم بداية التقبل، والوعي جسر الدمج الإنساني»',
    recipientTitle: 'المتميز / المتميزة',
    bodyText:
      'تقديراً لخوضه بنجاح مسار تحدي نفهم وإظهار الاستيعاب العلمي الدقيق لخصائص طيف التوحد، والمعالجة الحسية، وأدوات التواصل البديل، ودعم الدمج المجتمعي المستدام.',
    supervisor: 'جامعة الإمام عبدالرحمن بن فيصل',
    supervisorDepartment: 'كلية الآداب',
    signatoryName: 'مبادرة «نفهم» التوعوية',
    signatoryRole: 'الجهة المانحة والراعية',
    styleTheme: 'royal_iau',
    primaryColor: '#0a4d7a',
    secondaryColor: '#0c6aa7',
    borderColor: '#c59b27',
    showScore: true,
    showRefId: true,
    isDefault: true,
    academicCommittee: {
      enabled: false,
      committeeTitle: 'لجنة الإشراف الأكاديمي والتحكيم',
      members: 'أ.د. منى بنت إبراهيم البراك · د. سارة بنت عبدالعزيز القحطاني · د. خالد بن فهد المطيري',
      department: 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب',
      notes: 'تحكيم المحتوى العلمي ومطابقة المعايير النمائية المعتمدة',
    },
    creativeTeam: {
      enabled: false,
      teamTitle: 'فريق الإنتاج الإبداعي والموشن جرافيكس',
      leadName: 'مبادرة نفهم التوعوية',
      specialists: 'تحريك الموشن جرافيكس، التصميم الجرافيكي، والهندسة البصرية',
      productionYear: 'إنتاج مبادرة نفهم 2026',
    },
  },
  {
    id: 'template_adventure',
    name: 'شهادة إتمام محطات المغامرة التفاعلية',
    category: 'adventure',
    title: 'شهادة بطل المغامرة وسفير التقبل',
    subtitle: 'اجتياز المحطات الست الاستكشافية في عالم طيف التوحد',
    honoraryQuote: '«لكل طفل عالمه الفريد، وبقلوبنا نفهم ونحتوي»',
    recipientTitle: 'البطل المستكشف',
    bodyText:
      'تقديراً لاجتيازه كافة محطات مغامرة نفهم التفاعلية (فهم الاختلاف، تواصل بلا حدود، عالم الحواس، روتين الأمان، دعم الانهيار، ومجتمع مرحب) وإبراز قيم التعاطف والصداقة.',
    supervisor: 'جامعة الإمام عبدالرحمن بن فيصل',
    supervisorDepartment: 'كلية الآداب',
    signatoryName: 'مبادرة «نفهم» التوعوية',
    signatoryRole: 'الجهة المانحة والراعية',
    styleTheme: 'modern_ocean',
    primaryColor: '#0c6aa7',
    secondaryColor: '#2eb9df',
    borderColor: '#2eb9df',
    showScore: false,
    showRefId: true,
    isDefault: false,
    academicCommittee: {
      enabled: false,
      committeeTitle: 'لجنة الإشراف الأكاديمي والتحكيم',
      members: 'د. حصة بنت سعد الدوسري · د. فهد بن ناصر التميمي',
      department: 'جامعة الإمام عبدالرحمن بن فيصل (IAU) · كلية الآداب',
      notes: 'إشراف أكاديمي على مواءمة المحطات للأطفال واليافعين',
    },
    creativeTeam: {
      enabled: false,
      teamTitle: 'فريق الإنتاج الإبداعي والموشن جرافيكس',
      leadName: 'مبادرة نفهم التوعوية',
      specialists: 'تصميم المشاهد ثلاثية الأبعاد والمؤثرات التفاعلية',
      productionYear: 'إنتاج مبادرة نفهم 2026',
    },
  },
  {
    id: 'template_volunteer',
    name: 'شهادة شكر وتقدير للمتطوعين وسفراء الوعي',
    category: 'volunteer',
    title: 'شهادة شكر وعرفان وسفير الوعي',
    subtitle: 'تقديراً للعطاء المجتمعي المخلص والمساهمة الفاعلة في نشر ثقافة التقبل',
    honoraryQuote: '«بالعطاء الإنساني تُبنى المجتمعات الدامجة»',
    recipientTitle: 'المتطوع / سفير الوعي',
    bodyText:
      'تتقدم إدارة مبادرة «نفهم» برعاية جامعة الإمام عبدالرحمن بن فيصل بجزيل الشكر والتقدير لجهودكم المتميزة في نشر ثقافة التقبل الإنساني ومساندة أفراد طيف التوحد وأسرهم.',
    supervisor: 'جامعة الإمام عبدالرحمن بن فيصل',
    supervisorDepartment: 'كلية الآداب',
    signatoryName: 'مبادرة «نفهم» التوعوية',
    signatoryRole: 'الجهة المانحة والراعية',
    styleTheme: 'golden_honor',
    primaryColor: '#854d0e',
    secondaryColor: '#d97706',
    borderColor: '#f59e0b',
    showScore: false,
    showRefId: true,
    isDefault: false,
    academicCommittee: {
      enabled: false,
      committeeTitle: 'لجنة الإشراف الأكاديمي والتحكيم',
      members: 'مجلس إدارة المبادرات المجتمعية · كلية الآداب',
      department: 'جامعة الإمام عبدالرحمن بن فيصل',
      notes: 'اعتماد ساعات التطوع وشهادات الأثر المجتمعي',
    },
    creativeTeam: {
      enabled: false,
      teamTitle: 'فريق الإنتاج الإبداعي والموشن جرافيكس',
      leadName: 'مبادرة نفهم التوعوية',
      specialists: 'هوية الحملات التوعوية والإخراج الرقمي',
      productionYear: 'مبادرة نفهم 2026',
    },
  },
  {
    id: 'template_workshop',
    name: 'شهادة المعلم والأسرة الداعمة (مواءمة البيئة)',
    category: 'workshop',
    title: 'شهادة مشاركة وتمكين في ممارسات الدمج',
    subtitle: 'استراتيجيات الدعم الصفي والمنزلي لأفراد طيف التوحد',
    honoraryQuote: '«بيئة مهيأة تصنع فارقاً مدى الحياة»',
    recipientTitle: 'المعلم / ولي الأمر الداعم',
    bodyText:
      'تقديراً لاكتسابه استراتيجيات مواءمة البيئة المادية والحسية، واستخدام الجداول البصرية، وأدوات التواصل المعزز، وخفض التوتر لتمكين المشاركة الكاملة.',
    supervisor: 'جامعة الإمام عبدالرحمن بن فيصل',
    supervisorDepartment: 'كلية الآداب',
    signatoryName: 'مبادرة «نفهم» التوعوية',
    signatoryRole: 'الجهة المانحة والراعية',
    styleTheme: 'kids_explorer',
    primaryColor: '#047857',
    secondaryColor: '#10b981',
    borderColor: '#10b981',
    showScore: false,
    showRefId: true,
    isDefault: false,
    academicCommittee: {
      enabled: false,
      committeeTitle: 'لجنة الإشراف الأكاديمي والتحكيم',
      members: 'لجنة تطوير المعايير المهنية للتربية الخاصة · كلية الآداب',
      department: 'جامعة الإمام عبدالرحمن بن فيصل (IAU)',
      notes: 'تحكيم استراتيجيات الدمج وحقائب الدعم الأسري',
    },
    creativeTeam: {
      enabled: false,
      teamTitle: 'فريق الإنتاج الإبداعي والموشن جرافيكس',
      leadName: 'مبادرة نفهم التوعوية',
      specialists: 'إنتاج الجداول البصرية والموشن جرافيكس التعليمي',
      productionYear: 'مبادرة نفهم 2026',
    },
  },
];

const STORAGE_TEMPLATES_KEY = 'nafham_certificate_templates_v3';
const STORAGE_ACTIVE_ID_KEY = 'nafham_active_certificate_template_id_v3';

export function loadCertificateTemplates(): CertificateTemplate[] {
  try {
    const saved = localStorage.getItem(STORAGE_TEMPLATES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((t) => ({
          ...t,
          supervisor: 'جامعة الإمام عبدالرحمن بن فيصل',
          supervisorDepartment: 'كلية الآداب',
          signatoryName: 'مبادرة «نفهم» التوعوية',
          signatoryRole: 'الجهة المانحة والراعية',
          academicCommittee: {
            ...(t.academicCommittee || {}),
            enabled: false,
          },
          creativeTeam: {
            ...(t.creativeTeam || {}),
            enabled: false,
          },
        }));
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_CERTIFICATE_TEMPLATES;
}

export function saveCertificateTemplates(templates: CertificateTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_TEMPLATES_KEY, JSON.stringify(templates));
  } catch {}
}

export function loadActiveCertificateTemplate(): CertificateTemplate {
  const templates = loadCertificateTemplates();
  try {
    const activeId = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
    if (activeId) {
      const found = templates.find((t) => t.id === activeId);
      if (found) return found;
    }
  } catch {}
  return templates.find((t) => t.isDefault) || templates[0];
}

export function setActiveCertificateTemplateId(templateId: string): void {
  try {
    localStorage.setItem(STORAGE_ACTIVE_ID_KEY, templateId);
  } catch {}
}
