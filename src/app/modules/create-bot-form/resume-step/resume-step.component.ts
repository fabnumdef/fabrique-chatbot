import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ChatbotConfiguration } from '../../../core/models';

@Component({
  selector: 'app-resume-step',
  templateUrl: './resume-step.component.html',
  styleUrls: ['./resume-step.component.scss']
})
export class ResumeStepComponent implements OnInit {

  @Input() formArray: FormArray;

  constructor() {
  }

  ngOnInit(): void {
  }

  generateChatbot() {
    const chatbotConfiguration: ChatbotConfiguration = this.formArray.getRawValue().reduce((obj1, obj2) => Object.assign(obj1, obj2));
    console.log(chatbotConfiguration);
  }

}
