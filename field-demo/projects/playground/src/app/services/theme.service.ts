import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('dark');

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
    this.applyToDocument();
  }

  setTheme(value: Theme): void {
    this.theme.set(value);
    this.applyToDocument();
  }

  applyToDocument(): void {
    document.documentElement.setAttribute('data-theme', this.theme());
  }
}
