// Generates a self-contained SVG data-URI "photo" so the prototype never depends on
// external image hosts. Each card gets a soft diagonal gradient plus a monogram,
// which keeps the catalog visually distinct without shipping real photography.
export function placeholderImage(label: string, gradient: [string, string] = ['#4B164C', '#7A2F7D']): string {
  const initials = label
    .split(' ')
    .filter((w) => /[a-zA-Z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  const [from, to] = gradient
  const uid = Math.abs(hashCode(label)).toString(36)

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
    <defs>
      <linearGradient id="g${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
      <radialGradient id="r${uid}" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <rect width="600" height="750" fill="url(#g${uid})"/>
    <rect width="600" height="750" fill="url(#r${uid})"/>
    <circle cx="300" cy="330" r="150" fill="rgba(255,255,255,0.08)"/>
    <circle cx="300" cy="330" r="110" fill="rgba(255,255,255,0.10)"/>
    <text x="300" y="360" font-family="Georgia, 'Playfair Display', serif" font-size="120" font-weight="700" fill="rgba(255,255,255,0.92)" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <text x="300" y="670" font-family="Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.85)" text-anchor="middle" letter-spacing="2">${escapeXml(label).toUpperCase()}</text>
    <line x1="220" y1="700" x2="380" y2="700" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
  </svg>`.trim()

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export const GRADIENTS: Record<string, [string, string]> = {
  plum: ['#4B164C', '#7A2F7D'],
  coral: ['#FF5A5F', '#C42227'],
  midnight: ['#171717', '#3F1240'],
  garba: ['#B970BC', '#4B164C'],
  gold: ['#4B164C', '#8A5A2B'],
  emerald: ['#0F5C42', '#16855B'],
  rose: ['#7A2F7D', '#FF5A5F'],
  slate: ['#3F1240', '#6B6B6B'],
}
