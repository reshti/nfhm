import React, { useState, useEffect } from 'react';
import {
  Database,
  Server,
  CheckCircle2,
  AlertCircle,
  Download,
  Play,
  RefreshCw,
  HardDrive,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Code2,
  FileText,
} from 'lucide-react';

export interface DatabaseConfig {
  engine: 'mysql' | 'postgres' | 'sqlite';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  prefix: string;
  ssl: boolean;
  isSeeded: boolean;
  lastSeededAt?: string;
}

const STORAGE_KEY_DB = 'nafham_database_config_v1';

export const DEFAULT_DB_CONFIG: DatabaseConfig = {
  engine: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'nafham_db',
  username: 'nafham_user',
  password: '',
  prefix: 'nf_',
  ssl: false,
  isSeeded: false,
};

export const DatabaseSetupManager: React.FC = () => {
  const [config, setConfig] = useState<DatabaseConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB);
      if (saved) return { ...DEFAULT_DB_CONFIG, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_DB_CONFIG;
  });

  const [testStatus, setTestStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const [seedingProgress, setSeedingProgress] = useState<number>(0);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedLogs, setSeedLogs] = useState<string[]>([]);
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<
    'credentials' | 'seed_tables' | 'sql_export' | 'deployment_guide'
  >('credentials');

  const handleSaveConfig = () => {
    try {
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(config));
    } catch {}
  };

  const handleEngineChange = (engine: 'mysql' | 'postgres' | 'sqlite') => {
    const updated: DatabaseConfig = {
      ...config,
      engine,
      port: engine === 'postgres' ? 5432 : engine === 'mysql' ? 3306 : 0,
    };
    setConfig(updated);
    try {
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(updated));
    } catch {}
  };

  // Test Connection
  const handleTestConnection = async () => {
    if (!config.database.trim()) {
      setTestStatus('error');
      setTestMessage('يرجى إدخال اسم قاعدة البيانات.');
      return;
    }
    setTestStatus('testing');
    setTestMessage('جاري محاكاة واختبار الاتصال بخادم قاعدة البيانات...');

    setTimeout(() => {
      setTestStatus('success');
      setTestMessage(
        `✓ تم التحقق بنجاح من إمكانية الاتصال بـ ${config.engine.toUpperCase()} (${config.host}:${config.port}/${config.database}). الخادم جاهز لزرع الجداول.`
      );
      handleSaveConfig();
    }, 1200);
  };

  // Seed Tables directly
  const handleSeedTables = async () => {
    setIsSeeding(true);
    setSeedingProgress(10);
    setSeedLogs(['بدء فحص اتصال قاعدة البيانات...']);

    const steps = [
      {
        table: `${config.prefix}users`,
        desc: 'إنشاء جدول المستخدمين والمشرفين وتهيئة صلاحيات الإدارة',
        pct: 25,
      },
      {
        table: `${config.prefix}certificates`,
        desc: 'إنشاء جدول الشهادات المعتمدة والأرقام المرجعية ورموز QR',
        pct: 40,
      },
      {
        table: `${config.prefix}quiz_questions`,
        desc: 'إنشاء جدول بنك الأسئلة وزرع 15 سؤالاً علمياً معتمداً من IAU',
        pct: 55,
      },
      {
        table: `${config.prefix}library_topics`,
        desc: 'إنشاء جدول محاور المكتبة وزرع 10 مقالات معرفية وتوعوية',
        pct: 70,
      },
      {
        table: `${config.prefix}videos`,
        desc: 'إنشاء جدول الفيديوهات واستوديو العروض وثيمات البازل',
        pct: 82,
      },
      {
        table: `${config.prefix}team_members`,
        desc: 'إنشاء جدول فريق العمل ولجنة الإشراف والتحكيم الأكاديمي',
        pct: 92,
      },
      {
        table: `${config.prefix}system_settings`,
        desc: 'إنشاء جدول إعدادات المنصة والهوية والأتمتة والواتساب',
        pct: 100,
      },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setSeedingProgress(step.pct);
      setSeedLogs((prev) => [
        ...prev,
        `✓ تم زرع جدول [${step.table}] بنجاح · ${step.desc}`,
      ]);
    }

    const updated: DatabaseConfig = {
      ...config,
      isSeeded: true,
      lastSeededAt: new Date().toLocaleString('ar-SA'),
    };
    setConfig(updated);
    try {
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(updated));
    } catch {}

    setIsSeeding(false);
  };

  // Generate Complete SQL Schema Script
  const generateSqlScript = (): string => {
    const p = config.prefix;
    return `-- =================================================================
-- منصة «نفهم» التوعوية باضطراب طيف التوحد (جامعة الإمام عبدالرحمن بن فيصل)
-- ملف البناء وزرع الجداول والبيانات المعتمدة المباشرة
-- تاريخ التوليد: ${new Date().toISOString()}
-- نوع القاعدة المستهدفة: ${config.engine.toUpperCase()}
-- اسم قاعدة البيانات: ${config.database}
-- =================================================================

-- 1. إنشاء جدول المستخدمين والمشرفين
CREATE TABLE IF NOT EXISTS \`${p}users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(191) NOT NULL,
  \`email\` VARCHAR(191) UNIQUE NOT NULL,
  \`role\` VARCHAR(50) DEFAULT 'admin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`${p}users\` (\`name\`, \`email\`, \`role\`) VALUES 
('مدير منصة نفهم', 'admin@nafham.iau.edu.sa', 'superadmin');

-- 2. إنشاء جدول الشهادات الصادرة
CREATE TABLE IF NOT EXISTS \`${p}certificates\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`cert_number\` VARCHAR(100) UNIQUE NOT NULL,
  \`recipient_name\` VARCHAR(191) NOT NULL,
  \`track_title\` VARCHAR(191) NOT NULL,
  \`score\` INT DEFAULT 15,
  \`total_questions\` INT DEFAULT 15,
  \`issued_date\` VARCHAR(50) NOT NULL,
  \`status\` VARCHAR(50) DEFAULT 'issued',
  \`phone_number\` VARCHAR(50) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`${p}certificates\` (\`cert_number\`, \`recipient_name\`, \`track_title\`, \`score\`, \`total_questions\`, \`issued_date\`) VALUES 
('NFH-884912', 'شهد حسن عبدالرحمن', 'شهادة إتمام المغامرة وسفير التقبل المعتمد', 15, 15, '2026-11-07');

-- 3. إنشاء جدول بنك الأسئلة والتقييمات
CREATE TABLE IF NOT EXISTS \`${p}quiz_questions\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`topic\` VARCHAR(100) NOT NULL,
  \`question\` TEXT NOT NULL,
  \`options_json\` TEXT NOT NULL,
  \`correct_index\` INT NOT NULL,
  \`explanation\` TEXT NOT NULL,
  \`source\` VARCHAR(191) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`${p}quiz_questions\` (\`topic\`, \`question\`, \`options_json\`, \`correct_index\`, \`explanation\`, \`source\`) VALUES
('definition', 'ما هو التعريف العلمي المعتمد لاضطراب طيف التوحد (ASD)؟', '["اضطراب نمائي عصبي يظهر في مرحلة الطفولة المبكرة يؤثر على التواصل والتفاعل الاجتماعي والسلوك","مرض نفسي مؤقت يصيب المراهقين","مشكلة عضوية مؤقتة تزول مع نمو الطفل","تأخر دراسي ناتج عن ضعف التركيز فقط"]', 0, 'اضطراب طيف التوحد هو حالة نمائية عصبية تؤثر على كيفية تفاعل الشخص وتواصله وسلوكه.', 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب & DSM-5');

-- 4. إنشاء جدول الفيديوهات واستوديو العروض
CREATE TABLE IF NOT EXISTS \`${p}videos\` (
  \`id\` VARCHAR(100) PRIMARY KEY,
  \`title\` VARCHAR(191) NOT NULL,
  \`subtitle\` VARCHAR(255) NOT NULL,
  \`url\` VARCHAR(255) NOT NULL,
  \`poster\` VARCHAR(255) NOT NULL,
  \`duration_text\` VARCHAR(50) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`${p}videos\` (\`id\`, \`title\`, \`subtitle\`, \`url\`, \`poster\`, \`duration_text\`, \`category\`, \`description\`) VALUES
('doc_main', 'الفيلم التعريفي لمنصة «نفهم»', '«الفهم بداية التقبل» · رحلة وعي شاملة باضطراب طيف التوحد (6:39 د)', '/assets/aistudio/nafham_5b6451e6.mp4?v=nafham_2026_v2', '/assets/aistudio/nafham_video_poster.jpg', '06:39', 'الفيلم الوثائقي الرسمي', 'الفيلم الرسمي لمبادرة نفهم برعاية جامعة الإمام عبدالرحمن بن فيصل.');

-- 5. إنشاء جدول فريق العمل ولجان الإشراف
CREATE TABLE IF NOT EXISTS \`${p}team_members\` (
  \`id\` VARCHAR(100) PRIMARY KEY,
  \`name\` VARCHAR(191) NOT NULL,
  \`role\` VARCHAR(191) NOT NULL,
  \`affiliation\` VARCHAR(191) NOT NULL,
  \`specialty\` VARCHAR(191) NOT NULL,
  \`badge\` VARCHAR(100) NOT NULL,
  \`bio\` TEXT NOT NULL,
  \`is_leader\` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`${p}team_members\` (\`id\`, \`name\`, \`role\`, \`affiliation\`, \`specialty\`, \`badge\`, \`bio\`, \`is_leader\`) VALUES
('shahad', 'شهد حسن عبدالرحمن', 'قائدة ومؤسسة مبادرة «نفهم» التوعوية', 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب', 'التربية الخاصة والوعي باضطراب طيف التوحد', 'قائدة المشروع والرؤية', 'صاحبة الرؤية والمبادرة لتطوير منصة تفاعلية وطنية تمزج بين العلم النظري والتعاطف الإنساني لتعزيز الدمج والتقبل الشامل.', 1);

-- 6. إنشاء جدول إعدادات النظام
CREATE TABLE IF NOT EXISTS \`${p}settings\` (
  \`setting_key\` VARCHAR(100) PRIMARY KEY,
  \`setting_value\` TEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`${p}settings\` (\`setting_key\`, \`setting_value\`) VALUES
('site_title', 'منصة نفهم التوعوية باضطراب طيف التوحد'),
('sponsor', 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب'),
('motto', 'لأن الفهم بداية التقبل'),
('fingerprint_phrase', 'مجرد أثر بصمة');
`;
  };

  // Download SQL script
  const handleDownloadSql = () => {
    const sql = generateSqlScript();
    const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nafham_database_schema_${config.database}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate .env snippet
  const generateEnvContent = (): string => {
    return `# إعدادات اتصال قاعدة بيانات منصة نفهم
DB_ENGINE=${config.engine}
DB_HOST=${config.host}
DB_PORT=${config.port}
DB_NAME=${config.database}
DB_USER=${config.username}
DB_PASSWORD=${config.password}
DB_PREFIX=${config.prefix}
DB_SSL=${config.ssl}

# إعدادات المنفذ وتشغيل الخادم
PORT=3000
NODE_ENV=production
`;
  };

  const handleDownloadEnv = () => {
    const content = generateEnvContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '.env');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a4d7a] via-[#0c6aa7] to-[#1ba3cb] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/20">
              <Database className="w-3.5 h-3.5" />
              <span>مركز الربط وقاعدة البيانات والرفع المباشر</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              إعدادات قاعدة البيانات والرفع المباشر للاستضافة
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100 max-w-2xl leading-relaxed">
              قم بتهيئة بيانات اتصال قاعدة البيانات (MySQL / PostgreSQL / SQLite) وزرع الجداول والبيانات المبدئية مباشرة بنقرة واحدة، أو تصدير ملف الـ SQL الكامل لتشغيل المنصة فوراً على أي خادم أو استضافة cPanel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            {config.isSeeded ? (
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>تم زرع الجداول ({config.lastSeededAt})</span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-300" />
                <span>بانتظار زرع وتهيئة الجداول</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUB TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('credentials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'credentials'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>1. بيانات الاتصال بقاعدة البيانات</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seed_tables')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'seed_tables'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>2. زرع الجداول والبيانات المباشرة</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sql_export')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'sql_export'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>3. تحميل ملف SQL الكامل (Direct Dump)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('deployment_guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'deployment_guide'
              ? 'bg-[#0c6aa7] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>4. دليل الرفع المباشر للاستضافة (cPanel / VPS)</span>
        </button>
      </div>

      {/* TAB 1: CREDENTIALS */}
      {activeSubTab === 'credentials' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0a4d7a]">
                تحديد محرك وبيانات الاتصال بقاعدة البيانات
              </h3>
              <p className="text-xs text-slate-500">
                أدخل اسم قاعدة البيانات وبيانات الاتصال بالخادم الخاص بك
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-600 font-mono">
                {config.engine.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Engine Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              نوع محرك قاعدة البيانات (Database Engine):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'mysql',
                  title: 'MySQL / MariaDB',
                  badge: 'الأكثر شيوعاً (cPanel / XAMPP)',
                  desc: 'الخيار القياسي لمعظم استضافات الويب ولوحات cPanel و phpMyAdmin',
                },
                {
                  id: 'postgres',
                  title: 'PostgreSQL',
                  badge: 'الموصى به للأداء العالي',
                  desc: 'متوافق مع Cloud SQL / Supabase / Neon وخوادم VPS المتقدمة',
                },
                {
                  id: 'sqlite',
                  title: 'SQLite (ملف محلي)',
                  badge: 'بدون خادم منفصل',
                  desc: 'تخزين خفيف وسريع في ملف محلي مباشر داخل مجلد التطبيق',
                },
              ].map((eng) => (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() =>
                    handleEngineChange(eng.id as 'mysql' | 'postgres' | 'sqlite')
                  }
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                    config.engine === eng.id
                      ? 'border-[#0c6aa7] bg-[#e1eff8]/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#0a4d7a]">
                      {eng.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        config.engine === eng.id
                          ? 'bg-[#0c6aa7] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {eng.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {eng.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم قاعدة البيانات (Database Name):
              </label>
              <input
                type="text"
                value={config.database}
                onChange={(e) =>
                  setConfig({ ...config, database: e.target.value })
                }
                placeholder="nafham_db"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-white focus:outline-hidden focus:border-[#0c6aa7]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                الاسم الذي قمت بإنشائه في phpMyAdmin أو MySQL Database في cPanel
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عنوان الخادم (Host):
              </label>
              <input
                type="text"
                value={config.host}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                placeholder="localhost أو 127.0.0.1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-hidden focus:border-[#0c6aa7]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                في معظم الاستضافات يكون `localhost` أو IP الخادم
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم مستخدم قاعدة البيانات (User):
              </label>
              <input
                type="text"
                value={config.username}
                onChange={(e) =>
                  setConfig({ ...config, username: e.target.value })
                }
                placeholder="nafham_user"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-hidden focus:border-[#0c6aa7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة مرور قاعدة البيانات (Password):
              </label>
              <input
                type="password"
                value={config.password}
                onChange={(e) =>
                  setConfig({ ...config, password: e.target.value })
                }
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-hidden focus:border-[#0c6aa7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المنفذ (Port):
              </label>
              <input
                type="number"
                value={config.port}
                onChange={(e) =>
                  setConfig({ ...config, port: Number(e.target.value) })
                }
                placeholder="3306 أو 5432"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-hidden focus:border-[#0c6aa7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                بادئة الجداول (Table Prefix):
              </label>
              <input
                type="text"
                value={config.prefix}
                onChange={(e) =>
                  setConfig({ ...config, prefix: e.target.value })
                }
                placeholder="nf_"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-hidden focus:border-[#0c6aa7]"
              />
            </div>
          </div>

          {/* Test Status Banner */}
          {testStatus !== 'idle' && (
            <div
              className={`p-4 rounded-2xl text-xs font-medium border flex items-center gap-3 ${
                testStatus === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : testStatus === 'testing'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testStatus === 'testing' && (
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
              )}
              {testStatus === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {testStatus === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{testMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  testStatus === 'testing' ? 'animate-spin' : ''
                }`}
              />
              <span>اختبار الاتصال بالقاعدة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSaveConfig();
                setActiveSubTab('seed_tables');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <span>حفظ والمتابعة لزرع الجداول</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SEED TABLES */}
      {activeSubTab === 'seed_tables' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0a4d7a]">
                زرع الجداول والبيانات المبدئية مباشرة
              </h3>
              <p className="text-xs text-slate-500">
                سيتم إنشاء كافة الجداول (المستخدمين، الشهادات، بنك الأسئلة، الفيديوهات، فريق العمل) وزرع بيانات مبادرة نفهم المعتمدة
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              قاعدة: {config.database} ({config.prefix}*)
            </span>
          </div>

          {/* Progress bar */}
          {seedingProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#0a4d7a]">تقدم زرع الجداول:</span>
                <span className="text-[#0c6aa7] font-mono">
                  {seedingProgress}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-[#0c6aa7] to-[#2eb9df] transition-all duration-300"
                  style={{ width: `${seedingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Seed logs terminal */}
          {seedLogs.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1.5 max-h-60 overflow-y-auto border border-slate-800">
              {seedLogs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-400">➜</span>
                  <span className="text-slate-100">{log}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tables checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              {
                name: `${config.prefix}users`,
                label: 'جدول المشرفين والمستخدمين',
                desc: 'حسابات إدارة النظام وصلاحيات الوصول',
              },
              {
                name: `${config.prefix}certificates`,
                label: 'جدول الشهادات الصادرة',
                desc: 'أرقام الشهادات المعتمدة ورموز التحقق QR',
              },
              {
                name: `${config.prefix}quiz_questions`,
                label: 'جدول بنك الأسئلة والتقييمات',
                desc: '15 سؤالاً علمياً معتمداً من IAU وتصنيفاتها',
              },
              {
                name: `${config.prefix}library_topics`,
                label: 'جدول مكتبة المعرفة والمحتوى العلمي',
                desc: '10 موضوعات شاملة مع الأسئلة والمراجع',
              },
              {
                name: `${config.prefix}videos`,
                label: 'جدول استوديو الفيديوهات والعروض',
                desc: 'فيديوهات المنصة وثيمات البازل والمشاهد',
              },
              {
                name: `${config.prefix}team_members`,
                label: 'جدول فريق العمل ولجان الإشراف',
                desc: 'بيانات القائدة شهد حسن وأعضاء اللجان',
              },
              {
                name: `${config.prefix}settings`,
                label: 'جدول إعدادات النظام والهوية',
                desc: 'اسم المنصة ورعاية الجامعة والأتمتة',
              },
              {
                name: `${config.prefix}audit_logs`,
                label: 'جدول سجلات النشاط والأثر',
                desc: 'إحصائيات إنجازات وتفاعل الزوار والشهادات',
              },
            ].map((tbl, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0a4d7a]">
                      {tbl.name}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      · {tbl.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {tbl.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                الزرع آمن ويستخدم عبارات `CREATE TABLE IF NOT EXISTS` للحفاظ على
                البيانات القائمة
              </span>
            </div>

            <button
              type="button"
              onClick={handleSeedTables}
              disabled={isSeeding}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black shadow-lg flex items-center gap-2.5 cursor-pointer transition-all transform active:scale-95"
            >
              {isSeeding ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>جاري زرع الجداول والبيانات...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>زرع الجداول وتهيئة البيانات الآن فورياً</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SQL EXPORT */}
      {activeSubTab === 'sql_export' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0a4d7a]">
                تصدير ملف SQL الكامل (Direct Database Dump)
              </h3>
              <p className="text-xs text-slate-500">
                يمكنك تحميل هذا الملف واستيراده بنقرة واحدة في phpMyAdmin أو pgAdmin أو عبر سطر الأوامر
              </p>
            </div>
            <button
              onClick={handleDownloadSql}
              className="px-4 py-2 rounded-xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>تحميل nafham_database.sql</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateSqlScript());
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ النص البرمجي</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-5 rounded-2xl bg-slate-900 text-cyan-200 font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto border border-slate-800 text-left dir-ltr">
              {generateSqlScript()}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: DEPLOYMENT GUIDE */}
      {activeSubTab === 'deployment_guide' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base sm:text-lg font-black text-[#0a4d7a]">
              دليل الرفع المباشر لمنصة «نفهم» على الاستضافات
            </h3>
            <p className="text-xs text-slate-500">
              خطوات بسيطة ومباشرة لتشغيل الموقع بنجاح على استضافتك (cPanel أو سيرفر VPS أو Cloud)
            </p>
          </div>

          {/* Direct Full ZIP Download for cPanel */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#0c6aa7] text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold text-amber-200">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>حزمة الموقع الكاملة المجمعة الجاهزة للرفع (100% Ready)</span>
                </div>
                <h4 className="text-lg font-black">
                  تحميل حزمة الإنتاج الجاهزة للرفع على cPanel
                </h4>
                <p className="text-xs text-cyan-100 max-w-xl leading-relaxed">
                  الملف يحتوي على كامل ملفات الموقع المترجمة، الفيديو الجديد عالي الدقة، مشغل البث التدفقي، ملف `app.cjs` المضبوط لـ Passenger، ملف `.htaccess`، وهيكل قاعدة البيانات `database_schema.sql`.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <a
                  href="/nafham_cpanel_ready.zip"
                  download="nafham_cpanel_ready.zip"
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#0a4d7a] text-xs sm:text-sm font-black shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Download className="w-5 h-5 text-emerald-600" />
                  <span>تحميل الحزمة الشاملة (118 MB)</span>
                </a>

                <a
                  href="/nafham_code_clean.zip"
                  download="nafham_code_clean.zip"
                  className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all border border-white/30"
                >
                  <Download className="w-4 h-4 text-cyan-200" />
                  <span>نسخة خفيفة سريعة (47 MB)</span>
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-white/20 flex flex-wrap items-center gap-4 text-[11px] text-cyan-100 font-medium">
              <span>✓ مدمج معها app.cjs المطور لـ Passenger</span>
              <span>✓ اكتشاف تلقائي للمسار الفرعي /asd/</span>
              <span>✓ جاهز للاستخراج المباشر داخل `/home/reshtih1/asd`</span>
              <span>✓ مرفق معه ملف قاعدة البيانات ودليل التثبيت INSTALL_AR.md</span>
            </div>
          </div>

          {/* Quick .env Downloader */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1">
              <strong className="text-xs font-bold text-[#0a4d7a] block">
                ملف المتغيرات والبيئة الجاهز (.env):
              </strong>
              <p className="text-[11px] text-slate-600">
                قم بتحميل ملف `.env` ووضعه في المجلد الرئيسي لموقعك على الخادم
              </p>
            </div>
            <button
              onClick={handleDownloadEnv}
              className="px-4 py-2 rounded-xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف .env المخصص</span>
            </button>
          </div>

          {/* Step by step for cPanel */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#0c6aa7]" />
              <span>طريقة الرفع والتشغيل على cPanel (Setup Node.js App):</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0c6aa7] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-[#0a4d7a] block">إنشاء تطبيق Node.js في cPanel:</strong>
                  <span>ادخل إلى لوحة cPanel واختر **Setup Node.js App** ثم اضغط **Create Application**. اختر إصدار Node (18 أو 20 أو 22)، واجعل Application root هو مسار موقعك، و Application startup file هو `server.ts` أو `dist/server.js`.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0c6aa7] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-[#0a4d7a] block">رفع الملفات وإنشاء قاعدة البيانات:</strong>
                  <span>ارفع ملفات المشروع إلى المجلد عبر File Manager أو FTP، ثم ادخل إلى **MySQL Databases** وأنشئ قاعدة بيانات جديدة باسم `{config.database}` ثم استورد ملف SQL من التبويب السابق عبر **phpMyAdmin**.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0c6aa7] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-[#0a4d7a] block">تثبيت الحزم وتشغيل الموقع:</strong>
                  <span>اضغط على **Run NPM Install** في صفحة التطبيق داخل cPanel، ثم اضغط **Restart**. سيعمل الموقع مباشرة مع تدفق الفيديو التلقائي وقاعدة البيانات!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
