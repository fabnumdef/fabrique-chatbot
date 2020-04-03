import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-description-step',
  templateUrl: './description-step.component.html',
  styleUrls: ['./description-step.component.scss']
})
export class DescriptionStepComponent implements OnInit {

  @Input() formGroup: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
  }

  get controls() {
    return this.formGroup.controls;
  }

  getErrorMessage(field) {
    if (field === 'problematic') {
      return this.formGroup.controls.problematic.hasError('required') ? 'Vous n\'avez pas saisi de problématique pour votre chatbot.' :
        this.formGroup.controls.problematic.hasError('maxlength') ? 'Vous avez dépassé le nombre de caractères maximum autorisés' : '';
    }
    if (field === 'audience') {
      return this.formGroup.controls.audience.hasError('required') ? 'Vous n\'avez pas saisi le public visé.' :
        this.formGroup.controls.audience.hasError('maxlength') ? 'Vous avez dépassé le nombre de caractères maximum autorisés' : '';
    }
    if (field === 'solution') {
      return this.formGroup.controls.solution.hasError('required') ? 'Vous n\'avez pas saisi le but de votre chatbot.' :
        this.formGroup.controls.solution.hasError('maxlength') ? 'Vous avez dépassé le nombre de caractères maximum autorisés' : '';
    }
    return '';
  }

}
