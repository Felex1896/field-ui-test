import { Injectable } from '@angular/core';
import type { FieldSuggestOption } from 'field-ui';
import { DEFAULT_SUGGEST_OPTIONS } from '../data/default-suggest-options';

const STORAGE_KEY = 'field-ui-test-playground-suggest-options';
const MAX_LINES = 100;

@Injectable({ providedIn: 'root' })
export class SuggestOptionsService {
  readonly maxLines = MAX_LINES;

  options: FieldSuggestOption[] = [...DEFAULT_SUGGEST_OPTIONS];
  draft = this.optionsToText(DEFAULT_SUGGEST_OPTIONS);
  error = '';

  constructor() {
    this.loadFromStorage();
  }

  apply(): void {
    const parsed = this.textToOptions(this.draft);
    if (parsed.length === 0) {
      this.error = 'No valid options found. Enter at least one line.';
      return;
    }
    this.error = '';
    this.options = parsed;
    this.draft = this.optionsToText(parsed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // localStorage unavailable
    }
  }

  resetToDefaults(): void {
    this.options = [...DEFAULT_SUGGEST_OPTIONS];
    this.draft = this.optionsToText(DEFAULT_SUGGEST_OPTIONS);
    this.error = '';
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  optionsToText(opts: FieldSuggestOption[]): string {
    return opts
      .map((o) => (o.value && o.value !== o.label ? `${o.label} | ${o.value}` : o.label))
      .join('\n');
  }

  private textToOptions(text: string): FieldSuggestOption[] {
    return text
      .split('\n')
      .slice(0, MAX_LINES)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const sep = line.indexOf('|');
        if (sep !== -1) {
          const label = line.slice(0, sep).trim();
          const value = line.slice(sep + 1).trim();
          return { label: label || value, value: value || label };
        }
        return { label: line, value: line };
      });
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: FieldSuggestOption[] = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every((o) => typeof o.label === 'string')
      ) {
        this.options = parsed;
        this.draft = this.optionsToText(parsed);
      }
    } catch {
      // malformed storage — fall back to defaults silently
    }
  }
}
