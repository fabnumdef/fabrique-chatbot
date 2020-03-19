import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticatedLayoutComponent } from './components/authenticated-layout/authenticated-layout.component';
import { NotAuthenticatedLayoutComponent } from './components/not-authenticated-layout/not-authenticated-layout.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ToastrModule.forRoot()
  ],
  declarations: [
  AuthenticatedLayoutComponent,
  NotAuthenticatedLayoutComponent,
  HeaderComponent,
  FooterComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ]
})
export class CoreModule {
}
