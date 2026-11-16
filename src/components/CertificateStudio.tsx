import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Sparkles,
  Printer,
  Check,
  Plus,
  Trash2,
  Edit3,
  Palette,
  GraduationCap,
  Download,
  Eye,
  Film,
  Building2,
  Users,
  CheckCircle2,
  Calendar,
  QrCode,
  FileText,
  Save,
  RotateCcw,
} from 'lucide-react';
import {
  CertificateTemplate,
  loadCertificateTemplates,
  saveCertificateTemplates,
  loadActiveCertificateTemplate,
  setActiveCertificateTemplateId,
} from '../data/certificateTemplates';

interface CertificateStudioProps {
  onTemplateAdopted?: (template: CertificateTemplate) => void;
}

export const CertificateStudio: React.FC<CertificateStudioProps> = ({ onTemplateAdopted }) => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>(loadCertificateTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    loadActiveCertificateTemplate().id
  );
  const [activePlatformTemplateId, setActivePlatformTemplateId] = useState<string>(
    loadActiveCertificateTemplate().id
  );

  // Live test preview recipient name & score
  const [previewName, setPreviewName] = useState('سفير الوعي بطيف التوحد');
  const [previewScore, setPreviewScore] = useState(15);
  const [previewTotal, setPreviewTotal] = useState(15);
  const [savedNotice, setSavedNotice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'academic' | 'creative' | 'style'>('content');

  const certCanvasRef = useRef<HTMLDivElement>(null);

  // Active selected template object
  const currentTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Editable form state for current template
  const [formData, setFormData] = useState<CertificateTemplate>(currentTemplate);

  useEffect(() => {
    setFormData(currentTemplate);
  }, [currentTemplate]);

  // Handle adopting this template platform-wide
  const handleAdoptTemplate = () => {
    setActiveCertificateTemplateId(currentTemplate.id);
    setActivePlatformTemplateId(currentTemplate.id);
    if (onTemplateAdopted) {
      onTemplateAdopted(currentTemplate);
    }
    setSavedNotice(`✓ تم اعتماد «${currentTemplate.name}» كقالب رسمي لكافة شهادات المنصة!`);
    setTimeout(() => setSavedNotice(''), 4500);
  };

  // Save changes to current template
  const handleSaveCurrentTemplate = () => {
    const updated = templates.map((t) => (t.id === formData.id ? { ...formData } : t));
    setTemplates(updated);
    saveCertificateTemplates(updated);
    setSavedNotice(`✓ تم حفظ تعديلات هوية «${formData.name}» بنجاح!`);
    setIsEditing(false);
    setTimeout(() => setSavedNotice(''), 4000);
  };

  // Create brand new template
  const handleCreateNewTemplate = () => {
    const newId = `custom_template_${Date.now()}`;
    const newT: CertificateTemplate = {
      id: newId,
      name: 'قالب شهادة احترافي جديد',
      category: 'general',
      title: 'شهادة تقدير وإنجاز توعوي رفيع',
      subtitle: 'مبادرة نفهم باضطراب طيف التوحد · جامعة الإمام عبدالرحمن بن فيصل',
      honoraryQuote: '«الفهم بداية التقبل، والوعي جسر الدمج الإنساني»',
      recipientTitle: 'المشارك المتميز',
      bodyText:
        'تقديراً لاجتيازه الفاعل لمسارات مبادرة «نفهم» التوعوية وإظهار التزامه العميق بنشر ثقافة التقبل الإنساني ومساندة أفراد طيف التوحد وأسرهم.',
      supervisor: 'جامعة الإمام عبدالرحمن بن فيصل',
      supervisorDepartment: 'كلية الآداب · المبادرات المجتمعية',
      signatoryName: 'شهد حسن عبدالرحمن',
      signatoryRole: 'قائدة ومؤسسة مبادرة «نفهم»',
      styleTheme: 'royal_iau',
      primaryColor: '#0a4d7a',
      secondaryColor: '#0c6aa7',
      borderColor: '#c59b27',
      showScore: true,
      showRefId: true,
      isDefault: false,
      academicCommittee: {
        enabled: true,
        committeeTitle: 'لجنة الإشراف الأكاديمي والتحكيم',
        members: 'أ.د. منى بنت إبراهيم البراك · د. سارة بنت عبدالعزيز القحطاني',
        department: 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب',
        notes: 'تحكيم ومطابقة معايير جودة المحتوى التوعوي',
      },
      creativeTeam: {
        enabled: true,
        teamTitle: 'فريق الإنتاج الإبداعي والموشن جرافيكس',
        leadName: 'شهد حسن عبدالرحمن (إشراف فني وإخراج)',
        specialists: 'تحريك الموشن جرافيكس، التصميم الجرافيكي، والمؤثرات البصرية',
        productionYear: 'إنتاج مبادرة نفهم 2026',
      },
    };
    const updated = [...templates, newT];
    setTemplates(updated);
    saveCertificateTemplates(updated);
    setSelectedTemplateId(newId);
    setFormData(newT);
    setIsEditing(true);
    setSavedNotice('تم إنشاء قالب شهادة جديد! يمكنك الآن تخصيص كافة بياناته وأقسامه.');
    setTimeout(() => setSavedNotice(''), 4000);
  };

  // Delete template
  const handleDeleteTemplate = (id: string) => {
    if (templates.length <= 1) {
      alert('يجب الإبقاء على قالب واحد على الأقل في المنصة.');
      return;
    }
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    saveCertificateTemplates(updated);
    if (selectedTemplateId === id) {
      setSelectedTemplateId(updated[0].id);
    }
    setSavedNotice('تم حذف القالب بنجاح.');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  // Print certificate
  const handlePrintCertificate = () => {
    window.print();
  };

  const todayDate = new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Determine certificate theme classes
  const getThemeCanvasStyles = () => {
    switch (formData.styleTheme) {
      case 'golden_honor':
        return {
          wrapper: 'bg-gradient-to-b from-[#fffefc] via-[#fdfaf3] to-[#fbf5e6] text-[#422006]',
          outerBorder: 'border-[#c59b27] shadow-[0_15px_40px_rgba(197,155,39,0.18)]',
          innerBorder: 'border-[#dfbd5d]/70',
          accentColor: '#b45309',
          goldGradient: 'from-[#c59b27] via-[#dfbd5d] to-[#9a7618]',
        };
      case 'kids_explorer':
        return {
          wrapper: 'bg-gradient-to-b from-[#f9fdfa] via-white to-[#edfbf4] text-[#064e3b]',
          outerBorder: 'border-[#059669] shadow-[0_15px_40px_rgba(5,150,105,0.15)]',
          innerBorder: 'border-[#34d399]/60',
          accentColor: '#059669',
          goldGradient: 'from-[#059669] via-[#10b981] to-[#047857]',
        };
      case 'modern_ocean':
        return {
          wrapper: 'bg-gradient-to-b from-[#f8fbfe] via-white to-[#edf5fc] text-[#082f49]',
          outerBorder: 'border-[#0284c7] shadow-[0_15px_40px_rgba(2,132,199,0.18)]',
          innerBorder: 'border-[#38bdf8]/60',
          accentColor: '#0284c7',
          goldGradient: 'from-[#0284c7] via-[#38bdf8] to-[#0369a1]',
        };
      case 'royal_iau':
      default:
        return {
          wrapper: 'bg-gradient-to-b from-[#fafcfe] via-white to-[#f0f6fa] text-[#0f2942]',
          outerBorder: 'border-[#0a4d7a] shadow-[0_20px_50px_rgba(10,77,122,0.22)]',
          innerBorder: 'border-[#c59b27]',
          accentColor: '#0a4d7a',
          goldGradient: 'from-[#c59b27] via-[#e5c158] to-[#9e7a17]',
        };
    }
  };

  const themeStyles = getThemeCanvasStyles();

  return (
    <div className="space-y-8 font-['Tajawal'] text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0a4d7a] via-[#0c6aa7] to-[#0a4d7a] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-8 h-8 text-[#e5c158]" />
            <h2 className="text-2xl sm:text-3xl font-black">
              ستوديو وقوالب الشهادات الفنية الرفيعة
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-cyan-100 max-w-2xl font-medium leading-relaxed">
            تصميم قوالب الشهادات بهوية أكاديمية وجمالية متميزة، مع إمكانية تعديل لجنة الإشراف الأكاديمي والتحكيم وفريق الإنتاج الإبداعي والموشن جرافيكس واعتماد القالب لكافة المنصة.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNewTemplate}
            className="px-4 py-2.5 rounded-2xl bg-white text-[#0a4d7a] text-xs font-bold hover:bg-cyan-50 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#0c6aa7]" />
            <span>إنشاء قالب جديد</span>
          </button>

          <button
            onClick={handleAdoptTemplate}
            className="px-5 py-2.5 rounded-2xl bg-[#c59b27] hover:bg-[#b0871d] text-white text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>اعتماد هذا القالب للمنصة</span>
          </button>
        </div>
      </div>

      {/* Notification Alert */}
      {savedNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </motion.div>
      )}

      {/* Main Studio Grid: Left (Editor controls) / Right (Live Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1: TEMPLATE SELECTOR & IDENTITY EDITORS (5 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Template Cards Carousel */}
          <div className="bg-white rounded-3xl p-5 border border-[#0c6aa7]/20 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">اختر قالباً للتعديل والمعاينة:</span>
              <span className="text-[11px] font-bold text-[#0c6aa7] bg-[#e1eff8] px-2.5 py-0.5 rounded-full">
                {templates.length} قوالب متوفرة
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {templates.map((tpl) => {
                const isSelected = tpl.id === selectedTemplateId;
                const isOfficial = tpl.id === activePlatformTemplateId;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tpl.id);
                      setIsEditing(false);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative text-right flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'border-[#0c6aa7] bg-[#f0f7fb] shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {isOfficial && (
                      <span className="absolute -top-2 left-2 text-[9px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                        القالب المعتمد حالياً
                      </span>
                    )}

                    <div className="text-xs font-bold text-[#0a4d7a] line-clamp-1">
                      {tpl.name}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {tpl.title}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] font-semibold text-slate-400">
                        {tpl.styleTheme === 'royal_iau'
                          ? 'ملكي IAU'
                          : tpl.styleTheme === 'golden_honor'
                          ? 'ذهبي شرفي'
                          : tpl.styleTheme === 'modern_ocean'
                          ? 'محيطي حديث'
                          : 'مستكشف مرح'}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0c6aa7]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Form Editor Tabs (Content, Academic Committee, Creative Team, Style) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#0c6aa7]" />
                <h3 className="text-sm font-black text-[#0a4d7a]">
                  تخصيص هوية القالب: {formData.name}
                </h3>
              </div>

              {templates.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteTemplate(formData.id)}
                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                  title="حذف هذا القالب"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sub-tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl text-[11px] font-bold text-center">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'content' ? 'bg-white text-[#0a4d7a] shadow-xs' : 'text-slate-600'
                }`}
              >
                البيانات والنصوص
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'style' ? 'bg-white text-[#0a4d7a] shadow-xs' : 'text-slate-600'
                }`}
              >
                التصميم والألوان
              </button>
            </div>

            {/* TAB CONTENT: General Content & Text */}
            {activeTab === 'content' && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم القالب الإداري:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">عنوان الشهادة الرئيسي:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0a4d7a] focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">العنوان الفرعي التوضيحي:</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">عبارة الفخر والتقدير (اقتباس جمالي):</label>
                  <input
                    type="text"
                    value={formData.honoraryQuote || ''}
                    onChange={(e) => setFormData({ ...formData, honoraryQuote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0c6aa7]"
                    placeholder="«الفهم بداية التقبل، والوعي جسر الدمج الإنساني»"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">نص التقدير والشهادة:</label>
                  <textarea
                    rows={3}
                    value={formData.bodyText}
                    onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0c6aa7] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اسم المعتمد / قائد المبادرة:</label>
                    <input
                      type="text"
                      value={formData.signatoryName}
                      onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-hidden focus:border-[#0c6aa7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">صفة المعتمد:</label>
                    <input
                      type="text"
                      value={formData.signatoryRole}
                      onChange={(e) => setFormData({ ...formData, signatoryRole: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0c6aa7]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB ACADEMIC: Academic Supervision and Arbitration Committee */}
            {activeTab === 'academic' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-700" />
                    <span className="font-bold text-amber-900">تفعيل ظهور لجنة الإشراف الأكاديمي والتحكيم</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.academicCommittee?.enabled ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicCommittee: {
                          ...(formData.academicCommittee || {
                            committeeTitle: 'لجنة الإشراف الأكاديمي والتحكيم',
                            members: '',
                            department: '',
                          }),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-[#0c6aa7] rounded-sm cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">مسمى اللجنة:</label>
                  <input
                    type="text"
                    value={formData.academicCommittee?.committeeTitle || 'لجنة الإشراف الأكاديمي والتحكيم'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicCommittee: {
                          ...formData.academicCommittee,
                          committeeTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">أسماء أعضاء ومحكمي اللجنة:</label>
                  <textarea
                    rows={2}
                    value={formData.academicCommittee?.members || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicCommittee: {
                          ...formData.academicCommittee,
                          members: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs leading-relaxed focus:outline-hidden focus:border-[#0c6aa7]"
                    placeholder="مثال: أ.د. منى بنت إبراهيم البراك · د. سارة بنت عبدالعزيز القحطاني · د. خالد بن فهد المطيري"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الجهة والأكاديمية المشرفة:</label>
                  <input
                    type="text"
                    value={formData.academicCommittee?.department || 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicCommittee: {
                          ...formData.academicCommittee,
                          department: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">مجال التحكيم والملاحظة العلمية:</label>
                  <input
                    type="text"
                    value={formData.academicCommittee?.notes || 'تحكيم المحتوى ومطابقة المعايير النمائية المعتمدة'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicCommittee: {
                          ...formData.academicCommittee,
                          notes: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>
              </div>
            )}

            {/* TAB CREATIVE: Creative Production and Motion Graphics Team */}
            {activeTab === 'creative' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200">
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-[#0c6aa7]" />
                    <span className="font-bold text-[#0a4d7a]">تفعيل ظهور فريق الإنتاج الإبداعي والموشن جرافيكس</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.creativeTeam?.enabled ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creativeTeam: {
                          ...(formData.creativeTeam || {
                            teamTitle: 'فريق الإنتاج الإبداعي والموشن جرافيكس',
                            leadName: 'شهد حسن عبدالرحمن',
                            specialists: '',
                          }),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-[#0c6aa7] rounded-sm cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">مسمى الفريق الإبداعي:</label>
                  <input
                    type="text"
                    value={formData.creativeTeam?.teamTitle || 'فريق الإنتاج الإبداعي والموشن جرافيكس'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creativeTeam: {
                          ...formData.creativeTeam,
                          teamTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المشرف / المخرج الإبداعي:</label>
                  <input
                    type="text"
                    value={formData.creativeTeam?.leadName || 'شهد حسن عبدالرحمن (الإشراف الإبداعي والإخراج الفني)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creativeTeam: {
                          ...formData.creativeTeam,
                          leadName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تخصصات وأدوار الفريق الفني:</label>
                  <textarea
                    rows={2}
                    value={formData.creativeTeam?.specialists || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creativeTeam: {
                          ...formData.creativeTeam,
                          specialists: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs leading-relaxed focus:outline-hidden focus:border-[#0c6aa7]"
                    placeholder="مثال: تحريك الموشن جرافيكس، التصميم الجرافيكي، والهندسة الصوتية"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">سنة الإنتاج وحقوق العمل:</label>
                  <input
                    type="text"
                    value={formData.creativeTeam?.productionYear || 'إنتاج مبادرة نفهم 2026'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creativeTeam: {
                          ...formData.creativeTeam,
                          productionYear: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0c6aa7]"
                  />
                </div>
              </div>
            )}

            {/* TAB STYLE: Themes & Decorative Options */}
            {activeTab === 'style' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-2">النمط الجمالي والألوان:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'royal_iau', label: 'ملكي IAU (كحلي وذهبي)', bg: 'bg-[#0a4d7a]' },
                      { id: 'golden_honor', label: 'شرفي فاخر (ذهبي دافئ)', bg: 'bg-amber-600' },
                      { id: 'modern_ocean', label: 'محيطي نقي (أزرق سماوي)', bg: 'bg-[#0c6aa7]' },
                      { id: 'kids_explorer', label: 'مستكشف مبهج (زمردي)', bg: 'bg-emerald-600' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            styleTheme: theme.id as any,
                          })
                        }
                        className={`p-3 rounded-xl border-2 text-right transition-all flex items-center justify-between ${
                          formData.styleTheme === theme.id
                            ? 'border-[#0c6aa7] bg-[#f0f7fb] font-bold'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[11px] text-slate-800">{theme.label}</span>
                        <span className={`w-3 h-3 rounded-full ${theme.bg}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">إظهار النتيجة والدرجة المحققة:</span>
                    <input
                      type="checkbox"
                      checked={formData.showScore}
                      onChange={(e) => setFormData({ ...formData, showScore: e.target.checked })}
                      className="w-4 h-4 text-[#0c6aa7] rounded-sm cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">إظهار الرقم المرجعي الموثق (Ref ID):</span>
                    <input
                      type="checkbox"
                      checked={formData.showRefId}
                      onChange={(e) => setFormData({ ...formData, showRefId: e.target.checked })}
                      className="w-4 h-4 text-[#0c6aa7] rounded-sm cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button for Current Form */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveCurrentTemplate}
                className="w-full py-2.5 rounded-2xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات هذا القالب</span>
              </button>
            </div>
          </div>

          {/* 3. Live Preview Recipient Sandbox */}
          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200 text-xs space-y-2.5">
            <span className="font-bold text-slate-600 block">تجربة المعاينة الفورية باسم المستلم:</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="اسم المستلم في المعاينة..."
                value={previewName}
                onChange={(e) => setPreviewName(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:outline-hidden"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={previewScore}
                  onChange={(e) => setPreviewScore(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-center font-bold"
                />
                <span className="text-slate-500 font-bold">من 15</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: HIGH-AESTHETIC CERTIFICATE CANVAS PREVIEW (7 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#0c6aa7]" />
              <h3 className="text-base font-black text-[#0a4d7a]">
                المعاينة الحية للقالب المعتمد (جاهز للطباعة والـ PDF)
              </h3>
            </div>

            <button
              onClick={handlePrintCertificate}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة وتصدير PDF</span>
            </button>
          </div>

          {/* THE ORNATE DIPLOMA CANVAS */}
          <div
            ref={certCanvasRef}
            className={`relative rounded-3xl p-6 sm:p-10 border-4 transition-all duration-300 overflow-hidden ${themeStyles.wrapper} ${themeStyles.outerBorder}`}
            style={{
              minHeight: '620px',
            }}
          >
            {/* INNER LUXURY FRAME WITH ORNATE CORNERS */}
            <div
              className={`absolute inset-3 sm:inset-4 rounded-2xl border-2 pointer-events-none ${themeStyles.innerBorder}`}
            />

            {/* Top Right Ornate Corner Bracket */}
            <svg
              className="absolute top-5 right-5 w-8 h-8 text-[#c59b27] opacity-80 pointer-events-none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M5,50 L5,5 L50,5" />
              <circle cx="20" cy="20" r="5" fill="currentColor" />
              <path d="M10,35 Q35,35 35,10" />
            </svg>

            {/* Top Left Ornate Corner Bracket */}
            <svg
              className="absolute top-5 left-5 w-8 h-8 text-[#c59b27] opacity-80 pointer-events-none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M95,50 L95,5 L50,5" />
              <circle cx="80" cy="20" r="5" fill="currentColor" />
              <path d="M90,35 Q65,35 65,10" />
            </svg>

            {/* Bottom Right Ornate Corner Bracket */}
            <svg
              className="absolute bottom-5 right-5 w-8 h-8 text-[#c59b27] opacity-80 pointer-events-none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M5,50 L5,95 L50,95" />
              <circle cx="20" cy="80" r="5" fill="currentColor" />
              <path d="M10,65 Q35,65 35,90" />
            </svg>

            {/* Bottom Left Ornate Corner Bracket */}
            <svg
              className="absolute bottom-5 left-5 w-8 h-8 text-[#c59b27] opacity-80 pointer-events-none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M95,50 L95,95 L50,95" />
              <circle cx="80" cy="80" r="5" fill="currentColor" />
              <path d="M90,65 Q65,65 65,90" />
            </svg>

            {/* Watermark Emblem in Background (No central seal, just subtle geometric Islamic/Academic geometry) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
              <svg className="w-96 h-96 text-[#0a4d7a]" viewBox="0 0 200 200" fill="currentColor">
                <polygon points="100,10 120,70 185,70 135,110 155,170 100,135 45,170 65,110 15,70 80,70" />
              </svg>
            </div>

            {/* CERTIFICATE HEADER: Dual Logos & Institutional Branding */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 pb-4 mb-6">
              {/* Right Side: University Branding */}
              <div className="flex items-center gap-3 text-right">
                <img
                  src="/assets/aistudio/nafham_logo_transparent_5d69613c.png"
                  alt="شعار جامعة الإمام عبدالرحمن بن فيصل"
                  className="h-12 w-auto object-contain drop-shadow-xs"
                />
                <div>
                  <div className="text-[10px] text-[#c59b27] font-black tracking-wide">
                    المملكة العربية السعودية
                  </div>
                  <div className="text-[11px] font-extrabold text-[#0a4d7a] tracking-tight">
                    جامعة الإمام عبدالرحمن بن فيصل
                  </div>
                  <div className="text-[10px] text-slate-600 font-bold">
                    كلية الآداب
                  </div>
                </div>
              </div>

              {/* Center Basmala / Emblem Ornament */}
              <div className="hidden sm:flex flex-col items-center">
                <div className="text-xs sm:text-sm font-bold text-[#c59b27] tracking-wider font-['Cairo'] select-none">
                  بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
                </div>
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent mt-1" />
              </div>

              {/* Left Side: Nafham Initiative Branding */}
              <div className="flex items-center gap-2.5 text-left">
                <div className="text-right">
                  <div className="text-[12px] font-black text-[#0c6aa7]">
                    مبادرة نفهم التوعوية
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    لأن الفهم بداية التقبل
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0a4d7a] to-[#0c6aa7] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  ن
                </div>
              </div>
            </div>

            {/* CERTIFICATE TITLES (NO "منطقة معتمدة" - Clean & Regal) */}
            <div className="relative z-10 text-center space-y-2 mb-5">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0a4d7a] tracking-wide font-['Cairo']">
                {formData.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
                {formData.subtitle}
              </p>
              {formData.honoraryQuote && (
                <div className="text-[11px] font-bold text-[#c59b27] italic pt-0.5">
                  {formData.honoraryQuote}
                </div>
              )}
              {/* Gilded ornamental separator */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="w-16 h-px bg-gradient-to-l from-[#c59b27] to-transparent" />
                <span className="text-[#c59b27] text-xs">✦</span>
                <div className="w-16 h-px bg-gradient-to-r from-[#c59b27] to-transparent" />
              </div>
            </div>

            {/* RECIPIENT NAME PRESENTATION */}
            <div className="relative z-10 text-center my-6">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                تُمنح هذه الشهادة بكل فخر واعتزاز إلى:
              </span>
              <div className="inline-block py-2 px-8 rounded-2xl bg-gradient-to-r from-transparent via-[#e1eff8]/40 to-transparent border-b-2 border-[#c59b27]">
                <h3 className="text-2xl sm:text-3xl font-black text-[#0a4d7a] font-['Cairo'] tracking-wide">
                  {previewName || 'سلطان عبدالله الدوسري'}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#0c6aa7] block mt-1">
                {formData.recipientTitle}
              </span>
            </div>

            {/* BODY TEXT / APPRECIATION */}
            <div className="relative z-10 max-w-xl mx-auto text-center mb-6">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {formData.bodyText}
              </p>

              {formData.showScore && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-[#0a4d7a] shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    النتيجة المحققة: {previewScore} من {previewTotal} في بنك الأسئلة العلمي
                  </span>
                </div>
              )}
            </div>

            {/* BOTTOM BAR: SIGNATURES, DATE, & QR VERIFICATION */}
            <div className="relative z-10 pt-6 mt-4 border-t border-slate-200 flex items-end justify-between text-right">
              {/* Date & Ref */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#0a4d7a]">تاريخ الإصدار:</div>
                <div className="text-xs font-semibold text-slate-700">{todayDate}</div>
                {formData.showRefId && (
                  <div className="text-[10px] text-slate-400 font-mono">
                    الرقم المرجعي: NFH-884912
                  </div>
                )}
              </div>

              {/* QR Verification Barcode */}
              <div className="hidden sm:flex flex-col items-center">
                <div className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                  تحقق إلكتروني فوري
                </span>
              </div>

              {/* Official Signatory: Initiative Entity */}
              <div className="text-left space-y-1">
                <div className="text-[11px] font-bold text-[#0a4d7a]">
                  الجهة المانحة:
                </div>
                <div className="text-sm sm:text-base font-black text-[#0c6aa7] font-['Cairo'] tracking-wide">
                  مبادرة «نفهم» التوعوية
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب
                </div>
                {/* Signature visual line */}
                <div className="w-28 h-0.5 bg-[#0a4d7a]/40 ml-auto mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
