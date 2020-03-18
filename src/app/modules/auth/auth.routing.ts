import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpSuccessComponent } from './sign-up/sign-up-success/sign-up-success.component';

const routes: Routes = [
  {path: 'sign_up', component: SignUpComponent},
  {path: 'sign_up/success', component: SignUpSuccessComponent},
  {path: 'sign_in', component: SignInComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
