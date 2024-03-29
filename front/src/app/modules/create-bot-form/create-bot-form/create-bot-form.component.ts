import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ChatbotConfiguration } from '@model/chatbot-configuration.model';
import { ChatbotService } from '@service/chatbot.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-bot-form',
  templateUrl: './create-bot-form.component.html',
  styleUrls: ['./create-bot-form.component.scss']
})
export class CreateBotFormComponent implements OnInit {

  createBotForm: UntypedFormGroup;
  chatbotGenerated = false;
  env = environment;

  constructor(public chatbotService: ChatbotService,
              private _fb: UntypedFormBuilder,
              private _toast: ToastrService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  get formArray(): UntypedFormArray | null {
    return <UntypedFormArray> this.createBotForm.get('formArray');
  }

  generateChatbot() {
    const chatbotConfiguration: ChatbotConfiguration = this.formArray
      .getRawValue()
      .reduce((obj1, obj2) => Object.assign(obj1, obj2));
    console.log(chatbotConfiguration);
    this.chatbotService.createChatbot(chatbotConfiguration).subscribe(() => {
      this.chatbotGenerated = true;
    });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private initForm() {
    this.createBotForm = this._fb.group({
      formArray: this._fb.array([
        this._fb.group({
          file: ['', Validators.required],
          intraDef: [false, Validators.required],
          domainName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-z-]+$')]],
          users: this._fb.array([])
        }),
        this._fb.group({
          problematic: ['', [Validators.required, Validators.maxLength(200)]],
          audience: ['', [Validators.required, Validators.maxLength(200)]],
        }),
        this._fb.group({
          name: ['', [Validators.required, Validators.maxLength(50)]],
          function: ['', [Validators.maxLength(50)]],
          icon: [null, Validators.required],
          primaryColor: ['#6e91f0', [Validators.required, Validators.maxLength(20)]],
          secondaryColor: ['#eef2fd', [Validators.required, Validators.maxLength(20)]],
        }),
        this._fb.group({
          acceptConditions: [false, Validators.requiredTrue],
        }),
      ])
    });
  }

}
