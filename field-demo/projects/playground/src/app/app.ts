import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FieldStandardComponent } from 'field-ui';

import { ThemeService } from './services/theme.service';
import { SuggestOptionsService } from './services/suggest-options.service';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { SuggestEditorComponent } from './components/suggest-editor/suggest-editor.component';

const PLAYGROUND_DRAWER_BREAKPOINT_PX = 900;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FieldStandardComponent,
    ToggleSwitchComponent,
    IconPickerComponent,
    SuggestEditorComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '(window:resize)': 'onWindowResize()',
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export class App {
  readonly themeSvc = inject(ThemeService);
  readonly suggestSvc = inject(SuggestOptionsService);

  controlsDrawerOpen = false;

  fieldControl = new FormControl('');

  suggestEnabled = false;

  fieldWidth = 400;
  fieldWidthText: string | number = '400';
  readonly fieldMinWidth = 200;
  readonly fieldMaxWidth = 960;

  showLabel = true;
  labelText = 'Label';

  showPlaceholder = true;
  placeholderText = 'Placeholder';

  showHint = false;
  hintText = 'Tell me a story';

  showSuffix = false;
  suffixText = 'Km';

  showLeadingIcon = false;
  leadingIconName = 'menu';
  leadingIconSvg = '';

  showTrailingIcon = false;
  trailingIconName = 'info';
  trailingIconSvg = '';

  isDisabled = false;
  forceError = false;

  readonly leadingIcons = ['menu', 'search', 'person', 'lock'];
  readonly trailingIcons = ['info', 'close', 'check', 'eye'];

  constructor() {
    this.themeSvc.applyToDocument();
  }

  toggleControlsDrawer(): void {
    this.controlsDrawerOpen = !this.controlsDrawerOpen;
  }

  closeControlsDrawer(): void {
    this.controlsDrawerOpen = false;
  }

  onWindowResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > PLAYGROUND_DRAWER_BREAKPOINT_PX) {
      this.controlsDrawerOpen = false;
    }
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.controlsDrawerOpen) return;
    event.preventDefault();
    this.closeControlsDrawer();
  }

  setFieldWidth(value: number | string): void {
    const n = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (!Number.isFinite(n)) return;
    this.fieldWidth = Math.min(this.fieldMaxWidth, Math.max(this.fieldMinWidth, Math.round(n)));
    this.fieldWidthText = String(this.fieldWidth);
  }

  commitFieldWidthFromInput(): void {
    const raw = String(this.fieldWidthText ?? '').trim();
    if (raw === '') {
      this.fieldWidthText = String(this.fieldWidth);
      return;
    }
    const n = parseFloat(raw.replace(',', '.'));
    if (!Number.isFinite(n)) {
      this.fieldWidthText = String(this.fieldWidth);
      return;
    }
    this.setFieldWidth(n);
  }

  onWidthInputEnter(event: Event): void {
    (event.target as HTMLInputElement).blur();
  }

  onThemeToggle(isLight: boolean): void {
    this.themeSvc.setTheme(isLight ? 'light' : 'dark');
  }

  onDisabledToggle(): void {
    if (this.isDisabled) {
      this.fieldControl.disable();
    } else {
      this.fieldControl.enable();
    }
  }

  onLeadingIconSelected(name: string): void {
    this.leadingIconName = name;
  }

  onLeadingSvgUploaded(svg: string): void {
    this.leadingIconSvg = svg;
  }

  onLeadingSvgCleared(): void {
    this.leadingIconSvg = '';
  }

  onTrailingIconSelected(name: string): void {
    this.trailingIconName = name;
  }

  onTrailingSvgUploaded(svg: string): void {
    this.trailingIconSvg = svg;
  }

  onTrailingSvgCleared(): void {
    this.trailingIconSvg = '';
  }
}
