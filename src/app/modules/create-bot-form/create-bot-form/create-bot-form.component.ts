import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatbotConfiguration } from '@model/chatbot-configuration.model';
import { ChatbotService } from '@service/chatbot.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-bot-form',
  templateUrl: './create-bot-form.component.html',
  styleUrls: ['./create-bot-form.component.scss']
})
export class CreateBotFormComponent implements OnInit {

  createBotForm: FormGroup;
  chatbotGenerated = false;

  constructor(public chatbotService: ChatbotService,
              private _fb: FormBuilder,
              private _toast: ToastrService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  get formArray(): FormArray | null {
    return <FormArray> this.createBotForm.get('formArray');
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
      ])
    });
  }

}
