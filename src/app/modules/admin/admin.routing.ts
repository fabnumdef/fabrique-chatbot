import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';

const routes: Routes = [
  {
    path: 'chatbot',
    component: ChatbotListComponent
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
