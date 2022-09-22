import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { PublicPreFooterComponent } from './components/public-pre-footer/public-pre-footer.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    HeaderComponent,
    FooterComponent,
    PublicPreFooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    ConfirmDialogComponent,
    HeaderComponent,
    FooterComponent,
    PublicPreFooterComponent
  ],
  providers: [
    {provide: Window, useValue: window},
  ]
})
export class SharedModule { }
