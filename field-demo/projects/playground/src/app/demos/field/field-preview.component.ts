import { Component, inject } from '@angular/core';
import { FieldStandardComponent } from 'components';

import { FieldPlaygroundStore } from './field-playground.store';
import { SuggestOptionsService } from '../../services/suggest-options.service';

@Component({
  selector: 'pg-field-preview',
  standalone: true,
  imports: [FieldStandardComponent],
  templateUrl: './field-preview.component.html',
  styleUrl: './field-preview.component.scss',
})
export class FieldPreviewComponent {
  readonly store = inject(FieldPlaygroundStore);
  readonly suggestSvc = inject(SuggestOptionsService);
}
