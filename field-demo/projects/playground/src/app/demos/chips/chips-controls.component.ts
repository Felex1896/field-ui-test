import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IconPickerComponent } from '../../components/icon-picker/icon-picker.component';
import { ToggleSwitchComponent } from '../../components/toggle-switch/toggle-switch.component';
import { ChipsPlaygroundStore } from './chips-playground.store';

@Component({
  selector: 'pg-chips-controls',
  standalone: true,
  imports: [FormsModule, ToggleSwitchComponent, IconPickerComponent],
  templateUrl: './chips-controls.component.html',
})
export class ChipsControlsComponent {
  readonly store = inject(ChipsPlaygroundStore);
}
