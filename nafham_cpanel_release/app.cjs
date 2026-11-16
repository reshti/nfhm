/**
 * Phusion Passenger Entrypoint (.cjs for CommonJS explicit compatibility)
 * Platform «Nafham» - Imam Abdulrahman Bin Faisal University (IAU)
 * Motto: «لأن الفهم بداية التقبل» | Identity: «مجرد أثر بصمة»
 * 
 * Auto-detects Base URL, loads .env from application directory,
 * and bridges seamlessly with Node.js 20 and Phusion Passenger.
 */

const path = require('path');
const fs = require('fs');

// 1. Force current directory to app root so relative paths work accurately
const appDir = __dirname;
try {
  process.chdir(appDir);
} catch (e) {
  // Ignore chdir errors if restricted
}

// 2. Load environment variables from .env if present in appDir or parent directory
const envCandidates = [
  path.join(appDir, '.env'),
  path.join(appDir, 'data', '.env'),
  path.join(process.cwd(), '.env'),
];

for (const envFile of envCandidates) {
  if (fs.existsSync(envFile)) {
    try {
      const dotenv = require('dotenv');
      dotenv.config({ path: envFile });
      console.log(`[Nafham Passenger] Loaded environment variables from: ${envFile}`);
      break;
    } catch (err) {
      // Fallback manual parser if dotenv is not yet required
      try {
        const content = fs.readFileSync(envFile, 'utf8');
        content.split('\n').forEach(line => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            if (!process.env[key]) {
              process.env[key] = value.trim();
            }
          }
        });
      } catch (manualErr) {}
    }
  }
}

// 3. Auto-detect Base URL & Subpath from Passenger / cPanel environment
// e.g. /home/reshtih1/asd -> folder name is 'asd', default base path is '/asd'
if (!process.env.APP_BASE_PATH && !process.env.BASE_URL) {
  const folderName = path.basename(appDir);
  // If the folder is named 'asd' or similar subfolder (and not public_html / root)
  if (folderName && !['public_html', 'www', 'root', 'app', 'applet'].includes(folderName)) {
    process.env.APP_BASE_PATH = `/${folderName}`;
    console.log(`[Nafham Passenger] Auto-detected subpath APP_BASE_PATH: ${process.env.APP_BASE_PATH}`);
  }
}

// 4. Ensure production mode is set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// 5. Load and export the compiled production Express server
const app = require('./server.js');

module.exports = app;
