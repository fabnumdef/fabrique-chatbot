import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthRoutingModule } from './auth.routing';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpSuccessComponent } from './sign-up/sign-up-success/sign-up-success.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordSuccessComponent } from './forgot-password/forgot-password-success/forgot-password-success.component';
import { ResetPasswordSuccessComponent } from './reset-password/reset-password-success/reset-password-success.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SignUpSuccessComponent,
    AuthLayoutComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ForgotPasswordSuccessComponent,
    ResetPasswordSuccessComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule {
}
