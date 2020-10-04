import { Component, Input, OnInit } from '@angular/core';
import { Chatbot } from '../../../../core/models/chatbot.model';

@Component({
  selector: 'app-chatbot-preview',
  templateUrl: './chatbot-preview.component.html',
  styleUrls: ['./chatbot-preview.component.scss']
})
export class ChatbotPreviewComponent implements OnInit {

  @Input() chatbot: Chatbot;
  @Input() iconSrc: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
