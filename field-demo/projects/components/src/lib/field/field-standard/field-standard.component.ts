import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  signal,
  computed,
  viewChild,
  viewChildren,
  effect,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FieldChipComponent } from '../../chips/field-chip/field-chip.component';
import { FieldIconComponent } from '../../core/icon/field-icon.component';
import { SuggestPanelComponent } from '../suggest-panel/suggest-panel.component';
import type { SuggestOption } from '../models/suggest-option';

export type FieldState = 'default' | 'hover' | 'active' | 'error' | 'disabled';

/**
 * Standard text field with optional suggest list. When `multiValueEnabled` is true, the control
 * holds the draft string; committed tokens are in `chipValues` (use `model()` two-way binding).
 * Multi mode implies suggest (`effectiveSuggestEnabled`).
 */
@Component({
  selector: 'app-field-standard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FieldChipComponent,
    FieldIconComponent,
    SuggestPanelComponent,
  ],
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
  private readonly injector = inject(Injector);

  readonly control = input<FormControl>(new FormControl(''));
  readonly label = input('Label');
  readonly showLabel = input(true);
  readonly placeholder = input('Placeholder');
  readonly showPlaceholder = input(true);
  readonly hint = input('');
  readonly showHint = input(false);
  /** Ignored when `multiValueEnabled` is true (suffix is not shown with the chip row). */
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
  readonly suggestOptions = input<SuggestOption[]>([]);

  /** When true, draft text is committed as chips (Enter); suggest is always active for filtering. */
  readonly multiValueEnabled = input(false);

  /** Committed chip labels/values when `multiValueEnabled` is true. */
  readonly chipValues = model<string[]>([]);

  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('fieldInput');
  readonly suggestPanel = viewChild<SuggestPanelComponent>('suggestPanel');
  readonly chipRefs = viewChildren(FieldChipComponent);

  /** Last chip index staged for deletion (first Backspace on empty draft); second Backspace removes it. */
  private readonly chipDeleteStageIndex = signal<number | null>(null);

  readonly isFocused = signal(false);
  readonly isHovered = signal(false);
  /** After Escape or picking an option, hide the list until the user types again or refocuses. */
  private readonly suggestSuppressed = signal(false);

  /** Tracks control value reactively for computed derivations. */
  private readonly controlValue = signal<string | null>(null);

  readonly effectiveSuggestEnabled = computed(
    () => this.suggestEnabled() || this.multiValueEnabled(),
  );

  readonly filteredSuggestItems = computed(() => {
    if (!this.effectiveSuggestEnabled() || !this.suggestOptions()?.length) return [];
    const raw = String(this.controlValue() ?? '').trim();
    if (raw.length === 0) return [];
    const q = raw.toLowerCase();
    return this.suggestOptions().filter((o) => o.label.toLowerCase().includes(q));
  });

  readonly showSuggestPanel = computed(() => {
    return (
      this.effectiveSuggestEnabled() &&
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
    if (this.multiValueEnabled() && this.chipValues().length > 0) return true;
    const v = this.controlValue();
    return v !== null && v !== undefined && v !== '';
  });

  readonly isLabelFloated = computed(() => {
    return this.isFocused() || this.showPlaceholder() || this.hasValue();
  });

  /** In multi-value mode, placeholder shows only until the first chip exists. */
  readonly activePlaceholder = computed(() => {
    if (!this.showPlaceholder()) return '';
    if (this.multiValueEnabled() && this.chipValues().length > 0) return '';
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
    effect((onCleanup) => {
      const ctrl = this.control();
      this.controlValue.set(ctrl.value);

      const statusSub = ctrl.statusChanges.subscribe(() => {
        this.controlValue.set(ctrl.value);
      });
      const valueSub = ctrl.valueChanges.subscribe((val) => {
        this.controlValue.set(val);
        if (String(val ?? '').length > 0) {
          this.chipDeleteStageIndex.set(null);
        }
        if (this.effectiveSuggestEnabled()) {
          this.suggestSuppressed.set(false);
          this.suggestPanel()?.clampHighlight();
        }
      });

      onCleanup(() => {
        statusSub.unsubscribe();
        valueSub.unsubscribe();
      });
    });

    effect(() => {
      if (!this.multiValueEnabled()) {
        this.chipDeleteStageIndex.set(null);
      }
    });
  }

  isChipDeleteStaged(index: number): boolean {
    return this.chipDeleteStageIndex() === index;
  }

  trackChip(index: number, value: string): string {
    return `${index}\0${value}`;
  }

  onBodyClick(): void {
    if (this.isDisabled()) return;
    this.inputRef()?.nativeElement.focus();
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
    if (this.effectiveSuggestEnabled()) {
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
    if (this.effectiveSuggestEnabled()) {
      this.suggestSuppressed.set(false);
      this.suggestPanel()?.clampHighlight();
    }
  }

  onSuggestKeydown(ev: KeyboardEvent): void {
    if (!this.effectiveSuggestEnabled() || this.isDisabled()) return;

    const panel = this.suggestPanel();
    const open = this.showSuggestPanel();

    if (!open && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      this.suggestSuppressed.set(false);
    }

    const handled = panel ? panel.handleKeydown(ev, open) : false;

    if (this.multiValueEnabled() && ev.key === 'Backspace' && !handled) {
      this.handleMultiValueBackspace(ev);
      return;
    }

    if (this.multiValueEnabled() && ev.key === 'Enter' && !handled) {
      ev.preventDefault();
      this.commitDraftAsChip();
    }
  }

  private focusStagedChipMain(index: number): void {
    afterNextRender(
      () => {
        this.chipRefs().at(index)?.focusMain();
      },
      { injector: this.injector },
    );
  }

  /** Empty draft: first Backspace stages last chip + focuses it; second removes it (from input or chip). */
  private handleMultiValueBackspace(ev: KeyboardEvent): void {
    const draft = String(this.control().value ?? '');
    if (draft !== '') return;

    const chips = this.chipValues();
    const last = chips.length - 1;
    if (last < 0) return;

    ev.preventDefault();
    const staged = this.chipDeleteStageIndex();

    if (staged === null) {
      this.chipDeleteStageIndex.set(last);
      this.focusStagedChipMain(last);
      return;
    }

    if (staged === last) {
      this.chipValues.update((arr) => arr.slice(0, -1));
      this.chipDeleteStageIndex.set(null);
      this.control().markAsDirty();
      queueMicrotask(() => this.inputRef()?.nativeElement.focus());
      return;
    }

    this.chipDeleteStageIndex.set(last);
    this.focusStagedChipMain(last);
  }

  onChipDeletionStagingCancel(): void {
    this.chipDeleteStageIndex.set(null);
    queueMicrotask(() => this.inputRef()?.nativeElement.focus());
  }

  /** Commits trimmed draft text as a chip; no-op if empty. */
  private commitDraftAsChip(): void {
    const raw = String(this.control().value ?? '').trim();
    if (!raw) return;
    this.chipDeleteStageIndex.set(null);
    this.chipValues.update((arr) => [...arr, raw]);
    this.control().setValue('');
    this.control().markAsDirty();
    this.suggestSuppressed.set(true);
    queueMicrotask(() => this.inputRef()?.nativeElement.focus());
  }

  onChipRemove(index: number): void {
    if (this.isDisabled()) return;
    this.chipDeleteStageIndex.set(null);
    this.chipValues.update((arr) => arr.filter((_, i) => i !== index));
    this.control().markAsDirty();
    queueMicrotask(() => this.inputRef()?.nativeElement.focus());
  }

  onSuggestOptionSelected(event: { option: SuggestOption; index: number }): void {
    if (this.isDisabled()) return;
    const text = event.option.value ?? event.option.label;
    if (this.multiValueEnabled()) {
      this.chipDeleteStageIndex.set(null);
      this.chipValues.update((arr) => [...arr, text]);
      this.control().setValue('');
      this.control().markAsDirty();
    } else {
      this.control().setValue(text);
      this.control().markAsDirty();
    }
    this.suggestSuppressed.set(true);
    this.inputRef()?.nativeElement.focus();
  }

  onSuggestDismissed(): void {
    this.suggestSuppressed.set(true);
  }
}
