import { Component, inject } from '@angular/core';
import { FieldChipComponent } from 'components';

import { ChipsPlaygroundStore } from './chips-playground.store';

@Component({
  selector: 'pg-chips-preview',
  standalone: true,
  imports: [FieldChipComponent],
  templateUrl: './chips-preview.component.html',
  styleUrl: './chips-preview.component.scss',
})
export class ChipsPreviewComponent {
  readonly store = inject(ChipsPlaygroundStore);
}
