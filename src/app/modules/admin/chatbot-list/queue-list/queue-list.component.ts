import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '@service/chatbot.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-queue-list',
  templateUrl: './queue-list.component.html',
  styleUrls: ['./queue-list.component.scss']
})
export class QueueListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'chatbotId', 'createdAt', 'launchedAt', 'actions'];
  jobs: any[];
  loading$: Observable<boolean>;

  constructor(private _chatbotService: ChatbotService,
              private _dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loading$ = this._chatbotService.loading$;
    this._loadJobs();
  }

  deleteJob(job: any) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Êtes-vous sûr de vouloir supprimer le job <b>${job.id}</b> ?.`
      },
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(() => {
        this._chatbotService.deleteJob(job.id).subscribe();
      });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private _loadJobs() {
    this._chatbotService.getQueueJobs().subscribe(jobs => {
      this.jobs = jobs;
    });
  }

}
