import { Injectable } from '@angular/core';
import { BUILT_IN_ICONS } from './built-in-icons';

@Injectable({ providedIn: 'root' })
export class FieldIconRegistry {
  private readonly icons = new Map<string, string>(BUILT_IN_ICONS);

  /** Register a custom icon by name (SVG inner content for a 24x24 viewBox). */
  register(name: string, svgContent: string): void {
    this.icons.set(name, svgContent);
  }

  /** Returns SVG inner content for the given icon name, or `null` if not registered. */
  get(name: string): string | null {
    return this.icons.get(name) ?? null;
  }

  has(name: string): boolean {
    return this.icons.has(name);
  }
}
