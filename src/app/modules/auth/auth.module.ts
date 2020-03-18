import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthRoutingModule } from './auth.routing';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent
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
