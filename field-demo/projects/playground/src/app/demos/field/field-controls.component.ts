import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IconPickerComponent } from '../../components/icon-picker/icon-picker.component';
import { SuggestEditorComponent } from '../../components/suggest-editor/suggest-editor.component';
import { ToggleSwitchComponent } from '../../components/toggle-switch/toggle-switch.component';
import { FieldPlaygroundStore } from './field-playground.store';

@Component({
  selector: 'pg-field-controls',
  standalone: true,
  imports: [FormsModule, ToggleSwitchComponent, IconPickerComponent, SuggestEditorComponent],
  templateUrl: './field-controls.component.html',
})
export class FieldControlsComponent {
  readonly store = inject(FieldPlaygroundStore);
}
