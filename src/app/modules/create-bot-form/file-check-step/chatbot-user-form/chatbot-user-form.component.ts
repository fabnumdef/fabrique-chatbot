import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatbotUserRole, ChatbotUserRole_Fr } from '@enum/chatbot-user-role.enum';

@Component({
  selector: 'app-chatbot-user-form',
  templateUrl: './chatbot-user-form.component.html',
  styleUrls: ['./chatbot-user-form.component.scss']
})
export class ChatbotUserFormComponent implements OnInit {

  @Input() chatbotUserForm: FormGroup;
  chatbotUserRole = Object.keys(ChatbotUserRole);
  chatbotUserRole_Fr = ChatbotUserRole_Fr;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
  }

  get controls() {
    return this.chatbotUserForm.controls;
  }

}
