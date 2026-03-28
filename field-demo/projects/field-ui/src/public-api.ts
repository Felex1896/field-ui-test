/*
 * Public API Surface of field-ui
 */

export { FieldStandardComponent } from './lib/field-standard/field-standard.component';
export type { FieldState, FieldSuggestOption } from './lib/field-standard/field-standard.component';

export { FieldChipComponent } from './lib/field-chip/field-chip.component';
export type {
  ChipAppearance,
  ChipTone,
  ChipVisualState,
} from './lib/field-chip/field-chip.component';

export { FieldIconComponent } from './lib/icon/field-icon.component';
export { FieldIconRegistry } from './lib/icon/field-icon-registry.service';

export { SuggestPanelComponent } from './lib/suggest-panel/suggest-panel.component';
export type { SuggestOption } from './lib/suggest-panel/suggest-panel.component';

export { FigmaIconService } from './lib/services/figma-icon.service';
export type { FigmaNodeRef } from './lib/services/figma-icon.service';
