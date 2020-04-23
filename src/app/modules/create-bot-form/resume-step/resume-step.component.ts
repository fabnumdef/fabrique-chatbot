import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatbotService } from '@service/chatbot.service';
import { ChatbotConfiguration } from '@model/chatbot-configuration.model';
import { AuthService } from '@service/auth.service';

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
              private _route: ActivatedRoute,
              public auth: AuthService) {
  }

  ngOnInit(): void {
  }

  generateChatbot() {

    const chatbotConfiguration: ChatbotConfiguration = this.formArray
      .getRawValue()
      .reduce((obj1, obj2) => Object.assign(obj1, obj2));
    console.log(chatbotConfiguration);
    this.chatbotService.createChatbot(chatbotConfiguration).subscribe(() => {
      this.success = 1;
    }, err => {
      console.log('Erreur lors de l\'appel à l\'api pour la génération du bot.');
    });
  }
}
