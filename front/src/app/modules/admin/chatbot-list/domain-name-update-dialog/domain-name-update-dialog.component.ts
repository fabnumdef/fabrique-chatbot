import { Component, Inject, OnInit } from '@angular/core';
import { Chatbot } from '@model/chatbot.model';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ChatbotStatus } from "@enum/chatbot-status.enum";

@Component({
  selector: 'app-domain-name-update-dialog',
  templateUrl: './domain-name-update-dialog.component.html',
  styleUrls: ['./domain-name-update-dialog.component.scss']
})
export class DomainNameUpdateDialogComponent implements OnInit {

  chatbot: Chatbot;
  updateDomainNameFormGroup: UntypedFormGroup;

  constructor(private _fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.chatbot = data;
  }

  ngOnInit(): void {
    this._initForm();
  }

  get controls() {
    return this.updateDomainNameFormGroup.controls;
  }

  private _initForm() {
    this.updateDomainNameFormGroup = this._fb.group({
      domainName: [this.chatbot.domainName, [Validators.maxLength(50), Validators.pattern('^[a-z-.]+$'), Validators.required]],
      userPassword: [null, [Validators.maxLength(200), Validators.required]],
    });
  }

}
