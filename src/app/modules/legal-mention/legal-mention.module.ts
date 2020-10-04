import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalMentionRoutingModule } from './legal-mention.routing';
import { LegalMentionComponent } from './legal-mention.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LegalMentionComponent
  ],
  imports: [
    CommonModule,
    LegalMentionRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class LegalMentionModule { }
