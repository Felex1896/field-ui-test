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
    const t = this.theme();
    document.documentElement.setAttribute('data-theme', t);
    document.body.style.backgroundColor = t === 'light' ? '#f5f5f5' : '#1a1a1a';
    document.body.style.color = t === 'light' ? 'rgba(0,0,0,0.87)' : 'rgba(253,253,253,0.9)';
  }
}
