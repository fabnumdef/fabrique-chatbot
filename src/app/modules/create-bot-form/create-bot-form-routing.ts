import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBotFormComponent } from './create-bot-form/create-bot-form.component';

const routes: Routes = [
  {
    path: '',
    component: CreateBotFormComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CreateBotFormRoutingModule { }
