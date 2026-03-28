import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldIconRegistry } from './field-icon-registry.service';

@Component({
  selector: 'field-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    @if (customSvg()) {
      <span class="icon-inline" [innerHTML]="safeSvg()"></span>
    } @else if (registrySvg()) {
      <svg
        class="icon-svg"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        [innerHTML]="safeRegistrySvg()"
      ></svg>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--field-icon-size, 24px);
      height: var(--field-icon-size, 24px);
      color: inherit;
    }
    .icon-inline {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--field-icon-size, 24px);
      height: var(--field-icon-size, 24px);
      color: inherit;
    }
    .icon-inline :deep(svg) {
      width: 100%;
      height: 100%;
    }
    .icon-svg {
      width: var(--field-icon-size, 24px);
      height: var(--field-icon-size, 24px);
    }
  `,
})
export class FieldIconComponent {
  private readonly registry = inject(FieldIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  /** Icon name from the registry (e.g. 'menu', 'search'). Ignored when `svg` is set. */
  readonly name = input('');
  /** Full custom SVG markup. Takes precedence over `name`. */
  readonly svg = input('');

  readonly customSvg = computed(() => this.svg().length > 0);

  readonly registrySvg = computed(() => {
    if (this.customSvg()) return null;
    return this.registry.get(this.name());
  });

  readonly safeSvg = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.svg()));

  readonly safeRegistrySvg = computed(() => {
    const content = this.registrySvg();
    return content ? this.sanitizer.bypassSecurityTrustHtml(content) : null;
  });
}
