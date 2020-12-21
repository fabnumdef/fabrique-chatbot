import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiComponent } from './ui.component';
import { UiRoutingModule } from './ui.routing';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [UiComponent],
  imports: [
    CommonModule,
    UiRoutingModule,
    MaterialModule
  ]
})
export class UiModule { }
