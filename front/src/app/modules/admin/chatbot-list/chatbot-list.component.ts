import { Component, OnInit } from '@angular/core';
import { Chatbot } from '@model/chatbot.model';
import { Observable } from 'rxjs';
import { ChatbotService } from '@service/chatbot.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';
import { LaunchChatbotUpdateDialogComponent } from './launch-chatbot-update-dialog/launch-chatbot-update-dialog.component';
import { EditChatbotDialogComponent } from './edit-chatbot-dialog/edit-chatbot-dialog.component';
import { ChatbotStatus, ChatbotStatus_Fr } from '@enum/chatbot-status.enum';
import { DomainNameUpdateDialogComponent } from './domain-name-update-dialog/domain-name-update-dialog.component';

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
      .subscribe(async (r) => {
        await this._chatbotService.launchUpdateChatbot(chatbot.id, r).subscribe();
        this._loadChatbots();
      });
  }

  updateDomainName(chatbot: Chatbot): void {
    const dialogRef = this._dialog.open(DomainNameUpdateDialogComponent, {
      data: chatbot,
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(async (r) => {
        await this._chatbotService.launchUpdateDomainName(chatbot.id, r).subscribe();
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
      .subscribe(async (r) => {
        await this._chatbotService.updateChatbot(chatbot.id, r).subscribe();
        this._loadChatbots();
      });
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
      .subscribe(async () => {
        await this._chatbotService.delete(chatbot.id);
        this._loadChatbots();
      });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private _loadChatbots() {
    this._chatbotService.getChatbots().subscribe(chatbots => {
      this.chatbots = chatbots;
      // console.log(chatbots);
    });
  }

}
