// Field domain — standard input, suggest panel, shared suggest model

import type { SuggestOption } from '../lib/field/models/suggest-option';

export { FieldStandardComponent } from '../lib/field/field-standard/field-standard.component';
export type { FieldState } from '../lib/field/field-standard/field-standard.component';

export { SuggestPanelComponent } from '../lib/field/suggest-panel/suggest-panel.component';

export type { SuggestOption } from '../lib/field/models/suggest-option';

/** @deprecated Use {@link SuggestOption} instead. */
export type FieldSuggestOption = SuggestOption;
