import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';

import type { SuggestOption } from '../models/suggest-option';
export type { SuggestOption } from '../models/suggest-option';

let suggestPanelSeq = 0;

@Component({
  selector: 'field-suggest-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './suggest-panel.component.html',
  styleUrl: './suggest-panel.component.scss',
})
export class SuggestPanelComponent {
  readonly items = input.required<SuggestOption[]>();
  readonly selectedValue = input<string | null>(null);

  readonly optionSelected = output<{ option: SuggestOption; index: number }>();
  readonly dismissed = output<void>();

  private readonly instanceId = `fldsug-${++suggestPanelSeq}`;

  readonly listboxId = `${this.instanceId}-listbox`;
  readonly highlightedIndex = signal(0);

  readonly activeDescendantId = computed(() => {
    const items = this.items();
    if (!items.length || this.highlightedIndex() >= items.length) return null;
    return `${this.instanceId}-opt-${this.highlightedIndex()}`;
  });

  optionId(index: number): string {
    return `${this.instanceId}-opt-${index}`;
  }

  onOptionPointerDown(ev: Event): void {
    ev.preventDefault();
  }

  onOptionMouseEnter(index: number): void {
    this.highlightedIndex.set(index);
  }

  onOptionClick(opt: SuggestOption, index: number): void {
    this.optionSelected.emit({ option: opt, index });
  }

  trackOption(index: number, opt: SuggestOption): string {
    return `${opt.label}\0${opt.value ?? ''}\0${index}`;
  }

  /** Called by the parent field component to handle keyboard events while the panel is open. */
  handleKeydown(ev: KeyboardEvent, panelOpen: boolean): boolean {
    const count = this.items().length;

    switch (ev.key) {
      case 'ArrowDown':
        if (count === 0) return false;
        ev.preventDefault();
        if (!panelOpen) {
          this.highlightedIndex.set(0);
        } else {
          this.highlightedIndex.update((i) => Math.min(count - 1, i + 1));
        }
        return true;
      case 'ArrowUp':
        if (count === 0) return false;
        ev.preventDefault();
        if (!panelOpen) {
          this.highlightedIndex.set(count - 1);
        } else {
          this.highlightedIndex.update((i) => Math.max(0, i - 1));
        }
        return true;
      case 'Enter':
        if (panelOpen && this.items()[this.highlightedIndex()]) {
          ev.preventDefault();
          this.optionSelected.emit({
            option: this.items()[this.highlightedIndex()],
            index: this.highlightedIndex(),
          });
          return true;
        }
        return false;
      case 'Escape':
        if (panelOpen) {
          ev.preventDefault();
          this.dismissed.emit();
          return true;
        }
        return false;
      case 'Home':
        if (panelOpen && count > 0) {
          ev.preventDefault();
          this.highlightedIndex.set(0);
          return true;
        }
        return false;
      case 'End':
        if (panelOpen && count > 0) {
          ev.preventDefault();
          this.highlightedIndex.set(count - 1);
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  resetHighlight(): void {
    this.highlightedIndex.set(0);
  }

  clampHighlight(): void {
    const n = this.items().length;
    if (n === 0) {
      this.highlightedIndex.set(0);
    } else if (this.highlightedIndex() >= n) {
      this.highlightedIndex.set(n - 1);
    }
  }
}
