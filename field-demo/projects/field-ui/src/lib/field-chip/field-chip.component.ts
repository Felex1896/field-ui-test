import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldIconComponent } from '../icon/field-icon.component';

export type ChipAppearance = 'transparent' | 'filled' | 'no-bg' | 'outlined';
export type ChipTone = 'neutral' | 'primary' | 'danger';
export type ChipVisualState = 'default' | 'hover' | 'pressed' | 'focused' | 'disabled';

@Component({
  selector: 'field-chip',
  standalone: true,
  imports: [CommonModule, FieldIconComponent],
  templateUrl: './field-chip.component.html',
  styleUrl: './field-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(mousedown)': 'onMouseDown()',
    '(mouseup)': 'onMouseUp()',
  },
})
export class FieldChipComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly label = input('Label');
  readonly appearance = input<ChipAppearance>('transparent');
  readonly tone = input<ChipTone>('neutral');
  readonly disabled = input(false);
  readonly showLeadingIcon = input(false);
  readonly leadingIconName = input('add');
  readonly leadingIconSvg = input('');
  readonly removable = input(true);

  readonly remove = output<void>();
  readonly chipClick = output<void>();

  readonly isHovered = signal(false);
  readonly isPressed = signal(false);
  readonly isFocused = signal(false);

  /** Primary/danger fills apply only when appearance is `filled` (matches Figma matrix). */
  readonly paletteTone = computed<ChipTone>(() => {
    const t = this.tone();
    if (t === 'neutral') return 'neutral';
    return this.appearance() === 'filled' ? t : 'neutral';
  });

  readonly visualState = computed<ChipVisualState>(() => {
    if (this.disabled()) return 'disabled';
    if (this.isFocused()) return 'focused';
    if (this.isPressed()) return 'pressed';
    if (this.isHovered()) return 'hover';
    return 'default';
  });

  onMouseEnter(): void {
    if (!this.disabled()) {
      this.isHovered.set(true);
    }
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
    this.isPressed.set(false);
  }

  onMouseDown(): void {
    if (!this.disabled()) {
      this.isPressed.set(true);
    }
  }

  onMouseUp(): void {
    this.isPressed.set(false);
  }

  onFocusIn(): void {
    if (!this.disabled()) {
      this.isFocused.set(true);
    }
  }

  onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.host.nativeElement.contains(next)) {
      return;
    }
    this.isFocused.set(false);
  }

  onMainClick(): void {
    if (this.disabled()) return;
    this.chipClick.emit();
  }

  onRemoveClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled()) return;
    this.remove.emit();
  }
}
