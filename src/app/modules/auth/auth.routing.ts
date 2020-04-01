import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpSuccessComponent } from './sign-up/sign-up-success/sign-up-success.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordSuccessComponent } from './reset-password/reset-password-success/reset-password-success.component';
import { ForgotPasswordSuccessComponent } from './forgot-password/forgot-password-success/forgot-password-success.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {path: 'login', component: SignInComponent},
      {path: 'sign_up', component: SignUpComponent},
      {path: 'sign_up/success', component: SignUpSuccessComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'reset-password/success', component: ResetPasswordSuccessComponent},
      {path: 'forgot-password', component: ForgotPasswordComponent},
      {path: 'forgot-password/success', component: ForgotPasswordSuccessComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
