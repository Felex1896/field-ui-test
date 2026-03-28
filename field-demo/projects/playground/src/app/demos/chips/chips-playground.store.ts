import { Injectable } from '@angular/core';
import type { ChipAppearance, ChipTone } from 'components';

@Injectable()
export class ChipsPlaygroundStore {
  chipLabel = 'Label';
  chipAppearance: ChipAppearance = 'transparent';
  chipTone: ChipTone = 'neutral';
  chipDisabled = false;
  chipShowLeading = false;
  chipRemovable = true;
  chipLeadingIconName = 'add';
  chipLeadingIconSvg = '';

  readonly chipLeadingIcons = ['add', 'menu', 'search', 'person', 'lock'];

  readonly chipAppearanceOptions = [
    { value: 'transparent' as const, label: 'Transparent' },
    { value: 'filled' as const, label: 'Filled' },
    { value: 'no-bg' as const, label: 'No BG' },
    { value: 'outlined' as const, label: 'Outlined' },
  ];

  readonly chipToneOptions = [
    { value: 'neutral' as const, label: 'Neutral' },
    { value: 'primary' as const, label: 'Primary' },
    { value: 'danger' as const, label: 'Danger' },
  ];

  /** Primary/danger map to Figma filled chips; neutral resets to transparent. */
  onChipToneChange(tone: ChipTone): void {
    this.chipTone = tone;
    if (tone === 'primary' || tone === 'danger') {
      this.chipAppearance = 'filled';
    } else {
      this.chipAppearance = 'transparent';
    }
  }

  /** Primary/danger tints apply only to Filled; other appearances force neutral. */
  onChipAppearanceChange(appearance: ChipAppearance): void {
    this.chipAppearance = appearance;
    if (appearance !== 'filled') {
      this.chipTone = 'neutral';
    }
  }

  onChipLeadingIconSelected(name: string): void {
    this.chipLeadingIconName = name;
  }

  onChipLeadingSvgUploaded(svg: string): void {
    this.chipLeadingIconSvg = svg;
  }

  onChipLeadingSvgCleared(): void {
    this.chipLeadingIconSvg = '';
  }
}
