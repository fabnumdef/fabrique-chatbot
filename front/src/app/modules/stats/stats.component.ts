import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {

  public internetChatbots = 3;
  public averageQuestions = '3,31';
  public responseRate = 80;
  // Questions * taux de réponse * 2min
  public dayWon = 68;
  public intentsData = [
    {
      value: 1965,
      name: 'Juin - Dec 2020'
    },
    {
      value: 81 + 37,
      name: 'Jan - Juin 2021'
    },
    {
      value: 132 + 58,
      name: 'Juin - Dec 2021'
    },
    {
      value: 85 + 23 + 512,
      name: 'Jan - Juin 2022'
    },
    {
      value: 10 + 0 + 1,
      name: 'Juin - Sept 2022'
    }
  ];
  public totalIntents = '2 901';
  public questionsData = [
    {
      value: 12546,
      name: 'Juin - Dec 2020'
    },
    {
      value: 19224 + 394 + 0,
      name: 'Jan - Juin 2021'
    },
    {
      value: 13144 + 3327,
      name: 'Juin - Dec 2021'
    },
    {
      value: 8370 + 471 + 36,
      name: 'Jan - Juin 2022'
    },
    {
      value: 4142 + 19 + 233,
      name: 'Juin - Sept 2022'
    }
  ];
  public totalQuestions = '61 538';
  public sessionsData = [
    {
      value: 3424,
      name: 'Juin - Dec 2020'
    },
    {
      value: 5728 + 63,
      name: 'Jan - Juin 2021'
    },
    {
      value: 4115 + 572,
      name: 'Juin - Dec 2021'
    },
    {
      value: 2843 + 185 + 21,
      name: 'Jan - Juin 2022'
    },
    {
      value: 1468 + 11 + 97,
      name: 'Juin - Sept 2022'
    }
  ];
  public totalSessions = '18 463';
  public colorScheme = {
    domain: ['#b3b3de']
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }
}
