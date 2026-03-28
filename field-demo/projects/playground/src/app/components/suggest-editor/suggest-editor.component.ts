import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SuggestOptionsService } from '../../services/suggest-options.service';

@Component({
  selector: 'pg-suggest-editor',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './suggest-editor.component.html',
  styleUrl: './suggest-editor.component.scss',
})
export class SuggestEditorComponent {
  readonly svc = inject(SuggestOptionsService);
}
