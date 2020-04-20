import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatbotService } from '@service/chatbot.service';
import { ChatbotConfiguration } from '@model/chatbot-configuration.model';

@Component({
  selector: 'app-resume-step',
  templateUrl: './resume-step.component.html',
  styleUrls: ['./resume-step.component.scss']
})
export class ResumeStepComponent implements OnInit {

  @Input() formArray: FormArray;
  success: number;

  constructor(public chatbotService: ChatbotService,
              private _router: Router,
              private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  generateChatbot() {

    const chatbotConfiguration: ChatbotConfiguration = this.formArray
      .getRawValue()
      .reduce((obj1, obj2) => Object.assign(obj1, obj2));
    console.log(chatbotConfiguration);
    this.chatbotService.createChatbot(chatbotConfiguration).subscribe(() => {
      //this._router.navigate(['./success'], {relativeTo: this._route});
      this.success = 1;
    }, err => {
      // TODO Delete when BACK is OK
      console.log('Erreur lors de l\'appel à l\'api pour la génération du bot.');
      //this._router.navigate(['./success'], {relativeTo: this._route});
    });
  }

  test() {
    console.log(this.formArray);
  }

}
