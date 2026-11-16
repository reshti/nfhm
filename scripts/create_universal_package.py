import os
import zipfile
import shutil
import subprocess

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIST_DIR = os.path.join(ROOT_DIR, 'dist')
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')

OUTPUT_UNIVERSAL_PUBLIC = os.path.join(PUBLIC_DIR, 'nafham_universal_deployment.zip')
OUTPUT_CPANEL_PUBLIC = os.path.join(PUBLIC_DIR, 'nafham_cpanel_ready.zip')

print(f"Creating Universal Deployment Package from: {ROOT_DIR}")

# 1. Compile server.ts using esbuild
server_ts = os.path.join(ROOT_DIR, 'server.ts')
server_js = os.path.join(ROOT_DIR, 'server.js')
if os.path.exists(server_ts):
    print("Bundling server.ts to server.js with esbuild...")
    try:
        subprocess.run(
            ['npx', 'esbuild', 'server.ts', '--bundle', '--platform=node', '--format=cjs', '--outfile=server.js', '--external:@google/genai', '--external:vite'],
            cwd=ROOT_DIR,
            check=True
        )
        print("Successfully generated server.js")
    except Exception as e:
        print(f"Warning: Failed to compile server.ts via esbuild: {e}")

# 2. Package into zip file
temp_zip = os.path.join(ROOT_DIR, 'temp_package.zip')
added_names = set()

with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    def add_file(src, arc):
        if arc not in added_names and os.path.exists(src):
            zipf.write(src, arcname=arc)
            added_names.add(arc)

    # Add all files from dist
    if os.path.exists(DIST_DIR):
        for root, dirs, files in os.walk(DIST_DIR):
            for file in files:
                if file.endswith('.zip'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, DIST_DIR)
                add_file(full_path, rel_path)

    # Server execution files
    add_file(os.path.join(ROOT_DIR, 'server.js'), 'server.js')
    add_file(os.path.join(ROOT_DIR, 'app.js'), 'app.js')
    add_file(os.path.join(ROOT_DIR, 'server.ts'), 'server.ts')
    add_file(os.path.join(ROOT_DIR, 'package.json'), 'package.json')
    add_file(os.path.join(ROOT_DIR, '.env.example'), '.env.example')
    add_file(os.path.join(ROOT_DIR, '.env.example'), '.env')

    # Apache & Database schema & Docs
    add_file(os.path.join(PUBLIC_DIR, '.htaccess'), '.htaccess')
    add_file(os.path.join(PUBLIC_DIR, 'database_schema.sql'), 'database_schema.sql')
    add_file(os.path.join(PUBLIC_DIR, 'README_DEPLOYMENT_AR.md'), 'README_DEPLOYMENT_AR.md')
    add_file(os.path.join(PUBLIC_DIR, 'README_CPANEL_AR.txt'), 'README_CPANEL_AR.txt')

    # Add canonical video if not present in dist
    video_src = os.path.join(PUBLIC_DIR, 'assets/aistudio/nafham_5b6451e6.mp4')
    if os.path.exists(video_src):
        add_file(video_src, 'assets/aistudio/nafham_5b6451e6.mp4')
        add_file(video_src, 'assets/aistudio/nafham_documentary.mp4')
        add_file(video_src, 'assets/aistudio/nafham_video.mp4')

# Copy to final destinations
shutil.copyfile(temp_zip, OUTPUT_UNIVERSAL_PUBLIC)
shutil.copyfile(temp_zip, OUTPUT_CPANEL_PUBLIC)

if os.path.exists(DIST_DIR):
    shutil.copyfile(temp_zip, os.path.join(DIST_DIR, 'nafham_universal_deployment.zip'))
    shutil.copyfile(temp_zip, os.path.join(DIST_DIR, 'nafham_cpanel_ready.zip'))

if os.path.exists(temp_zip):
    os.remove(temp_zip)

print(f"Universal package created successfully!")
print(f"File 1: {OUTPUT_UNIVERSAL_PUBLIC} ({os.path.getsize(OUTPUT_UNIVERSAL_PUBLIC)} bytes)")
print(f"File 2: {OUTPUT_CPANEL_PUBLIC} ({os.path.getsize(OUTPUT_CPANEL_PUBLIC)} bytes)")
