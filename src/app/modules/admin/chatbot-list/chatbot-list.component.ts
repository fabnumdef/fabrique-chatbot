import { Component, OnInit } from '@angular/core';
import { Chatbot } from '@model/chatbot.model';
import { Observable } from 'rxjs';
import { ChatbotService } from '@service/chatbot.service';

@Component({
  selector: 'app-chatbot-list',
  templateUrl: './chatbot-list.component.html',
  styleUrls: ['./chatbot-list.component.scss']
})
export class ChatbotListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'problematic', 'status', 'createdAt', 'actions'];
  chatbots: Chatbot[];
  loading$: Observable<boolean>;

  constructor(private _chatbotService: ChatbotService) {
  }

  ngOnInit(): void {
    this.loading$ = this._chatbotService.loading$;
    this._loadChatbots();
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private _loadChatbots() {
    this._chatbotService.getChatbots().subscribe(chatbots => {
      this.chatbots = chatbots;
      console.log(chatbots);
    });
  }

}
