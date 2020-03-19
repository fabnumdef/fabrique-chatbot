import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customization-step',
  templateUrl: './customization-step.component.html',
  styleUrls: ['./customization-step.component.scss']
})
export class CustomizationStepComponent implements OnInit {

  @Input() formGroup: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
  }

  get controls() {
    return this.formGroup.controls;
  }

}
