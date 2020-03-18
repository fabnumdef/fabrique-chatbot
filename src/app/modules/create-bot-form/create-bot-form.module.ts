import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBotFormComponent } from './create-bot-form/create-bot-form.component';
import { CreateBotFormRoutingModule } from './create-bot-form-routing';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileCheckStepComponent } from './file-check-step/file-check-step.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';

@NgModule({
  declarations: [
    CreateBotFormComponent,
    FileCheckStepComponent
  ],
  imports: [
    CommonModule,
    CreateBotFormRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MaterialFileInputModule
  ]
})
export class CreateBotFormModule {
}
