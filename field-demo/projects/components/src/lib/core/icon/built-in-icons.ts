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
  // Figma ic-info_outlined_sml (Vibe-Coding node 39:1684): tighter ring + compact block “i”.
  [
    'info',
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>' +
      '<rect x="11" y="7" width="2" height="2" rx="0.25" fill="currentColor"/>' +
      '<rect x="11" y="10.5" width="2" height="5.5" rx="0.25" fill="currentColor"/>',
  ],
  [
    'close',
    '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ],
  // Figma ic-close_small (node 29:1899); chip remove uses this instead of stroke `close`.
  [
    'close-small',
    '<path fill="currentColor" d="M15.4674 9.59769L13.0651 12L15.4674 14.4023C15.7616 14.6964 15.7616 15.1733 15.4674 15.4674C15.1733 15.7616 14.6964 15.7616 14.4023 15.4674L12 13.0651L9.59768 15.4674C9.30356 15.7616 8.82669 15.7616 8.53256 15.4674C8.23844 15.1733 8.23844 14.6964 8.53256 14.4023L10.9349 12L8.53256 9.59768C8.23844 9.30356 8.23844 8.82669 8.53256 8.53256C8.82669 8.23844 9.30356 8.23844 9.59768 8.53256L12 10.9349L14.4023 8.53256C14.6964 8.23844 15.1733 8.23844 15.4674 8.53256C15.7616 8.82669 15.7616 9.30356 15.4674 9.59769Z"/>',
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
