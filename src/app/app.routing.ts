import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: 'create',
    loadChildren: () => import('./modules/create-bot-form/create-bot-form.module').then(m => m.CreateBotFormModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
    // { enableTracing : true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
