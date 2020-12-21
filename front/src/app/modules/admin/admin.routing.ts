import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: 'chatbot',
    component: ChatbotListComponent
  },
  {
    path: 'user',
    component: UserListComponent
  },
  {
    path: '',
    redirectTo: 'chatbot'
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
