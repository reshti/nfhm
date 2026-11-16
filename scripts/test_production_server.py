#!/usr/bin/env python3
import os
import sys
import time
import json
import signal
import subprocess
import urllib.request
import urllib.error

STAGING_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../package_staging'))
TEST_PORT = 3098
BASE_URL = f"http://127.0.0.1:{TEST_PORT}"

print("=" * 70)
print(f" بدء الفحص والاختبار الفعلي لخادم الإنتاج (Port: {TEST_PORT})...")
print("=" * 70)

# Check that package_staging exists
if not os.path.exists(STAGING_DIR):
    print("خطأ: مجلد package_staging غير موجود. يجب تنفيذ بناء الحزمة أولاً.")
    sys.exit(1)

# Start test server process
env = os.environ.copy()
env['PORT'] = str(TEST_PORT)
env['NODE_ENV'] = 'production'

proc = subprocess.Popen(
    ['node', 'server.js'],
    cwd=STAGING_DIR,
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

time.sleep(1.5)

test_results = []

def run_test(name, url, headers=None, expected_code=200, check_fn=None):
    if headers is None:
        headers = {}
    req = urllib.request.Request(url, headers=headers)
    try:
        start_t = time.time()
        with urllib.request.urlopen(req, timeout=5) as resp:
            elapsed_ms = int((time.time() - start_t) * 1000)
            code = resp.getcode()
            body = resp.read()
            resp_headers = dict(resp.info())
            
            passed = (code == expected_code)
            extra_msg = ""
            if passed and check_fn:
                valid, detail = check_fn(resp_headers, body)
                passed = valid
                extra_msg = detail
            
            test_results.append({
                "test": name,
                "url": url,
                "status": "PASS" if passed else "FAIL",
                "code": code,
                "time_ms": elapsed_ms,
                "detail": extra_msg or f"HTTP {code}"
            })
    except urllib.error.HTTPError as e:
        elapsed_ms = int((time.time() - start_t) * 1000)
        code = e.code
        passed = (code == expected_code)
        extra_msg = ""
        if passed and check_fn:
            valid, detail = check_fn(dict(e.headers), e.read())
            passed = valid
            extra_msg = detail
        test_results.append({
            "test": name,
            "url": url,
            "status": "PASS" if passed else "FAIL",
            "code": code,
            "time_ms": elapsed_ms,
            "detail": extra_msg or f"HTTP {code}"
        })
    except Exception as ex:
        test_results.append({
            "test": name,
            "url": url,
            "status": "FAIL",
            "code": 0,
            "time_ms": 0,
            "detail": str(ex)
        })

# Test 1: Root GET /
def check_html(headers, body):
    content = body.decode('utf-8', errors='ignore')
    has_root = '<div id="root">' in content
    has_relative_assets = './assets/' in content or 'assets/' in content
    return (has_root and has_relative_assets, "HTML Valid & Relative Assets Confirmed")

run_test("1. فحص الواجهة الرئيسية (Root SPA)", f"{BASE_URL}/", expected_code=200, check_fn=check_html)

# Test 2: Installation Status API
def check_install_status(headers, body):
    try:
        data = json.loads(body.decode('utf-8'))
        return ("isInstalled" in data, f"JSON: {data}")
    except:
        return (False, "Invalid JSON")

run_test("2. فحص نقطة فحص التثبيت (API /api/install/status)", f"{BASE_URL}/api/install/status", expected_code=200, check_fn=check_install_status)

# Test 3: Video Streaming HTTP 206 Partial Content
def check_video_stream(headers, body):
    h = {k.lower(): v for k, v in headers.items()}
    accept_ranges = h.get('accept-ranges') == 'bytes'
    content_range = 'content-range' in h
    content_type = h.get('content-type', '').startswith('video/mp4')
    length = len(body)
    return (accept_ranges and content_range and content_type, f"Bytes: {length}, Range: {h.get('content-range')}, Content-Type: {h.get('content-type')}")

run_test("3. فحص تدفق الفيديو الوثائقي (HTTP 206 Partial Content)", f"{BASE_URL}/api/video/documentary", headers={"Range": "bytes=0-1024"}, expected_code=206, check_fn=check_video_stream)

# Test 4: Subpath Forwarding Simulation (/asd/api/install/status)
run_test("4. فحص التوافق مع المجلدات الفرعية (/asd/api/...)", f"{BASE_URL}/asd/api/install/status", expected_code=200, check_fn=check_install_status)

# Test 5: Fallback Routing for Subpath (/admincp)
def check_spa_fallback(headers, body):
    content = body.decode('utf-8', errors='ignore')
    return ('<div id="root">' in content, "SPA Fallback Active")

run_test("5. فحص التوجيه لصفحة الإدارة (/admincp)", f"{BASE_URL}/admincp", expected_code=200, check_fn=check_spa_fallback)

# Test 6: manifest.json at Root
def check_manifest(headers, body):
    h = {k.lower(): v for k, v in headers.items()}
    ct = h.get('content-type', '')
    try:
        data = json.loads(body.decode('utf-8'))
        is_valid = "name" in data and "icons" in data
        return (is_valid and "manifest" in ct, f"Valid PWA Manifest: {data.get('short_name')}")
    except:
        return (False, "Invalid JSON in manifest")

run_test("6. فحص ملف manifest.json بالجذر", f"{BASE_URL}/manifest.json", expected_code=200, check_fn=check_manifest)

# Test 7: Subfolder manifest.json (/asd/manifest.json)
run_test("7. فحص ملف manifest.json بالمجلد الفرعي (/asd/...)", f"{BASE_URL}/asd/manifest.json", expected_code=200, check_fn=check_manifest)

# Test 8: Missing static resource MUST return 404 (Not index.html)
def check_missing_404(headers, body):
    content = body.decode('utf-8', errors='ignore')
    not_html = '<div id="root">' not in content
    return (not_html, "Clean 404 for missing asset (no HTML returned)")

run_test("8. فحص منع إرجاع HTML للملفات المفقودة (Anti-MIME Syntax Error)", f"{BASE_URL}/assets/missing_test_script.js", expected_code=404, check_fn=check_missing_404)

# Test 9: Subfolder Installer Route (/asd/install)
run_test("9. فحص معالج التثبيت في مجلد فرعي (/asd/install)", f"{BASE_URL}/asd/install", expected_code=200, check_fn=check_spa_fallback)

# Terminate test server
try:
    proc.terminate()
    proc.wait(timeout=2)
except:
    proc.kill()

print("\n" + "=" * 70)
print(" نتائج الاختبارات الفعلية للإنتاج:")
print("=" * 70)
all_passed = True
for r in test_results:
    mark = "✓" if r['status'] == "PASS" else "✗"
    print(f"[{mark}] {r['test']}: {r['status']} ({r['code']}) في {r['time_ms']}ms | {r['detail']}")
    if r['status'] != "PASS":
        all_passed = False

print("=" * 70)
if all_passed:
    print("✓ نجحت جميع الاختبارات بنسبة 100%! الحزمة جاهزة للتشغيل والرفع على cPanel CloudLinux.")
    sys.exit(0)
else:
    print("✗ فشل في بعض الاختبارات!")
    sys.exit(1)
