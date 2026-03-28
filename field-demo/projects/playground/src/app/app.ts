import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldStandardComponent, FieldSuggestOption } from 'field-ui';

type IconSlot = 'leading' | 'trailing';

const SUGGEST_OPTIONS_STORAGE_KEY = 'field-ui-test-playground-suggest-options';
const MAX_SUGGEST_LINES = 100;

/** Default playground list: 100 fruits and vegetables (label = value). */
const DEFAULT_SUGGEST_NAMES: readonly string[] = [
  'Apple',
  'Apricot',
  'Artichoke',
  'Arugula',
  'Asparagus',
  'Avocado',
  'Banana',
  'Basil',
  'Beet',
  'Bell pepper',
  'Blackberry',
  'Blueberry',
  'Bok choy',
  'Broccoli',
  'Brussels sprout',
  'Cabbage',
  'Cantaloupe',
  'Carrot',
  'Cauliflower',
  'Celery',
  'Chard',
  'Cherry',
  'Chicory',
  'Clementine',
  'Coconut',
  'Collard greens',
  'Corn',
  'Cranberry',
  'Cucumber',
  'Date',
  'Daikon',
  'Dragon fruit',
  'Durian',
  'Eggplant',
  'Elderberry',
  'Endive',
  'Fennel',
  'Fig',
  'Garlic',
  'Ginger',
  'Gooseberry',
  'Grape',
  'Grapefruit',
  'Green bean',
  'Guava',
  'Honeydew',
  'Jalapeño',
  'Jackfruit',
  'Kale',
  'Kiwi',
  'Kohlrabi',
  'Kumquat',
  'Leek',
  'Lemon',
  'Lettuce',
  'Lime',
  'Lychee',
  'Lotus root',
  'Mango',
  'Mangosteen',
  'Mulberry',
  'Mushroom',
  'Nectarine',
  'Okra',
  'Olive',
  'Onion',
  'Orange',
  'Papaya',
  'Parsnip',
  'Passion fruit',
  'Peach',
  'Pear',
  'Pea',
  'Persimmon',
  'Pineapple',
  'Plantain',
  'Plum',
  'Pomegranate',
  'Potato',
  'Pumpkin',
  'Quince',
  'Radish',
  'Raspberry',
  'Red currant',
  'Rhubarb',
  'Rutabaga',
  'Shallot',
  'Spinach',
  'Squash',
  'Star fruit',
  'Strawberry',
  'Sweet potato',
  'Swiss chard',
  'Tangerine',
  'Tomato',
  'Turnip',
  'Watercress',
  'Watermelon',
  'Yam',
  'Zucchini',
];

const DEFAULT_SUGGEST_OPTIONS: FieldSuggestOption[] = DEFAULT_SUGGEST_NAMES.map((name) => ({
  label: name,
  value: name,
}));

function optionsToText(opts: FieldSuggestOption[]): string {
  return opts
    .map((o) => (o.value && o.value !== o.label ? `${o.label} | ${o.value}` : o.label))
    .join('\n');
}

function textToOptions(text: string): FieldSuggestOption[] {
  return text
    .split('\n')
    .slice(0, MAX_SUGGEST_LINES)
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FieldStandardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly maxSuggestLines = MAX_SUGGEST_LINES;

  fieldControl = new FormControl('');

  suggestEnabled = false;
  suggestOptions: FieldSuggestOption[] = [...DEFAULT_SUGGEST_OPTIONS];
  suggestOptionsDraft = optionsToText(DEFAULT_SUGGEST_OPTIONS);
  suggestOptionsError = '';

  fieldWidth = 400;
  fieldWidthText: string | number = '400';
  readonly fieldMinWidth = 200;
  readonly fieldMaxWidth = 960;

  theme: 'dark' | 'light' = 'dark';

  showLabel = true;
  labelText = 'Label';

  showPlaceholder = true;
  placeholderText = 'Placeholder';

  showHint = false;
  hintText = 'Tell me a story';

  showSuffix = false;
  suffixText = 'Km';

  showLeadingIcon = false;
  leadingIconName = 'menu';
  leadingIconSvg = '';

  showTrailingIcon = false;
  trailingIconName = 'info';
  trailingIconSvg = '';

  isDisabled = false;
  forceError = false;

  readonly leadingIcons = ['menu', 'search', 'person', 'lock'];
  readonly trailingIcons = ['info', 'close', 'check', 'eye'];

  ngOnInit(): void {
    this.applyTheme();
    this.loadSuggestOptionsFromStorage();
  }

  setFieldWidth(value: number | string): void {
    const n = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (!Number.isFinite(n)) return;
    this.fieldWidth = Math.min(
      this.fieldMaxWidth,
      Math.max(this.fieldMinWidth, Math.round(n)),
    );
    this.fieldWidthText = String(this.fieldWidth);
  }

  commitFieldWidthFromInput(): void {
    const raw = String(this.fieldWidthText ?? '').trim();
    if (raw === '') {
      this.fieldWidthText = String(this.fieldWidth);
      return;
    }
    const n = parseFloat(raw.replace(',', '.'));
    if (!Number.isFinite(n)) {
      this.fieldWidthText = String(this.fieldWidth);
      return;
    }
    this.setFieldWidth(n);
  }

  onWidthInputEnter(event: Event): void {
    (event.target as HTMLInputElement).blur();
  }

  onThemeChange(): void {
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.theme);
    document.body.style.backgroundColor = this.theme === 'light' ? '#f5f5f5' : '#1a1a1a';
    document.body.style.color = this.theme === 'light' ? 'rgba(0,0,0,0.87)' : 'rgba(253,253,253,0.9)';
  }

  applySuggestOptions(): void {
    const parsed = textToOptions(this.suggestOptionsDraft);
    if (parsed.length === 0) {
      this.suggestOptionsError = 'No valid options found. Enter at least one line.';
      return;
    }
    this.suggestOptionsError = '';
    this.suggestOptions = parsed;
    this.suggestOptionsDraft = optionsToText(parsed);
    try {
      localStorage.setItem(SUGGEST_OPTIONS_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // localStorage unavailable (e.g. private mode with storage blocked)
    }
  }

  resetSuggestOptionsToDefaults(): void {
    this.suggestOptions = [...DEFAULT_SUGGEST_OPTIONS];
    this.suggestOptionsDraft = optionsToText(DEFAULT_SUGGEST_OPTIONS);
    this.suggestOptionsError = '';
    try {
      localStorage.removeItem(SUGGEST_OPTIONS_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  private loadSuggestOptionsFromStorage(): void {
    try {
      const raw = localStorage.getItem(SUGGEST_OPTIONS_STORAGE_KEY);
      if (!raw) return;
      const parsed: FieldSuggestOption[] = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every((o) => typeof o.label === 'string')
      ) {
        this.suggestOptions = parsed;
        this.suggestOptionsDraft = optionsToText(parsed);
      }
    } catch {
      // malformed storage — fall back to defaults silently
    }
  }

  onDisabledToggle(): void {
    if (this.isDisabled) {
      this.fieldControl.disable();
    } else {
      this.fieldControl.enable();
    }
  }

  onSvgUpload(slot: IconSlot, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result as string;
      const normalized = this.normalizeSvg(raw);
      if (slot === 'leading') this.leadingIconSvg = normalized;
      else this.trailingIconSvg = normalized;
      input.value = '';
    };
    reader.readAsText(file);
  }

  clearIcon(slot: IconSlot): void {
    if (slot === 'leading') {
      this.leadingIconSvg = '';
    } else {
      this.trailingIconSvg = '';
    }
  }

  private normalizeSvg(svg: string): string {
    return svg
      .replace(/fill="(?!none\b)([^"]+)"/gi, 'fill="currentColor"')
      .replace(/stroke="(?!none\b)([^"]+)"/gi, 'stroke="currentColor"')
      .replace(/style="([^"]*)fill\s*:\s*(?!none)[^;}"]+/gi, (_, pre) => `style="${pre}fill:currentColor`)
      .replace(/style="([^"]*)stroke\s*:\s*(?!none)[^;}"]+/gi, (_, pre) => `style="${pre}stroke:currentColor`);
  }
}
