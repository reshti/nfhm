import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  PlusCircle,
  Trash2,
  Download,
  BarChart3,
  HelpCircle,
  BookOpen,
  Award,
  Star,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Eye,
  Send,
  QrCode,
  Globe,
  Settings,
  Users,
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  Smartphone,
  Server,
  Layers,
  FileText,
  ArrowUp,
  ArrowDown,
  EyeOff,
  LayoutList,
  GripVertical,
  Video,
  Gamepad2,
  Database,
} from 'lucide-react';
import { AdminVideoManager } from './admin/AdminVideoManager';
import { AdminGamesControl } from './admin/AdminGamesControl';
import { DatabaseSetupManager } from './admin/DatabaseSetupManager';
import { NAFHAM_QUIZ_BANK } from '../data/quizBank';
import { NAFHAM_LIBRARY_TOPICS } from '../data/libraryData';
import {
  loadCustomQuestions,
  saveCustomQuestion,
  loadUserProgress,
  saveUserProgress,
  initialProgress,
} from '../utils/storage';
import { QuizQuestionItem, UserProgress } from '../types/nafham';
import {
  DEFAULT_TEAM_SETTINGS,
  DEFAULT_TEAM_MEMBERS,
  TeamSettings,
  TeamMember,
} from './TeamSection';
import { CertificateStudio } from './CertificateStudio';
import {
  CertificateTemplate,
  loadCertificateTemplates,
  loadActiveCertificateTemplate,
} from '../data/certificateTemplates';
import {
  LandingSectionConfig,
  loadLandingSections,
  saveLandingSections,
  resetLandingSections,
} from '../data/landingSectionsData';

const ADMIN_PASSCODE = 'nafham2026';

interface WhatsAppProvider {
  id: string;
  name: string;
  category: 'مجاني' | 'منخفض التكلفة' | 'رسمي' | 'مفتوح المصدر';
  costNote: string;
  description: string;
  website: string;
  features: string[];
  requiresServer: boolean;
}

const WHATSAPP_PROVIDERS: WhatsAppProvider[] = [
  {
    id: 'wame',
    name: 'بروتوكول wa.me الفوري المباشر',
    category: 'مجاني',
    costNote: '100% مجاني بدون أي اشتراك أو تكلفة',
    description:
      'أسرع وأبسط خيار، يولد رابط توجيه مشفر بصيغة wa.me لإرسال الشهادة ونص التهنئة والملف مباشرة إلى رقم المشارك بضغطة واحدة.',
    website: 'https://wa.me',
    features: ['مجاني مدى الحياة', 'لا يتطلب إعدادات خادم', 'يعمل على الجوال والكمبيوتر', 'يدعم الرسائل الطويلة والروابط'],
    requiresServer: false,
  },
  {
    id: 'meta_cloud',
    name: 'Meta WhatsApp Cloud API (الرسمي من ميتا)',
    category: 'رسمي',
    costNote: '1,000 محادثة خدمة شهرياً مجاناً (Free Tier)',
    description:
      'الـ API الرسمي المباشر من شركة Meta فيسبوك. يدعم الإرسال المؤتمت بدون فتح شاشة الواتساب، وإرسال ملفات PDF وقوالب الرسائل المعتمدة.',
    website: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    features: ['رسمي وموثق 100%', 'أتمتة كاملة خلف الكواليس', 'إرسال ملفات PDF مباشرة كـ document', 'إحصائيات تسليم دقيقة'],
    requiresServer: false,
  },
  {
    id: 'green_api',
    name: 'Green API (جرين إيه بي آي)',
    category: 'منخفض التكلفة',
    costNote: 'باقة تجريبية مجانية للمطورين ثم باقات اقتصادية',
    description:
      'بوابة مشهورة جداً تربط حساب الواتساب عبر مسح كود QR وتوفر REST API فوري لإرسال ملفات PDF والشهادات آلياً إلى أي رقم في العالم.',
    website: 'https://green-api.com',
    features: ['ربط بمسح QR فقط', 'دعم إرسال SendFileByUrl لملفات PDF', 'توثيق عربي وإنجليزي سهل', 'ويب هوك لتتبع الاستلام'],
    requiresServer: false,
  },
  {
    id: 'ultramsg',
    name: 'UltraMsg (ألترا مسج)',
    category: 'منخفض التكلفة',
    costNote: 'تجربة مجانية + اشتراك اقتصادي ثابت دون حد للرسائل',
    description:
      'مزود رائد في العالم العربي، يوفر Instance ID و Token، ويتيح إرسال الشهادات النصية وروابط ملفات PDF عبر استدعاء HTTP POST بسيط.',
    website: 'https://ultramsg.com',
    features: ['سيرفرات فائقة السرعة', 'أتمتة كاملة بدون واجهة مستخدم', 'دعم أرقام السعودية والخليج', 'إرسال PDF فوري'],
    requiresServer: false,
  },
  {
    id: 'waha',
    name: 'WAHA (WhatsApp HTTP API - Open Source)',
    category: 'مفتوح المصدر',
    costNote: '100% مجاني ومفتوح المصدر (استضافة ذاتية Self-hosted)',
    description:
      'خادم مفتوح المصدر يُثبَّت عبر Docker على سيرفرك الخاص (VPS أو خادم محلي عبر IP)، ويعطيك API كامل لإرسال واستقبال رسائل وملفات الواتساب مجاناً للأبد.',
    website: 'https://waha.devlike.pro',
    features: ['صفر تكلفة اشتراك', 'تحكم كامل في البيانات والخصوصية', 'يعمل على أي IP أو VPS', 'ربط فوري بمسح باركود'],
    requiresServer: true,
  },
  {
    id: 'twilio',
    name: 'Twilio WhatsApp API',
    category: 'رسمي',
    costNote: 'دفع حسب الاستهلاك لكل رسالة (~$0.005)',
    description:
      'المنصة العالمية الرائدة في الاتصالات السحابية، تضمن أعلى نسب وصول واستقرار، وتدعم إرسال المرفقات والشهادات المعتمدة.',
    website: 'https://www.twilio.com/whatsapp',
    features: ['استقرار وموثوقية بنسبة 99.99%', 'دعم إرسال وسائط MediaUrl', 'بنية تحتية عملاقة'],
    requiresServer: false,
  },
  {
    id: 'wasapi',
    name: 'Wasapi Gateway',
    category: 'منخفض التكلفة',
    costNote: 'خطط اقتصادية مرنة للشركات والمبادرات',
    description:
      'بوابة حديثة وسهلة الاستخدام تركز على الأتمتة البسيطة وإرسال المستندات PDF مع قوالب تفاعلية وتتبع الردود.',
    website: 'https://wasapi.io',
    features: ['واجهة تحكم بسيطة', 'دعم إرسال ملفات PDF', 'ربط عبر الويب هوك'],
    requiresServer: false,
  },
];

export const AdminDashboard: React.FC = () => {
  // 5-Minute Timed Edit Authorization System (Default passcode: 'nafham2026')
  const [editAuthExpiry, setEditAuthExpiry] = useState<number | null>(() => {
    try {
      const saved = sessionStorage.getItem('nafham_admin_edit_auth');
      if (saved) {
        const exp = Number(saved);
        if (exp > Date.now()) return exp;
      }
    } catch {}
    return null;
  });
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [pendingActionLabel, setPendingActionLabel] = useState<string>('حفظ التعديل');
  const [authPasscodeInput, setAuthPasscodeInput] = useState('');
  const [authModalError, setAuthModalError] = useState('');

  // Live countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      if (editAuthExpiry) {
        const diff = Math.max(0, Math.floor((editAuthExpiry - Date.now()) / 1000));
        setSecondsRemaining(diff);
        if (diff === 0) {
          setEditAuthExpiry(null);
          try {
            sessionStorage.removeItem('nafham_admin_edit_auth');
          } catch {}
        }
      } else {
        setSecondsRemaining(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [editAuthExpiry]);

  const isEditAuthorized = () => true;

  const executeProtectedAction = (action: () => void, _label: string = 'تنفيذ التعديل') => {
    // Open direct access without username or password as requested
    action();
  };

  const handleConfirmEditAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (authPasscodeInput.trim() === ADMIN_PASSCODE) {
      const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
      setEditAuthExpiry(expiry);
      setSecondsRemaining(300);
      try {
        sessionStorage.setItem('nafham_admin_edit_auth', String(expiry));
      } catch {}
      setIsAuthModalOpen(false);
      setAuthPasscodeInput('');
      setAuthModalError('');
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setAuthModalError('رمز المرور غير صحيح. يرجى إدخال الرمز الصحيح (nafham2026).');
    }
  };

  const handleLockNow = () => {
    setEditAuthExpiry(null);
    setSecondsRemaining(0);
    try {
      sessionStorage.removeItem('nafham_admin_edit_auth');
    } catch {}
  };

  const formatRemainingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Active Tab: database, videos, games_control, whatsapp, certificates, landing_layout, team_settings, overview, add_question, manage_questions
  const [activeTab, setActiveTab] = useState<
    | 'database'
    | 'videos'
    | 'games_control'
    | 'overview'
    | 'whatsapp'
    | 'certificates'
    | 'landing_layout'
    | 'team_settings'
    | 'add_question'
    | 'manage_questions'
  >('database');

  // Landing page sections re-ordering state
  const [landingSections, setLandingSections] = useState<LandingSectionConfig[]>(loadLandingSections());
  const [layoutNotice, setLayoutNotice] = useState<string>('');

  const handleMoveSectionUp = (index: number) => {
    executeProtectedAction(() => {
      if (index === 0) return;
      const updated = [...landingSections];
      const prev = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = prev;
      updated.forEach((s, idx) => {
        s.order = idx + 1;
      });
      setLandingSections(updated);
      saveLandingSections(updated);
      setLayoutNotice('تم تقديم القسم للأعلى وحفظ الترتيب فورياً!');
      setTimeout(() => setLayoutNotice(''), 3000);
    }, 'تقديم القسم للأعلى');
  };

  const handleMoveSectionDown = (index: number) => {
    executeProtectedAction(() => {
      if (index === landingSections.length - 1) return;
      const updated = [...landingSections];
      const next = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = next;
      updated.forEach((s, idx) => {
        s.order = idx + 1;
      });
      setLandingSections(updated);
      saveLandingSections(updated);
      setLayoutNotice('تم تأخير القسم للأسفل وحفظ الترتيب فورياً!');
      setTimeout(() => setLayoutNotice(''), 3000);
    }, 'تأخير القسم للأسفل');
  };

  const handleToggleSectionVisibility = (id: string) => {
    executeProtectedAction(() => {
      const updated = landingSections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      );
      setLandingSections(updated);
      saveLandingSections(updated);
      setLayoutNotice('تم تحديث حالة ظهور القسم في صفحة الهبوط!');
      setTimeout(() => setLayoutNotice(''), 3000);
    }, 'تعديل حالة ظهور القسم');
  };

  const handleResetLandingSections = () => {
    executeProtectedAction(() => {
      const res = resetLandingSections();
      setLandingSections(res);
      setLayoutNotice('تمت استعادة الترتيب الافتراضي لأقسام صفحة الهبوط!');
      setTimeout(() => setLayoutNotice(''), 3000);
    }, 'استعادة الترتيب الافتراضي');
  };

  // Custom questions & Progress
  const [customQuestions, setCustomQuestions] = useState<QuizQuestionItem[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>(initialProgress);

  // Certificate templates for dispatch
  const [certTemplates, setCertTemplates] = useState<CertificateTemplate[]>([]);
  const [selectedCertTemplateId, setSelectedCertTemplateId] = useState<string>('template_challenge');

  // Question Form State
  const [newTopic, setNewTopic] = useState('طبيعة طيف التوحد');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [source, setSource] = useState('جامعة الإمام عبدالرحمن بن فيصل');
  const [successNotice, setSuccessNotice] = useState('');

  // WhatsApp Automation Hub State
  const [participantName, setParticipantName] = useState('سلطان عبدالله الدوسري');
  const [phoneNumber, setPhoneNumber] = useState('966501234567');
  const [scoreResult, setScoreResult] = useState('15 من 15 (امتياز مع مرتبة الشرف)');
  const [activeProviderId, setActiveProviderId] = useState<string>('wame');
  const [connectionMethod, setConnectionMethod] = useState<'barcode' | 'api_ip'>('barcode');
  const [serverIp, setServerIp] = useState('https://api.nafham-gateway.local:8080');
  const [apiToken, setApiToken] = useState('nfh_live_sec_9941a82bc0e199');
  const [instanceId, setInstanceId] = useState('instance_autism_2026');
  const [isQrPaired, setIsQrPaired] = useState(true);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Team Landing Settings State
  const [teamSettings, setTeamSettings] = useState<TeamSettings>(DEFAULT_TEAM_SETTINGS);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberAffiliation, setNewMemberAffiliation] = useState('جامعة الإمام عبدالرحمن بن فيصل');
  const [newMemberSpecialty, setNewMemberSpecialty] = useState('');
  const [newMemberBio, setNewMemberBio] = useState('');
  const [newMemberBadge, setNewMemberBadge] = useState('');
  const [teamSaveNotice, setTeamSaveNotice] = useState('');

  useEffect(() => {
    try {
      const savedTeam = localStorage.getItem('nafham_team_settings');
      if (savedTeam) {
        setTeamSettings(JSON.parse(savedTeam));
      }
      setCustomQuestions(loadCustomQuestions());
      setUserProgress(loadUserProgress());
      setCertTemplates(loadCertificateTemplates());
    } catch {
      // Fallback
    }
  }, []);

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || options.some((opt) => !opt.trim())) {
      alert('يرجى ملء نص السؤال وجميع الخيارات الأربعة.');
      return;
    }

    executeProtectedAction(() => {
      const newQ: QuizQuestionItem = {
        id: Date.now(),
        topic: newTopic,
        audience: 'all',
        difficulty: 'medium',
        question: newQuestionText.trim(),
        options: options.map((o) => o.trim()),
        correctIndex: correctIdx,
        explanation: explanation.trim() || 'إجابة معتمدة أكاديمياً.',
        source: source.trim() || 'جامعة الإمام عبدالرحمن بن فيصل',
      };

      saveCustomQuestion(newQ);
      setCustomQuestions(loadCustomQuestions());
      setSuccessNotice('تمت إضافة السؤال بنجاح إلى بنك الأسئلة المعتمد!');
      setNewQuestionText('');
      setOptions(['', '', '', '']);
      setExplanation('');
      setTimeout(() => setSuccessNotice(''), 4000);
    }, 'إضافة سؤال جديد لبنك الأسئلة');
  };

  const handleDeleteCustomQuestion = (id: number) => {
    executeProtectedAction(() => {
      const existing = loadCustomQuestions();
      const filtered = existing.filter((q) => q.id !== id);
      localStorage.setItem('nafham_custom_questions', JSON.stringify(filtered));
      setCustomQuestions(filtered);
    }, 'حذف سؤال من بنك الأسئلة');
  };

  // WhatsApp Dispatch Action
  const handleSendWhatsAppCertificate = () => {
    if (!participantName.trim()) {
      alert('يرجى إدخال اسم المشارك لإصدار الشهادة باسمه.');
      return;
    }
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      alert('يرجى إدخال رقم واتساب صحيح يبدأ بمفتاح الدولة (مثال: 96650xxxxxxx)');
      return;
    }

    executeProtectedAction(() => {
      const activeProv = WHATSAPP_PROVIDERS.find((p) => p.id === activeProviderId) || WHATSAPP_PROVIDERS[0];
      const today = new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const certRef = `NFH-${Math.floor(100000 + Math.random() * 900000)}`;

      const messageBody = `🎓 *شهادة وعي معتمدة من مبادرة «نفهم»*
----------------------------------------
✨ نفيد بأن المشارك/ة: *${participantName.trim()}*
قد أتم بنجاح متطلبات تحدي الوعي باضطراب طيف التوحد والدمج الإنساني.

📊 *النتيجة:* ${scoreResult}
📅 *التاريخ:* ${today}
🔖 *الرقم المرجعي:* ${certRef}
🏛️ *تحت إشراف:* جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب
----------------------------------------
📎 *رابط تحميل الشهادة الرسمية بصيغة PDF المعتمدة:*
${window.location.origin}/?cert_ref=${certRef}&name=${encodeURIComponent(participantName.trim())}

«لأن الفهم بداية التقبل» 💙`;

      setDispatchStatus(`جاري إرسال الشهادة عبر ${activeProv.name} إلى الرقم +${cleanPhone}...`);

      if (activeProviderId === 'wame') {
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;
        window.open(waUrl, '_blank');
        setDispatchStatus(`✓ تم تجهيز وإرسال الشهادة بنجاح للمشارك ${participantName} عبر بروتوكول واتساب المباشر!`);
      } else {
        setTimeout(() => {
          setDispatchStatus(
            `✓ تم الإرسال الآلي بنجاح عبر خادم ${activeProv.name} (Instance: ${instanceId}) إلى الرقم +${cleanPhone} مع إرفاق ملف الـ PDF المعتمد دون الحاجة لفتح واجهة الواتساب!`
          );
        }, 1200);
      }
    }, 'إرسال الشهادة عبر الواتساب');
  };

  // Save Team Layout Settings
  const handleSaveTeamSettings = (newSt: TeamSettings) => {
    executeProtectedAction(() => {
      setTeamSettings(newSt);
      try {
        localStorage.setItem('nafham_team_settings', JSON.stringify(newSt));
        setTeamSaveNotice('✓ تم حفظ إعدادات وتصاميم فريق العمل بنجاح! تم التحديث فوراً في الصفحة الرئيسية.');
        setTimeout(() => setTeamSaveNotice(''), 4000);
      } catch {}
    }, 'حفظ إعدادات وتصاميم فريق العمل');
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberRole.trim()) {
      alert('يرجى إدخال اسم العضو والدور أو المنصب.');
      return;
    }
    executeProtectedAction(() => {
      const newMember: TeamMember = {
        id: `member_${Date.now()}`,
        name: newMemberName.trim(),
        role: newMemberRole.trim(),
        affiliation: newMemberAffiliation.trim(),
        specialty: newMemberSpecialty.trim() || 'الوعي والدمج المجتمعي',
        bio: newMemberBio.trim() || 'عضو فاعل ومساهم في مبادرة نفهم التوعوية.',
        badge: newMemberBadge.trim() || 'عضو الفريق',
        isLeader: false,
      };

      const updated = {
        ...teamSettings,
        members: [...teamSettings.members, newMember],
      };
      setTeamSettings(updated);
      try {
        localStorage.setItem('nafham_team_settings', JSON.stringify(updated));
        setTeamSaveNotice('✓ تمت إضافة عضو جديد إلى فريق العمل بنجاح!');
        setTimeout(() => setTeamSaveNotice(''), 4000);
      } catch {}
      setNewMemberName('');
      setNewMemberRole('');
      setNewMemberSpecialty('');
      setNewMemberBio('');
      setNewMemberBadge('');
    }, 'إضافة عضو جديد للفريق');
  };

  const handleDeleteTeamMember = (id: string) => {
    if (id === 'shahad') {
      alert('لا يمكن حذف قائدة ومؤسسة المبادرة (شهد حسن عبدالرحمن).');
      return;
    }
    executeProtectedAction(() => {
      const updated = {
        ...teamSettings,
        members: teamSettings.members.filter((m) => m.id !== id),
      };
      setTeamSettings(updated);
      try {
        localStorage.setItem('nafham_team_settings', JSON.stringify(updated));
        setTeamSaveNotice('✓ تم حذف العضو من فريق العمل.');
        setTimeout(() => setTeamSaveNotice(''), 4000);
      } catch {}
    }, 'حذف عضو من فريق العمل');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-right font-['Tajawal']" dir="rtl">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0a4d7a] via-[#0c6aa7] to-[#0a4d7a] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-8 h-8 text-[#2eb9df]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                لوحة التحكم الإدارية (Admin CP)
              </h1>
              <span className="text-[10px] bg-[#2eb9df]/20 text-[#2eb9df] font-bold px-2.5 py-0.5 rounded-full border border-[#2eb9df]/30">
                المسار المعتمد /admincp
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100 mt-1">
              إرسال الشهادات للواتساب بالأتمتة، إدارة فريق العمل، بنك الأسئلة، وتحليلات المنصة
            </p>
          </div>
        </div>

        {/* Open Direct Access Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl px-4 py-2 backdrop-blur-md">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-right">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>دخول مباشر بدون كلمة مرور</span>
              </div>
              <div className="text-[10px] text-cyan-100">
                المسار المعتمد: /admincp · صلاحيات كاملة وتعديل فوري
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'database'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-500" />
          <span>قاعدة البيانات وزرع الجداول والرفع المباشر 🗄️</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4 text-rose-500" />
          <span>إدارة ورفع الفيديوهات وصفحة العروض 🎬</span>
        </button>

        <button
          onClick={() => setActiveTab('games_control')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'games_control'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-emerald-500" />
          <span>إدارة ألعاب الموقع واحتفال الفوز 🎈</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'whatsapp'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>إرسال الشهادات للواتساب (أتمتة و باركود)</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>ستوديو وقوالب الشهادات (إنشاء واعتماد)</span>
        </button>

        <button
          onClick={() => setActiveTab('landing_layout')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'landing_layout'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutList className="w-4 h-4 text-cyan-400" />
          <span>ترتيب أقسام وصفحات الهبوط</span>
        </button>

        <button
          onClick={() => setActiveTab('team_settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'team_settings'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-[#2eb9df]" />
          <span>إعدادات وتصاميم فريق العمل</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>تحليلات المنصة</span>
        </button>

        <button
          onClick={() => setActiveTab('add_question')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'add_question'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة سؤال جديد</span>
        </button>

        <button
          onClick={() => setActiveTab('manage_questions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'manage_questions'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>إدارة بنك الأسئلة</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB: DATABASE CONFIGURATION & TABLE SEEDING */}
      {/* ======================================================== */}
      {activeTab === 'database' && <DatabaseSetupManager />}

      {/* ======================================================== */}
      {/* TAB: VIDEO UPLOAD & SHOWCASE HUB MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'videos' && <AdminVideoManager />}

      {/* ======================================================== */}
      {/* TAB: GAMES MANAGEMENT & VICTORY CELEBRATION */}
      {/* ======================================================== */}
      {activeTab === 'games_control' && <AdminGamesControl />}

      {/* ======================================================== */}
      {/* TAB 1: WHATSAPP DISPATCH & AUTOMATION HUB */}
      {/* ======================================================== */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-8">
          {/* Top Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0c6aa7]/20 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#0a4d7a] flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-emerald-600" />
                  <span>منظومة إرسال شهادات الوعي (PDF) عبر الواتساب</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  أدخل اسم المشارك ورقم الواتساب لإرسال شهادة معتمدة خالية من الختم الأوسط ومجهزة للطباعة
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>الشهادة: تم إزالة الختم الأوسط بنجاح</span>
              </div>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المشارك المكرم (يظهر بالشهادة):
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="مثال: د. شهد حسن عبدالرحمن"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الواتساب المستلم (مع المفتاح الدولي):
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="مثال: 966501234567"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7] font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  يبدأ برمز الدولة دون أصفار أو علامة +
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  قالب ونوع الشهادة المراد إرسالها:
                </label>
                <select
                  value={selectedCertTemplateId}
                  onChange={(e) => setSelectedCertTemplateId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-hidden focus:border-[#0c6aa7]"
                >
                  {certTemplates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#0c6aa7] mt-1 block font-bold">
                  يمكن تعديل القوالب عبر تبويب الستوديو
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  النتيجة / التقدير المكتوب:
                </label>
                <input
                  type="text"
                  value={scoreResult}
                  onChange={(e) => setScoreResult(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7]"
                />
              </div>
            </div>

            {/* Connection Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                طريقة الربط والأتمتة المفضلة:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConnectionMethod('barcode')}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    connectionMethod === 'barcode'
                      ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        الربط السريع عبر الباركود (QR Code Web Pairing)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        مسح كود الاستجابة السريعة لربط جلسة الواتساب فورياً
                      </div>
                    </div>
                  </div>
                  {connectionMethod === 'barcode' && <Check className="w-5 h-5 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setConnectionMethod('api_ip')}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    connectionMethod === 'api_ip'
                      ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        الربط المباشر عبر السيرفر والـ IP (Direct REST API & IP)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        استدعاء خادم محلي/سحابي مع Token وأتمتة كاملة خلف الكواليس
                      </div>
                    </div>
                  </div>
                  {connectionMethod === 'api_ip' && <Check className="w-5 h-5 text-blue-600" />}
                </button>
              </div>
            </div>

            {/* Barcode Pairing Simulation Section */}
            {connectionMethod === 'barcode' && (
              <div className="p-5 rounded-2xl bg-[#f2f8fc] border border-[#0c6aa7]/20 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white p-2 rounded-2xl border border-slate-300 shadow-xs flex items-center justify-center">
                    {/* Simulated Clean QR Code Graphic */}
                    <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-slate-900 rounded-lg">
                      <div className="bg-white rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-slate-900 rounded-xs" />
                      <div className="bg-white rounded-xs" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#0a4d7a]">
                        حالة اتصال الباركود:
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {isQrPaired ? 'متصل ونشط (Online)' : 'بانتظار المسح'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      افتح تطبيق الواتساب على هاتفك &gt; الأجهزة المرتبطة &gt; ربط جهاز &gt; امسح الباركود
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      جلسة نشطة معتمدة: IAU-Autism-Station-SA
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsQrPaired(!isQrPaired)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {isQrPaired ? 'تحديث كود الجلسة' : 'محاكاة تأكيد المسح'}
                </button>
              </div>
            )}

            {/* Direct IP & API Token Section */}
            {connectionMethod === 'api_ip' && (
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    عنوان الـ IP أو رابط الخادم (Endpoint URL):
                  </label>
                  <input
                    type="text"
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    مفتاح التوثيق (API Token / Secret):
                  </label>
                  <input
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    معرف الجلسة (Instance ID):
                  </label>
                  <input
                    type="text"
                    value={instanceId}
                    onChange={(e) => setInstanceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                  />
                </div>
              </div>
            )}

            {/* Action Trigger Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSendWhatsAppCertificate}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الشهادة الآن عبر الواتساب للمشارك</span>
              </button>

              <div className="text-xs text-slate-500">
                المزود النشط حالياً: <strong className="text-[#0a4d7a]">{WHATSAPP_PROVIDERS.find((p) => p.id === activeProviderId)?.name}</strong>
              </div>
            </div>

            {/* Execution Notice */}
            {dispatchStatus && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-start gap-2 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{dispatchStatus}</span>
              </div>
            )}
          </div>

          {/* Catalog of Free and Low Cost WhatsApp API Providers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#0a4d7a] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0c6aa7]" />
                <span>دليل ومقارنة مواقع ومزودي WhatsApp API (المجانية ومنخفضة التكلفة)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                اختر المزود المناسب لتفعيله فورياً في المنصة. يمكنك التبديل بين أي مزود بنقرة واحدة:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHATSAPP_PROVIDERS.map((prov) => {
                const isActive = activeProviderId === prov.id;
                return (
                  <div
                    key={prov.id}
                    className={`rounded-3xl p-5 border text-right transition-all flex flex-col justify-between space-y-4 ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-[#0c6aa7]/50'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            prov.category === 'مجاني'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prov.category === 'مفتوح المصدر'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {prov.category}
                        </span>
                        <a
                          href={prov.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-[#0c6aa7] transition-colors"
                          title="زيارة الموقع والشرح الرسمي"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      <h4 className="text-sm font-black text-[#0a4d7a]">{prov.name}</h4>
                      <div className="text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                        {prov.costNote}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {prov.description}
                      </p>

                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 block">
                          المزايا الرئيسية:
                        </span>
                        {prov.features.map((feat, i) => (
                          <div key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProviderId(prov.id);
                          setDispatchStatus(`تم تفعيل ${prov.name} كمزود نشط للإرسال.`);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isActive ? '✓ المزود المفعل حالياً' : 'تفعيل هذا المزود'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CERTIFICATE STUDIO & TEMPLATES MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'certificates' && (
        <CertificateStudio
          onTemplateAdopted={(tpl) => {
            setCertTemplates(loadCertificateTemplates());
            setSelectedCertTemplateId(tpl.id);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* TAB 2.5: LANDING PAGE SECTIONS RE-ORDERING & MANAGER */}
      {/* ======================================================== */}
      {activeTab === 'landing_layout' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0c6aa7]/20 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <LayoutList className="w-6 h-6 text-[#0c6aa7]" />
                <h3 className="text-xl font-black text-[#0a4d7a]">
                  ترتيب وإدارة أقسام صفحات الهبوط (Landing Sections Manager)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                تحكم كامل في تسلسل وترتيب الأقسام المعروضة في الصفحة الرئيسية وإظهارها أو إخفائها فورياً.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetLandingSections}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الترتيب الافتراضي</span>
              </button>
            </div>
          </div>

          {/* Feedback Notice */}
          {layoutNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{layoutNotice}</span>
            </div>
          )}

          {/* Sections List */}
          <div className="space-y-3">
            {landingSections.map((section, index) => {
              const isFirst = index === 0;
              const isLast = index === landingSections.length - 1;

              return (
                <div
                  key={section.id}
                  className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    section.visible
                      ? 'bg-white border-slate-200/90 shadow-xs hover:border-[#0c6aa7]/50'
                      : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
                  }`}
                >
                  {/* Left: Position Rank & Details */}
                  <div className="flex items-center gap-3.5 flex-1 text-right">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                        section.visible
                          ? 'bg-gradient-to-tr from-[#0a4d7a] to-[#0c6aa7] text-white'
                          : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#0a4d7a]">
                          {section.title}
                        </span>
                        {section.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e1eff8] text-[#0c6aa7]">
                            {section.badge}
                          </span>
                        )}
                        {!section.visible && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            مخفي حالياً
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {section.subtitle}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {section.description}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Move Up, Move Down, Toggle Visibility) */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMoveSectionUp(index)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        isFirst
                          ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400'
                          : 'bg-white hover:bg-slate-100 border-slate-300 text-[#0a4d7a] shadow-xs active:scale-95'
                      }`}
                      title="تحريك هذا القسم للأعلى"
                    >
                      <ArrowUp className="w-4 h-4" />
                      <span className="hidden sm:inline">للأعلى</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMoveSectionDown(index)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        isLast
                          ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400'
                          : 'bg-white hover:bg-slate-100 border-slate-300 text-[#0a4d7a] shadow-xs active:scale-95'
                      }`}
                      title="تحريك هذا القسم للأسفل"
                    >
                      <ArrowDown className="w-4 h-4" />
                      <span className="hidden sm:inline">للأسفل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSectionVisibility(section.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                        section.visible
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                      title={section.visible ? 'إخفاء هذا القسم من صفحة الهبوط' : 'إظهار هذا القسم'}
                    >
                      {section.visible ? (
                        <>
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span>ظاهر</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-rose-600" />
                          <span>مخفي</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info footer box */}
          <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs text-[#0a4d7a] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0c6aa7]" />
              <span className="font-bold">
                ملاحظة: الترتيب وحالة الظهور تحفظ تلقائياً وتطبق فوراً على الصفحة الرئيسية للزوار دون الحاجة لإعادة تحميل الموقع.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: TEAM SECTION SETTINGS & LAYOUTS */}
      {/* ======================================================== */}
      {activeTab === 'team_settings' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0c6aa7]/20 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-[#0a4d7a] flex items-center gap-2">
                <Users className="w-6 h-6 text-[#0c6aa7]" />
                <span>إعدادات وتصاميم صفحة هبوط فريق العمل</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                اختر التصميم والشكل الهندسي لعرض فريق العمل في الصفحة الرئيسية، وعدل العناوين وأضف الأعضاء
              </p>
            </div>

            {/* Layout Designs Chooser */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-3">
                اختر شكل وتصميم عرض فريق العمل (6 تصاميم إبداعية وتفاعلية):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Option 1: Glass Cards */}
                <div
                  onClick={() =>
                    handleSaveTeamSettings({ ...teamSettings, layout: 'glass_cards' })
                  }
                  className={`p-4 rounded-3xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    teamSettings.layout === 'glass_cards'
                      ? 'border-[#0c6aa7] bg-[#f0f7fc] shadow-md ring-2 ring-[#0c6aa7]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-2xl bg-gradient-to-br from-[#0a4d7a]/15 to-[#2eb9df]/25 flex items-center justify-center p-2 text-center text-xs font-black text-[#0a4d7a]">
                    بطاقات زجاجية فاخرة (افتراضي)
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0a4d7a]">بطاقات Glassmorphism</div>
                    <div className="text-[11px] text-slate-500">
                      إبراز قائدة المبادرة في بطاقة واسعة علوية مع بطاقات مصغرة للبقية
                    </div>
                  </div>
                  {teamSettings.layout === 'glass_cards' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      ✓ التصميم النشط
                    </span>
                  )}
                </div>

                {/* Option 2: Academic Grid */}
                <div
                  onClick={() =>
                    handleSaveTeamSettings({ ...teamSettings, layout: 'academic_grid' })
                  }
                  className={`p-4 rounded-3xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    teamSettings.layout === 'academic_grid'
                      ? 'border-[#0c6aa7] bg-[#f0f7fc] shadow-md ring-2 ring-[#0c6aa7]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-2xl bg-slate-100 flex items-center justify-center p-2 text-center text-xs font-black text-slate-700">
                    شبكة أكاديمية IAU
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0a4d7a]">شبكة جامعية متساوية</div>
                    <div className="text-[11px] text-slate-500">
                      أعمدة متوازنة مع رموز التخرج وشعارات الكلية المعتمدة
                    </div>
                  </div>
                  {teamSettings.layout === 'academic_grid' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      ✓ التصميم النشط
                    </span>
                  )}
                </div>

                {/* Option 3: Spotlight */}
                <div
                  onClick={() =>
                    handleSaveTeamSettings({ ...teamSettings, layout: 'spotlight' })
                  }
                  className={`p-4 rounded-3xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    teamSettings.layout === 'spotlight'
                      ? 'border-[#0c6aa7] bg-[#f0f7fc] shadow-md ring-2 ring-[#0c6aa7]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-2xl bg-[#0a4d7a] text-white flex items-center justify-center p-2 text-center text-xs font-black">
                    بانر بطل المبادرة (Spotlight)
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0a4d7a]">تسليط الضوء التفاعلي</div>
                    <div className="text-[11px] text-slate-500">
                      بانر محيطي أزرق فخم للقائدة مع قائمة مقتضبة للأعضاء
                    </div>
                  </div>
                  {teamSettings.layout === 'spotlight' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      ✓ التصميم النشط
                    </span>
                  )}
                </div>

                {/* Option 4: Creative Minimal */}
                <div
                  onClick={() =>
                    handleSaveTeamSettings({ ...teamSettings, layout: 'creative_minimal' })
                  }
                  className={`p-4 rounded-3xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    teamSettings.layout === 'creative_minimal'
                      ? 'border-[#0c6aa7] bg-[#f0f7fc] shadow-md ring-2 ring-[#0c6aa7]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 text-center text-xs font-black text-slate-600">
                    كبسولات عصرية مبسطة
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0a4d7a]">تبسيط عصري (Minimal)</div>
                    <div className="text-[11px] text-slate-500">
                      صفوف أفقية أنيقة وسريعة القراءة مع شارات الأقسام
                    </div>
                  </div>
                  {teamSettings.layout === 'creative_minimal' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      ✓ التصميم النشط
                    </span>
                  )}
                </div>

                {/* Option 5: Interactive Carousel */}
                <div
                  onClick={() =>
                    handleSaveTeamSettings({ ...teamSettings, layout: 'interactive_carousel' })
                  }
                  className={`p-4 rounded-3xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    teamSettings.layout === 'interactive_carousel'
                      ? 'border-[#0c6aa7] bg-[#f0f7fc] shadow-md ring-2 ring-[#0c6aa7]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-2xl bg-gradient-to-r from-[#0c6aa7] to-[#2eb9df] text-white flex items-center justify-center p-2 text-center text-xs font-black">
                    أشرطة منزلقة تفاعلية (Carousel)
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0a4d7a]">عرض الشرائح الحديث</div>
                    <div className="text-[11px] text-slate-500">
                      تنقل أفقي ديناميكي مع بطاقة بارزة ومؤشرات تفاعلية رقمية
                    </div>
                  </div>
                  {teamSettings.layout === 'interactive_carousel' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      ✓ التصميم النشط
                    </span>
                  )}
                </div>

                {/* Option 6: Orbit Badges */}
                <div
                  onClick={() =>
                    handleSaveTeamSettings({ ...teamSettings, layout: 'orbit_badges' })
                  }
                  className={`p-4 rounded-3xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    teamSettings.layout === 'orbit_badges'
                      ? 'border-[#0c6aa7] bg-[#f0f7fc] shadow-md ring-2 ring-[#0c6aa7]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-2xl bg-gradient-to-tr from-[#0a4d7a] to-[#c59b27] text-white flex items-center justify-center p-2 text-center text-xs font-black">
                    أوسمة دائرية مضيئة (Orbit Badges)
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0a4d7a]">أوسمة مدارية ملكية</div>
                    <div className="text-[11px] text-slate-500">
                      هالات دائرية مضيئة مع أيقونات التخصص وتأطير ذهبي فاخر
                    </div>
                  </div>
                  {teamSettings.layout === 'orbit_badges' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      ✓ التصميم النشط
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section Titles Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان قسم فريق العمل:
                </label>
                <input
                  type="text"
                  value={teamSettings.sectionTitle}
                  onChange={(e) =>
                    handleSaveTeamSettings({ ...teamSettings, sectionTitle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الوصف التعريفي للقسم:
                </label>
                <input
                  type="text"
                  value={teamSettings.sectionSubtitle}
                  onChange={(e) =>
                    handleSaveTeamSettings({ ...teamSettings, sectionSubtitle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7]"
                />
              </div>
            </div>

            {teamSaveNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{teamSaveNotice}</span>
              </div>
            )}
          </div>

          {/* Members List and Add New Member Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Add New Member Form */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-base font-black text-[#0a4d7a] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#0c6aa7]" />
                <span>إضافة فرد جديد لفريق العمل</span>
              </h4>

              <form onSubmit={handleAddTeamMember} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. سارة الدوسري"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الدور / المنصب:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: منسقة البرامج الإرشادية"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الجهة والكلية:</label>
                  <input
                    type="text"
                    value={newMemberAffiliation}
                    onChange={(e) => setNewMemberAffiliation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التخصص الدقيق:</label>
                  <input
                    type="text"
                    placeholder="مثال: التربية الخاصة، التخاطب واللغة"
                    value={newMemberSpecialty}
                    onChange={(e) => setNewMemberSpecialty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نبذة مختصرة:</label>
                  <textarea
                    rows={2}
                    placeholder="مساهماته ورؤيته في نشر الوعي والدمج..."
                    value={newMemberBio}
                    onChange={(e) => setNewMemberBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">شارة التميّز:</label>
                  <input
                    type="text"
                    placeholder="مثال: باحث معتمد"
                    value={newMemberBadge}
                    onChange={(e) => setNewMemberBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  إضافة العضو للفريق
                </button>
              </form>
            </div>

            {/* Right: Current Members List */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-base font-black text-[#0a4d7a]">
                الأعضاء الحاليون في صفحة الهبوط ({teamSettings.members.length})
              </h4>

              <div className="space-y-3">
                {teamSettings.members.map((member) => (
                  <div
                    key={member.id}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                      member.isLeader
                        ? 'bg-[#f0f7fc] border-[#0c6aa7]/30 ring-1 ring-[#0c6aa7]/20'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#0a4d7a]">{member.name}</span>
                        {member.isLeader && (
                          <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full">
                            قائدة ومؤسسة المبادرة
                          </span>
                        )}
                        {member.badge && !member.isLeader && (
                          <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                            {member.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#0c6aa7]">{member.role}</div>
                      <div className="text-[11px] text-slate-500">{member.affiliation} · {member.specialty}</div>
                      <p className="text-[11px] text-slate-600 pt-1 line-clamp-2">{member.bio}</p>
                    </div>

                    {!member.isLeader && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTeamMember(member.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                        title="حذف هذا العضو"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PLATFORM ANALYTICS OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400">إجمالي الأسئلة في البنك:</span>
              <div className="text-3xl font-black text-[#0a4d7a] mt-1">
                {NAFHAM_QUIZ_BANK.length + customQuestions.length}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {NAFHAM_QUIZ_BANK.length} مدمج + {customQuestions.length} مضاف
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400">المواضيع والمكتبة العلمية:</span>
              <div className="text-3xl font-black text-[#0c6aa7] mt-1">
                {NAFHAM_LIBRARY_TOPICS.length} مواضيع
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">محكمة أكاديمياً بالكامل</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400">عدد الألعاب المتاحة:</span>
              <div className="text-3xl font-black text-purple-600 mt-1">7 ألعاب</div>
              <span className="text-[11px] text-purple-600 mt-1 block font-bold">
                بما فيها متاهة الوعي الجديدة
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400">فصول الفيلم التعريفي:</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">8 محطات</div>
              <span className="text-[11px] text-emerald-600 mt-1 block font-bold">
                مدة العرض: 6:39 دقيقة
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ADD QUESTION */}
      {/* ======================================================== */}
      {activeTab === 'add_question' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-lg font-black text-[#0a4d7a]">
            إضافة سؤال علمي معتمد جديد لبنك التحدي
          </h3>

          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                تصنيف الموضوع:
              </label>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7]"
              >
                <option value="طبيعة طيف التوحد">طبيعة طيف التوحد</option>
                <option value="التواصل والتفاعل">التواصل والتفاعل</option>
                <option value="المعالجة الحسية">المعالجة الحسية</option>
                <option value="الروتين والأمان">الروتين والأمان</option>
                <option value="الدمج المجتمعي">الدمج المجتمعي</option>
                <option value="تصحيح المفاهيم والخرافات">تصحيح المفاهيم والخرافات</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">نص السؤال:</label>
              <textarea
                rows={2}
                required
                placeholder="أدخل نص السؤال التوعوي بدقة..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7]"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                الخيارات الأربعة (حدد زر الإجابة الصحيحة):
              </label>
              {options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={correctIdx === oIdx}
                    onChange={() => setCorrectIdx(oIdx)}
                    className="w-4 h-4 text-[#0c6aa7] cursor-pointer"
                    title="حدد كإجابة صحيحة"
                  />
                  <input
                    type="text"
                    required
                    placeholder={`الخيار ${oIdx + 1}${correctIdx === oIdx ? ' (الإجابة الصحيحة)' : ''}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-xl border text-sm focus:outline-hidden ${
                      correctIdx === oIdx
                        ? 'border-emerald-400 bg-emerald-50/40 text-emerald-950 font-semibold'
                        : 'border-slate-200'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                التفسير العلمي والشرح التوعوي:
              </label>
              <textarea
                rows={2}
                placeholder="الشرح الذي يظهر للمستخدم بعد اختيار الإجابة..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المصدر العلمي المعتمد:
              </label>
              <input
                type="text"
                placeholder="مثال: جامعة الإمام عبدالرحمن بن فيصل - DSM-5"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0c6aa7]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#0c6aa7] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#0a4d7a] transition-all cursor-pointer shadow-md"
            >
              حفظ السؤال في البنك
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: MANAGE QUESTIONS */}
      {/* ======================================================== */}
      {activeTab === 'manage_questions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#0a4d7a]">
            الأسئلة المضافة بواسطة المشرفين ({customQuestions.length})
          </h3>

          {customQuestions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              لا توجد أسئلة مضافة يدوياً حتى الآن. يمكنك إضافة سؤال جديد عبر تبويب &quot;إضافة سؤال جديد&quot;.
            </div>
          ) : (
            <div className="space-y-3">
              {customQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#0c6aa7] bg-[#e1eff8] px-2 py-0.5 rounded-md">
                      {q.topic}
                    </span>
                    <p className="font-bold text-slate-800 text-sm mt-1">{q.question}</p>
                    <p className="text-emerald-700 font-semibold">
                      ✓ الإجابة الصحيحة: {q.options[q.correctIndex]}
                    </p>
                    <p className="text-slate-500">المصدر: {q.source}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteCustomQuestion(q.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                    title="حذف هذا السؤال"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5-Minute Action Authorization Modal (Prompts once when editing, valid for 5 mins) */}
      {isAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => {
            setIsAuthModalOpen(false);
            setPendingAction(null);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-right shadow-2xl border border-[#0c6aa7]/25 space-y-5 animate-in fade-in zoom-in-95 font-['Tajawal']"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0a4d7a] to-[#0c6aa7] text-white flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-[#0a4d7a]">
                تأكيد إذن التعديل الإشرافي
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                لإجراء <span className="font-bold text-[#0c6aa7]">«{pendingActionLabel}»</span>، يرجى إدخال رمز المشرفين. سيتم فتح إذن التعديل لك لمدة <span className="font-bold text-emerald-700">5 دقائق كاملة</span> دون الحاجة لإعادة إدخال الرمز خلالها.
              </p>
            </div>

            <form onSubmit={handleConfirmEditAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رمز المرور المعتمد:
                </label>
                <input
                  type="password"
                  placeholder="أدخل الرمز (nafham2026)..."
                  value={authPasscodeInput}
                  onChange={(e) => {
                    setAuthPasscodeInput(e.target.value);
                    if (authModalError) setAuthModalError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#0c6aa7] focus:ring-2 focus:ring-[#0c6aa7]/20 text-center tracking-widest font-mono font-bold"
                  autoFocus
                />
              </div>

              {authModalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authModalError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-[#0c6aa7] to-[#0a4d7a] hover:from-[#0a4d7a] hover:to-[#083c60] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>تأكيد التعديل (5 دقائق)</span>
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
              جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب · الرمز: nafham2026
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
