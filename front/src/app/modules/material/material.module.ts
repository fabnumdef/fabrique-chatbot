import { NgModule } from '@angular/core';
import { MatStep, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [],
  imports: [
    MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule,
    MatSelectModule, MatRadioModule, MatDialogModule, MatTableModule, MatProgressBarModule, MatTooltipModule, MatMenuModule,
    MatCheckboxModule, MatStepperModule
  ],
  exports: [
    MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule,
    MatSelectModule, MatRadioModule, MatDialogModule, MatTableModule, MatProgressBarModule, MatTooltipModule, MatMenuModule,
    MatCheckboxModule, MatStepperModule
  ]
})
export class MaterialModule { }
