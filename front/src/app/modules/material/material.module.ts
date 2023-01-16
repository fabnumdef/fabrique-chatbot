import { NgModule } from '@angular/core';
import { MatStep, MatStepperModule } from '@angular/material/stepper';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

@NgModule({
  declarations: [],
  imports: [
    MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule,
    MatSelectModule, MatRadioModule, MatDialogModule, MatTableModule, MatProgressBarModule, MatTooltipModule, MatMenuModule,
    MatCheckboxModule, MatStepperModule, MatCardModule
  ],
  exports: [
    MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule,
    MatSelectModule, MatRadioModule, MatDialogModule, MatTableModule, MatProgressBarModule, MatTooltipModule, MatMenuModule,
    MatCheckboxModule, MatStepperModule, MatCardModule
  ]
})
export class MaterialModule { }
