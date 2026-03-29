import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class FieldPlaygroundStore {
  readonly fieldControl = new FormControl('');

  suggestEnabled = false;

  /** Chips-in-field mode; implies suggest (see `onMultiValueEnabledChange`). */
  multiValueEnabled = false;
  chipValues: string[] = [];

  fieldWidth = 400;
  fieldWidthText: string | number = '400';
  readonly fieldMinWidth = 200;
  /** When multi-value is on, preview width cannot go below this. */
  readonly fieldMinWidthMulti = 400;
  readonly fieldMaxWidth = 960;

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

  /** Slider / clamp lower bound: 400px when multi-value is enabled. */
  get fieldWidthSliderMin(): number {
    return this.multiValueEnabled ? this.fieldMinWidthMulti : this.fieldMinWidth;
  }

  setFieldWidth(value: number | string): void {
    const n = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (!Number.isFinite(n)) return;
    const minW = this.fieldWidthSliderMin;
    this.fieldWidth = Math.min(this.fieldMaxWidth, Math.max(minW, Math.round(n)));
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

  /** Pass the new toggle value — do not read `isDisabled` here (ngModel may not have updated yet). */
  onDisabledToggle(disabled: boolean): void {
    if (disabled) {
      this.fieldControl.disable();
    } else {
      this.fieldControl.enable();
    }
  }

  onMultiValueEnabledChange(on: boolean): void {
    this.multiValueEnabled = on;
    if (on) {
      this.suggestEnabled = true;
      this.showSuffix = false;
      if (this.fieldWidth < this.fieldMinWidthMulti) {
        this.setFieldWidth(this.fieldMinWidthMulti);
      }
    } else {
      this.chipValues = [];
      const wasDisabled = this.fieldControl.disabled;
      if (wasDisabled) {
        this.fieldControl.enable({ emitEvent: false });
      }
      this.fieldControl.setValue('');
      if (wasDisabled) {
        this.fieldControl.disable({ emitEvent: true });
      }
    }
    if (this.isDisabled) {
      this.fieldControl.disable({ emitEvent: true });
    }
  }

  onSuggestEnabledChange(on: boolean): void {
    this.suggestEnabled = on;
    if (!on && this.multiValueEnabled) {
      this.multiValueEnabled = false;
      this.chipValues = [];
      this.fieldControl.setValue('');
    }
  }

  onLeadingIconSelected(name: string): void {
    this.leadingIconName = name;
  }

  onLeadingSvgUploaded(svg: string): void {
    this.leadingIconSvg = svg;
  }

  onLeadingSvgCleared(): void {
    this.leadingIconSvg = '';
  }

  onTrailingIconSelected(name: string): void {
    this.trailingIconName = name;
  }

  onTrailingSvgUploaded(svg: string): void {
    this.trailingIconSvg = svg;
  }

  onTrailingSvgCleared(): void {
    this.trailingIconSvg = '';
  }
}
