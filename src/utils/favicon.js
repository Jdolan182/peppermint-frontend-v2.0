// Generates the browser-tab icon as an inline SVG: the site name's first
// letter, white on the brand colour — emerald on the public site, indigo
// in the admin panel. Called from App.vue whenever the site name or
// layout changes, so per-install branding needs no icon files.
export const BRAND_PUBLIC = '#059669' // emerald-600
export const BRAND_ADMIN  = '#4f46e5' // indigo-600

export function setLetterFavicon(name, bg = BRAND_PUBLIC) {
  const letter = (name || 'P').trim().charAt(0).toUpperCase()

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="14" fill="${bg}"/>` +
    `<text x="32" y="34" dominant-baseline="central" text-anchor="middle" ` +
    `font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="bold" ` +
    `fill="#fff">${letter}</text>` +
    `</svg>`

  let link = document.querySelector('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/svg+xml'
  link.href = 'data:image/svg+xml,' + encodeURIComponent(svg)
}
