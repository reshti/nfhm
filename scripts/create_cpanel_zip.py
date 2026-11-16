import os
import zipfile
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIST_DIR = os.path.join(ROOT_DIR, 'dist')
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')
OUTPUT_ZIP_PUBLIC = os.path.join(PUBLIC_DIR, 'nafham_cpanel_ready.zip')
OUTPUT_ZIP_DIST = os.path.join(DIST_DIR, 'nafham_cpanel_ready.zip')

print(f"Creating cPanel package from {ROOT_DIR}...")

# Files from dist (compiled production files)
with zipfile.ZipFile(OUTPUT_ZIP_PUBLIC, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # 1. Add dist contents
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            if file.endswith('.zip'):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, DIST_DIR)
            zipf.write(full_path, arcname=rel_path)

    # 2. Add server files
    server_js = os.path.join(ROOT_DIR, 'server.js')
    if os.path.exists(server_js):
        zipf.write(server_js, arcname='server.js')

    server_ts = os.path.join(ROOT_DIR, 'server.ts')
    if os.path.exists(server_ts):
        zipf.write(server_ts, arcname='server.ts')

    package_json = os.path.join(ROOT_DIR, 'package.json')
    if os.path.exists(package_json):
        zipf.write(package_json, arcname='package.json')

    env_example = os.path.join(ROOT_DIR, '.env.example')
    if os.path.exists(env_example):
        zipf.write(env_example, arcname='.env.example')
        zipf.write(env_example, arcname='.env')

    # 3. Add .htaccess
    htaccess = os.path.join(PUBLIC_DIR, '.htaccess')
    if os.path.exists(htaccess):
        zipf.write(htaccess, arcname='.htaccess')

    # 4. Add database_schema.sql
    sql_schema = os.path.join(PUBLIC_DIR, 'database_schema.sql')
    if os.path.exists(sql_schema):
        zipf.write(sql_schema, arcname='database_schema.sql')

    # 5. Add README_CPANEL_AR.txt
    readme = os.path.join(PUBLIC_DIR, 'README_CPANEL_AR.txt')
    if os.path.exists(readme):
        zipf.write(readme, arcname='README_CPANEL_AR.txt')

print(f"Created {OUTPUT_ZIP_PUBLIC} (size: {os.path.getsize(OUTPUT_ZIP_PUBLIC)} bytes)")

# Also copy to dist so it is available via web server
if os.path.exists(DIST_DIR):
    shutil.copyfile(OUTPUT_ZIP_PUBLIC, OUTPUT_ZIP_DIST)
    print(f"Copied to {OUTPUT_ZIP_DIST}")
