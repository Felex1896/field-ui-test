import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

export type FieldState = 'default' | 'hover' | 'active' | 'error' | 'disabled';

export interface FieldSuggestOption {
  label: string;
  /** If omitted, `label` is written to the control when the option is chosen. */
  value?: string;
}

let fieldStandardSuggestSeq = 0;

@Component({
  selector: 'app-field-standard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './field-standard.component.html',
  styleUrl: './field-standard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldStandardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() control: FormControl = new FormControl('');
  @Input() label = 'Label';
  @Input() showLabel = true;
  @Input() placeholder = 'Placeholder';
  @Input() showPlaceholder = true;
  @Input() hint = '';
  @Input() showHint = false;
  @Input() suffix = '';
  @Input() showSuffix = false;
  @Input() showLeadingIcon = false;
  @Input() leadingIconName = 'menu';
  @Input() leadingIconSvg = '';
  @Input() showTrailingIcon = false;
  @Input() trailingIconName = 'info';
  @Input() trailingIconSvg = '';
  @Input() forceError = false;

  /** When true, shows a Figma-style option list under the field while focused after the user has typed at least one character; options match by label substring (case-insensitive). */
  @Input() suggestEnabled = false;
  @Input() suggestOptions: FieldSuggestOption[] = [];

  @ViewChild('fieldInput') private inputRef?: ElementRef<HTMLInputElement>;

  readonly suggestInstanceId = `fldsug-${++fieldStandardSuggestSeq}`;

  isFocused = false;
  isHovered = false;
  highlightedSuggestIndex = 0;
  /** After Escape or picking an option, hide the list until the user types again or refocuses. */
  private suggestSuppressed = false;

  private statusSub?: Subscription;
  private valueSub?: Subscription;

  constructor(
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

  get suggestListboxId(): string {
    return `${this.suggestInstanceId}-listbox`;
  }

  get filteredSuggestItems(): FieldSuggestOption[] {
    if (!this.suggestEnabled || !this.suggestOptions?.length) return [];
    const raw = String(this.control.value ?? '').trim();
    if (raw.length === 0) return [];
    const q = raw.toLowerCase();
    return this.suggestOptions.filter((o) => o.label.toLowerCase().includes(q));
  }

  get showSuggestPanel(): boolean {
    return (
      this.suggestEnabled &&
      !this.isDisabled &&
      this.isFocused &&
      !this.suggestSuppressed &&
      this.filteredSuggestItems.length > 0
    );
  }

  get activeSuggestOptionId(): string | null {
    if (!this.showSuggestPanel || !this.filteredSuggestItems[this.highlightedSuggestIndex]) {
      return null;
    }
    return `${this.suggestInstanceId}-opt-${this.highlightedSuggestIndex}`;
  }

  safeLeadingIconSvg(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.leadingIconSvg);
  }

  safeTrailingIconSvg(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.trailingIconSvg);
  }

  ngOnInit(): void {
    this.statusSub = this.control.statusChanges.subscribe(() => {
      this.cdr.markForCheck();
    });
    this.valueSub = this.control.valueChanges.subscribe(() => {
      if (this.suggestEnabled) {
        this.suggestSuppressed = false;
        this.clampSuggestHighlight();
      }
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['forceError'] || changes['control'] || changes['suggestEnabled'] || changes['suggestOptions']) {
      this.clampSuggestHighlight();
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
    this.valueSub?.unsubscribe();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.isDisabled) {
      this.isHovered = true;
      this.cdr.markForCheck();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered = false;
    this.cdr.markForCheck();
  }

  onFocus(): void {
    if (!this.isDisabled) {
      this.isFocused = true;
      this.suggestSuppressed = false;
      this.highlightedSuggestIndex = 0;
      this.clampSuggestHighlight();
      this.cdr.markForCheck();
    }
  }

  onBlur(): void {
    if (this.suggestEnabled) {
      setTimeout(() => {
        if (!this.host.nativeElement.contains(document.activeElement)) {
          this.isFocused = false;
          this.suggestSuppressed = false;
          this.cdr.markForCheck();
        }
      }, 0);
    } else {
      this.isFocused = false;
      this.cdr.markForCheck();
    }
  }

  onSuggestInput(): void {
    if (this.suggestEnabled) {
      this.suggestSuppressed = false;
      this.clampSuggestHighlight();
      this.cdr.markForCheck();
    }
  }

  onSuggestKeydown(ev: KeyboardEvent): void {
    if (!this.suggestEnabled || this.isDisabled) return;

    const open = this.showSuggestPanel;
    const count = this.filteredSuggestItems.length;

    switch (ev.key) {
      case 'ArrowDown':
        if (count === 0) return;
        ev.preventDefault();
        if (!open) {
          this.suggestSuppressed = false;
          this.highlightedSuggestIndex = 0;
        } else {
          this.highlightedSuggestIndex = Math.min(count - 1, this.highlightedSuggestIndex + 1);
        }
        this.cdr.markForCheck();
        break;
      case 'ArrowUp':
        if (count === 0) return;
        ev.preventDefault();
        if (!open) {
          this.suggestSuppressed = false;
          this.highlightedSuggestIndex = count - 1;
        } else {
          this.highlightedSuggestIndex = Math.max(0, this.highlightedSuggestIndex - 1);
        }
        this.cdr.markForCheck();
        break;
      case 'Enter':
        if (open && this.filteredSuggestItems[this.highlightedSuggestIndex]) {
          ev.preventDefault();
          this.selectSuggestOption(
            this.filteredSuggestItems[this.highlightedSuggestIndex],
            this.highlightedSuggestIndex,
          );
        }
        break;
      case 'Escape':
        if (open) {
          ev.preventDefault();
          this.suggestSuppressed = true;
          this.cdr.markForCheck();
        }
        break;
      case 'Home':
        if (open && count > 0) {
          ev.preventDefault();
          this.highlightedSuggestIndex = 0;
          this.cdr.markForCheck();
        }
        break;
      case 'End':
        if (open && count > 0) {
          ev.preventDefault();
          this.highlightedSuggestIndex = count - 1;
          this.cdr.markForCheck();
        }
        break;
      default:
        break;
    }
  }

  onSuggestOptionPointerDown(ev: Event): void {
    ev.preventDefault();
  }

  onSuggestOptionMouseEnter(index: number): void {
    this.highlightedSuggestIndex = index;
    this.cdr.markForCheck();
  }

  selectSuggestOption(opt: FieldSuggestOption, index: number): void {
    if (this.isDisabled) return;
    this.control.setValue(opt.value ?? opt.label);
    this.control.markAsDirty();
    this.suggestSuppressed = true;
    this.highlightedSuggestIndex = index;
    this.inputRef?.nativeElement.focus();
    this.cdr.markForCheck();
  }

  trackSuggestOption(index: number, opt: FieldSuggestOption): string {
    return `${opt.label}\0${opt.value ?? ''}\0${index}`;
  }

  private clampSuggestHighlight(): void {
    const n = this.filteredSuggestItems.length;
    if (n === 0) {
      this.highlightedSuggestIndex = 0;
    } else if (this.highlightedSuggestIndex >= n) {
      this.highlightedSuggestIndex = n - 1;
    }
  }

  get isDisabled(): boolean {
    return this.control.disabled;
  }

  get hasError(): boolean {
    return this.forceError || (this.control.invalid && (this.control.dirty || this.control.touched));
  }

  get hasValue(): boolean {
    const v = this.control.value;
    return v !== null && v !== undefined && v !== '';
  }

  get isLabelFloated(): boolean {
    return this.isFocused || this.showPlaceholder || this.hasValue;
  }

  get activePlaceholder(): string {
    if (!this.showPlaceholder) return '';
    return this.placeholder;
  }

  get state(): FieldState {
    if (this.isDisabled) return 'disabled';
    if (this.hasError) return 'error';
    if (this.isFocused) return 'active';
    if (this.isHovered) return 'hover';
    return 'default';
  }

  get hintColor(): string {
    if (this.isDisabled) return 'disabled';
    if (this.hasError) return 'error';
    return 'default';
  }
}
