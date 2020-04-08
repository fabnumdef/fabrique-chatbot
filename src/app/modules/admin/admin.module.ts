import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';
import { AdminRoutingModule } from './admin.routing';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [ChatbotListComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule
  ]
})
export class AdminModule { }
