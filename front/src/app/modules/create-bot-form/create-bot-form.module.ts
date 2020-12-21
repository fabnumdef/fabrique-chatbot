import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBotFormComponent } from './create-bot-form/create-bot-form.component';
import { CreateBotFormRoutingModule } from './create-bot-form-routing';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileCheckStepComponent } from './file-check-step/file-check-step.component';
import { CustomizationStepComponent } from './customization-step/customization-step.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ResumeStepComponent } from './resume-step/resume-step.component';
import { DescriptionStepComponent } from './description-step/description-step.component';
import { WarningsDialogComponent } from './warnings-dialog/warnings-dialog.component';
import { ChatbotPreviewComponent } from './customization-step/chatbot-preview/chatbot-preview.component';
import { ChatbotUserFormComponent } from './file-check-step/chatbot-user-form/chatbot-user-form.component';

@NgModule({
  declarations: [
    CreateBotFormComponent,
    FileCheckStepComponent,
    DescriptionStepComponent,
    CustomizationStepComponent,
    ResumeStepComponent,
    WarningsDialogComponent,
    ChatbotPreviewComponent,
    ChatbotUserFormComponent
  ],
  imports: [
    CommonModule,
    CreateBotFormRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ColorPickerModule
  ]
})
export class CreateBotFormModule {
}
