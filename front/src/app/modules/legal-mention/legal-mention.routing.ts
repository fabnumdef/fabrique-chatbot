import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LegalMentionComponent } from './legal-mention.component';

const routes: Routes = [{ path: '', component: LegalMentionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalMentionRoutingModule { }
