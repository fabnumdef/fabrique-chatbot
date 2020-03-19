import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBotFormComponent } from './create-bot-form/create-bot-form.component';
import { CreateBotFormRoutingModule } from './create-bot-form-routing';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileCheckStepComponent } from './file-check-step/file-check-step.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { CustomizationStepComponent } from './customization-step/customization-step.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ResumeStepComponent } from './resume-step/resume-step.component';

@NgModule({
  declarations: [
    CreateBotFormComponent,
    FileCheckStepComponent,
    CustomizationStepComponent,
    ResumeStepComponent
  ],
  imports: [
    CommonModule,
    CreateBotFormRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    ColorPickerModule
  ]
})
export class CreateBotFormModule {
}
