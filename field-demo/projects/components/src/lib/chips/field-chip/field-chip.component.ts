import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldIconComponent } from '../../core/icon/field-icon.component';

export type ChipAppearance = 'transparent' | 'filled' | 'no-bg' | 'outlined';
export type ChipTone = 'neutral' | 'primary' | 'danger';

@Component({
  selector: 'field-chip',
  standalone: true,
  imports: [CommonModule, FieldIconComponent],
  templateUrl: './field-chip.component.html',
  styleUrl: './field-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldChipComponent {
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  readonly label = input('Label');
  readonly appearance = input<ChipAppearance>('transparent');
  readonly tone = input<ChipTone>('neutral');
  readonly disabled = input(false);
  readonly showLeadingIcon = input(false);
  readonly leadingIconName = input('add');
  readonly leadingIconSvg = input('');
  readonly removable = input(true);

  /**
   * When true (e.g. multi-value field staged delete), shows focus ring and Backspace removes the chip.
   */
  readonly deletionStaged = input(false);

  readonly remove = output<void>();
  readonly chipClick = output<void>();
  /** Emitted when Escape is pressed while `deletionStaged` — parent should clear staging and refocus the input. */
  readonly deletionStagingCancel = output<void>();

  /** Primary/danger fills apply only when appearance is `filled` (matches Figma matrix). */
  readonly paletteTone = computed<ChipTone>(() => {
    const t = this.tone();
    if (t === 'neutral') return 'neutral';
    return this.appearance() === 'filled' ? t : 'neutral';
  });

  onMainClick(): void {
    if (this.disabled()) return;
    this.chipClick.emit();
  }

  onRemoveClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled()) return;
    this.remove.emit();
  }

  /** Moves keyboard focus to the chip label control (for staged delete in multi-value fields). */
  focusMain(): void {
    const btn = this.hostEl.nativeElement.querySelector('.chip-main');
    (btn as HTMLElement | null)?.focus();
  }

  onMainKeydown(ev: KeyboardEvent): void {
    if (this.disabled() || !this.deletionStaged()) return;
    if (ev.key === 'Backspace') {
      ev.preventDefault();
      this.remove.emit();
      return;
    }
    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.deletionStagingCancel.emit();
    }
  }
}
