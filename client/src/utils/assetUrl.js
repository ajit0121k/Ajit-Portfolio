/**
 * Resolves asset URLs relative to the Vite base path.
 * On localhost, base is "/", so "/profile.jpg" stays "/profile.jpg".
 * On GitHub Pages, base is "/Ajit-Portfolio/", so "/profile.jpg" becomes "/Ajit-Portfolio/profile.jpg".
 */
const BASE = import.meta.env.BASE_URL || '/';

export function resolveAssetUrl(url) {
  if (!url) return url;
  // Already an absolute external URL or data URI
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  // If url starts with the base already, don't double-prefix
  if (url.startsWith(BASE)) {
    return url;
  }
  // Strip leading slash for concatenation
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${BASE}${cleanUrl}`;
}
