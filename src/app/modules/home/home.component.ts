import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isSmallScreen = false;
  idxImage = 0;

  constructor(private _breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this._breakpointObserver.observe('(max-width: 860px)').subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
  }
}
