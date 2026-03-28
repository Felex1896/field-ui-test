import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pg-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true,
    },
  ],
  template: `
    <label class="toggle">
      <input type="checkbox" [checked]="checked" (change)="onToggle($event)" />
      <span class="toggle-track"></span>
    </label>
  `,
  styleUrl: './toggle-switch.component.scss',
})
export class ToggleSwitchComponent implements ControlValueAccessor {
  checked = false;
  private onChange: (val: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (val: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onToggle(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.checked = el.checked;
    this.onChange(this.checked);
    this.onTouched();
  }
}
