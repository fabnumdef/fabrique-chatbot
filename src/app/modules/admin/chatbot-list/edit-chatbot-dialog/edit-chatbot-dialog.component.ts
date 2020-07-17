import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chatbot } from '@model/chatbot.model';
import { ChatbotStatus, ChatbotStatus_Fr } from '@enum/chatbot-status.enum';

@Component({
  selector: 'app-edit-chatbot-dialog',
  templateUrl: './edit-chatbot-dialog.component.html',
  styleUrls: ['./edit-chatbot-dialog.component.scss']
})
export class EditChatbotDialogComponent implements OnInit {

  chatbot: Chatbot;
  chatbotStatus = ChatbotStatus;
  chatbotStatusKeys = Object.keys(ChatbotStatus);
  chatbotStatus_Fr = ChatbotStatus_Fr;
  updateChatbotFormGroup: FormGroup;
  ipAdressPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  constructor(private _fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.chatbot = data;
  }

  ngOnInit(): void {
    this._initForm();
  }

  get controls() {
    return this.updateChatbotFormGroup.controls;
  }

  private _initForm() {
    this.updateChatbotFormGroup = this._fb.group({
      status: [this.chatbot.status, Validators.required],
      name: [this.chatbot.name, [Validators.maxLength(50)]],
      rootPassword: [null, [Validators.maxLength(200)]],
      ipAdress: [this.chatbot.ipAdress ? this.chatbot.ipAdress : null,
        [Validators.pattern(this.ipAdressPattern), Validators.maxLength(50)]],
      domainName: [this.chatbot.domainName, [Validators.maxLength(50), Validators.pattern('^[a-z-.]+$')]]
    });

    switch (this.chatbot.status) {
      case ChatbotStatus.creation:
        this.controls.rootPassword.setValidators(Validators.required);
        this.controls.ipAdress.setValidators(Validators.required);
        break;
      case ChatbotStatus.error_configuration:
        this.controls.ipAdress.setValidators(Validators.required);
        break;
      case ChatbotStatus.running:
        this.controls.name.setValidators(Validators.required);
        break;
    }
  }

}
