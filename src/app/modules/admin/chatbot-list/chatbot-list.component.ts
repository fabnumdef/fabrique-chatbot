import { Component, OnInit } from '@angular/core';
import { Chatbot } from '@model/chatbot.model';
import { Observable } from 'rxjs';
import { ChatbotService } from '@service/chatbot.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';
import { LaunchChatbotUpdateDialogComponent } from './launch-chatbot-update-dialog/launch-chatbot-update-dialog.component';
import { EditChatbotDialogComponent } from './edit-chatbot-dialog/edit-chatbot-dialog.component';
import { ChatbotStatus, ChatbotStatus_Fr } from '@enum/chatbot-status.enum';

@Component({
  selector: 'app-chatbot-list',
  templateUrl: './chatbot-list.component.html',
  styleUrls: ['./chatbot-list.component.scss']
})
export class ChatbotListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'problematic', 'status', 'createdAt', 'actions'];
  chatbots: Chatbot[];
  loading$: Observable<boolean>;
  chatbotStatus_fr = ChatbotStatus_Fr;

  constructor(private _chatbotService: ChatbotService,
              private _dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loading$ = this._chatbotService.loading$;
    this._loadChatbots();
  }

  updateChatbot(chatbot: Chatbot): void {
    const dialogRef = this._dialog.open(LaunchChatbotUpdateDialogComponent, {
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe((r) => {
        this._chatbotService.launchUpdateChatbot(chatbot.id, r).subscribe();
      });
  }

  showUpdateChatbot(chatbot: Chatbot): boolean {
    return [ChatbotStatus.running].includes(chatbot.status);
  }

  editChatbot(chatbot: Chatbot): void {
    const dialogRef = this._dialog.open(EditChatbotDialogComponent, {
      data: chatbot,
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe((r) => {
        this._chatbotService.updateChatbot(chatbot.id, r).subscribe();
      });
  }

  showEditChatbot(chatbot: Chatbot): boolean {
    return ![
      ChatbotStatus.pending_configuration,
      ChatbotStatus.configuration,
      ChatbotStatus.deleted
    ].includes(chatbot.status);
  }

  deleteChatbot(chatbot: Chatbot) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Êtes-vous sûr de vouloir supprimer le chatbot <b>${chatbot.name}</b> ?.`
      },
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(() => {
        this._chatbotService.delete(chatbot.id).subscribe();
      });
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
