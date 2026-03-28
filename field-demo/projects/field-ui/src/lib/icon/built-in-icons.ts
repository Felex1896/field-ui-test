/**
 * SVG inner content (paths/shapes) for built-in icons.
 * Each entry is the markup that goes inside a 24x24 viewBox SVG element.
 */
export const BUILT_IN_ICONS: ReadonlyMap<string, string> = new Map([
  [
    'add',
    '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ],
  [
    'menu',
    '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ],
  [
    'search',
    '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ],
  [
    'person',
    '<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ],
  [
    'lock',
    '<rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ],
  [
    'info',
    '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ],
  [
    'close',
    '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ],
  [
    'check',
    '<path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  ],
  [
    'eye',
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>' +
      '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>',
  ],
]);
