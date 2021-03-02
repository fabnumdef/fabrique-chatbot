import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { fadeIn, fadeInOut } from './animation';
import { MatHorizontalStepper } from "@angular/material/stepper";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInOut, fadeIn]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  isSmallScreen = false;
  isFixedBand = false;
  idxImage = 0;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(private _breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this._breakpointObserver.observe('(max-width: 860px)').subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
    window.addEventListener('scroll', this.scroll, true);
  }

  ngAfterViewInit(): void {
    this.stepper._getIndicatorType = () => 'number';
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = () => {
    const distanceFromBottom = document.body.scrollHeight - window.innerHeight - window.scrollY;
    this.isFixedBand = window.scrollY > 100 && distanceFromBottom > 158;
  }
}
