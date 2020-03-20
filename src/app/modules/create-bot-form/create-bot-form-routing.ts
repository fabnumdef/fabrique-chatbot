import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBotFormComponent } from './create-bot-form/create-bot-form.component';
import { SuccessStepComponent } from './success-step/success-step.component';

const routes: Routes = [
  {
    path: '',
    component: CreateBotFormComponent
  },
  {
    path: 'success',
    component: SuccessStepComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CreateBotFormRoutingModule { }
