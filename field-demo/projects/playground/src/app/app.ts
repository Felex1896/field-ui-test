import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldStandardComponent, FieldSuggestOption } from 'field-ui';

type IconSlot = 'leading' | 'trailing';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FieldStandardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  fieldControl = new FormControl('');

  suggestEnabled = false;
  readonly suggestOptions: FieldSuggestOption[] = [
    { label: 'Item 1', value: 'Item 1' },
    { label: 'Item 2', value: 'Item 2' },
    { label: 'Item 3', value: 'Item 3' },
    { label: 'Item 4', value: 'Item 4' },
    { label: 'Item 5', value: 'Item 5' },
    { label: 'Item 6', value: 'Item 6' },
  ];

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
