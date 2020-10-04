import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';
import { AdminRoutingModule } from './admin.routing';
import { MaterialModule } from '../material/material.module';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../shared/shared.module';
import { LaunchChatbotUpdateDialogComponent } from './chatbot-list/launch-chatbot-update-dialog/launch-chatbot-update-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditChatbotDialogComponent } from './chatbot-list/edit-chatbot-dialog/edit-chatbot-dialog.component';
import { QueueListComponent } from './chatbot-list/queue-list/queue-list.component';

@NgModule({
  declarations: [
    ChatbotListComponent,
    UserListComponent,
    LaunchChatbotUpdateDialogComponent,
    EditChatbotDialogComponent,
    QueueListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
