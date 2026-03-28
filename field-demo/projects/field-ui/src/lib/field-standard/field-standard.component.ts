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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

export type FieldState = 'default' | 'hover' | 'active' | 'error' | 'disabled';

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

  isFocused = false;
  isHovered = false;

  private statusSub?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['forceError'] || changes['control']) {
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
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
      this.cdr.markForCheck();
    }
  }

  onBlur(): void {
    this.isFocused = false;
    this.cdr.markForCheck();
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
