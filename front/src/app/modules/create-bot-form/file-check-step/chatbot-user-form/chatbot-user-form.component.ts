import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ChatbotUserRole, ChatbotUserRole_Fr } from '@enum/chatbot-user-role.enum';

@Component({
  selector: 'app-chatbot-user-form',
  templateUrl: './chatbot-user-form.component.html',
  styleUrls: ['./chatbot-user-form.component.scss']
})
export class ChatbotUserFormComponent implements OnInit {

  @Input() chatbotUserForm: UntypedFormGroup;
  chatbotUserRole = Object.keys(ChatbotUserRole);
  chatbotUserRole_Fr = ChatbotUserRole_Fr;

  constructor(private _fb: UntypedFormBuilder) { }

  ngOnInit(): void {
  }

  get controls() {
    return this.chatbotUserForm.controls;
  }

}
