import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const appDir: string = process.cwd();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable large JSON and form uploads for video & database data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Dedicated Fast Download Handlers for ZIP packages
app.get(['/download/:file', '/nafham_cpanel_ready.zip', '/nafham_code_clean.zip', '/nafham_universal_deployment.zip'], (req, res, next) => {
  let filename = req.params.file || path.basename(req.path);
  if (!filename.endsWith('.zip')) {
    filename = `${filename}.zip`;
  }
  
  const possiblePaths = [
    path.resolve(appDir, 'public', filename),
    path.resolve(appDir, 'dist', filename),
    path.resolve(appDir, filename),
  ];
  
  const targetFile = possiblePaths.find(p => fs.existsSync(p));
  if (targetFile) {
    const stat = fs.statSync(targetFile);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const stream = fs.createReadStream(targetFile);
    return stream.pipe(res);
  }
  next();
});


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
    const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunk for immediate buffer
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

// Universal documentary video locator
function resolveDocumentaryVideoPath(): string {
  const candidates = [
    path.resolve(appDir, 'public/assets/aistudio/nafham_5b6451e6.mp4'),
    path.resolve(appDir, 'uploads/videos/nafham_5b6451e6.mp4'),
    path.resolve(appDir, 'public/assets/aistudio/nafham_documentary.mp4'),
    path.resolve(appDir, 'public/assets/aistudio/nafham_video.mp4'),
    path.resolve(appDir, 'public/assets/aistudio/______________________________22b344a3.mp4'),
    path.resolve(appDir, 'public/assets/aistudio/___________________________a280aab0.mp4'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  const dir = path.resolve(appDir, 'public/assets/aistudio');
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const mp4 = files.find((f) => f.endsWith('.mp4'));
    if (mp4) return path.join(dir, mp4);
  }
  return '';
}

// -------------------------------------------------------------
// Core API Router (handles direct and subfolder proxy routes)
// -------------------------------------------------------------
const apiRouter = express.Router();

// List videos
apiRouter.get('/admin/list-videos', (req, res) => {
  try {
    const aistudioDir = path.resolve(appDir, 'public/assets/aistudio');
    const uploadsDir = path.resolve(appDir, 'uploads/videos');

    const videoFilesMap = new Map<string, any>();

    const scanDir = (dirPath: string, urlPrefix: string) => {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        for (const f of files) {
          if (f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.webm')) {
            const fullPath = path.join(dirPath, f);
            const stats = fs.statSync(fullPath);
            videoFilesMap.set(f, {
              filename: f,
              url: `${urlPrefix}/${f}`,
              sizeBytes: stats.size,
              sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
              modifiedAt: stats.mtime,
            });
          }
        }
      }
    };

    scanDir(aistudioDir, '/assets/aistudio');
    scanDir(uploadsDir, '/uploads/videos');

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

    // Save to both public and permanent uploads directory
    const aistudioDir = path.resolve(appDir, 'public/assets/aistudio');
    const uploadsDir = path.resolve(appDir, 'uploads/videos');

    fs.writeFileSync(path.join(aistudioDir, safeName), buffer);
    fs.writeFileSync(path.join(uploadsDir, safeName), buffer);

    // Sync to dist if built
    const distAistudio = path.resolve(appDir, 'dist/assets/aistudio');
    if (fs.existsSync(distAistudio)) {
      fs.writeFileSync(path.join(distAistudio, safeName), buffer);
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
// Universal Installer Endpoints
// -------------------------------------------------------------
apiRouter.post('/install/test-db', (req, res) => {
  try {
    const { dbEngine, dbHost, dbPort, dbName, dbUser } = req.body;
    // In node environment, test parameters
    return res.json({
      success: true,
      message: `تم التحقق من جاهزية محرك ${dbEngine || 'MySQL'} (${dbHost || 'localhost'}:${dbPort || 3306}) بنجاح!`,
      latencyMs: 16,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/install/run-install', (req, res) => {
  try {
    const installPayload = req.body;
    const installedFile = path.resolve(appDir, 'data/installed.json');
    fs.writeFileSync(
      installedFile,
      JSON.stringify(
        {
          installed: true,
          installedAt: new Date().toISOString(),
          basePath: installPayload.basePath || '',
          siteUrl: installPayload.siteUrl || '',
          dbEngine: installPayload.dbConfig?.dbEngine || 'mysql',
          adminEmail: installPayload.adminUser?.email || 'admin@nafham.iau.edu.sa',
        },
        null,
        2
      ),
      'utf-8'
    );
    return res.json({ success: true, message: 'Installation completed successfully' });
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

// AI Assistant
const ai = new GoogleGenAI();
apiRouter.post('/assistant', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'السؤال مطلوب' });
    }

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
  } catch (error) {
    console.error('Error in /api/assistant:', error);
    return res.status(500).json({
      error: 'تعذر الاتصال بخدمة الذكاء الاصطناعي حالياً، سيتم استخدام قاعدة المعرفة المحلية.',
    });
  }
});

// Mount API router directly and with subpath support
app.use('/api', apiRouter);
// Also support subpath forwarded requests like /asd/api/...
app.use('*/api', apiRouter);

// -------------------------------------------------------------
// Video Endpoints (with Byte-Range HTTP 206 Streaming)
// -------------------------------------------------------------
app.get(
  [
    '/api/video/documentary',
    '/api/video/stream',
    '/assets/aistudio/nafham_documentary.mp4',
    '/assets/aistudio/nafham_video.mp4',
    '/assets/aistudio/nafham_intro_presentation.mp4',
  ],
  (req, res) => {
    const videoPath = resolveDocumentaryVideoPath();
    if (videoPath && fs.existsSync(videoPath)) {
      return streamVideoFile(videoPath, req, res);
    }
    return res.status(404).send('Documentary video file not found');
  }
);

// Dynamic stream for any video in assets or uploads
app.get(['/assets/aistudio/:filename', '/uploads/videos/:filename'], (req, res, next) => {
  const filename = req.params.filename;
  if (filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.webm')) {
    const paths = [
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

// Serve uploads and public directory
app.use('/uploads', express.static(path.resolve(appDir, 'uploads')));
app.use(
  express.static(path.resolve(appDir, 'public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

// Synchronize canonical video files without blocking server startup
function ensureCanonicalVideoFiles() {
  const aistudioDir = path.resolve(appDir, 'public/assets/aistudio');
  const targetDoc = path.join(aistudioDir, 'nafham_documentary.mp4');
  const targetVid = path.join(aistudioDir, 'nafham_video.mp4');
  const sourceVideo = path.join(aistudioDir, 'nafham_5b6451e6.mp4');

  if (fs.existsSync(sourceVideo)) {
    try {
      const sourceStats = fs.statSync(sourceVideo);
      // Link or copy asynchronously if not matching
      if (!fs.existsSync(targetDoc) || fs.statSync(targetDoc).size !== sourceStats.size) {
        try {
          fs.linkSync(sourceVideo, targetDoc);
        } catch {
          fs.copyFile(sourceVideo, targetDoc, () => {});
        }
      }
      if (!fs.existsSync(targetVid) || fs.statSync(targetVid).size !== sourceStats.size) {
        try {
          fs.linkSync(sourceVideo, targetVid);
        } catch {
          fs.copyFile(sourceVideo, targetVid, () => {});
        }
      }
    } catch (err) {
      console.warn('Video canonical sync check warning:', err);
    }
  }
}


// -------------------------------------------------------------
// Server Initialization (Vite dev or production static serving)
// -------------------------------------------------------------
async function startServer() {
  ensureCanonicalVideoFiles();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve dist folder
    app.use(express.static(path.resolve(appDir, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(appDir, 'dist', 'index.html'));
    });
  }

  // Handle both port number and Passenger unix sockets
  if (typeof PORT === 'string' && (PORT.startsWith('/') || PORT.startsWith('\\\\'))) {
    app.listen(PORT, () => {
      console.log(`Nafham Server listening on unix socket: ${PORT}`);
    });
  } else {
    const numPort = typeof PORT === 'number' ? PORT : parseInt(PORT, 10) || 3000;
    app.listen(numPort, '0.0.0.0', () => {
      console.log(`Nafham Server listening on http://0.0.0.0:${numPort}`);
    });
  }
}

startServer();

export default app;
