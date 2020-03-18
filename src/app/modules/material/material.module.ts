import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [],
  imports: [
    MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule
  ],
  exports: [
    MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule
  ]
})
export class MaterialModule { }
