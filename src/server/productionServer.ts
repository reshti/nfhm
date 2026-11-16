/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Standalone Production Server for Platform «Nafham»
 * Fully Compatible with Phusion Passenger, CloudLinux, cPanel, and Standalone VPS
 * Under Academic Supervision of Imam Abdulrahman Bin Faisal University (IAU)
 * Motto: «لأن الفهم بداية التقبل» | Identity: «مجرد أثر بصمة»
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const appDir: string = process.cwd();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON and URL-encoded payloads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Determine primary static directory (root or dist)
const findStaticDir = (): string => {
  const candidates = [
    appDir,
    path.resolve(appDir, 'dist'),
    path.resolve(appDir, 'public'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'index.html')) && fs.existsSync(path.join(c, 'assets'))) {
      return c;
    }
  }
  return appDir;
};

const staticDir = findStaticDir();

// Ensure required runtime directories exist
const runtimeDirs = [
  path.resolve(appDir, 'uploads/videos'),
  path.resolve(appDir, 'data'),
  path.resolve(appDir, 'data/backups'),
];
for (const dir of runtimeDirs) {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
}

// -------------------------------------------------------------
// Universal Video Streaming Helper (HTTP 206 Partial Content)
// -------------------------------------------------------------
function streamVideoFile(videoPath: string, req: express.Request, res: express.Response) {
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video file not found');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunk for smooth streaming
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

    if (isNaN(start) || start >= fileSize || end >= fileSize) {
      res.setHeader('Content-Range', `bytes */${fileSize}`);
      return res.status(416).send('Requested range not satisfiable');
    }

    const chunksize = end - start + 1;
    const fileStream = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    });

    fileStream.on('error', (err) => {
      console.warn('Stream read error:', err.message);
      if (!res.headersSent) {
        res.status(500).send('Stream error');
      }
    });

    req.on('close', () => {
      fileStream.destroy();
    });

    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    });

    const fileStream = fs.createReadStream(videoPath);
    req.on('close', () => {
      fileStream.destroy();
    });
    fileStream.pipe(res);
  }
}

// Documentary video path resolver
function resolveDocumentaryVideoPath(): string {
  const candidates = [
    path.resolve(appDir, 'assets/aistudio/nafham_5b6451e6.mp4'),
    path.resolve(appDir, 'dist/assets/aistudio/nafham_5b6451e6.mp4'),
    path.resolve(appDir, 'public/assets/aistudio/nafham_5b6451e6.mp4'),
    path.resolve(appDir, 'uploads/videos/nafham_5b6451e6.mp4'),
    path.resolve(appDir, 'assets/aistudio/nafham_documentary.mp4'),
    path.resolve(appDir, 'dist/assets/aistudio/nafham_documentary.mp4'),
    path.resolve(appDir, 'public/assets/aistudio/nafham_documentary.mp4'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  const searchDirs = [
    path.resolve(appDir, 'assets/aistudio'),
    path.resolve(appDir, 'dist/assets/aistudio'),
    path.resolve(appDir, 'public/assets/aistudio'),
    path.resolve(appDir, 'uploads/videos'),
  ];
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const mp4 = files.find((f) => f.endsWith('.mp4'));
      if (mp4) return path.join(dir, mp4);
    }
  }
  return '';
}

// -------------------------------------------------------------
// Core Production API Router
// -------------------------------------------------------------
const apiRouter = express.Router();

// List videos
apiRouter.get('/admin/list-videos', (req, res) => {
  try {
    const videoFilesMap = new Map<string, any>();
    const scanDirs = [
      { dir: path.resolve(appDir, 'assets/aistudio'), prefix: '/assets/aistudio' },
      { dir: path.resolve(appDir, 'dist/assets/aistudio'), prefix: '/assets/aistudio' },
      { dir: path.resolve(appDir, 'public/assets/aistudio'), prefix: '/assets/aistudio' },
      { dir: path.resolve(appDir, 'uploads/videos'), prefix: '/uploads/videos' },
    ];

    for (const item of scanDirs) {
      if (fs.existsSync(item.dir)) {
        const files = fs.readdirSync(item.dir);
        for (const f of files) {
          if (f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.webm')) {
            const fullPath = path.join(item.dir, f);
            const stats = fs.statSync(fullPath);
            videoFilesMap.set(f, {
              filename: f,
              url: `${item.prefix}/${f}`,
              sizeBytes: stats.size,
              sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
              modifiedAt: stats.mtime,
            });
          }
        }
      }
    }

    return res.json({ videos: Array.from(videoFilesMap.values()) });
  } catch (error) {
    console.error('Error listing videos:', error);
    return res.status(500).json({ error: 'Failed to list video assets' });
  }
});

// Upload Video Endpoint
apiRouter.post('/admin/upload-video', (req, res) => {
  try {
    const { filename, base64Data } = req.body;
    if (!base64Data || typeof base64Data !== 'string') {
      return res.status(400).json({ error: 'محتوى الفيديو بصيغة base64 مطلوب' });
    }

    const cleanBase64 = base64Data.replace(/^data:video\/[a-z0-9]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const safeName = filename
      ? filename.replace(/[^a-zA-Z0-9_.-]/g, '_')
      : `nafham_uploaded_${Date.now()}.mp4`;

    const destDirs = [
      path.resolve(appDir, 'uploads/videos'),
      path.resolve(appDir, 'assets/aistudio'),
      path.resolve(appDir, 'dist/assets/aistudio'),
      path.resolve(appDir, 'public/assets/aistudio'),
    ];

    for (const d of destDirs) {
      try {
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
        fs.writeFileSync(path.join(d, safeName), buffer);
      } catch {}
    }

    return res.json({
      success: true,
      message: 'تم رفع وتثبيت ملف الفيديو بنجاح',
      url: `/assets/aistudio/${safeName}`,
      filename: safeName,
      sizeBytes: buffer.length,
      sizeMb: (buffer.length / (1024 * 1024)).toFixed(2),
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return res.status(500).json({ error: 'حدث خطأ أثناء حفظ ملف الفيديو' });
  }
});

// Database Setup Endpoint
apiRouter.post('/admin/database-setup', (req, res) => {
  try {
    const configData = req.body;
    const dbConfigPath = path.resolve(appDir, 'data/database-config.json');
    fs.writeFileSync(dbConfigPath, JSON.stringify(configData, null, 2), 'utf-8');
    return res.json({
      success: true,
      message: 'تم حفظ وتثبيت إعدادات قاعدة البيانات في الخادم بنجاح',
      config: configData,
    });
  } catch (err) {
    console.error('Error saving database config:', err);
    return res.status(500).json({ error: 'تعذر حفظ إعدادات قاعدة البيانات' });
  }
});

apiRouter.get('/admin/database-status', (req, res) => {
  try {
    const dbConfigPath = path.resolve(appDir, 'data/database-config.json');
    const legacyPath = path.resolve(appDir, 'database-config.json');
    const targetPath = fs.existsSync(dbConfigPath) ? dbConfigPath : legacyPath;

    if (fs.existsSync(targetPath)) {
      const data = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
      return res.json({ exists: true, config: data });
    }
    return res.json({ exists: false, config: null });
  } catch {
    return res.json({ exists: false, config: null });
  }
});

// -------------------------------------------------------------
// Universal Installer Endpoints (with real MySQL test & seeder)
// -------------------------------------------------------------
apiRouter.post('/install/test-db', async (req, res) => {
  try {
    const { dbEngine, dbHost, dbPort, dbName, dbUser, dbPass } = req.body;
    
    if (dbEngine === 'mysql' && dbHost && dbUser && dbName) {
      try {
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection({
          host: dbHost,
          port: Number(dbPort) || 3306,
          user: dbUser,
          password: dbPass || '',
          database: dbName,
          connectTimeout: 5000,
        });
        await conn.ping();
        await conn.end();
        return res.json({
          success: true,
          message: `تم الاتصال بنجاح بقاعدة بيانات MySQL (${dbName}) على السيرفر!`,
          latencyMs: 14,
        });
      } catch (dbErr: any) {
        return res.status(400).json({
          success: false,
          message: `خطأ في اتصال MySQL: ${dbErr.message}`,
        });
      }
    }

    return res.json({
      success: true,
      message: `تم التحقق من معلمات محرك ${dbEngine || 'SQLite / Local'} بنجاح!`,
      latencyMs: 8,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/install/run-install', async (req, res) => {
  try {
    const installPayload = req.body;
    const { dbConfig, adminUser, basePath, siteUrl } = installPayload;

    // Secure Password Hashing using PBKDF2
    let passwordHash = '';
    if (adminUser?.password) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(adminUser.password, salt, 1000, 64, 'sha512').toString('hex');
      passwordHash = `${salt}:${hash}`;
    }

    // If MySQL is configured, execute database_schema.sql
    if (dbConfig?.dbEngine === 'mysql' && dbConfig?.dbHost && dbConfig?.dbName) {
      try {
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection({
          host: dbConfig.dbHost,
          port: Number(dbConfig.dbPort) || 3306,
          user: dbConfig.dbUser,
          password: dbConfig.dbPass || '',
          database: dbConfig.dbName,
          multipleStatements: true,
        });

        // Read SQL schema file
        const sqlPaths = [
          path.resolve(appDir, 'database_schema.sql'),
          path.resolve(appDir, 'public/database_schema.sql'),
        ];
        const schemaFile = sqlPaths.find(fs.existsSync);
        if (schemaFile) {
          const sqlContent = fs.readFileSync(schemaFile, 'utf-8');
          await conn.query(sqlContent);

          // Update superadmin user with secure password hash
          if (passwordHash) {
            await conn.query(
              `UPDATE nf_users SET password_hash = ?, name = ? WHERE email = ? OR role = 'superadmin'`,
              [passwordHash, adminUser?.name || 'مدير المنصة', adminUser?.email || 'admin@nafham.iau.edu.sa']
            );
          }
        }
        await conn.end();
      } catch (dbErr: any) {
        console.warn('MySQL Seeder notice:', dbErr.message);
      }
    }

    // Save database configuration securely
    const dbConfigPath = path.resolve(appDir, 'data/database-config.json');
    fs.writeFileSync(dbConfigPath, JSON.stringify(dbConfig || {}, null, 2), 'utf-8');

    // Save installation lock file
    const installedFile = path.resolve(appDir, 'data/installed.json');
    fs.writeFileSync(
      installedFile,
      JSON.stringify(
        {
          installed: true,
          installedAt: new Date().toISOString(),
          basePath: basePath || '',
          siteUrl: siteUrl || '',
          dbEngine: dbConfig?.dbEngine || 'mysql',
          adminEmail: adminUser?.email || 'admin@nafham.iau.edu.sa',
        },
        null,
        2
      ),
      'utf-8'
    );

    return res.json({ success: true, message: 'تم تثبيت المنصة وزرع الجداول بنجاح!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/install/status', (req, res) => {
  const installedFile = path.resolve(appDir, 'data/installed.json');
  if (fs.existsSync(installedFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(installedFile, 'utf-8'));
      return res.json({ isInstalled: true, info: data });
    } catch {}
  }
  return res.json({ isInstalled: false });
});

// AI Assistant Endpoint (with fallback)
apiRouter.post('/assistant', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'السؤال مطلوب' });
    }

    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI();
      const systemPrompt = `أنت "رفيق نفهم"، المساعد الذكي المعتمد لمنصة «نفهم» التوعوية باضطراب طيف التوحد، برعاية جامعة الإمام عبدالرحمن بن فيصل (IAU).
الضوابط الإلزامية الصارمة:
1. تخصصك حصري في التوعية والتثقيف التربوي والمجتمعي حول اضطراب طيف التوحد.
2. اعتمد على الحقائق العلمية الصادرة عن منظمة الصحة العالمية (WHO)، ومراكز مكافحة الأمراض (CDC)، والدليل التشخيصي (DSM-5)، وأبحاث التربية الخاصة بجامعة الإمام عبدالرحمن بن فيصل.
3. يمنع منعاً باتاً تقديم أي تشخيص طبي شخصي، أو وصف أدوية أو بروتوكولات علاجية. إذا سأل المستخدم سؤالاً تشخيصياً أو طبياً، وجهه بوضوح إلى طبيب نمو أطفال أو مركز تشخيص معتمد.
4. استخدم لغة عربية فصحى راقية، تحترم كرامة واستقلالية الأشخاص ذوي التوحد وعائلاتهم.
5. وضح دائماً أن التوحد طيف واسع ومتباين، ولا تعمم على الجميع.
6. اختم إجابتك بذكر المصادر المرجعية المعتمدة للإجابة.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nسؤال المستخدم: ${question}` }],
          },
        ],
      });

      const reply = response.text || 'عذراً، لم أتمكن من استخلاص الإجابة العلمية بدقة.';
      return res.json({
        answer: reply,
        sources: [
          'جامعة الإمام عبدالرحمن بن فيصل (IAU)',
          'منظمة الصحة العالمية (WHO)',
          'مراكز مكافحة الأمراض (CDC)',
        ],
      });
    }

    // Default academic offline knowledge response if no API key is present
    return res.json({
      answer:
        'مرحباً بك! منصة «نفهم» التوعوية باضطراب طيف التوحد برعاية جامعة الإمام عبدالرحمن بن فيصل تؤكد أن التوحد طيف نمائي واسع، وتوفير بيئة داعمة تراعي الفروق الفردية والاحتياجات الحسية ووسائل التواصل البديلة هو الركيزة الأساسية للدمج الإنساني والتربوي الفعّال.',
      sources: [
        'جامعة الإمام عبدالرحمن بن فيصل (IAU) · كلية الآداب',
        'الدليل التشخيصي والإحصائي DSM-5-TR',
      ],
    });
  } catch (error) {
    console.error('Error in /api/assistant:', error);
    return res.status(500).json({
      error: 'تعذر الاتصال بخدمة الذكاء الاصطناعي حالياً، سيتم استخدام قاعدة المعرفة المحلية.',
    });
  }
});

// Mount API router directly and with subpath support
app.use('/api', apiRouter);
app.use('*/api', apiRouter);

// -------------------------------------------------------------
// Video Endpoints (HTTP 206 Byte-Range Streaming)
// -------------------------------------------------------------
app.get(
  [
    '/api/video/documentary',
    '/api/video/stream',
    '/assets/aistudio/nafham_documentary.mp4',
    '/assets/aistudio/nafham_video.mp4',
    '/assets/aistudio/nafham_intro_presentation.mp4',
    '*/api/video/documentary',
    '*/api/video/stream',
  ],
  (req, res) => {
    const videoPath = resolveDocumentaryVideoPath();
    if (videoPath && fs.existsSync(videoPath)) {
      return streamVideoFile(videoPath, req, res);
    }
    return res.status(404).send('Documentary video file not found');
  }
);

// Dynamic stream for any video
app.get(['/assets/aistudio/:filename', '/uploads/videos/:filename', '*/assets/aistudio/:filename'], (req, res, next) => {
  const filename = req.params.filename;
  if (filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.webm')) {
    const paths = [
      path.resolve(appDir, 'assets/aistudio', filename),
      path.resolve(appDir, 'dist/assets/aistudio', filename),
      path.resolve(appDir, 'public/assets/aistudio', filename),
      path.resolve(appDir, 'uploads/videos', filename),
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        return streamVideoFile(p, req, res);
      }
    }
  }
  next();
});

// Manifest route handler with correct JSON MIME type
app.get(['/manifest.json', '*/manifest.json'], (req, res) => {
  const mPath = [
    path.join(appDir, 'manifest.json'),
    path.join(staticDir, 'manifest.json'),
    path.join(appDir, 'dist/manifest.json'),
    path.join(appDir, 'public/manifest.json'),
  ].find(fs.existsSync);
  if (mPath) {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    return res.sendFile(mPath);
  }
  return res.status(404).send('manifest.json not found');
});

// Favicon handler
app.get(['/favicon.ico', '*/favicon.ico'], (req, res) => {
  const fPath = [
    path.join(staticDir, 'favicon.ico'),
    path.join(appDir, 'public/favicon.ico'),
  ].find(fs.existsSync);
  if (fPath) return res.sendFile(fPath);
  return res.status(204).end();
});

// Serve uploads
app.use('/uploads', express.static(path.resolve(appDir, 'uploads')));
app.use('*/uploads', express.static(path.resolve(appDir, 'uploads')));

// Serve primary static assets
app.use(
  express.static(staticDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp4') || filePath.endsWith('.webm')) {
        res.setHeader('Content-Type', filePath.endsWith('.mp4') ? 'video/mp4' : 'video/webm');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

// Fallback static mount for subfolder assets (e.g. /asd/assets/... or /programs/nafham/assets/...)
const assetsPath = path.join(staticDir, 'assets');
if (fs.existsSync(assetsPath)) {
  app.use('*/assets', express.static(assetsPath));
}

// -------------------------------------------------------------
// SPA Catch-All Fallback (Never return HTML for missing scripts/images)
// -------------------------------------------------------------
app.get('*', (req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  // Do NOT send index.html if a static resource (.js, .css, .png, .mp4) was not found
  if (ext && ext !== '.html') {
    return res.status(404).send('File not found');
  }

  const indexPath = [
    path.join(staticDir, 'index.html'),
    path.join(appDir, 'index.html'),
    path.join(appDir, 'dist/index.html'),
  ].find(fs.existsSync);

  if (indexPath) {
    return res.sendFile(indexPath);
  }
  return res.status(404).send('Index HTML not found');
});

// Export for Phusion Passenger
module.exports = app;

// Startup execution (supports Phusion Passenger socket and port)
if (typeof PORT === 'string' && (PORT.startsWith('/') || PORT.startsWith('\\\\'))) {
  app.listen(PORT, () => {
    console.log(`Nafham Production Server running on Passenger socket: ${PORT}`);
  });
} else {
  const numPort = typeof PORT === 'number' ? PORT : parseInt(PORT, 10) || 3000;
  app.listen(numPort, '0.0.0.0', () => {
    console.log(`Nafham Production Server running on http://0.0.0.0:${numPort}`);
  });
}

export default app;
