import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ThemeService } from './services/theme.service';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import { ChipsPlaygroundStore } from './demos/chips/chips-playground.store';
import { ChipsControlsComponent } from './demos/chips/chips-controls.component';
import { ChipsPreviewComponent } from './demos/chips/chips-preview.component';
import { FieldPlaygroundStore } from './demos/field/field-playground.store';
import { FieldControlsComponent } from './demos/field/field-controls.component';
import { FieldPreviewComponent } from './demos/field/field-preview.component';

const PLAYGROUND_DRAWER_BREAKPOINT_PX = 900;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    ToggleSwitchComponent,
    FieldPreviewComponent,
    FieldControlsComponent,
    ChipsPreviewComponent,
    ChipsControlsComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [FieldPlaygroundStore, ChipsPlaygroundStore],
  host: {
    '(window:resize)': 'onWindowResize()',
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export class App {
  readonly themeSvc = inject(ThemeService);

  readonly selectedComponent = signal<'field' | 'chips'>('field');

  controlsDrawerOpen = false;

  constructor() {
    this.themeSvc.applyToDocument();
  }

  setComponent(which: 'field' | 'chips'): void {
    this.selectedComponent.set(which);
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

  onThemeToggle(isLight: boolean): void {
    this.themeSvc.setTheme(isLight ? 'light' : 'dark');
  }
}
