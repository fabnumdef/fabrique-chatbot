import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { fadeIn, fadeInOut } from './animation';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInOut, fadeIn]
})
export class HomeComponent implements OnInit, AfterViewInit {

  isSmallScreen = false;
  idxImage = 0;
  @ViewChild(MatStepper) stepper: MatStepper;

  constructor(private _breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this._breakpointObserver.observe('(max-width: 860px)').subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
  }

  ngAfterViewInit(): void {
    this.stepper._getIndicatorType = () => 'number';
  }
}
