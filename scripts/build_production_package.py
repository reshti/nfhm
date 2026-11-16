#!/usr/bin/env python3
import os
import sys
import json
import time
import shutil
import zipfile
import subprocess

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
STAGING_DIR = os.path.join(ROOT_DIR, 'package_staging')
RELEASE_DIR = os.path.join(ROOT_DIR, 'nafham_cpanel_release')
DIST_DIR = os.path.join(ROOT_DIR, 'dist')
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')
OUTPUT_ZIP_1 = os.path.join(PUBLIC_DIR, 'nafham_universal_deployment.zip')
OUTPUT_ZIP_2 = os.path.join(PUBLIC_DIR, 'nafham_cpanel_ready.zip')

print("=" * 70)
print(" منصة «نفهم» التوعوية باضطراب طيف التوحد (جامعة الإمام عبدالرحمن بن فيصل)")
print(" بناء حزمة الإنتاج المستقلة لبيئات CloudLinux و Phusion Passenger و cPanel")
print("=" * 70)

# Step 1: Clean Staging & Release Directories
for d in [STAGING_DIR, RELEASE_DIR]:
    if os.path.exists(d):
        shutil.rmtree(d)
    os.makedirs(d, exist_ok=True)

# Step 2: Build Client Application using Vite
print("\n[1/7] بناء واجهة التطبيق عبر Vite (Client Build)...")
# Clean any previous zip in dist before build
if os.path.exists(DIST_DIR):
    for f in os.listdir(DIST_DIR):
        if f.endswith('.zip'):
            try:
                os.remove(os.path.join(DIST_DIR, f))
            except:
                pass

build_res = subprocess.run(['npm', 'run', 'build'], cwd=ROOT_DIR, capture_output=True, text=True)
if build_res.returncode != 0:
    print("Vite Build Failed!")
    print(build_res.stderr)
    sys.exit(1)
print("✓ تم بناء واجهة المستخدم بنجاح في مجلد dist/")

# Step 3: Bundle Production Server via esbuild into CommonJS
print("\n[2/7] ترجمة وحزم خادم الإنتاج (esbuild Production Bundle)...")
server_ts = os.path.join(ROOT_DIR, 'src/server/productionServer.ts')
server_js = os.path.join(STAGING_DIR, 'server.js')
esbuild_cmd = [
    'npx', 'esbuild', server_ts,
    '--bundle',
    '--platform=node',
    '--format=cjs',
    '--define:process.env.NODE_ENV=\'"production"\'',
    '--external:vite',
    '--outfile=' + server_js
]
esb_res = subprocess.run(esbuild_cmd, cwd=ROOT_DIR, capture_output=True, text=True)
if esb_res.returncode != 0:
    print("esbuild Failed!")
    print(esb_res.stderr)
    sys.exit(1)
print(f"✓ تم إنشاء server.js إنتاجي بصيغة CommonJS متوافقة مع Passenger ({os.path.getsize(server_js)} bytes)")

# Also copy server.js to root
shutil.copyfile(server_js, os.path.join(ROOT_DIR, 'server.js'))

# Step 4: Create app.js (Passenger Entrypoint)
print("\n[3/7] إنشاء ملف بدء التشغيل لمشغل Phusion Passenger (app.js)...")
app_js_content = """/**
 * Phusion Passenger Entrypoint for cPanel & CloudLinux
 * Platform «Nafham» - Imam Abdulrahman Bin Faisal University (IAU)
 * Motto: «لأن الفهم بداية التقبل» | Identity: «مجرد أثر بصمة»
 */
const app = require('./server.js');
module.exports = app;
"""
with open(os.path.join(STAGING_DIR, 'app.js'), 'w', encoding='utf-8') as f:
    f.write(app_js_content)
with open(os.path.join(ROOT_DIR, 'app.js'), 'w', encoding='utf-8') as f:
    f.write(app_js_content)
with open(os.path.join(STAGING_DIR, 'app.cjs'), 'w', encoding='utf-8') as f:
    f.write(app_js_content)
with open(os.path.join(ROOT_DIR, 'app.cjs'), 'w', encoding='utf-8') as f:
    f.write(app_js_content)
print("✓ تم تجهيز app.js و app.cjs المتوافقين مع محرك Passenger بنجاح")


# Step 5: Create Clean Production package.json (NO "type": "module", NO devDependencies)
print("\n[4/7] توليد package.json الإنتاجي النظيف والخالي من تعارضات CloudLinux...")
prod_package_json = {
    "name": "nafham-autism-platform",
    "version": "2.5.0",
    "private": True,
    "description": "منصة نفهم التوعوية باضطراب طيف التوحد - برعاية وإشراف جامعة الإمام عبدالرحمن بن فيصل (كلية الآداب)",
    "main": "app.js",
    "scripts": {
        "start": "node server.js"
    },
    "dependencies": {
        "express": "^4.21.2",
        "dotenv": "^17.2.3",
        "mysql2": "^3.12.0",
        "@google/genai": "^2.4.0"
    },
    "engines": {
        "node": ">=18.0.0"
    }
}
with open(os.path.join(STAGING_DIR, 'package.json'), 'w', encoding='utf-8') as f:
    json.dump(prod_package_json, f, indent=2, ensure_ascii=False)
print("✓ تم توليد package.json الإنتاجي (بدون type: module وبدون devDependencies لمنع خطأ SIGABRT)")

# Step 6: Deploy compiled files to BOTH root and dist subfolder of staging
print("\n[5/7] دمج ملفات الواجهة المترجمة في جذر الحزمة ومجلد dist...")

# 6.1 Copy dist contents directly to STAGING ROOT
for item in os.listdir(DIST_DIR):
    if item.endswith('.zip'):
        continue
    s = os.path.join(DIST_DIR, item)
    d = os.path.join(STAGING_DIR, item)
    if os.path.isdir(s):
        if os.path.exists(d):
            shutil.rmtree(d)
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

# 6.2 Also keep a clean dist/ copy inside staging for setups configured with DocumentRoot dist
staging_dist = os.path.join(STAGING_DIR, 'dist')
os.makedirs(staging_dist, exist_ok=True)
for item in os.listdir(DIST_DIR):
    if item.endswith('.zip'):
        continue
    s = os.path.join(DIST_DIR, item)
    d = os.path.join(staging_dist, item)
    if os.path.isdir(s):
        if os.path.exists(d):
            shutil.rmtree(d)
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

# 6.3 Copy .htaccess to staging root and dist
shutil.copyfile(os.path.join(PUBLIC_DIR, '.htaccess'), os.path.join(STAGING_DIR, '.htaccess'))
shutil.copyfile(os.path.join(PUBLIC_DIR, '.htaccess'), os.path.join(staging_dist, '.htaccess'))

# 6.4 Copy database_schema.sql
shutil.copyfile(os.path.join(PUBLIC_DIR, 'database_schema.sql'), os.path.join(STAGING_DIR, 'database_schema.sql'))

# 6.5 Copy documentation
for doc in ['README_CPANEL_CLOUDLINUX_AR.md', 'README_DEPLOYMENT_AR.md', 'README_CPANEL_AR.txt']:
    src_doc = os.path.join(PUBLIC_DIR, doc)
    if os.path.exists(src_doc):
        shutil.copyfile(src_doc, os.path.join(STAGING_DIR, doc))

# 6.6 Create runtime folders
os.makedirs(os.path.join(STAGING_DIR, 'uploads', 'videos'), exist_ok=True)
os.makedirs(os.path.join(STAGING_DIR, 'data', 'backups'), exist_ok=True)

# 6.7 Ensure Video is present in root assets/aistudio and dist/assets/aistudio
source_video = os.path.join(PUBLIC_DIR, 'assets', 'aistudio', 'nafham_5b6451e6.mp4')
if os.path.exists(source_video):
    target_video_dirs = [
        os.path.join(STAGING_DIR, 'assets', 'aistudio'),
        os.path.join(STAGING_DIR, 'dist', 'assets', 'aistudio'),
    ]
    for tvd in target_video_dirs:
        os.makedirs(tvd, exist_ok=True)
        shutil.copyfile(source_video, os.path.join(tvd, 'nafham_5b6451e6.mp4'))
        shutil.copyfile(source_video, os.path.join(tvd, 'nafham_documentary.mp4'))
        shutil.copyfile(source_video, os.path.join(tvd, 'nafham_video.mp4'))
    print(f"✓ تم تضمين ملف الفيديو المعتمد nafham_5b6451e6.mp4 ({os.path.getsize(source_video)} bytes)")

# Step 7: Pre-install Production Dependencies into staging node_modules
print("\n[6/7] تجهيز التبعيات الإنتاجية المسبقة (node_modules)...")
npm_install_res = subprocess.run(
    ['npm', 'install', '--omit=dev'],
    cwd=STAGING_DIR,
    capture_output=True,
    text=True
)
if npm_install_res.returncode == 0:
    print("✓ تم تجهيز مجلد node_modules الإنتاجي المسبق بنجاح تام داخل الحزمة")
else:
    print("تنبيه: سيتم الاعتماد على الحزم المجمعة ذاتياً داخل server.js")

# Copy the entire staging directory to nafham_cpanel_release for direct unzipped access
print("\n[6.5/7] تجهيز مجلد الإصدار المباشر nafham_cpanel_release...")
for item in os.listdir(STAGING_DIR):
    s = os.path.join(STAGING_DIR, item)
    d = os.path.join(RELEASE_DIR, item)
    if os.path.isdir(s):
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)
print("✓ تم تجهيز مجلد nafham_cpanel_release الكامل للاستخدام المباشر دون الحاجة لفك الضغط")

# Step 8: Create Clean Deployment ZIP Archives
print("\n[7/7] إنشاء ملف ZIP الإنتاجي الشامل والنهائي...")
def zip_dir(src_dir, zip_filename):
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(src_dir):
            for file in files:
                if file.endswith('.zip'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, src_dir)
                zipf.write(full_path, arcname=rel_path)

# Remove any existing zip files before writing
for zf in [OUTPUT_ZIP_1, OUTPUT_ZIP_2]:
    if os.path.exists(zf):
        try:
            os.remove(zf)
        except:
            pass

zip_dir(STAGING_DIR, OUTPUT_ZIP_1)
shutil.copyfile(OUTPUT_ZIP_1, OUTPUT_ZIP_2)

# Also copy to dist for serving via dev web server if requested
if os.path.exists(DIST_DIR):
    shutil.copyfile(OUTPUT_ZIP_1, os.path.join(DIST_DIR, 'nafham_universal_deployment.zip'))
    shutil.copyfile(OUTPUT_ZIP_1, os.path.join(DIST_DIR, 'nafham_cpanel_ready.zip'))

print("✓ اكتمل تجهيز الحزم:")
print(f"  - الحزمة المضغوطة 1: {OUTPUT_ZIP_1} ({os.path.getsize(OUTPUT_ZIP_1)} bytes)")
print(f"  - الحزمة المضغوطة 2: {OUTPUT_ZIP_2} ({os.path.getsize(OUTPUT_ZIP_2)} bytes)")
print(f"  - المجلد المباشر: {RELEASE_DIR}")
print("=" * 70)
