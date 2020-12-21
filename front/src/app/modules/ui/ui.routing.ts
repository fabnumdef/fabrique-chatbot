import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UiComponent } from './ui.component';

const routes: Routes = [
  {
    path: '',
    component: UiComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UiRoutingModule { }
