import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pg-icon-picker',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.scss',
})
export class IconPickerComponent {
  readonly icons = input.required<string[]>();
  readonly selectedIcon = input('');
  readonly customSvg = input('');

  readonly iconSelected = output<string>();
  readonly svgUploaded = output<string>();
  readonly svgCleared = output<void>();

  onIconClick(name: string): void {
    this.iconSelected.emit(name);
  }

  onSvgUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result as string;
      const normalized = this.normalizeSvg(raw);
      this.svgUploaded.emit(normalized);
      input.value = '';
    };
    reader.readAsText(file);
  }

  onClear(): void {
    this.svgCleared.emit();
  }

  private normalizeSvg(svg: string): string {
    return svg
      .replace(/fill="(?!none\b)([^"]+)"/gi, 'fill="currentColor"')
      .replace(/stroke="(?!none\b)([^"]+)"/gi, 'stroke="currentColor"')
      .replace(
        /style="([^"]*)fill\s*:\s*(?!none)[^;}"]+/gi,
        (_, pre) => `style="${pre}fill:currentColor`,
      )
      .replace(
        /style="([^"]*)stroke\s*:\s*(?!none)[^;}"]+/gi,
        (_, pre) => `style="${pre}stroke:currentColor`,
      );
  }
}
