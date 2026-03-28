import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  DestroyRef,
  inject,
  input,
  signal,
  computed,
  viewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FieldIconComponent } from '../icon/field-icon.component';
import { SuggestPanelComponent, SuggestOption } from '../suggest-panel/suggest-panel.component';

export type FieldState = 'default' | 'hover' | 'active' | 'error' | 'disabled';

export interface FieldSuggestOption {
  label: string;
  /** If omitted, `label` is written to the control when the option is chosen. */
  value?: string;
}

@Component({
  selector: 'app-field-standard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FieldIconComponent, SuggestPanelComponent],
  templateUrl: './field-standard.component.html',
  styleUrl: './field-standard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class FieldStandardComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly control = input<FormControl>(new FormControl(''));
  readonly label = input('Label');
  readonly showLabel = input(true);
  readonly placeholder = input('Placeholder');
  readonly showPlaceholder = input(true);
  readonly hint = input('');
  readonly showHint = input(false);
  readonly suffix = input('');
  readonly showSuffix = input(false);
  readonly showLeadingIcon = input(false);
  readonly leadingIconName = input('menu');
  readonly leadingIconSvg = input('');
  readonly showTrailingIcon = input(false);
  readonly trailingIconName = input('info');
  readonly trailingIconSvg = input('');
  readonly forceError = input(false);

  /** When true, shows a Figma-style option list under the field while focused after the user has typed at least one character; options match by label substring (case-insensitive). */
  readonly suggestEnabled = input(false);
  readonly suggestOptions = input<FieldSuggestOption[]>([]);

  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('fieldInput');
  readonly suggestPanel = viewChild<SuggestPanelComponent>('suggestPanel');

  readonly isFocused = signal(false);
  readonly isHovered = signal(false);
  /** After Escape or picking an option, hide the list until the user types again or refocuses. */
  private readonly suggestSuppressed = signal(false);

  /** Tracks control value reactively for computed derivations. */
  private readonly controlValue = signal<string | null>(null);

  readonly filteredSuggestItems = computed(() => {
    if (!this.suggestEnabled() || !this.suggestOptions()?.length) return [];
    const raw = String(this.controlValue() ?? '').trim();
    if (raw.length === 0) return [];
    const q = raw.toLowerCase();
    return this.suggestOptions().filter((o) => o.label.toLowerCase().includes(q));
  });

  readonly showSuggestPanel = computed(() => {
    return (
      this.suggestEnabled() &&
      !this.isDisabled() &&
      this.isFocused() &&
      !this.suggestSuppressed() &&
      this.filteredSuggestItems().length > 0
    );
  });

  readonly isDisabled = computed(() => this.control().disabled);

  readonly hasError = computed(() => {
    const ctrl = this.control();
    return this.forceError() || (ctrl.invalid && (ctrl.dirty || ctrl.touched));
  });

  readonly hasValue = computed(() => {
    const v = this.controlValue();
    return v !== null && v !== undefined && v !== '';
  });

  readonly isLabelFloated = computed(() => {
    return this.isFocused() || this.showPlaceholder() || this.hasValue();
  });

  readonly activePlaceholder = computed(() => {
    if (!this.showPlaceholder()) return '';
    return this.placeholder();
  });

  readonly state = computed<FieldState>(() => {
    if (this.isDisabled()) return 'disabled';
    if (this.hasError()) return 'error';
    if (this.isFocused()) return 'active';
    if (this.isHovered()) return 'hover';
    return 'default';
  });

  readonly hintColor = computed(() => {
    if (this.isDisabled()) return 'disabled';
    if (this.hasError()) return 'error';
    return 'default';
  });

  constructor() {
    effect(() => {
      const ctrl = this.control();
      this.controlValue.set(ctrl.value);

      const statusSub = ctrl.statusChanges.subscribe(() => {
        this.controlValue.set(ctrl.value);
      });
      const valueSub = ctrl.valueChanges.subscribe((val) => {
        this.controlValue.set(val);
        if (this.suggestEnabled()) {
          this.suggestSuppressed.set(false);
          this.suggestPanel()?.clampHighlight();
        }
      });

      this.destroyRef.onDestroy(() => {
        statusSub.unsubscribe();
        valueSub.unsubscribe();
      });
    });
  }

  onMouseEnter(): void {
    if (!this.isDisabled()) {
      this.isHovered.set(true);
    }
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  onFocus(): void {
    if (!this.isDisabled()) {
      this.isFocused.set(true);
      this.suggestSuppressed.set(false);
      this.suggestPanel()?.resetHighlight();
    }
  }

  onBlur(): void {
    if (this.suggestEnabled()) {
      setTimeout(() => {
        if (!this.host.nativeElement.contains(document.activeElement)) {
          this.isFocused.set(false);
          this.suggestSuppressed.set(false);
        }
      }, 0);
    } else {
      this.isFocused.set(false);
    }
  }

  onSuggestInput(): void {
    if (this.suggestEnabled()) {
      this.suggestSuppressed.set(false);
      this.suggestPanel()?.clampHighlight();
    }
  }

  onSuggestKeydown(ev: KeyboardEvent): void {
    if (!this.suggestEnabled() || this.isDisabled()) return;

    const panel = this.suggestPanel();
    if (!panel) return;

    const open = this.showSuggestPanel();
    if (!open && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      this.suggestSuppressed.set(false);
    }
    panel.handleKeydown(ev, open);
  }

  onSuggestOptionSelected(event: { option: SuggestOption; index: number }): void {
    if (this.isDisabled()) return;
    this.control().setValue(event.option.value ?? event.option.label);
    this.control().markAsDirty();
    this.suggestSuppressed.set(true);
    this.inputRef()?.nativeElement.focus();
  }

  onSuggestDismissed(): void {
    this.suggestSuppressed.set(true);
  }
}
