import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';
import { AdminRoutingModule } from './admin.routing';
import { MaterialModule } from '../material/material.module';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ChatbotListComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class AdminModule { }
