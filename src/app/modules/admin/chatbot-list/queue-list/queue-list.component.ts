import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '@service/chatbot.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-queue-list',
  templateUrl: './queue-list.component.html',
  styleUrls: ['./queue-list.component.scss']
})
export class QueueListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'chatbotId', 'createdAt', 'launchedAt'];
  jobs: any[];
  loading$: Observable<boolean>;

  constructor(private _chatbotService: ChatbotService,
              private _dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loading$ = this._chatbotService.loading$;
    this._loadJobs();
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private _loadJobs() {
    this._chatbotService.getQueueJobs().subscribe(jobs => {
      this.jobs = jobs;
      // console.log(jobs);
    });
  }

}
