import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
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
  updateChatbotFormGroup: UntypedFormGroup;
  ipAdressPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  constructor(private _fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.chatbot = data;
  }

  ngOnInit(): void {
    this._initForm();
  }

  get controls() {
    return this.updateChatbotFormGroup.controls;
  }

  isControlRequired(abstractControl: AbstractControl) {
    if (abstractControl.validator) {
      const validator = abstractControl.validator({}as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    if (abstractControl['controls']) {
      for (const controlName in abstractControl['controls']) {
        if (abstractControl['controls'][controlName]) {
          if (this.isControlRequired(abstractControl['controls'][controlName])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private _initForm() {
    this.updateChatbotFormGroup = this._fb.group({
      status: [this.chatbot.status, Validators.required],
      name: [this.chatbot.name, [Validators.maxLength(50)]],
      frontBranch: [this.chatbot.frontBranch, [Validators.maxLength(50)]],
      backBranch: [this.chatbot.backBranch, [Validators.maxLength(50)]],
      botBranch: [this.chatbot.botBranch, [Validators.maxLength(50)]],
      apiKey: [this.chatbot.apiKey, [Validators.maxLength(200)]],
      // rootUser: [null, [Validators.maxLength(200)]],
      // rootPassword: [null, [Validators.maxLength(200)]],
      userPassword: [null, [Validators.maxLength(200)]],
      sshCert: [null, [Validators.maxLength(10000)]],
      dbName: [null, [Validators.maxLength(200)]],
      dbPassword: [null, [Validators.maxLength(200)]],
      launchGenerationManually: [false],
      ipAdress: [this.chatbot.ipAdress ? this.chatbot.ipAdress : null,
        [Validators.pattern(this.ipAdressPattern), Validators.maxLength(50)]],
      domainName: [this.chatbot.domainName, [Validators.maxLength(50), Validators.pattern('^[a-z-.]+$')]]
    });

    switch (this.chatbot.status) {
      case ChatbotStatus.creation:
        // this.controls.rootUser.setValidators(Validators.required);
        // this.controls.rootPassword.setValidators(Validators.required);
        this.controls.userPassword.setValidators(Validators.required);
        this.controls.ipAdress.setValidators(Validators.required);
        this.controls.frontBranch.setValidators(Validators.required);
        this.controls.backBranch.setValidators(Validators.required);
        this.controls.botBranch.setValidators(Validators.required);
        this.controls.dbName.setValidators(Validators.required);
        this.controls.dbPassword.setValidators(Validators.required);
        break;
      case ChatbotStatus.running:
        this.controls.name.setValidators(Validators.required);
        this.controls.frontBranch.setValidators(Validators.required);
        this.controls.backBranch.setValidators(Validators.required);
        this.controls.botBranch.setValidators(Validators.required);
        break;
    }
  }

}
