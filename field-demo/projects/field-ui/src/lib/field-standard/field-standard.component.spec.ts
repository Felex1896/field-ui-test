import { describe, it, expect, beforeEach } from 'vitest';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldStandardComponent } from './field-standard.component';
import type { SuggestOption } from '../models/suggest-option';

const SUGGEST_OPTIONS: SuggestOption[] = [
  { label: 'Apple' },
  { label: 'Apricot' },
  { label: 'Banana' },
];

@Component({
  standalone: true,
  imports: [FieldStandardComponent, ReactiveFormsModule],
  template: `
    <app-field-standard [control]="control()" [suggestEnabled]="true" [suggestOptions]="options" />
  `,
})
class HostComponent {
  control = signal(new FormControl(''));
  options = SUGGEST_OPTIONS;
}

@Component({
  standalone: true,
  imports: [FieldStandardComponent, ReactiveFormsModule],
  template: `<app-field-standard [control]="ctrl" [forceError]="forceError" />`,
})
class ForceErrorHostComponent {
  ctrl = new FormControl('');
  forceError = false;
}

describe('FieldStandardComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let field: FieldStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, ForceErrorHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    field = fixture.debugElement.children[0].componentInstance as FieldStandardComponent;
  });

  describe('computed state', () => {
    it('shows error state when forceError is true', () => {
      const f2 = TestBed.createComponent(ForceErrorHostComponent);
      f2.componentInstance.forceError = true;
      f2.detectChanges();
      const f2Field = f2.debugElement.children[0].componentInstance as FieldStandardComponent;
      expect(f2Field.hasError()).toBe(true);
      expect(f2Field.state()).toBe('error');
    });

    it('hasValue is false for empty control', () => {
      host.control().setValue('');
      fixture.detectChanges();
      expect(field.hasValue()).toBe(false);
    });

    it('hasValue is true when control has a value', () => {
      host.control().setValue('hello');
      fixture.detectChanges();
      expect(field.hasValue()).toBe(true);
    });

    it('state is active when focused', () => {
      field.isFocused.set(true);
      expect(field.state()).toBe('active');
    });

    it('state is hover when hovered but not focused', () => {
      field.isHovered.set(true);
      expect(field.state()).toBe('hover');
    });

    it('state is default when neither focused nor hovered', () => {
      expect(field.state()).toBe('default');
    });
  });

  describe('suggest filtering', () => {
    it('returns empty when control value is empty', () => {
      host.control().setValue('');
      fixture.detectChanges();
      expect(field.filteredSuggestItems()).toEqual([]);
    });

    it('filters options by label substring (case-insensitive)', () => {
      host.control().setValue('ap');
      fixture.detectChanges();
      expect(field.filteredSuggestItems().map((o) => o.label)).toEqual(['Apple', 'Apricot']);
    });

    it('returns empty when no options match', () => {
      host.control().setValue('zzz');
      fixture.detectChanges();
      expect(field.filteredSuggestItems()).toEqual([]);
    });
  });

  describe('control swap — subscription cleanup', () => {
    it('tracks value from the new control after swap', () => {
      const newCtrl = new FormControl('newValue');
      host.control.set(newCtrl);
      fixture.detectChanges();
      expect(field.hasValue()).toBe(true);
    });

    it('does not react to old control value changes after swap', () => {
      const oldCtrl = host.control();
      const newCtrl = new FormControl('');
      host.control.set(newCtrl);
      fixture.detectChanges();

      oldCtrl.setValue('ghost');
      fixture.detectChanges();
      // new control is still empty, so hasValue should be false
      expect(field.hasValue()).toBe(false);
    });

    it('reacts to new control value changes', () => {
      const newCtrl = new FormControl('');
      host.control.set(newCtrl);
      fixture.detectChanges();

      newCtrl.setValue('typed');
      fixture.detectChanges();
      expect(field.hasValue()).toBe(true);
    });
  });

  describe('suggest suppression', () => {
    it('onSuggestDismissed suppresses the panel', () => {
      field.isFocused.set(true);
      host.control().setValue('ap');
      fixture.detectChanges();

      field.onSuggestDismissed();
      fixture.detectChanges();
      expect(field.showSuggestPanel()).toBe(false);
    });

    it('onFocus clears suppression', () => {
      field.isFocused.set(true);
      host.control().setValue('ap');
      fixture.detectChanges();

      field.onSuggestDismissed();
      fixture.detectChanges();
      expect(field.showSuggestPanel()).toBe(false);

      field.onFocus();
      fixture.detectChanges();
      expect(field.showSuggestPanel()).toBe(true);
    });
  });
});
