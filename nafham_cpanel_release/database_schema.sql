-- =================================================================
-- منصة «نفهم» التوعوية باضطراب طيف التوحد (جامعة الإمام عبدالرحمن بن فيصل)
-- ملف البناء وزرع الجداول الشاملة (9 جداول متكاملة)
-- معتمد للاستيراد المباشر في phpMyAdmin / MySQL / MariaDB / PostgreSQL / SQLite
-- =================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- 1. جدول المستخدمين والمشرفين (nf_users)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_users` (`name`, `email`, `password_hash`, `role`) VALUES 
('مدير منصة نفهم', 'admin@nafham.iau.edu.sa', '$2b$10$e8oYkP8g0HqLwG3R5K1M2eC3k9mU.z8h2dG8oM4V9bO1iQ7eP8aNu', 'superadmin');

-- -------------------------------------------------------------
-- 2. جدول الشهادات الصادرة والاعتمادات (nf_certificates)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_certificates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cert_number` VARCHAR(100) UNIQUE NOT NULL,
  `recipient_name` VARCHAR(191) NOT NULL,
  `track_title` VARCHAR(191) NOT NULL,
  `score` INT DEFAULT 15,
  `total_questions` INT DEFAULT 15,
  `issued_date` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'issued',
  `phone_number` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_certificates` (`cert_number`, `recipient_name`, `track_title`, `score`, `total_questions`, `issued_date`) VALUES 
('NFH-884912', 'شهد حسن عبدالرحمن', 'شهادة إتمام المغامرة وسفير التقبل المعتمد', 15, 15, '2026-11-07');

-- -------------------------------------------------------------
-- 3. جدول بنك الأسئلة والتقييمات (nf_quiz_questions)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_quiz_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `topic` VARCHAR(100) NOT NULL,
  `question` TEXT NOT NULL,
  `options_json` TEXT NOT NULL,
  `correct_index` INT NOT NULL,
  `explanation` TEXT NOT NULL,
  `source` VARCHAR(191) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_quiz_questions` (`topic`, `question`, `options_json`, `correct_index`, `explanation`, `source`) VALUES
('definition', 'ما هو التعريف العلمي المعتمد لاضطراب طيف التوحد (ASD)؟', '["اضطراب نمائي عصبي يظهر في مرحلة الطفولة المبكرة يؤثر على التواصل والتفاعل الاجتماعي والسلوك","مرض نفسي مؤقت يصيب المراهقين","مشكلة عضوية مؤقتة تزول مع نمو الطفل","تأخر دراسي ناتج عن ضعف التركيز فقط"]', 0, 'اضطراب طيف التوحد هو حالة نمائية عصبية تؤثر على كيفية تفاعل الشخص وتواصله وسلوكه.', 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب & DSM-5'),
('communication', 'ما هو المفهوم الصحيح لاختلافات التواصل لدى ذوي التوحد؟', '["قد يستخدم بعضهم وسائل بديلة ومعززة كالتواصل البصري أو الإيماءات أو الأجهزة اللوحية للتعبير عن احتياجاتهم","عدم الكلام يعني عدم الرغبة في التواصل نهائياً","التواصل اللفظي هو الطريقة الوحيدة المقبولة","لا يفهمون ما يُقال لهم"]', 0, 'التواصل طيف واسع، واستخدام وسائل التواصل المعززة والبديلة (AAC) يعزز التعبير والاستقلالية.', 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب'),
('sensory', 'كيف تؤثر المعالجة الحسية على تجربة الشخص ذي التوحد في البيئة المزدحمة؟', '["قد يشعر بفرط استجابة حسية (حمل حسي زائد) نتيجة الأضواء الساطعة والأصوات العالية، مما يتطلب بيئة هادئة وداعمة","لا يتأثر بالمثيرات الخارجية أبداً","المشكلة تقتصر على حاسة السمع فقط","يتجاهل المؤثرات تماماً"]', 0, 'الحمل الحسي الزائد يحدث عندما يستقبل الدماغ مدخلات حسية تفوق قدرته على المعالجة في تلك اللحظة.', 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب & CDC');

-- -------------------------------------------------------------
-- 4. جدول موضوعات مكتبة المعرفة (nf_library_topics)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_library_topics` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `summary` TEXT NOT NULL,
  `article_content` LONGTEXT NOT NULL,
  `practical_tips` TEXT NOT NULL,
  `references_json` TEXT NOT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_library_topics` (`id`, `title`, `category`, `summary`, `article_content`, `practical_tips`, `references_json`, `sort_order`) VALUES
('autism-definition', 'ما هو اضطراب طيف التوحد؟', 'الأساسيات والمفاهيم', 'تعريف شامل بطبيعة الاضطراب النمائي العصبي ومظاهره وتاريخ تشخيصه.', 'اضطراب طيف التوحد حالة نمائية عصبية تمتد مدى الحياة وتؤثر على كيفية إدراك الشخص للعالم وتواصله وتفاعله مع الآخرين.', 'امنح الشخص وقتاً كافياً لمعالجة المعلومات واستجب برحابة صدر وهدوء.', '["DSM-5-TR, APA, 2022","WHO ICD-11, 2022"]', 1),
('sensory-processing', 'المعالجة الحسية والحمل الزائد', 'الحواس والبيئة', 'فهم آليات المعالجة الحسية المختلفة وأسباب الحمل الحسي وكيفية الوقاية منه.', 'يختبر العديد من ذوي التوحد معالجة حسية مختلفة، حيث تكون حواسهم أكثر أو أقل استجابة للمؤثرات البيئية مقارنة بالآخرين.', 'وفر ركناً هادئاً، وخفف الأضواء الساطعة، واستخدم سماعات إلغاء الضوضاء عند الحاجة.', '["Sensory Processing in Autism (Tomchek & Dunn)","IAU Special Education Dept"]', 2),
('aac-communication', 'وسائل التواصل المعززة والبديلة', 'التواصل واللغة', 'أهمية بطاقات الصور (PECS)، والتطبيقات اللوحية، والإشارات في دعم التعبير.', 'التواصل حق أساسي لكل إنسان. لا يقتصر التواصل على الكلمات المنطوقة، بل يشمل الإيماءات والأنظمة البصرية والأجهزة المساعدة.', 'لا تنتظر حتى ينطق الطفل، بل باشر بتعليمه وسائل بديلة لتقليل الإحباط وبناء الثقة.', '["ISAAC Principles","Beukelman & Light, 2020"]', 3);

-- -------------------------------------------------------------
-- 5. جدول الفيديوهات واستوديو العروض (nf_videos)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_videos` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `subtitle` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `poster` VARCHAR(255) NOT NULL,
  `duration_text` VARCHAR(50) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `is_active` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_videos` (`id`, `title`, `subtitle`, `url`, `poster`, `duration_text`, `category`, `description`, `is_active`) VALUES
('doc_main', 'الفيلم التعريفي لمنصة «نفهم»', '«الفهم بداية التقبل» · رحلة وعي شاملة باضطراب طيف التوحد (6:39 د)', '/assets/aistudio/nafham_5b6451e6.mp4', '/assets/aistudio/nafham_video_poster.jpg', '06:39', 'الفيلم الوثائقي الرسمي', 'الفيلم الرسمي لمبادرة نفهم برعاية جامعة الإمام عبدالرحمن بن فيصل.', 1);

-- -------------------------------------------------------------
-- 6. جدول فريق العمل واللجان (nf_team_members)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_team_members` (
  `id` VARCHAR(100) PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL,
  `affiliation` VARCHAR(191) NOT NULL,
  `specialty` VARCHAR(191) NOT NULL,
  `badge` VARCHAR(100) NOT NULL,
  `bio` TEXT NOT NULL,
  `is_leader` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_team_members` (`id`, `name`, `role`, `affiliation`, `specialty`, `badge`, `bio`, `is_leader`, `sort_order`) VALUES
('shahad', 'شهد حسن عبدالرحمن', 'قائدة ومؤسسة مبادرة «نفهم» التوعوية', 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب', 'التربية الخاصة والوعي باضطراب طيف التوحد', 'قائدة المشروع والرؤية', 'صاحبة الرؤية والمبادرة لتطوير منصة تفاعلية وطنية تمزج بين العلم النظري والتعاطف الإنساني لتعزيز الدمج والتقبل الشامل.', 1, 1);

-- -------------------------------------------------------------
-- 7. جدول أقسام صفحات الهبوط (nf_landing_sections)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_landing_sections` (
  `id` VARCHAR(100) PRIMARY KEY,
  `section_key` VARCHAR(100) UNIQUE NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `is_enabled` BOOLEAN DEFAULT TRUE,
  `sort_order` INT DEFAULT 0,
  `layout_mode` VARCHAR(50) DEFAULT 'cinematic',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_landing_sections` (`id`, `section_key`, `title`, `is_enabled`, `sort_order`, `layout_mode`) VALUES
('sec_video_hub', 'video_hub', 'استوديو العروض السينمائية', 1, 1, 'cinematic'),
('sec_hero', 'hero', 'الواجهة الرئيسية والتعريف', 1, 2, 'standard'),
('sec_tracks', 'tracks', 'مسارات الفئات المستهدفة', 1, 3, 'cards'),
('sec_adventure', 'adventure', 'مغامرة نفهم (6 محطات)', 1, 4, 'interactive'),
('sec_games', 'games', 'مدينة ألعاب التقبل والمشاعر', 1, 5, 'playful'),
('sec_library', 'library', 'مكتبة المعرفة والبحث العلمي', 1, 6, 'accordion'),
('sec_challenge', 'challenge', 'تحدي المعرفة والشهادات', 1, 7, 'quiz'),
('sec_team', 'team', 'فريق العمل والقيادة الإشرافية', 1, 8, 'grid');

-- -------------------------------------------------------------
-- 8. جدول إعدادات النظام (nf_settings)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_settings` (`setting_key`, `setting_value`) VALUES
('site_title', 'منصة نفهم التوعوية باضطراب طيف التوحد'),
('sponsor', 'جامعة الإمام عبدالرحمن بن فيصل · كلية الآداب'),
('motto', 'لأن الفهم بداية التقبل'),
('fingerprint_phrase', 'مجرد أثر بصمة'),
('app_version', '2.5.0'),
('installed_at', '2026-11-07');

-- -------------------------------------------------------------
-- 9. جدول سجل الأنشطة والتدقيق (nf_audit_logs)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nf_audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(100) DEFAULT 'system',
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NOT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nf_audit_logs` (`user_id`, `action`, `details`) VALUES 
('system', 'INSTALL_COMPLETED', 'تم تثبيت المنصة وزرع الجداول التسعة بنجاح وتجهيز النظام للعمل الشامل.');

SET FOREIGN_KEY_CHECKS = 1;
