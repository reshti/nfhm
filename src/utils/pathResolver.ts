/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Universal Path & Subfolder Resolver for Platform «Nafham»
 * Supports root deployments (/), single subfolders (/asd), nested paths (/programs/nafham),
 * and custom domains without modifying source code or rebuilds.
 */

declare global {
  interface Window {
    __NAFHAM_BASE__?: string;
  }
}

/**
 * Known internal routes to accurately detect subfolder roots
 */
const KNOWN_INTERNAL_ROUTES = [
  '/admincp',
  '/admin',
  '/install',
  '/cinematic',
  '/showcase',
  '/games',
  '/library',
  '/challenge',
  '/adventure',
  '/team',
  '/certificate',
];

/**
 * Returns the detected or configured base path of the application.
 * E.g. "" (for root https://example.com/) or "/asd" or "/programs/nafham"
 * Guarantees no trailing slash, and leading slash if not empty.
 */
export function getAppBasePath(): string {
  if (typeof window === 'undefined') {
    const envBase = (typeof process !== 'undefined' && process.env?.APP_BASE_PATH) || '';
    return normalizeBasePath(envBase);
  }

  // 1. Explicit runtime override on window
  if (window.__NAFHAM_BASE__ !== undefined && typeof window.__NAFHAM_BASE__ === 'string') {
    return normalizeBasePath(window.__NAFHAM_BASE__);
  }

  // 2. Check <meta name="app-base" content="..."> tag
  const metaBase = document.querySelector('meta[name="app-base"]')?.getAttribute('content');
  if (metaBase) {
    return normalizeBasePath(metaBase);
  }

  // 3. Check HTML <base href="..."> tag if present
  const baseEl = document.querySelector('base');
  if (baseEl && baseEl.getAttribute('href')) {
    const href = baseEl.getAttribute('href') || '';
    if (href !== '/' && !href.startsWith('http://') && !href.startsWith('https://')) {
      return normalizeBasePath(href);
    }
  }

  // 4. Smart heuristic from window.location.pathname
  const pathname = window.location.pathname || '/';

  // Check if pathname matches or ends with any known internal route
  for (const route of KNOWN_INTERNAL_ROUTES) {
    const idx = pathname.indexOf(route);
    if (idx !== -1) {
      const subpath = pathname.substring(0, idx);
      return normalizeBasePath(subpath);
    }
  }

  // If at root or subfolder index like /asd/ or /asd
  // If the pathname has parts and ends with .html, get folder
  if (pathname.endsWith('.html')) {
    const lastSlash = pathname.lastIndexOf('/');
    return normalizeBasePath(pathname.substring(0, lastSlash));
  }

  // Check if there is a single or multi subfolder before index (e.g. /asd or /asd/)
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1 && !segments[0].includes('.')) {
    // Single subfolder e.g. /asd
    return `/${segments[0]}`;
  }

  return '';
}

/**
 * Normalizes a base path string (strips trailing slashes, ensures leading slash if non-empty)
 */
function normalizeBasePath(base: string): string {
  if (!base || base === '/' || base === './') return '';
  let clean = base.trim();
  if (!clean.startsWith('/')) clean = '/' + clean;
  if (clean.endsWith('/')) clean = clean.slice(0, -1);
  return clean;
}

/**
 * Resolves an internal application navigation URL respecting base path
 * resolveAppUrl('/admincp') => '/asd/admincp' (if base is /asd) or '/admincp' (if root)
 */
export function resolveAppUrl(path: string): string {
  const base = getAppBasePath();
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  if (!base) return cleanPath;
  return `${base}${cleanPath}`;
}

/**
 * Resolves a media or static asset URL respecting base path
 */
export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  // External or inline data URIs pass through directly
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const base = getAppBasePath();
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  if (!base) return cleanPath;
  return `${base}${cleanPath}`;
}

/**
 * Resolves an API endpoint URL respecting base path
 * resolveApiUrl('assistant') => '/asd/api/assistant' or '/api/assistant'
 */
export function resolveApiUrl(endpoint: string): string {
  const base = getAppBasePath();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const apiPath = cleanEndpoint.startsWith('api/') ? cleanEndpoint : `api/${cleanEndpoint}`;
  if (!base) return `/${apiPath}`;
  return `${base}/${apiPath}`;
}

/**
 * Gets the current internal route by stripping the base path from pathname
 */
export function getRelativeRoute(customPathname?: string): string {
  if (typeof window === 'undefined') return '/';
  const pathname = customPathname || window.location.pathname;
  const base = getAppBasePath();
  if (!base) return pathname || '/';
  if (pathname.startsWith(base)) {
    const stripped = pathname.substring(base.length);
    return stripped.startsWith('/') ? stripped : `/${stripped}`;
  }
  return pathname;
}
