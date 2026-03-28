import { describe, it, expect, beforeEach } from 'vitest';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { SuggestPanelComponent } from './suggest-panel.component';
import type { SuggestOption } from '../models/suggest-option';

const OPTIONS: SuggestOption[] = [
  { label: 'Apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry' },
];

/** Minimal host to drive the panel's required `items` input. */
@Component({
  standalone: true,
  imports: [SuggestPanelComponent],
  template: `<field-suggest-panel [items]="items()" />`,
})
class HostComponent {
  items = signal<SuggestOption[]>(OPTIONS);
}

function makeKey(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
}

describe('SuggestPanelComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let panel: SuggestPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    panel = fixture.debugElement.children[0].componentInstance as SuggestPanelComponent;
  });

  describe('highlight management', () => {
    it('starts at index 0', () => {
      expect(panel.highlightedIndex()).toBe(0);
    });

    it('resetHighlight() sets index to 0', () => {
      panel.highlightedIndex.set(2);
      panel.resetHighlight();
      expect(panel.highlightedIndex()).toBe(0);
    });

    it('clampHighlight() keeps valid index unchanged', () => {
      panel.highlightedIndex.set(1);
      panel.clampHighlight();
      expect(panel.highlightedIndex()).toBe(1);
    });

    it('clampHighlight() clamps out-of-bounds index to last', () => {
      panel.highlightedIndex.set(99);
      panel.clampHighlight();
      expect(panel.highlightedIndex()).toBe(OPTIONS.length - 1);
    });

    it('clampHighlight() resets to 0 when items is empty', () => {
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      panel.highlightedIndex.set(2);
      panel.clampHighlight();
      expect(panel.highlightedIndex()).toBe(0);
    });
  });

  describe('handleKeydown — panel open', () => {
    it('ArrowDown moves highlight forward', () => {
      panel.highlightedIndex.set(0);
      panel.handleKeydown(makeKey('ArrowDown'), true);
      expect(panel.highlightedIndex()).toBe(1);
    });

    it('ArrowDown does not go past last item', () => {
      panel.highlightedIndex.set(OPTIONS.length - 1);
      panel.handleKeydown(makeKey('ArrowDown'), true);
      expect(panel.highlightedIndex()).toBe(OPTIONS.length - 1);
    });

    it('ArrowUp moves highlight backward', () => {
      panel.highlightedIndex.set(2);
      panel.handleKeydown(makeKey('ArrowUp'), true);
      expect(panel.highlightedIndex()).toBe(1);
    });

    it('ArrowUp does not go below 0', () => {
      panel.highlightedIndex.set(0);
      panel.handleKeydown(makeKey('ArrowUp'), true);
      expect(panel.highlightedIndex()).toBe(0);
    });

    it('Home sets highlight to 0', () => {
      panel.highlightedIndex.set(2);
      panel.handleKeydown(makeKey('Home'), true);
      expect(panel.highlightedIndex()).toBe(0);
    });

    it('End sets highlight to last', () => {
      panel.highlightedIndex.set(0);
      panel.handleKeydown(makeKey('End'), true);
      expect(panel.highlightedIndex()).toBe(OPTIONS.length - 1);
    });

    it('Enter emits optionSelected for highlighted item', () => {
      panel.highlightedIndex.set(1);
      let emitted: { option: SuggestOption; index: number } | undefined;
      panel.optionSelected.subscribe((e) => (emitted = e));
      panel.handleKeydown(makeKey('Enter'), true);
      expect(emitted).toEqual({ option: OPTIONS[1], index: 1 });
    });

    it('Escape emits dismissed', () => {
      let dismissed = false;
      panel.dismissed.subscribe(() => (dismissed = true));
      panel.handleKeydown(makeKey('Escape'), true);
      expect(dismissed).toBe(true);
    });

    it('returns true for handled keys', () => {
      expect(panel.handleKeydown(makeKey('ArrowDown'), true)).toBe(true);
      expect(panel.handleKeydown(makeKey('ArrowUp'), true)).toBe(true);
      expect(panel.handleKeydown(makeKey('Home'), true)).toBe(true);
      expect(panel.handleKeydown(makeKey('End'), true)).toBe(true);
      expect(panel.handleKeydown(makeKey('Escape'), true)).toBe(true);
    });

    it('returns false for unhandled keys', () => {
      expect(panel.handleKeydown(makeKey('Tab'), true)).toBe(false);
    });
  });

  describe('handleKeydown — panel closed', () => {
    it('ArrowDown sets highlight to 0 and returns true', () => {
      panel.highlightedIndex.set(2);
      const result = panel.handleKeydown(makeKey('ArrowDown'), false);
      expect(panel.highlightedIndex()).toBe(0);
      expect(result).toBe(true);
    });

    it('ArrowUp sets highlight to last item and returns true', () => {
      panel.highlightedIndex.set(0);
      const result = panel.handleKeydown(makeKey('ArrowUp'), false);
      expect(panel.highlightedIndex()).toBe(OPTIONS.length - 1);
      expect(result).toBe(true);
    });

    it('Escape returns false when panel is closed', () => {
      expect(panel.handleKeydown(makeKey('Escape'), false)).toBe(false);
    });

    it('Enter returns false when panel is closed', () => {
      expect(panel.handleKeydown(makeKey('Enter'), false)).toBe(false);
    });
  });

  describe('activeDescendantId', () => {
    it('returns an id string when items are present', () => {
      panel.highlightedIndex.set(0);
      expect(panel.activeDescendantId()).toMatch(/^fldsug-\d+-opt-0$/);
    });

    it('returns null when items is empty', () => {
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      expect(panel.activeDescendantId()).toBeNull();
    });
  });
});
