import { describe, it, expect, beforeEach } from 'vitest';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FieldChipComponent } from './field-chip.component';

@Component({
  standalone: true,
  imports: [FieldChipComponent],
  template: `
    <field-chip
      [disabled]="disabled()"
      [tone]="tone()"
      [appearance]="appearance()"
      (remove)="removed.set(true)"
      (chipClick)="clicked.set(true)"
    />
  `,
})
class HostComponent {
  disabled = signal(false);
  tone = signal<'neutral' | 'primary' | 'danger'>('neutral');
  appearance = signal<'transparent' | 'filled' | 'no-bg' | 'outlined'>('transparent');
  removed = signal(false);
  clicked = signal(false);
}

describe('FieldChipComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let chip: FieldChipComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    chip = fixture.debugElement.children[0].componentInstance as FieldChipComponent;
  });

  it('adds chip-disabled class when disabled input is true', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const shell = fixture.nativeElement.querySelector('.chip-shell') as HTMLElement | null;
    expect(shell?.classList.contains('chip-disabled')).toBe(true);
  });

  it('paletteTone stays neutral when tone is primary but appearance is not filled', () => {
    host.tone.set('primary');
    host.appearance.set('transparent');
    fixture.detectChanges();
    expect(chip.paletteTone()).toBe('neutral');
  });

  it('paletteTone is primary when tone is primary and appearance is filled', () => {
    host.tone.set('primary');
    host.appearance.set('filled');
    fixture.detectChanges();
    expect(chip.paletteTone()).toBe('primary');
  });

  it('emits remove when remove button is clicked', () => {
    const removeBtn = fixture.nativeElement.querySelector('.chip-remove') as HTMLButtonElement;
    expect(removeBtn).toBeTruthy();
    removeBtn.click();
    fixture.detectChanges();
    expect(host.removed()).toBe(true);
  });

  it('emits chipClick when main button is clicked', () => {
    const mainBtn = fixture.nativeElement.querySelector('.chip-main') as HTMLButtonElement;
    mainBtn.click();
    fixture.detectChanges();
    expect(host.clicked()).toBe(true);
  });
});
